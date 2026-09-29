import { Film, Ticket, ShieldCheck, Clock } from 'lucide-react';

export function App() {
  return (
    <div className="min-h-screen bg-cinema-950 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-cinema-900 border border-cinema-800 rounded-2xl p-8 shadow-glow-purple text-center">
        {/* Brand Header */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="p-3 bg-cinema-red/20 text-cinema-red rounded-xl border border-cinema-red/30">
            <Film className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-cinema-neon bg-clip-text text-transparent">
            CineTicket System
          </h1>
        </div>
        <p className="text-slate-400 mb-8 text-sm md:text-base">
          Hệ thống Frontend đã kết nối cấu trúc nền tảng với Backend NestJS (PostgreSQL + Redis Lock + RabbitMQ + VNPay).
        </p>
        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-cinema-850 rounded-xl border border-cinema-800 text-left">
            <Ticket className="w-6 h-6 text-cinema-neon mb-2" />
            <h3 className="font-semibold text-white text-sm">Real-Time Seat</h3>
            <p className="text-xs text-slate-400 mt-1">Khóa ghế Redis 10 phút, chống race condition.</p>
          </div>
          <div className="p-4 bg-cinema-850 rounded-xl border border-cinema-800 text-left">
            <Clock className="w-6 h-6 text-cinema-gold mb-2" />
            <h3 className="font-semibold text-white text-sm">10-Min Hold TTL</h3>
            <p className="text-xs text-slate-400 mt-1">Đếm ngược nhả ghế tự động qua RabbitMQ.</p>
          </div>
          <div className="p-4 bg-cinema-850 rounded-xl border border-cinema-800 text-left">
            <ShieldCheck className="w-6 h-6 text-emerald-400 mb-2" />
            <h3 className="font-semibold text-white text-sm">RBAC Protected</h3>
            <p className="text-xs text-slate-400 mt-1">Phân quyền User và Admin chặt chẽ.</p>
          </div>
        </div>
        {/* Màn chiếu mô phỏng */}
        <div className="mt-6">
          <div className="cinema-screen-curve w-3/4 mx-auto mb-2"></div>
          <span className="text-xs uppercase tracking-widest text-slate-500 font-medium">MÀN HÌNH CHIẾU</span>
        </div>
      </div>
    </div>
  );
}
export default App;