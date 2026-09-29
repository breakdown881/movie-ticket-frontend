import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach JWT Token if available
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

// Response Interceptor: Unwrap NestJS TransformInterceptor envelope
axiosClient.interceptors.response.use(
  (response) => {
    // NestJS TransformInterceptor wraps in: { success: true, statusCode: 200, data: T }
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return response.data.data;
    }
    return response.data;
  },
  (error: AxiosError<{ message?: string | string[]; error?: string; statusCode?: number }>) => {
    const status = error.response?.status;
    const responseData = error.response?.data;

    let errorMessage = 'An unexpected error occurred. Please try again.';

    if (responseData?.message) {
      if (Array.isArray(responseData.message)) {
        errorMessage = responseData.message.join(', ');
      } else {
        errorMessage = responseData.message;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    // Auto logout on 401 Unauthorized (unless requesting login/register)
    if (status === 401 && !window.location.pathname.includes('/auth/')) {
      localStorage.removeItem('cine_token');
      localStorage.removeItem('cine_user');
      window.location.href = '/auth/login?sessionExpired=true';
    }

    return Promise.reject(new Error(errorMessage));
  }
);

export default axiosClient;
