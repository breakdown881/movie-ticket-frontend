import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Discount } from "../../../types/booking.types";
import { DiscountType } from "../../../types/api.types";
import adminApi from "../services/admin.api";
import { toast } from "sonner";
import { CheckCircle, Loader2, Plus, Tag, Trash2, X, XCircle } from "lucide-react";
import { formatCurrency, formatDate } from "../../../common/utils/format";

export function AdminDiscountsPage() {
    const queryClient = useQueryClient();
    const [isAddModal, setIsAddModal] = useState(false);

    // Form state
    const [form, setForm] = useState<Partial<Discount>>({
        code: '',
        discountType: DiscountType.PERCENTAGE,
        discountValue: 20,
        minOrderAmount: 100000,
        maxDiscountAmount: 50000,
        usageLimit: 100,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        isActive: true,
    });

    // 1. Lấy danh sách voucher
    const { data: discounts = [], isLoading } = useQuery({
        queryKey: ['admin-discounts-list'],
        queryFn: () => adminApi.getAllDiscounts(),
    });

    // 2. Mutation Tạo voucher
    const createMutation = useMutation({
        mutationFn: (payload: Partial<Discount>) => adminApi.createDiscount(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-discounts-list'] });
            toast.success('Tạo mã khuyến mãi thành công!');
            setIsAddModal(false);
            setForm({
                code: '',
                discountType: DiscountType.PERCENTAGE,
                discountValue: 20,
                minOrderAmount: 100000,
                maxDiscountAmount: 50000,
                usageLimit: 100,
                startDate: new Date().toISOString().split('T')[0],
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                isActive: true,
            });
        },
        onError: (err: unknown) => {
            const error = err as Error;
            toast.error(error.message || 'Không thể tạo mã khuyến mãi!');
        },
    });

    // 3. Mutation Xóa voucher
    const deleteMutation = useMutation({
        mutationFn: (id: string) => adminApi.deleteDiscount(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-discounts-list'] });
            toast.success('Đã xóa mã khuyến mãi!');
        },
        onError: (err: unknown) => {
            const error = err as Error;
            toast.error(error.message || 'Không thể xóa mã!');
        },
    });

    const handleDelete = (id: string, code: string) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa mã "${code}" không?`)) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cinema-800">
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                        <Tag className="w-6 h-6 text-emerald-400" /> Quản Lý Mã Khuyến Mãi (Vouchers)
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">
                        Tổng cộng: <strong>{discounts.length}</strong> mã khuyến mãi
                    </p>
                </div>
                <button
                    onClick={() => setIsAddModal(true)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 self-start sm:self-auto"
                >
                    <Plus className="w-4 h-4" /> Tạo Mã Mới
                </button>
            </div>
            {/* Table */}
            <div className="bg-cinema-900 border border-cinema-800 rounded-2xl overflow-hidden">
                {isLoading ? (
                    <div className="p-12 text-center text-slate-400 animate-pulse">Đang tải danh sách mã...</div>
                ) : discounts.length === 0 ? (
                    <div className="p-12 text-center text-slate-400">Chưa có mã khuyến mãi nào.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="bg-cinema-850/60 border-b border-cinema-800 text-slate-400 uppercase tracking-wider">
                                    <th className="py-3 px-4 font-semibold">Mã Code</th>
                                    <th className="py-3 px-4 font-semibold">Mức Giảm</th>
                                    <th className="py-3 px-4 font-semibold">Đơn Tối Thiểu</th>
                                    <th className="py-3 px-4 font-semibold">Lượt Đã Dùng</th>
                                    <th className="py-3 px-4 font-semibold">Hạn Dùng</th>
                                    <th className="py-3 px-4 font-semibold">Trạng Thái</th>
                                    <th className="py-3 px-4 font-semibold text-right">Thao Tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-cinema-800/60">
                                {discounts.map((d) => (
                                    <tr key={d.id} className="hover:bg-cinema-850/40 transition-colors">
                                        <td className="py-3 px-4 font-mono font-black text-white text-sm">
                                            {d.code}
                                        </td>
                                        <td className="py-3 px-4 font-bold text-emerald-400">
                                            {d.discountType === DiscountType.PERCENTAGE
                                                ? `${d.discountValue}% (Tối đa ${formatCurrency(d.maxDiscountAmount || 0)})`
                                                : formatCurrency(d.discountValue)}
                                        </td>
                                        <td className="py-3 px-4 text-slate-300">
                                            {formatCurrency(d.minOrderAmount)}
                                        </td>
                                        <td className="py-3 px-4 text-slate-300">
                                            <strong>{d.usedCount}</strong> / {d.usageLimit}
                                        </td>
                                        <td className="py-3 px-4 text-slate-400">
                                            {formatDate(d.startDate)} &rarr; {formatDate(d.endDate)}
                                        </td>
                                        <td className="py-3 px-4">
                                            {d.isActive ? (
                                                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold">
                                                    <CheckCircle className="w-3 h-3" /> Đang bật
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-semibold">
                                                    <XCircle className="w-3 h-3" /> Đã tắt
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <button
                                                onClick={() => handleDelete(d.id, d.code)}
                                                disabled={deleteMutation.isPending}
                                                className="p-1.5 text-slate-400 hover:text-cinema-red hover:bg-red-950/30 rounded-lg transition-colors"
                                                title="Xóa voucher"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            {/* ===== MODAL TẠO MÃ KHUYẾN MÃI ===== */}
            {isAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                    <div className="relative w-full max-w-md bg-cinema-900 border border-cinema-800 rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-3 border-b border-cinema-800">
                            <h3 className="text-base font-bold text-white flex items-center gap-2">
                                <Tag className="w-4 h-4 text-emerald-400" /> Tạo Mã Giảm Giá Mới
                            </h3>
                            <button onClick={() => setIsAddModal(false)} className="text-slate-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                createMutation.mutate(form);
                            }}
                            className="space-y-3.5 text-xs"
                        >
                            <div>
                                <label className="block font-medium text-slate-300 mb-1">Mã Code (Chữ in hoa) *</label>
                                <input
                                    type="text"
                                    required
                                    value={form.code}
                                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                                    placeholder="VD: CINETICKET20"
                                    className="w-full bg-cinema-850 border border-cinema-800 rounded-xl px-3.5 py-2 text-white font-mono font-bold uppercase focus:outline-none focus:border-emerald-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-medium text-slate-300 mb-1">Loại Giảm Giá</label>
                                    <select
                                        value={form.discountType}
                                        onChange={(e) => setForm({ ...form, discountType: e.target.value as DiscountType })}
                                        className="w-full bg-cinema-850 border border-cinema-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                                    >
                                        <option value={DiscountType.PERCENTAGE}>Phần Trăm (%)</option>
                                        <option value={DiscountType.FIXED_AMOUNT}>Tiền Cố Định (VNĐ)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-medium text-slate-300 mb-1">Giá Trị Giảm *</label>
                                    <input
                                        type="number"
                                        min={1}
                                        required
                                        value={form.discountValue}
                                        onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })}
                                        className="w-full bg-cinema-850 border border-cinema-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-medium text-slate-300 mb-1">Đơn Tối Thiểu (VNĐ)</label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={form.minOrderAmount}
                                        onChange={(e) => setForm({ ...form, minOrderAmount: Number(e.target.value) })}
                                        className="w-full bg-cinema-850 border border-cinema-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium text-slate-300 mb-1">Giảm Tối Đa (VNĐ)</label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={form.maxDiscountAmount}
                                        onChange={(e) => setForm({ ...form, maxDiscountAmount: Number(e.target.value) })}
                                        className="w-full bg-cinema-850 border border-cinema-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block font-medium text-slate-300 mb-1">Tổng Lượt Sử Dụng *</label>
                                <input
                                    type="number"
                                    min={1}
                                    required
                                    value={form.usageLimit}
                                    onChange={(e) => setForm({ ...form, usageLimit: Number(e.target.value) })}
                                    className="w-full bg-cinema-850 border border-cinema-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-emerald-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-medium text-slate-300 mb-1">Ngày Bắt Đầu *</label>
                                    <input
                                        type="date"
                                        required
                                        value={form.startDate}
                                        onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                                        className="w-full bg-cinema-850 border border-cinema-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium text-slate-300 mb-1">Ngày Hết Hạn *</label>
                                    <input
                                        type="date"
                                        required
                                        value={form.endDate}
                                        onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                                        className="w-full bg-cinema-850 border border-cinema-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>
                            <div className="pt-3 border-t border-cinema-800 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModal(false)}
                                    className="px-4 py-2 bg-cinema-850 hover:bg-cinema-800 text-slate-300 rounded-xl font-medium"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={createMutation.isPending || !form.code}
                                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-md flex items-center gap-1.5"
                                >
                                    {createMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                    Lưu Voucher
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDiscountsPage;