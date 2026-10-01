import { AlertCircle, Calendar, Clock, Film, Home, MapPin, Ticket } from "lucide-react";
import { useBookingStore } from "../../../stores/bookingStore";
import { Link } from "react-router-dom";
import { formatCurrency, formatDate, formatTime } from "../../../common/utils/format";

export function MyTicketsPage() {
    const { currentReservation, currentShowtime, selectedSeats } = useBookingStore();

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-cinema-800">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
                        <Ticket className="w-7 h-7 text-cinema-neon" /> Vé Của Tôi
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">Danh sách vé xem phim bạn đã đặt và xác nhận</p>
                </div>
                <Link
                    to="/"
                    className="px-4 py-2 bg-cinema-850 hover:bg-cinema-800 text-slate-300 text-xs font-semibold rounded-xl border border-cinema-800 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                >
                    <Home className="w-4 h-4" /> Đặt Vé Khác
                </Link>
            </div>
            {currentReservation ? (
                <div className="space-y-4">
                    <div className="bg-cinema-900 border border-cinema-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row justify-between gap-6 hover:border-cinema-neon/40 transition-colors">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase">
                                    ĐÃ XÁC NHẬN (CONFIRMED)
                                </span>
                                <span className="text-xs font-mono text-slate-400">
                                    Mã: {currentReservation.id.slice(0, 8).toUpperCase()}
                                </span>
                            </div>
                            <h3 className="text-xl font-extrabold text-white">
                                {currentShowtime?.movie?.title || 'Phim Chiếu Rạp Bom Tấn'}
                            </h3>
                            <div className="flex flex-wrap gap-4 text-xs text-slate-300">
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5 text-cinema-gold" />
                                    {currentShowtime?.hall?.name || 'Phòng 01'}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                                    {currentShowtime ? formatDate(currentShowtime.startTime) : 'Hôm nay'}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5 text-cinema-neon" />
                                    {currentShowtime ? formatTime(currentShowtime.startTime) : '19:30'}
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 pt-1">
                                Ghế:{' '}
                                <strong className="text-cinema-neon text-sm">
                                    {selectedSeats.length > 0
                                        ? selectedSeats.map((s) => `${s.row}${s.seatNumber}`).join(', ')
                                        : 'A1, A2'}
                                </strong>
                            </p>
                        </div>
                        <div className="flex flex-col justify-between items-start md:items-end border-t md:border-t-0 pt-4 md:pt-0 border-cinema-800">
                            <div className="text-left md:text-right">
                                <span className="text-xs text-slate-400">Tổng thanh toán</span>
                                <p className="text-xl font-black text-cinema-gold">
                                    {formatCurrency(currentReservation.finalAmount)}
                                </p>
                            </div>
                            <Link
                                to="/booking/payment-return"
                                className="mt-4 px-4 py-2 bg-cinema-neon hover:bg-indigo-600 text-white font-semibold text-xs rounded-xl shadow-glow-purple transition-all"
                            >
                                Xem Vé Điện Tử QR &rarr;
                            </Link>
                        </div>
                    </div>
                    <div className="p-3 bg-cinema-850/60 rounded-xl border border-cinema-800 text-[11px] text-slate-400 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-cinema-gold flex-shrink-0" />
                        <span>
                            Theo chính sách của rạp, vé chỉ được phép hủy trước giờ chiếu ít nhất <strong>60 phút</strong>.
                        </span>
                    </div>
                </div>
            ) : (
                <div className="p-16 text-center text-slate-400 bg-cinema-900 border border-cinema-800 rounded-2xl space-y-4">
                    <Film className="w-12 h-12 text-slate-600 mx-auto" />
                    <div>
                        <h3 className="text-base font-bold text-white">Bạn chưa có vé nào trong phiên này</h3>
                        <p className="text-xs text-slate-500 mt-1">Hãy chọn một bộ phim yêu thích và đặt vé ngay hôm nay!</p>
                    </div>
                    <Link
                        to="/"
                        className="inline-block px-5 py-2.5 bg-cinema-red hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-glow-red transition-all"
                    >
                        Khám Phá Phim Đang Chiếu
                    </Link>
                </div>
            )}
        </div>
    );
}

export default MyTicketsPage;