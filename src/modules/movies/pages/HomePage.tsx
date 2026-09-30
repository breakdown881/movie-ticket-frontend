import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import moviesApi from "../services/movies.api";
import { Film, Play, Sparkles, Ticket } from "lucide-react";
import { Link } from "react-router-dom";
import TrailerModal from "../components/TrailerModal";
import MovieCard from "../components/MovieCard";

export function HomePage() {
    const [activeTab, setActiveTab] = useState<'NOW_SHOWING' | 'COMING_SOON'>("NOW_SHOWING")
    const [isHeroTrailerOpen, setIsHeroTrailerOpen] = useState(false)

    // Lấy danh sách phim từ backend
    const { data: movies = [], isLoading } = useQuery({
        queryKey: ['movies'],
        queryFn: () => moviesApi.getAllMovies()
    })

    // Chọn phim đầu tiên làm Hero Banner nổi bật
    const featuredMovie = movies[0]

    return (
        <div className="space-y-12 pb-16">
            {/* ===== HERO BANNER SECTION ===== */}
            {featuredMovie && (
                <section className="relative w-full min-h-[500px] md:min-h-[580px] flex items-center overflow-hidden bg-cinema-950">
                    {/* Backdrop Image with Gradients */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src={featuredMovie.posterUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1600'}
                            alt={featuredMovie.title}
                            className="w-full h-full object-cover opacity-25 filter blur-sm scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-cinema-950 via-cinema-950/80 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-t from-cinema-950 via-transparent to-cinema-950/40" />
                    </div>
                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col md:flex-row items-center gap-8">
                        <div className="max-w-2xl text-left space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cinema-red/20 border border-cinema-red/40 text-cinema-red text-xs font-semibold uppercase tracking-wider">
                                <Sparkles className="w-3.5 h-3.5" /> Phim Bom Tấn Nổi Bật
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                                {featuredMovie.title}
                            </h1>
                            <p className="text-sm md:text-base text-slate-300 line-clamp-3 leading-relaxed">
                                {featuredMovie.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-4 pt-4">
                                <Link
                                    to={`/movies/${featuredMovie.id}`}
                                    className="px-6 py-3 rounded-xl bg-cinema-red hover:bg-red-700 text-white font-semibold text-sm transition-all shadow-glow-red flex items-center gap-2"
                                >
                                    <Ticket className="w-4 h-4" /> Đặt Vé Ngay
                                </Link>
                                {featuredMovie.trailerUrl && (
                                    <button
                                        onClick={() => setIsHeroTrailerOpen(true)}
                                        className="px-6 py-3 rounded-xl bg-cinema-900/80 hover:bg-cinema-800 text-white border border-cinema-700 font-semibold text-sm transition-all flex items-center gap-2"
                                    >
                                        <Play className="w-4 h-4 fill-current text-cinema-gold" /> Xem Trailer
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Hero Trailer Modal */}
                    <TrailerModal
                        isOpen={isHeroTrailerOpen}
                        onClose={() => setIsHeroTrailerOpen(false)}
                        trailerUrl={featuredMovie.trailerUrl}
                        movieTitle={featuredMovie.title}
                    />
                </section>
            )}
            {/* ===== MOVIES CATALOG GRID ===== */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Navigation Tabs */}
                <div className="flex items-center justify-between border-b border-cinema-800 pb-4 mb-8">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setActiveTab('NOW_SHOWING')}
                            className={`text-lg font-bold transition-all relative ${activeTab === 'NOW_SHOWING'
                                    ? 'text-white'
                                    : 'text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            Phim Đang Chiếu
                            {activeTab === 'NOW_SHOWING' && (
                                <div className="absolute -bottom-4 left-0 right-0 h-1 bg-cinema-red rounded-full shadow-glow-red" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('COMING_SOON')}
                            className={`text-lg font-bold transition-all relative ${activeTab === 'COMING_SOON'
                                    ? 'text-white'
                                    : 'text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            Phim Sắp Chiếu
                            {activeTab === 'COMING_SOON' && (
                                <div className="absolute -bottom-4 left-0 right-0 h-1 bg-cinema-neon rounded-full shadow-glow-purple" />
                            )}
                        </button>
                    </div>
                    <span className="text-xs text-slate-400 hidden sm:inline">
                        Tổng cộng: <strong className="text-white">{movies.length}</strong> phim
                    </span>
                </div>
                {/* Movies Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className="aspect-[2/3] bg-cinema-900 border border-cinema-800 rounded-2xl animate-pulse"
                            />
                        ))}
                    </div>
                ) : movies.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 bg-cinema-900/50 rounded-2xl border border-cinema-800">
                        <Film className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                        <p className="text-base font-semibold text-slate-300">Chưa có dữ liệu phim.</p>
                        <p className="text-xs text-slate-500 mt-1">Vui lòng kiểm tra lại dữ liệu seed từ Backend.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                        {movies.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}

export default HomePage