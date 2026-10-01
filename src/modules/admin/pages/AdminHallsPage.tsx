import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { GenerateSeatsPayload, Hall } from "../../../types/cinema.types";
import showtimesApi from "../../showtimes/services/showtimes.api";
import adminApi from "../services/admin.api";
import { toast } from "sonner";
import { Armchair, Check, Layers, Loader2, Plus, X } from "lucide-react";

export function AdminHallsPage() {
    const queryClient = useQueryClient();
    const [isAddHallModal, setIsAddHallModal] = useState(false);
    const [selectedHallForSeats, setSelectedHallForSeats] = useState<Hall | null>(null);

    // Form state thêm phòng chiếu
    const [hallName, setHallName] = useState('');
    const [totalSeatsInput, setTotalSeatsInput] = useState(120);

    // State cho Ma trận sinh ghế tự động
    const allAlphabetRows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K'];
    const [selectedRows, setSelectedRows] = useState<string[]>(['A', 'B', 'C', 'D', 'E', 'F', 'G']);
    const [seatsPerRow, setSeatsPerRow] = useState<number>(12);
    const [vipRows, setVipRows] = useState<string[]>(['D', 'E']);

    // 1. Lấy danh sách phòng chiếu
    const { data: halls = [], isLoading } = useQuery({
        queryKey: ['admin-halls-list'],
        queryFn: () => showtimesApi.getHalls(),
    });

    // 2. Mutation Thêm phòng chiếu
    const createHallMutation = useMutation({
        mutationFn: () => adminApi.createHall(hallName, totalSeatsInput),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-halls-list'] });
            toast.success('Tạo phòng chiếu mới thành công!');
            setIsAddHallModal(false);
            setHallName('');
        },
        onError: (err: unknown) => {
            const error = err as Error;
            toast.error(error.message || 'Không thể tạo phòng chiếu!');
        },
    });

    // 3. Mutation Sinh Ghế Tự Động (Call API /halls/:id/seats/generate)
    const generateSeatsMutation = useMutation({
        mutationFn: (payload: { hallId: string, data: GenerateSeatsPayload }) => adminApi.generateSeats(payload.hallId, payload.data),
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ['admin-halls-list'] });
            toast.success(res.message || 'Sinh ma trận ghế thành công!');
            setSelectedHallForSeats(null);
        },
        onError: (err: unknown) => {
            const error = err as Error;
            toast.error(error.message || 'Không thể sinh ma trận ghế!');
        },
    });

    const toggleRow = (r: string) => {
        if (selectedRows.includes(r)) {
            setSelectedRows(selectedRows.filter((x) => x !== r));
            setVipRows(vipRows.filter((x) => x !== r));
        } else {
            setSelectedRows([...selectedRows, r]);
        }
    };

    const toggleVipRow = (r: string) => {
        if (vipRows.includes(r)) {
            setVipRows(vipRows.filter((x) => x !== r));
        } else {
            setVipRows([...vipRows, r]);
        }
    };

    const handleGenerateSeats = () => {
        if (!selectedHallForSeats) return;
        if (selectedRows.length === 0) {
            toast.warning('Vui lòng chọn ít nhất 1 hàng ghế!');
            return;
        }

        generateSeatsMutation.mutate({
            hallId: selectedHallForSeats.id,
            data: {
                rows: selectedRows,
                seatsPerRow,
                vipRows,
            },
        });
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cinema-800">
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                        <Armchair className="w-6 h-6 text-cinema-neon" /> Quản Lý Phòng Chiếu & Sơ Đồ Ghế
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">
                        Tổng cộng: <strong>{halls.length}</strong> phòng chiếu trong rạp
                    </p>
                </div>
                <button
                    onClick={() => setIsAddHallModal(true)}
                    className="px-4 py-2 bg-cinema-neon hover:bg-indigo-600 text-white font-bold text-xs rounded-xl transition-all shadow-glow-purple flex items-center gap-1.5 self-start sm:self-auto"
                >
                    <Plus className="w-4 h-4" /> Thêm Phòng Chiếu
                </button>
            </div>
            {/* Halls Grid */}
            {isLoading ? (
                <div className="p-12 text-center text-slate-400 animate-pulse">Đang tải danh sách phòng chiếu...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {halls.map((hall) => (
                        <div
                            key={hall.id}
                            className="bg-cinema-900 border border-cinema-800 rounded-2xl p-6 flex flex-col justify-between hover:border-cinema-neon/50 transition-all space-y-4"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-white">{hall.name}</h3>
                                    <span className="text-xs text-slate-400">Sức chứa: {hall.totalSeats} chỗ ngồi</span>
                                </div>
                                <div className="p-2.5 bg-cinema-850 rounded-xl border border-cinema-800 text-cinema-neon">
                                    <Armchair className="w-5 h-5" />
                                </div>
                            </div>
                            {/* Action: Sinh ghế tự động */}
                            <div className="pt-4 border-t border-cinema-800 flex items-center justify-between">
                                <span className="text-[11px] text-slate-500">ID: {hall.id.slice(0, 8)}...</span>
                                <button
                                    type="button"
                                    onClick={() => setSelectedHallForSeats(hall)}
                                    className="px-3.5 py-1.5 bg-cinema-gold/15 hover:bg-cinema-gold text-cinema-gold hover:text-cinema-950 font-bold text-xs rounded-xl border border-cinema-gold/30 transition-all flex items-center gap-1.5"
                                >
                                    <Layers className="w-3.5 h-3.5" /> Sinh Ghế Tự Động
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {/* ===== MODAL THÊM PHÒNG CHIẾU ===== */}
            {isAddHallModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                    <div className="relative w-full max-w-md bg-cinema-900 border border-cinema-800 rounded-2xl p-6 space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-cinema-800">
                            <h3 className="text-base font-bold text-white flex items-center gap-2">
                                <Plus className="w-4 h-4 text-cinema-neon" /> Thêm Phòng Chiếu Mới
                            </h3>
                            <button onClick={() => setIsAddHallModal(false)} className="text-slate-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                createHallMutation.mutate();
                            }}
                            className="space-y-4 text-xs"
                        >
                            <div>
                                <label className="block font-medium text-slate-300 mb-1">Tên phòng chiếu *</label>
                                <input
                                    type="text"
                                    required
                                    value={hallName}
                                    onChange={(e) => setHallName(e.target.value)}
                                    placeholder="VD: Phòng Chiếu 03 (IMAX Laser)"
                                    className="w-full bg-cinema-850 border border-cinema-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cinema-neon"
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-slate-300 mb-1">Dự kiến tổng số ghế</label>
                                <input
                                    type="number"
                                    min={10}
                                    value={totalSeatsInput}
                                    onChange={(e) => setTotalSeatsInput(Number(e.target.value))}
                                    className="w-full bg-cinema-850 border border-cinema-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cinema-neon"
                                />
                            </div>
                            <div className="pt-3 border-t border-cinema-800 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAddHallModal(false)}
                                    className="px-4 py-2 bg-cinema-850 hover:bg-cinema-800 text-slate-300 rounded-xl font-medium"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={createHallMutation.isPending || !hallName.trim()}
                                    className="px-5 py-2 bg-cinema-neon hover:bg-indigo-600 disabled:opacity-50 text-white font-bold rounded-xl shadow-glow-purple flex items-center gap-1.5"
                                >
                                    {createHallMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                    Lưu Phòng Chiếu
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* ===== MODAL SINH MA TRẬN GHẾ TỰ ĐỘNG (CORE ADMIN FEATURE) ===== */}
            {selectedHallForSeats && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                    <div className="relative w-full max-w-lg bg-cinema-900 border border-cinema-800 rounded-2xl p-6 space-y-5">
                        <div className="flex items-center justify-between pb-3 border-b border-cinema-800">
                            <div>
                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                    <Layers className="w-4 h-4 text-cinema-gold" /> Sinh Ma Trận Ghế Tự Động
                                </h3>
                                <span className="text-xs text-cinema-neon font-medium">{selectedHallForSeats.name}</span>
                            </div>
                            <button onClick={() => setSelectedHallForSeats(null)} className="text-slate-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-4 text-xs">
                            {/* 1. Chọn các hàng ghế */}
                            <div>
                                <label className="block font-medium text-slate-300 mb-1.5">
                                    1. Chọn các Hàng Ghế trong phòng:
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {allAlphabetRows.map((r) => {
                                        const isSelected = selectedRows.includes(r);
                                        return (
                                            <button
                                                type="button"
                                                key={r}
                                                onClick={() => toggleRow(r)}
                                                className={`w-8 h-8 rounded-lg font-bold border transition-all ${isSelected
                                                        ? 'bg-cinema-neon text-white border-cinema-neon shadow-glow-purple'
                                                        : 'bg-cinema-850 border-cinema-800 text-slate-400'
                                                    }`}
                                            >
                                                {r}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            {/* 2. Số ghế mỗi hàng */}
                            <div>
                                <label className="block font-medium text-slate-300 mb-1">
                                    2. Số ghế trên mỗi hàng (Cột):
                                </label>
                                <input
                                    type="number"
                                    min={4}
                                    max={24}
                                    value={seatsPerRow}
                                    onChange={(e) => setSeatsPerRow(Number(e.target.value))}
                                    className="w-full bg-cinema-850 border border-cinema-800 rounded-xl px-3.5 py-2 text-white font-bold focus:outline-none focus:border-cinema-gold"
                                />
                                <span className="text-[11px] text-slate-500 mt-1 block">
                                    Tổng ghế dự kiến: {selectedRows.length} hàng × {seatsPerRow} ghế ={' '}
                                    <strong className="text-cinema-gold">{selectedRows.length * seatsPerRow} ghế</strong>
                                </span>
                            </div>
                            {/* 3. Chỉ định hàng VIP */}
                            <div>
                                <label className="block font-medium text-slate-300 mb-1.5">
                                    3. Chỉ định các Hàng là Ghế VIP (Giá x1.2):
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {selectedRows.map((r) => {
                                        const isVip = vipRows.includes(r);
                                        return (
                                            <button
                                                type="button"
                                                key={r}
                                                onClick={() => toggleVipRow(r)}
                                                className={`px-3 py-1 rounded-lg border text-xs font-semibold transition-all flex items-center gap-1 ${isVip
                                                        ? 'bg-amber-600 text-white border-amber-500 shadow-sm shadow-amber-500/30'
                                                        : 'bg-cinema-850 border-cinema-800 text-slate-400'
                                                    }`}
                                            >
                                                Hàng {r} {isVip && <Check className="w-3 h-3" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        {/* Actions */}
                        <div className="pt-4 border-t border-cinema-800 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setSelectedHallForSeats(null)}
                                className="px-4 py-2 bg-cinema-850 hover:bg-cinema-800 text-slate-300 rounded-xl font-medium text-xs"
                            >
                                Đóng
                            </button>
                            <button
                                type="button"
                                onClick={handleGenerateSeats}
                                disabled={generateSeatsMutation.isPending || selectedRows.length === 0}
                                className="px-5 py-2 bg-cinema-gold hover:bg-amber-500 disabled:opacity-50 text-cinema-950 font-bold rounded-xl text-xs flex items-center gap-1.5"
                            >
                                {generateSeatsMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                Xác Nhận Sinh Ghế
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminHallsPage;