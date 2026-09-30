import { Navigate, Route, Routes } from "react-router-dom"
import MainLayout from "../common/layouts/MainLayout"
import ProtectedRoute from "./ProtectedRoute"
import { AuthLayout } from "../common/layouts/AuthLayout"
import LoginPage from "../modules/auth/pages/LoginPage"
import RegisterPage from "../modules/auth/pages/RegisterPage"
import AdminRoute from "./AdminRoute"

// Mock Home tạm thời để test layout
function TempHomePage() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
            <h1 className="text-4xl font-extrabold mb-4 text-white">🎬 Chào mừng đến với CineTicket</h1>
            <p className="text-slate-400 max-w-lg mx-auto">
                Hệ thống đặt vé xem phim trực tuyến thời gian thực kết nối Backend NestJS.
            </p>
        </div>
    )
}

export function AppRoutes() {
    return (
        <Routes>
            {/* 1. Public Routes bọc bởi MainLayout */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<TempHomePage />} />
                <Route path="/movies" element={<TempHomePage />} />
                <Route path="/showtimes" element={<TempHomePage />} />
                {/* 2. Protected Routes (Yêu cầu đăng nhập) */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/profile" element={<div className="p-8 text-center text-white">Trang Thông Tin Cá Nhân (Profile)</div>} />
                    <Route path="/my-tickets" element={<div className="p-8 text-center text-white">Trang Lịch Sử Vé Của Tôi</div>} />
                </Route>
            </Route>
            {/* 3. Auth Routes (Layout riêng biệt) */}
            <Route path="/auth" element={<AuthLayout />}>
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
            </Route>
            {/* 4. Admin Portal Routes (Chỉ Admin mới vào được) */}
            <Route element={<AdminRoute />}>
                <Route path="/admin/dashboard" element={<div className="p-8 text-center text-cinema-gold text-2xl">Bảng Điều Khiển Admin (Dashboard)</div>} />
            </Route>
            {/* 5. Fallback 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

export default AppRoutes