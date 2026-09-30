export function SeatLegend() {
    return (
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 py-4 px-6 bg-cinema-900 border border-cinema-800 rounded-2xl text-xs text-slate-300">
            {/* Ghế Thường */}
            <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-slate-700 border border-slate-600"></div>
                <span>Ghế Thường</span>
            </div>
            {/* Ghế VIP */}
            <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-amber-600 border border-amber-500 shadow-sm shadow-amber-500/20"></div>
                <span className="text-amber-400 font-medium">Ghế VIP (x1.2)</span>
            </div>
            {/* Ghế Đôi (Couple) */}
            <div className="flex items-center gap-2">
                <div className="w-8 h-5 rounded-md bg-pink-600 border border-pink-500 shadow-sm shadow-pink-500/20"></div>
                <span className="text-pink-400 font-medium">Ghế Đôi (x1.5)</span>
            </div>
            {/* Ghế Đang Chọn */}
            <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-cinema-neon border border-cinema-neon shadow-glow-purple"></div>
                <span className="text-cinema-neon font-semibold">Đang Chọn</span>
            </div>
            {/* Ghế Người Khác Đang Giữ */}
            <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-cinema-gold/60 border border-cinema-gold animate-pulse"></div>
                <span className="text-cinema-gold">Đang Giữ (10p)</span>
            </div>
            {/* Ghế Đã Bán */}
            <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-cinema-950 border border-cinema-850 opacity-40"></div>
                <span className="text-slate-500 line-through">Đã Bán</span>
            </div>
        </div>
    )
}

export default SeatLegend