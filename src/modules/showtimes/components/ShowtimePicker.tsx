import { useQuery } from "@tanstack/react-query"
import { addDays, format, isSameDay } from "date-fns"
import { useState } from "react"
import showtimesApi from "../services/showtimes.api"
import type { Showtime } from "../../../types/showtime.types"
import { Calendar, Clock, Film } from "lucide-react"
import { Link } from "react-router-dom"
import { vi } from 'date-fns/locale'
import { formatCurrency, formatTime } from '../../../common/utils/format'

interface ShowtimePickerProps {
    movieId?: string
}

export function ShowtimePicker({ movieId }: ShowtimePickerProps) {
    // Mặc định chọn ngày hôm nay
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())

    // Tạo danh sách 7 ngày liên tiếp để khách chọn
    const next7Days = Array.from({ length: 7 }).map((_, index) => addDays(new Date(), index))
    
    // Gọi API lấy lịch chiếu
    const { data: showtimes = [], isLoading } = useQuery({
        queryKey: ['showtimes', movieId, format(selectedDate, 'yyyy-MM-dd')],
        queryFn: () => showtimesApi.getShowtimes({
            movieId,
            date: format(selectedDate, 'yyyy-MM-dd')
        })
    })

    // Gom nhóm các suất chiếu theo từng Phòng chiếu / Rạp (Hall)
    const groupedByHall = showtimes.reduce<Record<string, { hallName: string; slots: Showtime[] }>>(
        (acc, slot) => {
            const hallId = slot.hallId
            const hallName = slot.hall?.name || 'Phòng chiếu tiêu chuẩn'
            if (!acc[hallId]) {
                acc[hallId] = { hallName, slots: []}
            }
            acc[hallId].slots.push(slot)
            return acc
        },
        {}
    )

    return (
        <div className="space-y-6">
            {/* 1. Date Selector Strip (Thanh chọn ngày) */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                {next7Days.map((date, idx) => {
                    const isSelected = isSameDay(date, selectedDate);
                    return (
                        <button
                            key={idx}
                            onClick={() => setSelectedDate(date)}
                            className={`flex-shrink-0 px-4 py-2.5 rounded-xl border text-center transition-all ${isSelected
                                    ? 'bg-cinema-neon text-white border-cinema-neon shadow-glow-purple scale-105'
                                    : 'bg-cinema-900 border-cinema-800 text-slate-300 hover:border-cinema-700'
                                }`}
                        >
                            <div className="text-[11px] uppercase font-semibold">
                                {idx === 0 ? 'Hôm nay' : format(date, 'EEEE', { locale: vi })}
                            </div>
                            <div className="text-base font-bold mt-0.5">{format(date, 'dd/MM')}</div>
                        </button>
                    );
                })}
            </div>
            {/* 2. Showtimes List */}
            {isLoading ? (
                <div className="p-8 text-center text-slate-400 bg-cinema-900/50 rounded-2xl border border-cinema-800 animate-pulse">
                    Đang tải lịch chiếu...
                </div>
            ) : Object.keys(groupedByHall).length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-cinema-900/50 rounded-2xl border border-cinema-800">
                    <Calendar className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                    <p className="text-sm font-medium">Hiện chưa có suất chiếu nào cho ngày này.</p>
                    <p className="text-xs text-slate-500 mt-1">Vui lòng chọn một ngày khác trong tuần.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {Object.entries(groupedByHall).map(([hallId, group]) => (
                        <div
                            key={hallId}
                            className="p-5 bg-cinema-900 border border-cinema-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                            {/* Hall Info */}
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-cinema-850 rounded-xl border border-cinema-800 text-cinema-neon">
                                    <Film className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-base font-bold text-white">{group.hallName}</h4>
                                    <span className="text-xs text-slate-400">Định dạng 2D Digital / Phụ đề</span>
                                </div>
                            </div>
                            {/* Time Slots */}
                            <div className="flex flex-wrap gap-2.5">
                                {group.slots.map((slot) => (
                                    <Link
                                        key={slot.id}
                                        to={`/booking/seat-selection/${slot.id}`}
                                        className="group px-4 py-2 bg-cinema-850 hover:bg-cinema-red border border-cinema-800 hover:border-cinema-red rounded-xl transition-all shadow-sm hover:shadow-glow-red text-center"
                                    >
                                        <div className="text-sm font-bold text-white group-hover:text-white flex items-center gap-1 justify-center">
                                            <Clock className="w-3.5 h-3.5 text-cinema-neon group-hover:text-white" />
                                            {formatTime(slot.startTime)}
                                        </div>
                                        <div className="text-[10px] text-slate-400 group-hover:text-red-100 font-medium mt-0.5">
                                            {formatCurrency(slot.price)}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}