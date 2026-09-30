import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

export function AdminRoute() {
    const { isAuthenticated, isAdmin } = useAuthStore()
    
    if (!isAuthenticated) {
        return <Navigate to="/auth/login?redirect=/admin/dashboard" replace />
    }

    if (!isAdmin) {
        // Không có quyền Admin -> điều hướng về trang chủ
        return <Navigate to="/" replace />
    }

    return <Outlet />
}

export default AdminRoute