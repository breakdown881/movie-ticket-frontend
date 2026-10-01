import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { CreateShowtimePayload } from "../../../types/showtime.types";
import showtimesApi from "../../showtimes/services/showtimes.api";
import moviesApi from "../../movies/services/movies.api";
import adminApi from "../services/admin.api";
import { toast } from "sonner";
import { AlertCircle, Armchair, CalendarClock, Clock, Loader2, Plus, Trash2, X } from "lucide-react";
import { formatCurrency, formatDateTime } from "../../../common/utils/format";

export function AdminShowtimesPage() {
    const queryClient = useQueryClient();
    const [isAddModal, setIsAddModal] = useState(false);

    // Form state
    const [form, setForm] = useState<CreateShowtimePayload>({
        movieId: '',
        hallId: '',
        startTime: '',
        price: 90000,
    });

    // 1. Lấy danh sách suất chiếu
    const { data: showtimes = [], isLoading } = useQuery({
        queryKey: ['admin-showtimes-list'],
        queryFn: () => showtimesApi.getShowtimes(),
    });

    // 2. Lấy danh sách phim để chọn trong dropdown
    const { data: movies = [] } = useQuery({
        queryKey: ['admin-movies-select'],
        queryFn: () => moviesApi.getAllMovies(),
    });

    // 3. Lấy danh sách phòng chiếu
    const { data: halls = [] } = useQuery({
        queryKey: ['admin-halls-select'],
        queryFn: () => showtimesApi.getHalls(),
    });

    // 4. Mutation Tạo suất chiếu mới (Có kiểm tra Anti-Conflict)
    const createMutation = useMutation({
        mutationFn: (payload: CreateShowtimePayload) => adminApi.createShowtime(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-showtimes-list'] });
            queryClient.invalidateQueries({ queryKey: ['showtimes'] });
            toast.success('Lên lịch chiếu thành công!');
            setIsAddModal(false);
            setForm({ movieId: '', hallId: '', startTime: '', price: 90000 });
        },
        onError: (err: unknown) => {
            const error = err as Error;
            toast.error(error.message || 'Trùng lịch chiếu hoặc thông tin không hợp lệ!');
        },
    });

    // 5. Mutation Xóa suất chiếu
    const deleteMutation = useMutation({
        mutationFn: (id: string) => adminApi.deleteShowtime(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-showtimes-list'] });
            queryClient.invalidateQueries({ queryKey: ['showtimes'] });
            toast.success('Đã xóa suất chiếu thành công!');
        },
        onError: (err: unknown) => {
            const error = err as Error;
            toast.error(error.message || 'Không thể xóa suất chiếu!');
        },
    });

    const handleDelete = (id: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa suất chiếu này không?')) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cinema-800">
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                        <CalendarClock className="w-6 h-6 text-cinema-gold" /> Quản Lý Lịch Chiếu (Showtimes)
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">
                        Tổng cộng: <strong>{showtimes.length}</strong> ca chiếu đang lên lịch
                    </p>
                </div>
                <button
                    onClick={() => setIsAddModal(true)}
                    className="px-4 py-2 bg-cinema-gold hover:bg-amber-500 text-cinema-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 self-start sm:self-auto"
                >
                    <Plus className="w-4 h-4" /> Lên Lịch Chiếu Mới
                </button>
            </div>
            {/* Showtimes Table */}
            <div className="bg-cinema-900 border border-cinema-800 rounded-2xl overflow-hidden">
                {isLoading ? (
                    <div className="p-12 text-center text-slate-400 animate-pulse">Đang tải lịch chiếu...</div>
                ) : showtimes.length === 0 ? (
                    <div className="p-12 text-center text-slate-400">Chưa có suất chiếu nào được tạo.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="bg-cinema-850/60 border-b border-cinema-800 text-slate-400 uppercase tracking-wider">
                                    <th className="py-3 px-4 font-semibold">Phim</th>
                                    <th className="py-3 px-4 font-semibold">Phòng Chiếu</th>
                                    <th className="py-3 px-4 font-semibold">Thời Gian Chiếu</th>
                                    <th className="py-3 px-4 font-semibold">Giá Vé Cơ Bản</th>
                                    <th className="py-3 px-4 font-semibold text-right">Thao Tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-cinema-800/60">
                                {showtimes.map((st) => (
                                    <tr key={st.id} className="hover:bg-cinema-850/40 transition-colors">
                                        <td className="py-3 px-4 font-bold text-white max-w-xs truncate">
                                            {st.movie?.title || 'Phim N/A'}
                                        </td>
                                        <td className="py-3 px-4 text-slate-300">
                                            <span className="inline-flex items-center gap-1.5 text-cinema-neon font-semibold">
                                                <Armchair className="w-3.5 h-3.5" />
                                                {st.hall?.name || 'Phòng N/A'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-slate-300">
                                            <span className="inline-flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5 text-cinema-gold" />
                                                {formatDateTime(st.startTime)}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 font-bold text-white">
                                            {formatCurrency(st.price)}
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <button
                                                onClick={() => handleDelete(st.id)}
                                                disabled={deleteMutation.isPending}
                                                className="p-1.5 text-slate-400 hover:text-cinema-red hover:bg-red-950/30 rounded-lg transition-colors"
                                                title="Xóa suất chiếu"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            {/* ===== MODAL LÊN LỊCH CHIẾU MỚI ===== */}
            {isAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                    <div className="relative w-full max-w-md bg-cinema-900 border border-cinema-800 rounded-2xl p-6 space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-cinema-800">
                            <h3 className="text-base font-bold text-white flex items-center gap-2">
                                <CalendarClock className="w-4 h-4 text-cinema-gold" /> Lên Lịch Chiếu Mới
                            </h3>
                            <button onClick={() => setIsAddModal(false)} className="text-slate-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-3 bg-cinema-850 rounded-xl border border-cinema-800 flex items-start gap-2 text-[11px] text-slate-400">
                            <AlertCircle className="w-4 h-4 text-cinema-neon flex-shrink-0 mt-0.5" />
                            <span>
                                Backend tích hợp cơ chế <strong>Anti-Conflict</strong> tự động ngăn chặn trùng giờ chiếu trong cùng một phòng.
                            </span>
                        </div>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                createMutation.mutate(form);
                            }}
                            className="space-y-4 text-xs"
                        >
                            {/* Chọn phim */}
                            <div>
                                <label className="block font-medium text-slate-300 mb-1">Chọn Phim *</label>
                                <select
                                    required
                                    value={form.movieId}
                                    onChange={(e) => setForm({ ...form, movieId: e.target.value })}
                                    className="w-full bg-cinema-850 border border-cinema-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cinema-gold"
                                >
                                    <option value="">-- Chọn một bộ phim --</option>
                                    {movies.map((m) => (
                                        <option key={m.id} value={m.id}>
                                            {m.title} ({m.durationMinutes} phút)
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* Chọn phòng chiếu */}
                            <div>
                                <label className="block font-medium text-slate-300 mb-1">Chọn Phòng Chiếu *</label>
                                <select
                                    required
                                    value={form.hallId}
                                    onChange={(e) => setForm({ ...form, hallId: e.target.value })}
                                    className="w-full bg-cinema-850 border border-cinema-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cinema-gold"
                                >
                                    <option value="">-- Chọn phòng chiếu --</option>
                                    {halls.map((h) => (
                                        <option key={h.id} value={h.id}>
                                            {h.name} ({h.totalSeats} ghế)
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* Giờ bắt đầu */}
                            <div>
                                <label className="block font-medium text-slate-300 mb-1">Thời gian bắt đầu *</label>
                                <input
                                    type="datetime-local"
                                    required
                                    value={form.startTime}
                                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                                    className="w-full bg-cinema-850 border border-cinema-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cinema-gold"
                                >
                                </input>
                            </div>
                            {/* Giá vé cơ sở */}
                            <div>
                                <label className="block font-medium text-slate-300 mb-1">Giá vé cơ bản (VNĐ) *</label>
                                <input
                                    type="number"
                                    min={10000}
                                    step={5000}
                                    required
                                    value={form.price}
                                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                                    className="w-full bg-cinema-850 border border-cinema-800 rounded-xl px-3.5 py-2 text-white font-bold focus:outline-none focus:border-cinema-gold"
                                />
                            </div>
                            <div className="pt-3 border-t border-cinema-800 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModal(false)}
                                    className="px-4 py-2 bg-cinema-850 hover:bg-cinema-800 text-slate-300 rounded-xl font-medium"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={createMutation.isPending || !form.movieId || !form.hallId || !form.startTime}
                                    className="px-5 py-2 bg-cinema-gold hover:bg-amber-500 disabled:opacity-50 text-cinema-950 font-bold rounded-xl shadow-md flex items-center gap-1.5"
                                >
                                    {createMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                    Lên Lịch Chiếu
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminShowtimesPage;