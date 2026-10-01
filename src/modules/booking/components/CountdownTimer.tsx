import { AlertTriangle, Clock } from "lucide-react"
import { useEffect, useState } from "react"

interface CountdownTimerProps {
    expiresAt: string | Date
    onExpire: () => void
}

export function CountdownTimer({ expiresAt, onExpire }: CountdownTimerProps) {
    // Tính số giây còn lại
    const calculateRemainingSeconds = () => {
        const expireTime = new Date(expiresAt).getTime()
        const now = Date.now()
        return Math.max(0, Math.floor((expireTime - now) / 1000))
    }

    const [remainingSeconds, setRemainingSeconds] = useState(calculateRemainingSeconds)

    useEffect(() => {
        const timer = setInterval(() => {
            const remaining = calculateRemainingSeconds()
            setRemainingSeconds(remaining)

            if (remaining <= 0) {
                clearInterval(timer)
                onExpire()
            }
        }, 1000)

        return () => clearInterval(timer)
    }, [expiresAt, onExpire])

    // Định dạng mm:ss
    const minutes = Math.floor(remainingSeconds / 60)
    const seconds = remainingSeconds % 60
    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

    const isUrgent = remainingSeconds <= 60

    return (
        <div
            className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-xl border transition-all ${isUrgent
                    ? 'bg-red-950/60 border-red-500 text-red-400 animate-pulse shadow-glow-red'
                    : 'bg-cinema-900 border-cinema-gold/40 text-cinema-gold'
                }`}
        >
            {isUrgent ? (
                <AlertTriangle className="w-4 h-4 text-red-400 animate-bounce" />
            ) : (
                <Clock className="w-4 h-4 text-cinema-gold" />
            )}
            <div className="text-xs font-medium">
                Thời gian giữ vé: <strong className="text-sm font-black font-mono ml-1">{formattedTime}</strong>
            </div>
        </div>
    )
}

export default CountdownTimer