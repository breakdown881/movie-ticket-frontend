import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../../../stores/authStore";
import { useBookingStore } from "../../../stores/bookingStore";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import showtimesApi from "../../showtimes/services/showtimes.api";
import bookingApi from "../services/booking.api";
import { ShowtimeSeatItem } from "../../../types/cinema.types";
import { SeatType } from "../../../types/api.types";
import { toast } from "sonner";
import { ArrowLeft, Loader2, ShieldCheck, Ticket } from "lucide-react";
import { formatCurrency, formatDate, formatTime } from "../../../common/utils/format";
import SeatItem from "../components/SeatItem";
import SeatLegend from "../components/SeatLegend";

export function SeatSelectionPage() {
    const { showtimeId } = useParams<{ showtimeId: string }>()
    const navigate = useNavigate()
    const { isAuthenticated } = useAuthStore()
    const { selectedSeats, toggleSeatSelection, setReservation, clearBooking } = useBookingStore()
    const [isHolding, setIsHolding] = useState(false)

    // 1. Lấy thông tin chi tiết suất chiếu
    const { data: showtime, isLoading: isShowtimeLoading } = useQuery({
        queryKey: ['showtime', showtimeId],
        queryFn: () => showtimesApi.getShowtimeById(showtimeId!),
        enabled: !!showtimeId
    })

    // 2. Lấy sơ đồ ghế Real-time với polling 3 giây (Sync với Redis Locks của Backend)
    const {
        data: seats = [],
        isLoading: isSeatsLoading,
        refetch
    } = useQuery({
        queryKey: ['showtime-seats', showtimeId],
        queryFn: () => bookingApi.getShowtimeSeats(showtimeId!),
        enabled: !!showtimeId,
        refetchInterval: 3000, // Tự động poll mỗi 3 giây để cập nhật ghế đang giữ
    })

    // 3. Gom nhóm ghế theo từng hàng (Row A, Row B, Row C...)
    const rows = useMemo(() => {
        const map = new Map<string, ShowtimeSeatItem[]>()
        seats.forEach((seat) => {
            if (!map.has(seat.row)) {
                map.set(seat.row, [])
            }
            map.get(seat.row)!.push(seat)
        })

        // Sắp xếp các ghế trong mỗi hàng theo số thứ tự tăng dần
        map.forEach((items) => items.sort((a, b) => a.seatNumber - b.seatNumber))
        return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b))
    }, [seats])

    // 4. Tính tổng tiền tạm tính cho các ghế đang chọn
    const basePrice = showtime ? Number(showtime.price) : 0
    const totalPrice = useMemo(() => {
        return selectedSeats.reduce((sum, seat) => {
            let multiplier = 1.0
            if (seat.seatType === SeatType.VIP) multiplier = 1.2
            if (seat.seatType === SeatType.COUPLE) multiplier = 1.5
            return sum + Math.round(basePrice * multiplier)
        }, 0)
    }, [selectedSeats, basePrice])

    // 5. Xử lý hành động bấm "Giữ Chỗ"
    const handleHoldSeats = async () => {
        if (selectedSeats.length === 0) {
            toast.error('Vui lòng chọn ít nhất 1 ghế để tiếp tục!')
            return
        }

        // Nếu chưa đăng nhập -> chuyển hướng sang Login kèm redirect URL
        if (!isAuthenticated) {
            toast.info('Vui lòng đăng nhập để tiến hành giữ chỗ và thanh toán!')
            navigate(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`)
            return
        }

        setIsHolding(true)
        try {
            const seatIds = selectedSeats.map((s) => s.id)
            const response = await bookingApi.holdSeats({
                showtimeId: showtimeId!,
                seatIds
            })

            // Lưu đơn giữ vé vào Zustand
            setReservation(response.reservation)
            toast.success(response.message || 'Giữ ghế thành công! Vui lòng thanh toán trong 10 phút.')

            // Chuyển hướng sang trang Thanh Toán (Checkout)
            navigate(`/booking/checkout/${response.reservation.id}`)
        } catch (err: unknown) {
            const error = err as Error
            // Nếu gặp lỗi xung đột khóa ghế Redis 409
            toast.error(error.message || 'Ghế bạn chọn vừa có người khác giữ trước. Vui lòng chọn ghế khác!')
            // Xóa danh sách ghế đang chọn và làm mới sơ đồ ghế ngay lập tức
            clearBooking()
            refetch()
        } finally {
            setIsHolding(false)
        }
    }

    if (isShowtimeLoading || isSeatsLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-24 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-cinema-neon" />
                <p className="text-sm">Đang tải sơ đồ phòng chiếu và đồng bộ trạng thái ghế real-time...</p>
            </div>
        )
    }

    if (!showtime) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center text-white">
                <p className="text-xl font-bold">Không tìm thấy suất chiếu</p>
                <Link to="/" className="text-cinema-neon hover:underline text-sm mt-2 inline-block">
                    &larr; Quay lại trang chủ
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen pb-32">
            {/* ===== HEADER BAR ===== */}
            <div className="bg-cinema-900 border-b border-cinema-800 py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            to={`/movies/${showtime.movieId}`}
                            className="p-2 rounded-xl bg-cinema-850 hover:bg-cinema-800 text-slate-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-lg font-bold text-white leading-tight">
                                {showtime.movie?.title || 'Chọn Ghế Xem Phim'}
                            </h1>
                            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                                <span className="text-cinema-neon font-medium">{showtime.hall?.name}</span>
                                <span>•</span>
                                <span>{formatDate(showtime.startTime)}</span>
                                <span>•</span>
                                <span className="text-white font-semibold">{formatTime(showtime.startTime)}</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 bg-cinema-850 px-3 py-1.5 rounded-xl border border-cinema-800 self-start sm:self-auto">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Redis Real-time Lock: <strong>Đang kết nối</strong></span>
                    </div>
                </div>
            </div>
            {/* ===== MAIN SEAT MAP CONTAINER ===== */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
                {/* Màn hình chiếu cong phát sáng */}
                <div className="text-center pt-2">
                    <div className="cinema-screen-curve w-3/4 sm:w-2/3 mx-auto mb-3"></div>
                    <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">
                        MÀN HÌNH CHIẾU (SCREEN)
                    </span>
                </div>
                {/* Ma trận ghế ngồi */}
                <div className="overflow-x-auto pb-6">
                    <div className="min-w-[600px] flex flex-col items-center gap-2 sm:gap-2.5">
                        {rows.map(([rowName, rowSeats]) => (
                            <div key={rowName} className="flex items-center gap-2 sm:gap-3">
                                {/* Tên hàng ghế bên trái */}
                                <span className="w-5 text-center text-xs font-bold text-slate-500">{rowName}</span>
                                {/* Các ghế trong hàng */}
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                    {rowSeats.map((seat) => {
                                        const isSelected = selectedSeats.some((s) => s.id === seat.id);
                                        return (
                                            <SeatItem
                                                key={seat.id}
                                                seat={seat}
                                                isSelected={isSelected}
                                                basePrice={basePrice}
                                                onToggle={(s) => {
                                                    try {
                                                        toggleSeatSelection(s);
                                                    } catch (err: unknown) {
                                                        const error = err as Error;
                                                        toast.warning(error.message);
                                                    }
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                                {/* Tên hàng ghế bên phải */}
                                <span className="w-5 text-center text-xs font-bold text-slate-500">{rowName}</span>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Chú thích loại ghế */}
                <SeatLegend />
            </div>
            {/* ===== BOTTOM ACTION BAR (GHIM ĐÁY MÀN HÌNH) ===== */}
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-cinema-900/95 backdrop-blur-md border-t border-cinema-800 py-3.5 shadow-2xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
                    {/* Thông tin ghế đã chọn */}
                    <div>
                        <div className="text-xs text-slate-400">
                            Ghế đang chọn ({selectedSeats.length}):
                        </div>
                        <div className="text-sm font-bold text-white mt-0.5 max-w-[200px] sm:max-w-md truncate">
                            {selectedSeats.length > 0 ? (
                                selectedSeats.map((s) => `${s.row}${s.seatNumber}`).join(', ')
                            ) : (
                                <span className="text-slate-500 font-normal">Chưa chọn ghế nào</span>
                            )}
                        </div>
                    </div>
                    {/* Tổng tiền & Nút Giữ Vé */}
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="text-xs text-slate-400">Tạm tính</div>
                            <div className="text-lg sm:text-xl font-black text-cinema-neon">
                                {formatCurrency(totalPrice)}
                            </div>
                        </div>
                        <button
                            onClick={handleHoldSeats}
                            disabled={selectedSeats.length === 0 || isHolding}
                            className="px-6 py-3 rounded-xl bg-cinema-red hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm transition-all shadow-glow-red flex items-center gap-2"
                        >
                            {isHolding ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    <Ticket className="w-4 h-4" />
                                    <span className="hidden sm:inline">Tiếp tục (Giữ chỗ 10p)</span>
                                    <span className="sm:hidden">Đặt Vé</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}