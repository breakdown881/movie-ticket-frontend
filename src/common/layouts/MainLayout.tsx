import { useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { ChevronDown, Film, LayoutDashboard, LogOut, Ticket, User } from "lucide-react";

export function MainLayout() {
    const { user, isAuthenticated, isAdmin, logout } = useAuthStore()
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        setDropdownOpen(false)
        navigate('/')
    }

    return (
        <div className="min-h-screen flex flex-col bg-cinema-950 text-slate-100">
            {/* ===== HEADER NAVIGATION ===== */}
            <header className="sticky top-0 z-40 bg-cinema-900/90 backdrop-blur-md border-b border-cinema-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    {/* Logo Brand */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="p-2 bg-cinema-red rounded-lg group-hover:scale-105 transition-transform">
                            <Film className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-cinema-neon bg-clip-text text-transparent">
                            CINETICKET
                        </span>
                    </Link>
                    {/* Navigation Links */}
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
                        <Link to="/" className="hover:text-cinema-neon transition-colors">Trang Chủ</Link>
                        <Link to="/movies" className="hover:text-cinema-neon transition-colors">Phim Đang Chiếu</Link>
                        <Link to="/showtimes" className="hover:text-cinema-neon transition-colors">Lịch Chiếu & Rạp</Link>
                    </nav>
                    {/* Auth Actions / Profile Dropdown */}
                    <div className="flex items-center gap-4">
                        {isAuthenticated && user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-cinema-800/80 transition-colors border border-cinema-800"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-cinema-neon/20 border border-cinema-neon/40 flex items-center justify-center text-cinema-neon font-bold text-sm">
                                        {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <span className="hidden sm:inline text-sm font-medium text-slate-200 max-w-[120px] truncate">
                                        {user.fullName}
                                    </span>
                                    <ChevronDown className="w-4 h-4 text-slate-400" />
                                </button>
                                {/* Dropdown Menu */}
                                {dropdownOpen && (
                                    <div
                                        className="absolute right-0 mt-2 w-56 bg-cinema-900 border border-cinema-800 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2"
                                        onMouseLeave={() => setDropdownOpen(false)}
                                    >
                                        <div className="px-4 py-2 border-b border-cinema-800">
                                            <p className="text-xs text-slate-400">Đăng nhập với tư cách</p>
                                            <p className="text-sm font-semibold text-white truncate">{user.email}</p>
                                            <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-cinema-neon/20 text-cinema-neon font-medium">
                                                {user.role}
                                            </span>
                                        </div>
                                        {isAdmin && (
                                            <Link
                                                to="/admin/dashboard"
                                                onClick={() => setDropdownOpen(false)}
                                                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-cinema-gold hover:bg-cinema-800 transition-colors font-medium"
                                            >
                                                <LayoutDashboard className="w-4 h-4" />
                                                Cổng Quản Trị (Admin)
                                            </Link>
                                        )}
                                        <Link
                                            to="/my-tickets"
                                            onClick={() => setDropdownOpen(false)}
                                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:bg-cinema-800 hover:text-white transition-colors"
                                        >
                                            <Ticket className="w-4 h-4 text-cinema-neon" />
                                            Vé Của Tôi
                                        </Link>
                                        <Link
                                            to="/profile"
                                            onClick={() => setDropdownOpen(false)}
                                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:bg-cinema-800 hover:text-white transition-colors"
                                        >
                                            <User className="w-4 h-4 text-slate-400" />
                                            Thông Tin Cá Nhân
                                        </Link>
                                        <div className="border-t border-cinema-800 mt-1 pt-1">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-cinema-red hover:bg-cinema-red/10 transition-colors text-left"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Đăng Xuất
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    to="/auth/login"
                                    className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-3 py-1.5"
                                >
                                    Đăng Nhập
                                </Link>
                                <Link
                                    to="/auth/register"
                                    className="text-sm font-medium text-white bg-cinema-red hover:bg-red-700 transition-colors px-4 py-2 rounded-xl shadow-glow-red"
                                >
                                    Đăng Ký
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>
            {/* ===== MAIN CONTENT BODY ===== */}
            <main className="flex-1">
                <Outlet />
            </main>
            {/* ===== CINEMA FOOTER ===== */}
            <footer className="bg-cinema-900 border-t border-cinema-800 py-10 mt-16 text-center text-xs text-slate-500">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <Film className="w-4 h-4 text-cinema-red" />
                        <span className="font-bold tracking-wider text-slate-300">CINETICKET ENTERPRISE</span>
                    </div>
                    <p>© 2026 CineTicket System. High Concurrency Movie Reservation System powered by NestJS & ReactJS.</p>
                </div>
            </footer>
        </div>
    )
}

export default MainLayout