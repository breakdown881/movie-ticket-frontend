import { Navigate, Route, Routes } from "react-router-dom"
import MainLayout from "../common/layouts/MainLayout"
import ProtectedRoute from "./ProtectedRoute"
import { AuthLayout } from "../common/layouts/AuthLayout"
import LoginPage from "../modules/auth/pages/LoginPage"
import RegisterPage from "../modules/auth/pages/RegisterPage"
import AdminRoute from "./AdminRoute"
import HomePage from "../modules/movies/pages/HomePage"
import MovieDetailPage from "../modules/movies/pages/MovieDetailPage"
import { ShowtimePicker } from "../modules/showtimes/components/ShowtimePicker"
import { SeatSelectionPage } from "../modules/booking/pages/SeatSelectionPage"
import PaymentReturnPage from "../modules/booking/pages/PaymentReturnPage"
import CheckoutPage from "../modules/booking/pages/CheckoutPage"

export function AppRoutes() {
    return (
        <Routes>
            {/* 1. Public Routes bọc bởi MainLayout */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/movies" element={<HomePage />} />
                <Route path="/movies/:id" element={<MovieDetailPage />} />
                <Route
                    path="/showtimes"
                    element={
                        <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">
                            <h1 className="text-3xl font-bold text-white">Lịch Chiếu Toàn Quốc</h1>
                            <ShowtimePicker />
                        </div>
                    }
                />

                {/* Route Chọn Ghế */}
                <Route path="/booking/seat-selection/:showtimeId" element={<SeatSelectionPage />} />

                {/* Route Kết Quả Thanh Toán & Vé Điện Tử QR */}
                <Route path="/booking/payment-return" element={<PaymentReturnPage />} />

                {/* 2. Protected Routes (Yêu cầu đăng nhập) */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/booking/checkout/:reservationId" element={<CheckoutPage />} />
                    <Route path="/profile" element={<div className="p-8 text-center text-white">Trang Thông Tin Cá Nhân</div>} />
                    <Route path="/my-tickets" element={<div className="p-8 text-center text-white">Trang Lịch Sử Vé Của Tôi</div>} />
                </Route>
            </Route>

            {/* 3. Auth Routes */}
            <Route path="/auth" element={<AuthLayout />}>
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
            </Route>

            {/* 4. Admin Portal Routes */}
            <Route element={<AdminRoute />}>
                <Route path="/admin/dashboard" element={<div className="p-8 text-center text-cinema-gold text-2xl">Bảng Điều Khiển Admin (Dashboard)</div>} />
            </Route>
            
            {/* 5. Fallback 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

export default AppRoutes