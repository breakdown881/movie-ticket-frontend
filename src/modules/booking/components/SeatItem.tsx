import React from "react";
import { ShowtimeSeatItem } from "../../../types/cinema.types";
import { SeatType } from "../../../types/api.types";
import { formatCurrency } from "../../../common/utils/format";

interface SeatItemProps {
    seat: ShowtimeSeatItem
    isSelected: boolean
    basePrice: number
    onToggle: (seat: ShowtimeSeatItem) => void
}

export const SeatItem = React.memo(function SeatItem({
    seat,
    isSelected,
    basePrice,
    onToggle
}: SeatItemProps) {
    // Tính giá ghế dựa trên loại ghế
    let multiplier = 1.0
    if (seat.seatType === SeatType.VIP) multiplier = 1.2
    if (seat.seatType === SeatType.COUPLE) multiplier = 1.5
    const seatPrice = Math.round(basePrice * multiplier)

    const isConfirmed = seat.status === 'CONFIRMED'
    const isHeld = seat.status === 'HELD'
    const isAvailable = seat.status === 'AVAILABLE'

    // Định nghĩa màu sắc theo trạng thái và loại ghế
    let bgClass = 'bg-slate-700 border-slate-600 hover:border-cinema-neon cursor-pointer'

    if (seat.seatType === SeatType.VIP) {
        bgClass = 'bg-amber-600/90 border-amber-500 hover:border-amber-400 cursor-pointer shadow-sm'
    } else if (seat.seatType === SeatType.COUPLE) {
        bgClass = 'bg-pink-600/90 border-pink-500 hover:border-pink-400 cursor-pointer shadow-sm'
    }

    if (isSelected) {
        bgClass = 'bg-cinema-neon border-white shadow-glow-purple scale-110 z-10 text-white font-bold cursor-pointer'
    } else if (isHeld) {
        bgClass = 'bg-cinema-gold/30 border-cinema-gold text-cinema-gold cursor-not-allowed animate-pulse'
    } else if (isConfirmed) {
        bgClass = 'bg-cinema-950/80 border-cinema-900 text-slate-600 cursor-not-allowed opacity-35'
    }

    const isCouple = seat.seatType === SeatType.COUPLE

    return (
        <button
            type="button"
            disabled={!isAvailable && !isSelected}
            onClick={() => onToggle(seat)}
            title={`Ghế ${seat.row}${seat.seatNumber} (${seat.seatType}) - ${formatCurrency(seatPrice)} ${isHeld ? '[Người khác đang giữ]' : isConfirmed ? '[Đã bán]' : ''
                }`}
            className={`relative ${isCouple ? 'w-16' : 'w-7 sm:w-8'
                } h-7 sm:h-8 rounded-lg border text-[10px] sm:text-xs font-semibold flex items-center justify-center transition-all duration-150 ${bgClass}`}
        >
            {seat.seatNumber}
        </button>
    )
})

export default SeatItem