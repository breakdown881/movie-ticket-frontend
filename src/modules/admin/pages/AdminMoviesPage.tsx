import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { CreateMoviePayload } from "../../../types/movie.types";
import moviesApi from "../../movies/services/movies.api";
import adminApi from "../services/admin.api";
import { toast } from "sonner";
import { Calendar, Clock, ExternalLink, Film, Loader2, Plus, Tag, Trash2, X } from "lucide-react";

export function AdminMoviesPage() {
    const queryClient = useQueryClient();
    const [isAddMovieModal, setIsAddMovieModal] = useState(false);
    const [isAddGenreModal, setIsAddGenreModal] = useState(false);

    // Form states cho thêm phim mới
    const [movieForm, setMovieForm] = useState<CreateMoviePayload>({
        title: '',
        description: '',
        posterUrl: '',
        trailerUrl: '',
        durationMinutes: 120,
        releaseDate: new Date().toISOString().split('T')[0],
        genreIds: [],
    });

    // Form states cho thêm thể loại mới
    const [genreName, setGenreName] = useState('');
    const [genreDesc, setGenreDesc] = useState('');

    // 1. Lấy danh sách phim
    const { data: movies = [], isLoading: isMoviesLoading } = useQuery({
        queryKey: ['admin-movies-list'],
        queryFn: () => moviesApi.getAllMovies(),
    });

    // 2. Lấy danh sách thể loại
    const { data: genres = [] } = useQuery({
        queryKey: ['admin-genres-list'],
        queryFn: () => moviesApi.getGenres(),
    });

    // 3. Mutation Tạo phim
    const createMovieMutation = useMutation({
        mutationFn: (payload: CreateMoviePayload) => adminApi.createMovie(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-movies-list'] });
            queryClient.invalidateQueries({ queryKey: ['movies'] });
            toast.success('Thêm phim mới thành công!');
            setIsAddMovieModal(false);
            setMovieForm({
                title: '',
                description: '',
                posterUrl: '',
                trailerUrl: '',
                durationMinutes: 120,
                releaseDate: new Date().toISOString().split('T')[0],
                genreIds: [],
            });
        },
        onError: (err: unknown) => {
            const error = err as Error;
            toast.error(error.message || 'Không thể tạo phim mới!');
        },
    });

    // 4. Mutation Tạo thể loại
    const createGenreMutation = useMutation({
        mutationFn: () => adminApi.createGenre(genreName, genreDesc),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-genres-list'] });
            toast.success('Thêm thể loại thành công!');
            setIsAddGenreModal(false);
            setGenreName('');
            setGenreDesc('');
        },
        onError: (err: unknown) => {
            const error = err as Error;
            toast.error(error.message || 'Không thể tạo thể loại!');
        },
    });

    // 5. Mutation Xóa phim
    const deleteMovieMutation = useMutation({
        mutationFn: (id: string) => adminApi.deleteMovie(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-movies-list'] });
            queryClient.invalidateQueries({ queryKey: ['movies'] });
            toast.success('Đã xóa phim thành công!');
        },
        onError: (err: unknown) => {
            const error = err as Error;
            toast.error(error.message || 'Không thể xóa phim!');
        },
    });

    const handleDeleteMovie = (id: string, title: string) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa bộ phim "${title}" không?`)) {
            deleteMovieMutation.mutate(id);
        }
    };

    const handleToggleGenre = (genreId: string) => {
        const current = movieForm.genreIds || [];
        if (current.includes(genreId)) {
            setMovieForm({ ...movieForm, genreIds: current.filter((id) => id !== genreId) });
        } else {
            setMovieForm({ ...movieForm, genreIds: [...current, genreId] });
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cinema-800">
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                        <Film className="w-6 h-6 text-cinema-red" /> Quản Lý Danh Mục Phim
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">
                        Tổng cộng: <strong>{movies.length}</strong> bộ phim trong hệ thống
                    </p>
                </div>
                <div className="flex items-center gap-2.5">
                    <button
                        onClick={() => setIsAddGenreModal(true)}
                        className="px-3.5 py-2 bg-cinema-850 hover:bg-cinema-800 text-slate-300 hover:text-white border border-cinema-800 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
                    >
                        <Tag className="w-3.5 h-3.5 text-cinema-neon" /> Thêm Thể Loại
                    </button>
                    <button
                        onClick={() => setIsAddMovieModal(true)}
                        className="px-4 py-2 bg-cinema-red hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all shadow-glow-red flex items-center gap-1.5"
                    >
                        <Plus className="w-4 h-4" /> Thêm Phim Mới
                    </button>
                </div>
            </div>
            {/* Movies Table */}
            <div className="bg-cinema-900 border border-cinema-800 rounded-2xl overflow-hidden">
                {isMoviesLoading ? (
                    <div className="p-12 text-center text-slate-400 animate-pulse">Đang tải danh sách phim...</div>
                ) : movies.length === 0 ? (
                    <div className="p-12 text-center text-slate-400">Chưa có bộ phim nào trong cơ sở dữ liệu.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="bg-cinema-850/60 border-b border-cinema-800 text-slate-400 uppercase tracking-wider">
                                    <th className="py-3 px-4 font-semibold">Poster & Tên Phim</th>
                                    <th className="py-3 px-4 font-semibold">Thời Lượng</th>
                                    <th className="py-3 px-4 font-semibold">Khởi Chiếu</th>
                                    <th className="py-3 px-4 font-semibold">Thể Loại</th>
                                    <th className="py-3 px-4 font-semibold text-right">Thao Tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-cinema-800/60">
                                {movies.map((movie) => (
                                    <tr key={movie.id} className="hover:bg-cinema-850/40 transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={movie.posterUrl}
                                                    alt={movie.title}
                                                    className="w-10 h-14 object-cover rounded-lg bg-cinema-850 border border-cinema-800 flex-shrink-0"
                                                />
                                                <div>
                                                    <span className="font-bold text-white text-sm block max-w-xs truncate">
                                                        {movie.title}
                                                    </span>
                                                    <p className="text-[11px] text-slate-400 line-clamp-1 max-w-sm mt-0.5">
                                                        {movie.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-slate-300">
                                            <span className="inline-flex items-center gap-1">
                                                <Clock className="w-3.5 h-3.5 text-cinema-gold" />
                                                {movie.durationMinutes} phút
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-slate-300">
                                            <span className="inline-flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                                                {movie.releaseDate}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex flex-wrap gap-1 max-w-xs">
                                                {movie.genres?.map((g) => (
                                                    <span
                                                        key={g.id}
                                                        className="px-2 py-0.5 rounded-md bg-cinema-neon/15 text-cinema-neon border border-cinema-neon/30 text-[10px] font-semibold"
                                                    >
                                                        {g.name}
                                                    </span>
                                                )) || <span className="text-slate-500">Chưa gắn</span>}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <a
                                                    href={`/movies/${movie.id}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="p-1.5 text-slate-400 hover:text-cinema-neon hover:bg-cinema-850 rounded-lg transition-colors"
                                                    title="Xem trên trang khách"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                                <button
                                                    onClick={() => handleDeleteMovie(movie.id, movie.title)}
                                                    disabled={deleteMovieMutation.isPending}
                                                    className="p-1.5 text-slate-400 hover:text-cinema-red hover:bg-red-950/30 rounded-lg transition-colors"
                                                    title="Xóa phim"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            {/* ===== MODAL THÊM PHIM MỚI ===== */}
            {isAddMovieModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                    <div className="relative w-full max-w-2xl bg-cinema-900 border border-cinema-800 rounded-2xl overflow-hidden shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-3 border-b border-cinema-800">
                            <h3 className="text-base font-bold text-white flex items-center gap-2">
                                <Plus className="w-4 h-4 text-cinema-red" /> Thêm Phim Mới Vào Hệ Thống
                            </h3>
                            <button
                                onClick={() => setIsAddMovieModal(false)}
                                className="text-slate-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                createMovieMutation.mutate(movieForm);
                            }}
                            className="space-y-4 text-xs"
                        >
                            {/* Tên phim */}
                            <div>
                                <label className="block font-medium text-slate-300 mb-1">Tên phim *</label>
                                <input
                                    type="text"
                                    required
                                    value={movieForm.title}
                                    onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
                                    placeholder="VD: Avengers: Secret Wars"
                                    className="w-full bg-cinema-850 border border-cinema-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cinema-neon"
                                />
                            </div>
                            {/* Mô tả cốt truyện */}
                            <div>
                                <label className="block font-medium text-slate-300 mb-1">Mô tả cốt truyện *</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={movieForm.description}
                                    onChange={(e) => setMovieForm({ ...movieForm, description: e.target.value })}
                                    placeholder="Nhập tóm tắt nội dung phim..."
                                    className="w-full bg-cinema-850 border border-cinema-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cinema-neon"
                                />
                            </div>
                            {/* Poster URL & Trailer URL */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-medium text-slate-300 mb-1">Poster Image URL *</label>
                                    <input
                                        type="url"
                                        required
                                        value={movieForm.posterUrl}
                                        onChange={(e) => setMovieForm({ ...movieForm, posterUrl: e.target.value })}
                                        placeholder="https://example.com/poster.jpg"
                                        className="w-full bg-cinema-850 border border-cinema-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cinema-neon"
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium text-slate-300 mb-1">YouTube Trailer URL</label>
                                    <input
                                        type="url"
                                        value={movieForm.trailerUrl}
                                        onChange={(e) => setMovieForm({ ...movieForm, trailerUrl: e.target.value })}
                                        placeholder="https://www.youtube.com/watch?v=..."
                                        className="w-full bg-cinema-850 border border-cinema-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cinema-neon"
                                    />
                                </div>
                            </div>
                            {/* Thời lượng & Ngày khởi chiếu */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-medium text-slate-300 mb-1">Thời lượng (Phút) *</label>
                                    <input
                                        type="number"
                                        min={1}
                                        required
                                        value={movieForm.durationMinutes}
                                        onChange={(e) => setMovieForm({ ...movieForm, durationMinutes: Number(e.target.value) })}
                                        className="w-full bg-cinema-850 border border-cinema-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cinema-neon"
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium text-slate-300 mb-1">Ngày khởi chiếu *</label>
                                    <input
                                        type="date"
                                        required
                                        value={movieForm.releaseDate}
                                        onChange={(e) => setMovieForm({ ...movieForm, releaseDate: e.target.value })}
                                        className="w-full bg-cinema-850 border border-cinema-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cinema-neon"
                                    />
                                </div>
                            </div>
                            {/* Chọn Thể loại */}
                            <div>
                                <label className="block font-medium text-slate-300 mb-1.5">Gắn Thể Loại</label>
                                <div className="flex flex-wrap gap-2 p-3 bg-cinema-850 rounded-xl border border-cinema-800 max-h-32 overflow-y-auto">
                                    {genres.map((g) => {
                                        const isSelected = movieForm.genreIds?.includes(g.id);
                                        return (
                                            <button
                                                type="button"
                                                key={g.id}
                                                onClick={() => handleToggleGenre(g.id)}
                                                className={`px-3 py-1 rounded-lg border text-xs font-semibold transition-all ${isSelected
                                                        ? 'bg-cinema-neon text-white border-cinema-neon'
                                                        : 'bg-cinema-900 border-cinema-800 text-slate-400 hover:text-white'
                                                    }`}
                                            >
                                                {g.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            {/* Submit Buttons */}
                            <div className="pt-3 border-t border-cinema-800 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAddMovieModal(false)}
                                    className="px-4 py-2 bg-cinema-850 hover:bg-cinema-800 text-slate-300 rounded-xl font-medium"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="submit"
                                    disabled={createMovieMutation.isPending}
                                    className="px-5 py-2 bg-cinema-red hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-glow-red flex items-center gap-1.5"
                                >
                                    {createMovieMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                    Lưu Phim Mới
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* ===== MODAL THÊM THỂ LOẠI ===== */}
            {isAddGenreModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                    <div className="relative w-full max-w-md bg-cinema-900 border border-cinema-800 rounded-2xl p-6 space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-cinema-800">
                            <h3 className="text-base font-bold text-white flex items-center gap-2">
                                <Tag className="w-4 h-4 text-cinema-neon" /> Thêm Thể Loại Phim
                            </h3>
                            <button onClick={() => setIsAddGenreModal(false)} className="text-slate-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                createGenreMutation.mutate();
                            }}
                            className="space-y-4 text-xs"
                        >
                            <div>
                                <label className="block font-medium text-slate-300 mb-1">Tên thể loại *</label>
                                <input
                                    type="text"
                                    required
                                    value={genreName}
                                    onChange={(e) => setGenreName(e.target.value)}
                                    placeholder="VD: Khoa Học Viễn Tưởng"
                                    className="w-full bg-cinema-850 border border-cinema-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cinema-neon"
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-slate-300 mb-1">Mô tả (tùy chọn)</label>
                                <input
                                    type="text"
                                    value={genreDesc}
                                    onChange={(e) => setGenreDesc(e.target.value)}
                                    placeholder="Mô tả thể loại..."
                                    className="w-full bg-cinema-850 border border-cinema-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cinema-neon"
                                />
                            </div>
                            <div className="pt-3 border-t border-cinema-800 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAddGenreModal(false)}
                                    className="px-4 py-2 bg-cinema-850 hover:bg-cinema-800 text-slate-300 rounded-xl font-medium"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={createGenreMutation.isPending || !genreName.trim()}
                                    className="px-5 py-2 bg-cinema-neon hover:bg-indigo-600 disabled:opacity-50 text-white font-bold rounded-xl shadow-glow-purple flex items-center gap-1.5"
                                >
                                    {createGenreMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                    Lưu Thể Loại
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminMoviesPage;