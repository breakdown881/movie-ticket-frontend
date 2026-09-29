import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '../types/auth.types';

interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    isAdmin: boolean
    setAuth: (user: User, token: string) => void
    logout: () => void
    updateUser: (user: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isAdmin: false,

            // Thiết lập thông tin khi đăng nhập thành công
            setAuth: (user: User, token: string) => {
                localStorage.setItem('cine_token', token)
                set({
                    user,
                    token,
                    isAuthenticated: true,
                    isAdmin: user.role === UserRole.ADMIN
                })
            },

            // Xóa phiên đăng nhập
            logout: () => {
                localStorage.removeItem('cine_token')
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    isAdmin: false
                })
            },

            // Cập nhật thông tin profile của user
            updateUser: (updatedFields) => {
                const currentUser = get().user
                if (currentUser) {
                    const newUser = { ...currentUser, ...updatedFields }
                    set({
                        user: newUser,
                        isAdmin: newUser.role === UserRole.ADMIN
                    })
                }
            },
        }),
        {
            name: 'cine_auth_storage', // Key lưu trữ trong localStorage
        }
    )
)