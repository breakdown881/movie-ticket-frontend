import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '../../../stores/authStore';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import authApi from '../services/auth.api';
import { toast } from 'sonner';
import { ArrowRight, Loader2, Lock, Mail } from 'lucide-react';
import { LoginPayload } from '../../../types/auth.types';

// 1. Zod Validation Schema
const loginSchema = z.object({
    email: z.string().email('Địa chỉ email không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginPage() {
    const [isLoading, setIsLoading] = useState(false)
    const { setAuth } = useAuthStore()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const redirectUrl = searchParams.get('redirect') || '/'

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: 'admin@cinema.com', // Mặc định sẵn tài khoản Admin để test nhanh
            password: 'Admin@123456',
        }
    })

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true)
        try {
            const response = await authApi.login(data as LoginPayload)
            setAuth(response.user, response.accessToken)
            toast.success(`Chào mừng trở lại, ${response.user.fullName || response.user.email}!`)
            navigate(redirectUrl, { replace: true })
        } catch (err: unknown) {
            const error = err as Error
            toast.error(error.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white tracking-tight">Đăng Nhập</h2>
                <p className="text-xs text-slate-400 mt-1">Truy cập để đặt vé và trải nghiệm điện ảnh đỉnh cao</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email Field */}
                <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Email</label>
                    <div className="relative">
                        <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                        <input
                            type="email"
                            {...register('email')}
                            placeholder="name@example.com"
                            className="w-full bg-cinema-850 border border-cinema-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cinema-neon focus:ring-1 focus:ring-cinema-neon transition-all"
                        />
                    </div>
                    {errors.email && <p className="text-xs text-cinema-red mt-1">{errors.email.message}</p>}
                </div>
                {/* Password Field */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-medium text-slate-300">Mật khẩu</label>
                        <Link to="/auth/forgot-password" className="text-xs text-cinema-neon hover:underline">
                            Quên mật khẩu?
                        </Link>
                    </div>
                    <div className="relative">
                        <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                        <input
                            type="password"
                            {...register('password')}
                            placeholder="••••••••"
                            className="w-full bg-cinema-850 border border-cinema-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cinema-neon focus:ring-1 focus:ring-cinema-neon transition-all"
                        />
                    </div>
                    {errors.password && <p className="text-xs text-cinema-red mt-1">{errors.password.message}</p>}
                </div>
                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 bg-cinema-red hover:bg-red-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-xl transition-all shadow-glow-red flex items-center justify-center gap-2 text-sm"
                >
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <>
                            Đăng Nhập <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </form>
            {/* Switch to Register */}
            <div className="mt-6 text-center text-xs text-slate-400">
                Chưa có tài khoản?{' '}
                <Link to="/auth/register" className="text-cinema-neon font-semibold hover:underline">
                    Đăng ký ngay
                </Link>
            </div>
        </div>
    )
}

export default LoginPage