import { Film } from "lucide-react";
import { Link, Outlet } from "react-router-dom";

export function AuthLayout() {
    return (
        <div className="min-h-screen bg-cinema-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
            {/* Background glow effects */}
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cinema-red/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cinema-neon/10 rounded-full blur-3xl pointer-events-none"></div>
            {/* Header Logo */}
            <Link to="/" className="flex items-center gap-2 mb-8 group z-10">
                <div className="p-2.5 bg-cinema-red rounded-xl shadow-glow-red group-hover:scale-105 transition-transform">
                    <Film className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-black tracking-tight text-white">
                    CINE<span className="text-cinema-red">TICKET</span>
                </span>
            </Link>
            {/* Form Card Content */}
            <div className="w-full max-w-md bg-cinema-900/90 border border-cinema-800 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl z-10">
                <Outlet />
            </div>
        </div>
    )
}