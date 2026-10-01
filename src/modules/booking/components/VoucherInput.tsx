import { useState } from "react"
import { ValidateDiscountResponse } from "../../../types/booking.types"
import { toast } from "sonner"
import bookingApi from "../services/booking.api"
import { formatCurrency } from "../../../common/utils/format"
import { Check, Loader2, Tag, X } from "lucide-react"

interface VoucherInputProps {
    orderAmount: number
    onApplySuccess: (result: ValidateDiscountResponse) => void
    onRemove: () => void
    appliedVoucher: ValidateDiscountResponse | null
}

export function VoucherInput({
    orderAmount,
    onApplySuccess,
    onRemove,
    appliedVoucher
}: VoucherInputProps) {
    const [code, setCode] = useState('')
    const [isValidating, setIsValidating] = useState(false)

    const handleApply = async () => {
        if (!code.trim()) {
            toast.warning('Vui lòng nhập mã khuyến mãi!')
            return
        }

        setIsValidating(true)
        try {
            const res = await bookingApi.validateDiscount({
                code: code.trim().toUpperCase(),
                orderAmount
            })

            onApplySuccess(res)
            toast.success(`Áp dụng thành công mã [${res.code}]! Giảm ${formatCurrency(res.discountAmount)}`)
            setCode('')
        } catch (err: unknown) {
            const error = err as Error
            toast.error(error.message || 'Mã giảm giá không hợp lệ hoặc đã hết lượt dùng!')
        } finally {
            setIsValidating(false)
        }
    }

    return (
        <div className="p-4 bg-cinema-850 border border-cinema-800 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <Tag className="w-4 h-4 text-cinema-neon" />
                <span>Mã Giảm Giá / Khuyến Mãi</span>
            </div>
            {appliedVoucher ? (
                <div className="flex items-center justify-between p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs">
                    <div className="flex items-center gap-2">
                        <div className="p-1 bg-emerald-500/20 text-emerald-400 rounded-md">
                            <Check className="w-3.5 h-3.5" />
                        </div>
                        <div>
                            <span className="font-bold text-white uppercase tracking-wider">{appliedVoucher.code}</span>
                            <p className="text-emerald-400 font-semibold mt-0.5">
                                Đã giảm {formatCurrency(appliedVoucher.discountAmount)}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onRemove}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-cinema-900 rounded-lg transition-colors"
                        title="Gỡ mã giảm giá"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        placeholder="Nhập mã voucher (VD: KM20, CHAOBAN)"
                        className="flex-1 bg-cinema-900 border border-cinema-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cinema-neon uppercase font-mono"
                    />
                    <button
                        type="button"
                        onClick={handleApply}
                        disabled={isValidating || !code.trim()}
                        className="px-4 py-2 bg-cinema-neon hover:bg-indigo-600 disabled:opacity-40 text-white font-semibold text-xs rounded-xl transition-all shadow-glow-purple flex items-center gap-1.5"
                    >
                        {isValidating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Áp Dụng'}
                    </button>
                </div>
            )}
        </div>
    )
}

export default VoucherInput