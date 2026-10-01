import { Link, useNavigate, useParams } from "react-router-dom";
import { useBookingStore } from "../../../stores/bookingStore";
import { useState } from "react";
import { PaymentMethod } from "../../../types/api.types";
import { ValidateDiscountResponse } from "../../../types/booking.types";
import { toast } from "sonner";
import bookingApi from "../services/booking.api";
import { ArrowLeft, CheckCircle2, CreditCard, Film, Loader2, QrCode, ShieldCheck, Trash2, Wallet } from "lucide-react";
import CountdownTimer from "../components/CountdownTimer";
import VoucherInput from "../components/VoucherInput";
import { formatCurrency, formatDate, formatTime } from "../../../common/utils/format";

export function CheckoutPage() {
    const { reservationId } = useParams<{ reservationId: string }>()
    const navigate = useNavigate()
    const { currentReservation, currentShowtime, selectedSeats, clearBooking } = useBookingStore()
    
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.VNPAY)
    const [appliedVoucher, setAppliedVoucher] = useState<ValidateDiscountResponse | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [isCancelling, setIsCancelling] = useState(false)

    // Mốc hết hạn 10 phút (lấy từ backend hoặc fallback 10 phút tính từ hiện tại)
    const expiresAt = currentReservation?.expiresAt || new Date(Date.now() + 600 * 1000).toISOString()

    // Tính toán số tiền
    const originalAmount = currentReservation ? Number(currentReservation.originalAmount) : 0
    const discountAmount = appliedVoucher ? appliedVoucher.discountAmount : 0
    const finalAmount = Math.max(0, originalAmount - discountAmount)

    // 1. Xử lý khi hết thời gian 10 phút giữ chỗ
    const handleExpired = () => {
        toast.error('Thời gian giữ vé đã hết! Ghế của bạn đã được tự động giải phóng.')
        clearBooking()
        navigate('/')
    }

    // 2. Xử lý khi người dùng chủ động HỦY giữ chỗ
    const handleCancelReservation = async () => {
        if (!reservationId) return
        if (!window.confirm('Bạn có chắc chắn muốn hủy đơn giữ chỗ này và giải phóng ghế không?')) return

        setIsCancelling(true)
        try {
            await bookingApi.cancelReservation(reservationId)
            clearBooking()
            toast.success('Đã hủy đơn giữ vé thành công!')
            navigate('/')
        } catch (err: unknown) {
            const error = err as Error
            toast.error(error.message || 'Không thể hủy đơn giữ vé')
        } finally {
            setIsCancelling(false)
        }
    }

    // 3. Xử lý Thanh Toán
    const handleProcessPayment = async () => {
        if (!reservationId) return
        setIsProcessing(true)

        try {
            if (paymentMethod === PaymentMethod.VNPAY || paymentMethod === PaymentMethod.MOMO) {
                // Tạo URL thanh toán VNPay / MoMo
                const returnUrl = `${window.location.origin}/booking/payment-return`
                const res = await bookingApi.createPaymentUrl({
                    reservationId,
                    paymentMethod,
                    returnUrl
                })

                if (res.paymentUrl) {
                    toast.loading('Đang chuyển hướng sang cổng thanh toán an toàn...')
                    // Chuyển hướng người dùng sang cổng VNPay/MoMo
                    window.location.href = res.paymentUrl
                } else {
                    throw new Error('Không nhận được liên kết thanh toán từ cổng')
                }
            } else {
                // Thanh toán trực tiếp / Mock Sandbox
                const res = await bookingApi.checkout({
                    reservationId,
                    paymentMethod
                })

                toast.success(res.message || 'Thanh toán thành công!')
                navigate(`/booking/payment-return?status=SUCCESS&reservationId=${reservationId}`)
            }
        } catch (err: unknown) {
            const error = err as Error
            toast.error(error.message || 'Thanh toán thất bại. Vui lòng thử lại!')
            setIsProcessing(false)
        }
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            {/* Header & Timer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-cinema-800">
                <div>
                    <Link
                        to={currentShowtime ? `/booking/seat-selection/${currentShowtime.id}` : '/'}
                        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-2"
                    >
                        <ArrowLeft className="w-4 h-4" /> Quay lại sơ đồ ghế
                    </Link>
                    <h1 className="text-2xl font-black text-white tracking-tight">Thanh Toán Đơn Đặt Vé</h1>
                </div>
                {/* Đồng hồ đếm ngược 10 phút */}
                <CountdownTimer expiresAt={expiresAt} onExpire={handleExpired} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* CỘT TRÁI: Phương thức thanh toán & Voucher (Chiếm 2 cột) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* 1. Lựa chọn phương thức thanh toán */}
                    <div className="bg-cinema-900 border border-cinema-800 rounded-2xl p-6 space-y-4">
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-cinema-neon" />
                            Chọn Phương Thức Thanh Toán
                        </h3>
                        <div className="space-y-3">
                            {/* VNPay Option */}
                            <label
                                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === PaymentMethod.VNPAY
                                        ? 'bg-cinema-neon/15 border-cinema-neon shadow-glow-purple'
                                        : 'bg-cinema-850 border-cinema-800 hover:border-cinema-700'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value={PaymentMethod.VNPAY}
                                        checked={paymentMethod === PaymentMethod.VNPAY}
                                        onChange={() => setPaymentMethod(PaymentMethod.VNPAY)}
                                        className="accent-cinema-neon w-4 h-4"
                                    />
                                    <div>
                                        <span className="text-sm font-bold text-white flex items-center gap-1.5">
                                            <QrCode className="w-4 h-4 text-blue-400" /> Cổng VNPay QR / Thẻ ATM / Visa
                                        </span>
                                        <p className="text-xs text-slate-400 mt-0.5">Hỗ trợ quét mã VNPAY-QR qua mọi ứng dụng ngân hàng</p>
                                    </div>
                                </div>
                                <span className="text-xs px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-400 font-semibold">
                                    Phổ biến
                                </span>
                            </label>
                            {/* MoMo Option */}
                            <label
                                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === PaymentMethod.MOMO
                                        ? 'bg-pink-600/15 border-pink-500 shadow-sm shadow-pink-500/20'
                                        : 'bg-cinema-850 border-cinema-800 hover:border-cinema-700'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value={PaymentMethod.MOMO}
                                        checked={paymentMethod === PaymentMethod.MOMO}
                                        onChange={() => setPaymentMethod(PaymentMethod.MOMO)}
                                        className="accent-pink-500 w-4 h-4"
                                    />
                                    <div>
                                        <span className="text-sm font-bold text-white flex items-center gap-1.5">
                                            <Wallet className="w-4 h-4 text-pink-400" /> Ví Điện Tử MoMo
                                        </span>
                                        <p className="text-xs text-slate-400 mt-0.5">Thanh toán tức thì qua ứng dụng ví MoMo</p>
                                    </div>
                                </div>
                                <span className="text-xs px-2.5 py-1 rounded-md bg-pink-500/20 text-pink-400 font-semibold">
                                    Ví MoMo
                                </span>
                            </label>
                            {/* Mock Sandbox Option */}
                            <label
                                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === PaymentMethod.BANK_TRANSFER
                                        ? 'bg-emerald-600/15 border-emerald-500 shadow-sm shadow-emerald-500/20'
                                        : 'bg-cinema-850 border-cinema-800 hover:border-cinema-700'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value={PaymentMethod.BANK_TRANSFER}
                                        checked={paymentMethod === PaymentMethod.BANK_TRANSFER}
                                        onChange={() => setPaymentMethod(PaymentMethod.BANK_TRANSFER)}
                                        className="accent-emerald-500 w-4 h-4"
                                    />
                                    <div>
                                        <span className="text-sm font-bold text-white flex items-center gap-1.5">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Thanh Toán Thử Nghiệm (Sandbox)
                                        </span>
                                        <p className="text-xs text-slate-400 mt-0.5">Xác nhận thanh toán ngay lập tức không cần thẻ</p>
                                    </div>
                                </div>
                                <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 font-semibold">
                                    Thử nghiệm
                                </span>
                            </label>
                        </div>
                    </div>
                    {/* 2. Áp dụng mã giảm giá */}
                    <VoucherInput
                        orderAmount={originalAmount}
                        appliedVoucher={appliedVoucher}
                        onApplySuccess={(voucher) => setAppliedVoucher(voucher)}
                        onRemove={() => setAppliedVoucher(null)}
                    />
                </div>
                {/* CỘT PHẢI: Tóm tắt đơn vé (Chiếm 1 cột) */}
                <div className="space-y-6">
                    <div className="bg-cinema-900 border border-cinema-800 rounded-2xl p-6 space-y-5">
                        <h3 className="text-base font-bold text-white pb-3 border-b border-cinema-800 flex items-center gap-2">
                            <Film className="w-4 h-4 text-cinema-red" />
                            Tóm Tắt Đơn Vé
                        </h3>
                        {/* Thông tin phim */}
                        <div className="space-y-2">
                            <h4 className="text-base font-extrabold text-white">
                                {currentShowtime?.movie?.title || 'Phim Chiếu Rạp'}
                            </h4>
                            <p className="text-xs text-slate-400">
                                Rạp: <strong className="text-slate-200">{currentShowtime?.hall?.name}</strong>
                            </p>
                            <p className="text-xs text-slate-400">
                                Suất chiếu:{' '}
                                <strong className="text-cinema-neon">
                                    {currentShowtime ? `${formatTime(currentShowtime.startTime)} - ${formatDate(currentShowtime.startTime)}` : ''}
                                </strong>
                            </p>
                            <div className="text-xs text-slate-400 pt-1">
                                Ghế ({selectedSeats.length}):{' '}
                                <strong className="text-white">
                                    {selectedSeats.map((s) => `${s.row}${s.seatNumber}`).join(', ')}
                                </strong>
                            </div>
                        </div>
                        {/* Bảng chi tiết giá tiền */}
                        <div className="space-y-2 pt-4 border-t border-cinema-800 text-xs">
                            <div className="flex justify-between text-slate-400">
                                <span>Tổng tiền vé:</span>
                                <span className="text-white font-semibold">{formatCurrency(originalAmount)}</span>
                            </div>
                            {discountAmount > 0 && (
                                <div className="flex justify-between text-emerald-400">
                                    <span>Giảm giá khuyến mãi:</span>
                                    <span className="font-semibold">-{formatCurrency(discountAmount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center pt-3 border-t border-cinema-800 text-sm">
                                <span className="font-bold text-white">Tổng thanh toán:</span>
                                <span className="text-xl font-black text-cinema-neon">{formatCurrency(finalAmount)}</span>
                            </div>
                        </div>
                        {/* Nút Thanh Toán */}
                        <button
                            type="button"
                            onClick={handleProcessPayment}
                            disabled={isProcessing || isCancelling}
                            className="w-full py-3.5 bg-cinema-red hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-glow-red flex items-center justify-center gap-2 text-sm"
                        >
                            {isProcessing ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <ShieldCheck className="w-5 h-5" />
                                    Xác Nhận & Thanh Toán
                                </>
                            )}
                        </button>
                        {/* Nút Hủy Giữ Vé */}
                        <button
                            type="button"
                            onClick={handleCancelReservation}
                            disabled={isCancelling || isProcessing}
                            className="w-full py-2.5 bg-cinema-850 hover:bg-red-950/40 text-slate-400 hover:text-red-400 border border-cinema-800 hover:border-red-500/40 font-medium rounded-xl transition-colors flex items-center justify-center gap-2 text-xs"
                        >
                            {isCancelling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                            Hủy Đơn & Giải Phóng Ghế
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CheckoutPage