import { Link, useSearchParams } from "react-router-dom";
import { useBookingStore } from "../../../stores/bookingStore";
import { Calendar, CheckCircle2, Home, MapPin, Printer, Ticket, XCircle } from "lucide-react";
import { formatCurrency } from "../../../common/utils/format";
import { QRCodeSVG } from 'qrcode.react';

export function PaymentReturnPage() {
    const [searchParams] = useSearchParams()
    const { currentShowtime, selectedSeats } = useBookingStore()
    
    // Đọc params từ VNPay Return URL hoặc Mock Checkout
    const vnpResponseCode = searchParams.get('vnp_ResponseCode')
    const mockStatus = searchParams.get('status')
    const reservationId = searchParams.get('vnp_TxnRef') || searchParams.get('reservationId') || 'CINEMA-DEFAULT-ID'
    const amountParam = searchParams.get('vnp_Amount')
    const amount = amountParam ? Number(amountParam) / 100 : undefined

    // Giao dịch thành công nếu mã phản hồi VNPay là '00' hoặc mockStatus là 'SUCCESS'
    const isSuccess = vnpResponseCode === '00' || mockStatus === 'SUCCESS'

    const handlePrint = () => {
        window.print()
    }

    if (!isSuccess) {
        return (
            <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto border border-red-500/30">
                    <XCircle className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-white">Giao Dịch Không Thành Công</h2>
                <p className="text-sm text-slate-400">
                    Giao dịch thanh toán của bạn đã bị hủy hoặc không thành công. Ghế đã được tự động giải phóng.
                </p>
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cinema-red text-white text-sm font-semibold hover:bg-red-700 transition-colors shadow-glow-red"
                >
                    <Home className="w-4 h-4" /> Quay Lại Trang Chủ
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
            {/* Thông báo thành công */}
            <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30 animate-bounce">
                    <CheckCircle2 className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight">Đặt Vé Thành Công!</h1>
                <p className="text-xs text-slate-400">
                    Vé điện tử đã được xác nhận và gửi thông tin vào email của bạn.
                </p>
            </div>
            {/* ===== VÉ ĐIỆN TỬ (E-TICKET DESIGN) ===== */}
            <div className="relative bg-cinema-900 border-2 border-cinema-neon/40 rounded-3xl overflow-hidden shadow-2xl print:border-black print:text-black">
                {/* Phần trên vé */}
                <div className="p-6 sm:p-8 space-y-5 bg-gradient-to-br from-cinema-900 via-cinema-850 to-cinema-900">
                    <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full bg-cinema-red/20 text-cinema-red border border-cinema-red/30 text-xs font-bold uppercase tracking-wider">
                            Vé Xem Phim Điện Tử
                        </span>
                        <span className="text-xs font-mono text-slate-400">
                            Mã vé: <strong className="text-white">{reservationId.slice(0, 8).toUpperCase()}</strong>
                        </span>
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                            {currentShowtime?.movie?.title || 'Phim Chiếu Rạp Bom Tấn'}
                        </h2>
                        <p className="text-xs text-cinema-neon font-medium">Định dạng 2D Digital / Phụ đề tiếng Việt</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-cinema-800 text-xs text-slate-300">
                        <div className="space-y-1">
                            <span className="text-slate-500 flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-cinema-gold" /> Phòng chiếu
                            </span>
                            <p className="text-sm font-bold text-white">{currentShowtime?.hall?.name || 'Phòng 01'}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-slate-500 flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Suất chiếu
                            </span>
                            <p className="text-sm font-bold text-white">
                                {currentShowtime ? new Date(currentShowtime.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '19:30'}
                            </p>
                        </div>
                        <div className="space-y-1 col-span-2">
                            <span className="text-slate-500 flex items-center gap-1">
                                <Ticket className="w-3.5 h-3.5 text-cinema-neon" /> Ghế đã đặt
                            </span>
                            <p className="text-base font-black text-cinema-neon">
                                {selectedSeats.length > 0
                                    ? selectedSeats.map((s) => `${s.row}${s.seatNumber}`).join(', ')
                                    : 'A1, A2'}
                            </p>
                        </div>
                    </div>
                </div>
                {/* Vết cắt đục lỗ vé rạp phim (Ticket Perforation) */}
                <div className="relative h-6 bg-cinema-950 flex items-center justify-between px-2">
                    <div className="w-6 h-6 rounded-full bg-cinema-950 -ml-5 border border-cinema-800"></div>
                    <div className="flex-1 border-b-2 border-dashed border-cinema-800 mx-4"></div>
                    <div className="w-6 h-6 rounded-full bg-cinema-950 -mr-5 border border-cinema-800"></div>
                </div>
                {/* Phần dưới vé: QR Code Check-in */}
                <div className="p-6 bg-cinema-850 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="space-y-1 text-center sm:text-left">
                        <p className="text-xs text-slate-400">Vui lòng đưa mã này tại cổng soát vé</p>
                        <p className="text-xs font-semibold text-slate-200">Chúc bạn có buổi xem phim vui vẻ!</p>
                        {amount && (
                            <p className="text-xs text-cinema-gold pt-1">
                                Tổng đã thanh toán: <strong>{formatCurrency(amount)}</strong>
                            </p>
                        )}
                    </div>
                    {/* QR Code Container */}
                    <div className="p-3 bg-white rounded-2xl shadow-xl flex-shrink-0">
                        <QRCodeSVG
                            value={`CINETICKET:${reservationId}`}
                            size={110}
                            level="H"
                            includeMargin={false}
                        />
                    </div>
                </div>
            </div>
            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 print:hidden">
                <button
                    onClick={handlePrint}
                    className="px-5 py-2.5 bg-cinema-850 hover:bg-cinema-800 text-white border border-cinema-700 font-semibold text-xs rounded-xl transition-colors flex items-center gap-2"
                >
                    <Printer className="w-4 h-4" /> In Vé / Tải PDF
                </button>
                <Link
                    to="/my-tickets"
                    className="px-5 py-2.5 bg-cinema-neon hover:bg-indigo-600 text-white font-semibold text-xs rounded-xl transition-colors shadow-glow-purple flex items-center gap-2"
                >
                    <Ticket className="w-4 h-4" /> Lịch Sử Vé Của Tôi
                </Link>
                <Link
                    to="/"
                    className="px-5 py-2.5 bg-cinema-900 hover:bg-cinema-800 text-slate-300 hover:text-white border border-cinema-800 font-semibold text-xs rounded-xl transition-colors flex items-center gap-2"
                >
                    <Home className="w-4 h-4" /> Trang Chủ
                </Link>
            </div>
        </div>
    )
}

export default PaymentReturnPage