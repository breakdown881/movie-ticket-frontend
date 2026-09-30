import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useState } from 'react';
import { useAuthStore } from '../../../stores/authStore';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import authApi from '../services/auth.api';
import { ArrowRight, Loader2, Lock, Mail, Phone, UserIcon } from 'lucide-react';
import { RegisterPayload } from '../../../types/auth.types';

const registerSchema = z.object({
    fullName: z.string().min(2, 'Họ và tên tối thiểu 2 ký tự'),
    email: z.string().email('Địa chỉ email không hợp lệ'),
    phone: z.string().regex(/^[0-9]{10}$/, 'Số điện thoại phải gồm 10 chữ số').optional().or(z.literal('')),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
})

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false)
    const { setAuth } = useAuthStore()
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema)
    })

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true)
        try {
            const response = await authApi.register(data as RegisterPayload)
            setAuth(response.user, response.accessToken)
            toast.success('Đăng ký tài khoản thành công!')
            navigate('/', {replace: true})
        } catch (err) {
            const error = err as Error
            toast.error(error.message || 'Đăng ký thất bại. Vui lòng thử lại!')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white tracking-tight">Tạo Tài Khoản</h2>
                <p className="text-xs text-slate-400 mt-1">Gia nhập cộng đồng người yêu điện ảnh</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
                {/* Full Name */}
                <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Họ và tên</label>
                    <div className="relative">
                        <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                        <input
                            type="text"
                            {...register('fullName')}
                            placeholder="Nguyễn Văn A"
                            className="w-full bg-cinema-850 border border-cinema-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cinema-neon focus:ring-1 focus:ring-cinema-neon"
                        />
                    </div>
                    {errors.fullName && <p className="text-xs text-cinema-red mt-1">{errors.fullName.message}</p>}
                </div>
                {/* Email */}
                <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Email</label>
                    <div className="relative">
                        <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                        <input
                            type="email"
                            {...register('email')}
                            placeholder="name@example.com"
                            className="w-full bg-cinema-850 border border-cinema-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cinema-neon focus:ring-1 focus:ring-cinema-neon"
                        />
                    </div>
                    {errors.email && <p className="text-xs text-cinema-red mt-1">{errors.email.message}</p>}
                </div>
                {/* Phone */}
                <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Số điện thoại (tùy chọn)</label>
                    <div className="relative">
                        <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                        <input
                            type="tel"
                            {...register('phone')}
                            placeholder="0912345678"
                            className="w-full bg-cinema-850 border border-cinema-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cinema-neon focus:ring-1 focus:ring-cinema-neon"
                        />
                    </div>
                    {errors.phone && <p className="text-xs text-cinema-red mt-1">{errors.phone.message}</p>}
                </div>
                {/* Password */}
                <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Mật khẩu</label>
                    <div className="relative">
                        <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                        <input
                            type="password"
                            {...register('password')}
                            placeholder="••••••••"
                            className="w-full bg-cinema-850 border border-cinema-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cinema-neon focus:ring-1 focus:ring-cinema-neon"
                        />
                    </div>
                    {errors.password && <p className="text-xs text-cinema-red mt-1">{errors.password.message}</p>}
                </div>
                {/* Submit */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 bg-cinema-red hover:bg-red-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-xl transition-all shadow-glow-red flex items-center justify-center gap-2 text-sm"
                >
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <>
                            Đăng Ký Tài Khoản <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </form>
            <div className="mt-5 text-center text-xs text-slate-400">
                Đã có tài khoản?{' '}
                <Link to="/auth/login" className="text-cinema-neon font-semibold hover:underline">
                    Đăng nhập ngay
                </Link>
            </div>
        </div>
    )
}

export default RegisterPage