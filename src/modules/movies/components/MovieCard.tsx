import { useState } from "react";
import { Movie } from "../../../types/movie.types";
import { Clock, Play, Ticket } from "lucide-react";
import { Link } from "react-router-dom";
import TrailerModal from "./TrailerModal";

interface MovieCardProps {
    movie: Movie
}

export function MovieCard({ movie }: MovieCardProps) {
    const [isTrailerOpen, setIsTrailerOpen] = useState(false)

    return (
        <>
            <div className="group relative bg-cinema-900 border border-cinema-800 rounded-2xl overflow-hidden hover:border-cinema-neon/50 hover:shadow-glow-purple transition-all duration-300 flex flex-col">
                {/* Poster Image Container */}
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-cinema-850">
                    <img
                        src={movie.posterUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800'}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                    />
                    {/* Overlay Gradient on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-cinema-950 via-cinema-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                        {movie.trailerUrl && (
                            <button
                                onClick={() => setIsTrailerOpen(true)}
                                className="p-3.5 bg-cinema-red text-white rounded-full shadow-glow-red hover:scale-110 transition-transform"
                                title="Xem Trailer"
                            >
                                <Play className="w-5 h-5 fill-current" />
                            </button>
                        )}
                        <Link
                            to={`/movies/${movie.id}`}
                            className="p-3.5 bg-cinema-neon text-white rounded-full shadow-glow-purple hover:scale-110 transition-transform"
                            title="Đặt vé ngay"
                        >
                            <Ticket className="w-5 h-5" />
                        </Link>
                    </div>
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        {movie.genres?.slice(0, 2).map((genre) => (
                            <span
                                key={genre.id}
                                className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-cinema-900/80 backdrop-blur-md text-slate-200 border border-cinema-700"
                            >
                                {genre.name}
                            </span>
                        ))}
                    </div>
                </div>
                {/* Content Info */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                        <h3 className="text-base font-bold text-white group-hover:text-cinema-neon transition-colors line-clamp-1">
                            <Link to={`/movies/${movie.id}`}>{movie.title}</Link>
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                            {movie.description}
                        </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-cinema-800 flex items-center justify-between text-xs text-slate-400">
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-cinema-gold" />
                            <span>{movie.durationMinutes} phút</span>
                        </div>
                        <Link
                            to={`/movies/${movie.id}`}
                            className="font-semibold text-cinema-red hover:text-red-400 transition-colors flex items-center gap-1"
                        >
                            Đặt Vé &rarr;
                        </Link>
                    </div>
                </div>
            </div>
            {/* Trailer Popup Modal */}
            <TrailerModal
                isOpen={isTrailerOpen}
                onClose={() => setIsTrailerOpen(false)}
                trailerUrl={movie.trailerUrl}
                movieTitle={movie.title}
            />
        </>
    )
}

export default MovieCard