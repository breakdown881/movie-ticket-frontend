import { Calendar, Mail, Phone, ShieldCheck } from "lucide-react";
import { useAuthStore } from "../../../stores/authStore";
import { formatDate } from "../../../common/utils/format";

export function UserProfilePage() {
    const { user } = useAuthStore();

    return (
        <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
            <div className="pb-6 border-b border-cinema-800">
                <h1 className="text-3xl font-black text-white tracking-tight">Hồ Sơ Cá Nhân</h1>
                <p className="text-xs text-slate-400 mt-1">Quản lý thông tin tài khoản thành viên CineTicket</p>
            </div>
            <div className="bg-cinema-900 border border-cinema-800 rounded-2xl p-6 sm:p-8 space-y-6">
                {/* Avatar Header */}
                <div className="flex items-center gap-4 pb-6 border-b border-cinema-800">
                    <div className="w-16 h-16 rounded-2xl bg-cinema-neon/20 border border-cinema-neon/40 flex items-center justify-center text-cinema-neon font-black text-2xl shadow-glow-purple">
                        {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">{user?.fullName || 'Hội Viên'}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cinema-gold/20 text-cinema-gold border border-cinema-gold/30 font-bold uppercase">
                                {user?.role}
                            </span>
                            <span className="text-xs text-slate-500">•</span>
                            <span className="text-xs text-slate-400">Đăng nhập qua {user?.provider || 'LOCAL'}</span>
                        </div>
                    </div>
                </div>
                {/* Profile Info Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-cinema-850 rounded-xl border border-cinema-800 space-y-1">
                        <span className="text-slate-400 flex items-center gap-1.5">
                            <Mail className="w-4 h-4 text-cinema-neon" /> Địa chỉ Email
                        </span>
                        <p className="text-sm font-semibold text-white">{user?.email}</p>
                    </div>
                    <div className="p-4 bg-cinema-850 rounded-xl border border-cinema-800 space-y-1">
                        <span className="text-slate-400 flex items-center gap-1.5">
                            <Phone className="w-4 h-4 text-emerald-400" /> Số điện thoại
                        </span>
                        <p className="text-sm font-semibold text-white">{user?.phone || 'Chưa cập nhật'}</p>
                    </div>
                    <div className="p-4 bg-cinema-850 rounded-xl border border-cinema-800 space-y-1">
                        <span className="text-slate-400 flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-cinema-gold" /> Ngày đăng ký
                        </span>
                        <p className="text-sm font-semibold text-white">{formatDate(user?.createdAt)}</p>
                    </div>
                    <div className="p-4 bg-cinema-850 rounded-xl border border-cinema-800 space-y-1">
                        <span className="text-slate-400 flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-blue-400" /> Trạng thái bảo mật
                        </span>
                        <p className="text-sm font-semibold text-emerald-400">Tài khoản an toàn</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserProfilePage;