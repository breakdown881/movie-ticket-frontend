import { useQuery } from "@tanstack/react-query";
import moviesApi from "../../movies/services/movies.api";
import showtimesApi from "../../showtimes/services/showtimes.api";
import adminApi from "../services/admin.api";
import { Armchair, ArrowRight, CalendarPlus, Film, Layers, Sparkles, Tag, Users } from "lucide-react";
import { Link } from "react-router-dom";

export function AdminDashboardPage() {
    // 1. Lấy dữ liệu phim
    const { data: movies = [], isLoading: isMoviesLoading } = useQuery({
        queryKey: ['admin-movies'],
        queryFn: () => moviesApi.getAllMovies()
    });

    // 2. Lấy dữ liệu phòng chiếu
    const { data: halls = [] } = useQuery({
        queryKey: ['admin-halls'],
        queryFn: () => showtimesApi.getHalls()
    });

    // 3. Lấy dữ liệu khuyến mãi
    const { data: discounts = [] } = useQuery({
        queryKey: ['admin-discounts'],
        queryFn: () => adminApi.getAllDiscounts()
    });

    // 4. Lấy dữ liệu người dùng
    const { data: users = [] } = useQuery({
        queryKey: ['admin-users'],
        queryFn: () => adminApi.getAllUsers()
    });

    const activeVouchers = discounts.filter((d) => d.isActive).length;

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header Banner */}
            <div className="p-6 bg-gradient-to-r from-cinema-900 via-cinema-850 to-cinema-900 border border-cinema-800 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cinema-gold/20 text-cinema-gold text-[10px] font-bold uppercase tracking-wider mb-2">
                        <Sparkles className="w-3 h-3" /> Tổng Quan Hệ Thống
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                        Bảng Điều Khiển Quản Trị
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">
                        Theo dõi danh mục phim, lịch chiếu, ma trận ghế phòng vé và người dùng
                    </p>
                </div>
                {/* Quick Action Shortcuts */}
                <div className="flex flex-wrap gap-2.5">
                    <Link
                        to="/admin/showtimes"
                        className="px-4 py-2.5 bg-cinema-neon hover:bg-indigo-600 text-white font-semibold text-xs rounded-xl transition-all shadow-glow-purple flex items-center gap-1.5"
                    >
                        <CalendarPlus className="w-4 h-4" /> Lên Lịch Chiếu
                    </Link>
                    <Link
                        to="/admin/halls"
                        className="px-4 py-2.5 bg-cinema-gold hover:bg-amber-500 text-cinema-950 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
                    >
                        <Layers className="w-4 h-4" /> Sinh Ghế Tự Động
                    </Link>
                </div>
            </div>
            {/* KPI Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Phim */}
                <div className="p-5 bg-cinema-900 border border-cinema-800 rounded-2xl flex items-center justify-between">
                    <div>
                        <span className="text-xs text-slate-400 font-medium">Tổng Số Phim</span>
                        <p className="text-2xl font-black text-white mt-1">
                            {isMoviesLoading ? '...' : movies.length}
                        </p>
                    </div>
                    <div className="p-3 bg-cinema-red/20 text-cinema-red rounded-xl border border-cinema-red/30">
                        <Film className="w-6 h-6" />
                    </div>
                </div>
                {/* Phòng Chiếu */}
                <div className="p-5 bg-cinema-900 border border-cinema-800 rounded-2xl flex items-center justify-between">
                    <div>
                        <span className="text-xs text-slate-400 font-medium">Phòng Chiếu Hoạt Động</span>
                        <p className="text-2xl font-black text-white mt-1">{halls.length}</p>
                    </div>
                    <div className="p-3 bg-cinema-neon/20 text-cinema-neon rounded-xl border border-cinema-neon/30">
                        <Armchair className="w-6 h-6" />
                    </div>
                </div>
                {/* Khuyến Mãi */}
                <div className="p-5 bg-cinema-900 border border-cinema-800 rounded-2xl flex items-center justify-between">
                    <div>
                        <span className="text-xs text-slate-400 font-medium">Voucher Hiệu Lực</span>
                        <p className="text-2xl font-black text-emerald-400 mt-1">{activeVouchers}</p>
                    </div>
                    <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                        <Tag className="w-6 h-6" />
                    </div>
                </div>
                {/* Người Dùng */}
                <div className="p-5 bg-cinema-900 border border-cinema-800 rounded-2xl flex items-center justify-between">
                    <div>
                        <span className="text-xs text-slate-400 font-medium">Thành Viên Hệ Thống</span>
                        <p className="text-2xl font-black text-cinema-gold mt-1">{users.length}</p>
                    </div>
                    <div className="p-3 bg-cinema-gold/20 text-cinema-gold rounded-xl border border-cinema-gold/30">
                        <Users className="w-6 h-6" />
                    </div>
                </div>
            </div>
            {/* Danh Sách Phim Mới Nhất */}
            <div className="bg-cinema-900 border border-cinema-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Film className="w-4 h-4 text-cinema-neon" /> Phim Đang Quản Lý
                    </h3>
                    <Link
                        to="/admin/movies"
                        className="text-xs text-cinema-neon hover:underline font-semibold flex items-center gap-1"
                    >
                        Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="border-b border-cinema-800 text-slate-400 uppercase tracking-wider">
                                <th className="pb-3 font-semibold">Tên Phim</th>
                                <th className="pb-3 font-semibold">Thời Lượng</th>
                                <th className="pb-3 font-semibold">Ngày Khởi Chiếu</th>
                                <th className="pb-3 font-semibold">Thể Loại</th>
                                <th className="pb-3 font-semibold text-right">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-cinema-800/60">
                            {movies.slice(0, 5).map((movie) => (
                                <tr key={movie.id} className="hover:bg-cinema-850/50 transition-colors">
                                    <td className="py-3 font-bold text-white flex items-center gap-2.5">
                                        <img
                                            src={movie.posterUrl}
                                            alt={movie.title}
                                            className="w-8 h-10 object-cover rounded-md bg-cinema-850 flex-shrink-0"
                                        />
                                        <span className="truncate max-w-[200px]">{movie.title}</span>
                                    </td>
                                    <td className="py-3 text-slate-300">{movie.durationMinutes} phút</td>
                                    <td className="py-3 text-slate-300">{movie.releaseDate}</td>
                                    <td className="py-3 text-slate-400">
                                        {movie.genres?.map((g) => g.name).join(', ') || 'N/A'}
                                    </td>
                                    <td className="py-3 text-right">
                                        <Link
                                            to={`/movies/${movie.id}`}
                                            className="text-cinema-neon hover:underline font-medium"
                                        >
                                            Chi tiết &rarr;
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboardPage;