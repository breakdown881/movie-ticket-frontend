import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from "../stores/authStore";

export function ProtectedRoute() {
    const { isAuthenticated } = useAuthStore()
    const location = useLocation()

    if (!isAuthenticated) {
        // Lưu lại URL trước đó để sau khi đăng nhập xong tự động quay lại
        return <Navigate to={`/auth/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
    }

    return <Outlet />
}

export default ProtectedRoute