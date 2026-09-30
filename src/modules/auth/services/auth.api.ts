import axiosClient from "../../../services/axiosClient";
import { AuthResponse, ForgotPasswordPayload, LoginPayload, RegisterPayload, ResetPasswordPayload, User } from "../../../types/auth.types";

export const authApi = {
    // Đăng nhập bằng Email/Password
    Login: async (payload: LoginPayload): Promise<AuthResponse> => {
        return axiosClient.post('/auth/login', payload)
    },

    // Đăng ký tài khoản mới
    register: async (payload: RegisterPayload): Promise<AuthResponse> => {
        return axiosClient.post('/auth/register', payload)
    },

    // Đăng nhập qua Google OAuth token
    loginWithGoogle: async (token: string): Promise<AuthResponse> => {
        return axiosClient.post('/auth/google', { token })
    },

    // Đăng nhập qua Facebook Access Token
    loginWithFacebook: async (token: string): Promise<AuthResponse> => {
        return axiosClient.post('/auth/facebook', { token })
    },

    // Yêu cầu link quên mật khẩu qua Email
    forgotPassword: async (payload: ForgotPasswordPayload): Promise<{ message: string }> => {
        return axiosClient.post('/auth/forgot-password', payload)
    },

    // Đặt lại mật khẩu với Token
    resetPassword: async (payload: ResetPasswordPayload): Promise<{ message: string }> => {
        return axiosClient.post('/auth/reset-password', payload)
    },

    // Lấy thông tin Profile của User đang đăng nhập
    getCurrentUser: async (): Promise<User> => {
        return axiosClient.get('/users/me')
    },
}

export default authApi