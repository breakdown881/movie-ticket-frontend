import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import moviesApi from "../services/movies.api";
import { ArrowLeft, Calendar, Clock, DollarSign, Play, Ticket, TrendingUp, Users } from "lucide-react";
import { formatCurrency, formatDate } from "../../../common/utils/format";
import { ShowtimePicker } from "../../showtimes/components/ShowtimePicker";
import TrailerModal from "../components/TrailerModal";

export function MovieDetailPage() {
    const { id } = useParams<{ id: string }>()
    const [isTrailerOpen, setIsTrailerOpen] = useState(false)

    // 1. Lấy chi tiết bộ phim
    const { data: movie, isLoading: isMovieLoading } = useQuery({
        queryKey: ['movie', id],
        queryFn: () => moviesApi.getMovieById(id!),
        enabled: !!id
    })

    // 2. Lấy thống kê vé bán & doanh thu trọn đời của phim (Endpoint /statistics của Backend)
    const { data: stats } = useQuery({
        queryKey: ['movie-stats', id],
        queryFn: () => moviesApi.getMovieStatistics(id!),
        enabled: !!id
    })

    if (isMovieLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400 animate-pulse">
                Đang tải thông tin phim...
            </div>
        )
    }

    if (!movie) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Không tìm thấy phim</h2>
                <Link to="/" className="text-cinema-neon hover:underline text-sm">
                    &larr; Quay lại trang chủ
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-12 pb-20">
            {/* ===== BACKDROP BANNER ===== */}
            <div className="relative w-full min-h-[420px] bg-cinema-950 overflow-hidden flex items-end">
                <div className="absolute inset-0 z-0">
                    <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover opacity-20 filter blur-md"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-cinema-950 via-cinema-950/80 to-transparent" />
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Quay lại danh sách phim
                    </Link>
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Poster Card */}
                        <div className="w-48 sm:w-60 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-cinema-800 flex-shrink-0 bg-cinema-900">
                            <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
                        </div>
                        {/* Movie Info */}
                        <div className="space-y-4 flex-1">
                            <div className="flex flex-wrap gap-2">
                                {movie.genres?.map((g) => (
                                    <span
                                        key={g.id}
                                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-cinema-neon/20 text-cinema-neon border border-cinema-neon/30"
                                    >
                                        {g.name}
                                    </span>
                                ))}
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                                {movie.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-300">
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4 text-cinema-gold" />
                                    <span>{movie.durationMinutes} phút</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4 text-emerald-400" />
                                    <span>Khởi chiếu: {formatDate(movie.releaseDate)}</span>
                                </div>
                            </div>
                            <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                                {movie.description}
                            </p>
                            {movie.trailerUrl && (
                                <div className="pt-2">
                                    <button
                                        onClick={() => setIsTrailerOpen(true)}
                                        className="px-5 py-2.5 rounded-xl bg-cinema-850 hover:bg-cinema-800 text-white border border-cinema-700 font-semibold text-sm transition-all flex items-center gap-2"
                                    >
                                        <Play className="w-4 h-4 fill-current text-cinema-red" /> Xem Trailer
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                {/* ===== BOX OFFICE STATISTICS CARD (TÍNH NĂNG ĐẶC BIỆT CỦA BACKEND) ===== */}
                {stats && (
                    <section className="bg-cinema-900 border border-cinema-800 rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4 text-cinema-gold">
                            <TrendingUp className="w-5 h-5" />
                            <h3 className="font-bold text-white text-base">Thống Kê Phòng Vé Trọn Đời (Box Office Stats)</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="p-4 bg-cinema-850 rounded-xl border border-cinema-800">
                                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                                    <Ticket className="w-4 h-4 text-cinema-neon" /> Tổng Số Vé Đã Bán
                                </span>
                                <p className="text-2xl font-black text-white mt-1">
                                    {stats.totalTicketsSold?.toLocaleString('vi-VN') || 0}
                                </p>
                            </div>
                            <div className="p-4 bg-cinema-850 rounded-xl border border-cinema-800">
                                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                                    <DollarSign className="w-4 h-4 text-emerald-400" /> Doanh Thu Phòng Vé
                                </span>
                                <p className="text-2xl font-black text-emerald-400 mt-1">
                                    {formatCurrency(stats.grossRevenue || 0)}
                                </p>
                            </div>
                            <div className="p-4 bg-cinema-850 rounded-xl border border-cinema-800">
                                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                                    <Users className="w-4 h-4 text-cinema-gold" /> Tổng Suất Chiếu
                                </span>
                                <p className="text-2xl font-black text-white mt-1">
                                    {stats.totalShowtimes || 0}
                                </p>
                            </div>
                        </div>
                    </section>
                )}
                {/* ===== SHOWTIMES SECTION ===== */}
                <section>
                    <div className="flex items-center gap-2 mb-6">
                        <Ticket className="w-6 h-6 text-cinema-red" />
                        <h2 className="text-2xl font-bold text-white tracking-tight">Lịch Chiếu & Đặt Vé</h2>
                    </div>
                    {/* Component ShowtimePicker */}
                    <ShowtimePicker movieId={id} />
                </section>
            </div>
            {/* Trailer Modal */}
            <TrailerModal
                isOpen={isTrailerOpen}
                onClose={() => setIsTrailerOpen(false)}
                trailerUrl={movie.trailerUrl}
                movieTitle={movie.title}
            />
        </div>
    )
}

export default MovieDetailPage