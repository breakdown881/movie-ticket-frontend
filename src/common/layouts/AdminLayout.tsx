import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { Armchair, CalendarClock, Film, Home, LayoutDashboard, LogOut, ShieldCheck, Tag, Users } from "lucide-react";

export function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navItems = [
        { label: 'Bảng Điều Khiển', path: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Quản Lý Phim', path: '/admin/movies', icon: Film },
        { label: 'Phòng Chiếu & Ghế', path: '/admin/halls', icon: Armchair },
        { label: 'Quản Lý Lịch Chiếu', path: '/admin/showtimes', icon: CalendarClock },
        { label: 'Mã Khuyến Mãi', path: '/admin/discounts', icon: Tag },
        { label: 'Quản Lý Người Dùng', path: '/admin/users', icon: Users },
    ];

    return (
        <div className="min-h-screen bg-cinema-950 flex flex-col md:flex-row text-slate-100">
            {/* ===== SIDEBAR NAVIGATION ===== */}
            <aside className="w-full md:w-64 bg-cinema-900 border-r border-cinema-800 flex flex-col justify-between flex-shrink-0">
                <div>
                    {/* Admin Brand */}
                    <div className="p-6 border-b border-cinema-800 flex items-center justify-between">
                        <Link to="/admin/dashboard" className="flex items-center gap-2.5">
                            <div className="p-2 bg-cinema-gold text-cinema-950 rounded-xl font-black">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="text-base font-black tracking-tight text-white block">CINETICKET</span>
                                <span className="text-[10px] text-cinema-gold font-bold uppercase tracking-wider block">Admin Portal</span>
                            </div>
                        </Link>
                    </div>
                    {/* Navigation Links */}
                    <nav className="p-4 space-y-1.5">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${isActive
                                        ? 'bg-cinema-gold text-cinema-950 shadow-md font-bold'
                                        : 'text-slate-400 hover:text-white hover:bg-cinema-850'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
                {/* Bottom Actions */}
                <div className="p-4 border-t border-cinema-800 space-y-1">
                    <Link
                        to="/"
                        className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-cinema-850 transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        Về Trang Khách Hàng
                    </Link>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-cinema-red hover:bg-red-950/30 transition-colors text-left"
                    >
                        <LogOut className="w-4 h-4" />
                        Đăng Xuất
                    </button>
                </div>
            </aside>
            {/* ===== MAIN CONTENT VIEWPORT ===== */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Header */}
                <header className="h-16 bg-cinema-900/60 backdrop-blur-md border-b border-cinema-800 px-6 sm:px-8 flex items-center justify-between">
                    <div className="text-xs text-slate-400">
                        Hệ Thống Quản Trị Rạp Chiếu Phim Doanh Nghiệp (Enterprise Cinema Admin)
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <span className="text-xs font-bold text-white block">{user?.fullName || 'Administrator'}</span>
                            <span className="text-[10px] text-cinema-gold font-medium block">Super Admin (RBAC)</span>
                        </div>
                        <div className="w-9 h-9 rounded-xl bg-cinema-gold/20 border border-cinema-gold/40 text-cinema-gold font-bold flex items-center justify-center text-sm">
                            {user?.fullName?.charAt(0).toUpperCase() || 'A'}
                        </div>
                    </div>
                </header>
                {/* Content Outlet */}
                <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;