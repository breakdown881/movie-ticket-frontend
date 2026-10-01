import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import adminApi from "../services/admin.api";
import { UserRole } from "../../../types/api.types";
import { toast } from "sonner";
import { Calendar, Mail, Phone, Users } from "lucide-react";
import { formatDate } from "../../../common/utils/format";

export function AdminUsersPage() {
    const queryClient = useQueryClient();

    // 1. Lấy danh sách người dùng
    const { data: users = [], isLoading } = useQuery({
        queryKey: ['admin-users-list'],
        queryFn: () => adminApi.getAllUsers(),
    });

    // 2. Mutation Đổi quyền người dùng (Call API PATCH /users/:id/role)
    const roleMutation = useMutation({
        mutationFn: (payload: { userId: string; role: UserRole }) => adminApi.promoteUserRole(payload.userId, payload.role),
        onSuccess: (updatedUser) => {
            queryClient.invalidateQueries({ queryKey: ['admin-users-list'] });
            toast.success(`Cập nhật quyền của [${updatedUser.email}] thành ${updatedUser.role}!`);
        },
        onError: (err: unknown) => {
            const error = err as Error;
            toast.error(error.message || 'Không thể thay đổi quyền hạn!');
        },
    });

    const handleRoleChange = (userId: string, newRole: UserRole, userEmail: string) => {
        if (window.confirm(`Bạn có chắc chắn muốn đổi quyền của "${userEmail}" thành "${newRole}" không?`)) {
            roleMutation.mutate({ userId, role: newRole });
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cinema-800">
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                        <Users className="w-6 h-6 text-cinema-neon" /> Quản Lý Người Dùng & Phân Quyền (RBAC)
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">
                        Tổng cộng: <strong>{users.length}</strong> thành viên đã đăng ký
                    </p>
                </div>
            </div>
            {/* Users Table */}
            <div className="bg-cinema-900 border border-cinema-800 rounded-2xl overflow-hidden">
                {isLoading ? (
                    <div className="p-12 text-center text-slate-400 animate-pulse">Đang tải danh sách hội viên...</div>
                ) : users.length === 0 ? (
                    <div className="p-12 text-center text-slate-400">Chưa có người dùng nào.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="bg-cinema-850/60 border-b border-cinema-800 text-slate-400 uppercase tracking-wider">
                                    <th className="py-3 px-4 font-semibold">Hội Viên</th>
                                    <th className="py-3 px-4 font-semibold">Email</th>
                                    <th className="py-3 px-4 font-semibold">Số Điện Thoại</th>
                                    <th className="py-3 px-4 font-semibold">Hình Thức</th>
                                    <th className="py-3 px-4 font-semibold">Ngày Tham Gia</th>
                                    <th className="py-3 px-4 font-semibold text-right">Vai Trò (Role)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-cinema-800/60">
                                {users.map((u) => (
                                    <tr key={u.id} className="hover:bg-cinema-850/40 transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-xl bg-cinema-850 border border-cinema-800 flex items-center justify-center font-bold text-cinema-neon">
                                                    {u.fullName ? u.fullName.charAt(0).toUpperCase() : 'U'}
                                                </div>
                                                <span className="font-bold text-white text-sm">{u.fullName || 'Người Dùng'}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-slate-300">
                                            <span className="inline-flex items-center gap-1.5">
                                                <Mail className="w-3.5 h-3.5 text-slate-500" />
                                                {u.email}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-slate-400">
                                            {u.phone ? (
                                                <span className="inline-flex items-center gap-1">
                                                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                                                    {u.phone}
                                                </span>
                                            ) : (
                                                '--'
                                            )}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="px-2 py-0.5 rounded-md bg-cinema-850 text-slate-300 border border-cinema-800 text-[10px] font-semibold uppercase">
                                                {u.provider || 'LOCAL'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-slate-400">
                                            <span className="inline-flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                                                {formatDate(u.createdAt)}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <select
                                                value={u.role}
                                                onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole, u.email)}
                                                disabled={roleMutation.isPending}
                                                className={`text-xs font-bold rounded-lg px-2.5 py-1 border focus:outline-none transition-colors ${u.role === UserRole.ADMIN
                                                        ? 'bg-cinema-gold/15 text-cinema-gold border-cinema-gold/40'
                                                        : 'bg-cinema-850 text-slate-300 border-cinema-800'
                                                    }`}
                                            >
                                                <option value={UserRole.USER}>Khách Hàng (USER)</option>
                                                <option value={UserRole.ADMIN}>Quản Trị Viên (ADMIN)</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminUsersPage;