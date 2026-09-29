import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
// Lấy Base URL từ file .env (Mặc định: http://localhost:3000/api/v1)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';
export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});
// 1. Request Interceptor: Tự động gắn JWT Token vào Header
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('cine_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);
// 2. Response Interceptor: Tự động unwrap NestJS TransformInterceptor envelope
axiosClient.interceptors.response.use(
  (response) => {
    // Nếu backend bọc trong { success: true, data: T }, trả thẳng payload T ra ngoài
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return response.data.data;
    }
    return response.data;
  },
  (error: AxiosError<{ message?: string | string[]; error?: string; statusCode?: number }>) => {
    const status = error.response?.status;
    const responseData = error.response?.data;
    let errorMessage = 'Đã có lỗi xảy ra. Vui lòng thử lại sau.';
    if (responseData?.message) {
      if (Array.isArray(responseData.message)) {
        errorMessage = responseData.message.join(', ');
      } else {
        errorMessage = responseData.message;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    // Nếu token hết hạn (401), xóa session và điều hướng về trang đăng nhập
    if (status === 401 && !window.location.pathname.includes('/auth/')) {
      localStorage.removeItem('cine_token');
      localStorage.removeItem('cine_user');
      window.location.href = '/auth/login?sessionExpired=true';
    }
    return Promise.reject(new Error(errorMessage));
  }
);
export default axiosClient;