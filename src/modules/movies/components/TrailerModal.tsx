import { X } from "lucide-react"

interface TrailerModalProps {
    isOpen: boolean
    onClose: () => void
    trailerUrl?: string
    movieTitle: string
}

export function TrailerModal({ isOpen, onClose, trailerUrl, movieTitle }: TrailerModalProps) {
    if (!isOpen) return null
    
    // Chuyển đổi link youtube thông thường sang dạng embed
    const getEmbedUrl = (url?: string) => {
        if (!url) return ''
        
        if (url.includes('youtube.com/watch?v=')) {
            return url.replace('watch?v=', 'embed/')
        }

        if (url.includes('youtu.be/')) {
            return url.replace('youtu.be/', 'youtube.com/embed/')
        }

        return url
    }

    const embedUrl = getEmbedUrl(trailerUrl)

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="relative w-full max-w-4xl bg-cinema-900 border border-cinema-800 rounded-2xl overflow-hidden shadow-2xl">
                {/* Header Modal */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-cinema-800">
                    <h3 className="text-base font-semibold text-white truncate max-w-md">
                        Trailer: {movieTitle}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-cinema-800 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                {/* Video Player */}
                <div className="relative aspect-video w-full bg-black">
                    {embedUrl ? (
                        <iframe
                            src={`${embedUrl}?autoplay=1`}
                            title={movieTitle}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full border-0"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-500 text-sm">
                            Trailer đang được cập nhật...
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default TrailerModal