import { Heart } from 'lucide-react'

const parseDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default function NoteItem({ note, onClick, onToggleFavorite }) {
    return (
        <div role="button" tabIndex={0} aria-label={`Ver nota ${note.title}`} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { onClick?.(); } }} className="flex flex-col bg-base-100 dark:bg-base-900/40 p-3 pb-5 rounded-3xl shadow-xs border border-base-200/60 dark:border-base-800/40 w-full max-w-41.25 transition-transform duration-300 md:hover:scale-[1.02] active:scale-98 relative justify-self-center cursor-pointer"
            onClick={onClick}
        >
            <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-base-200/50 dark:bg-base-950/20 border border-base-200/30 dark:border-base-850/20">
                <img
                    src={note.coverUrl || note.image_metadata?.storage_path}
                    className="w-full h-full object-cover pointer-events-none"
                    alt="Nuestros momentos"
                />
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite?.(note);
                    }}
                    className="absolute top-2 right-2 w-9 h-9 flex items-center justify-center rounded-full bg-base-100/80 dark:bg-base-950/80 hover:bg-base-200 dark:hover:bg-base-900 backdrop-blur-md text-base-content active:scale-90 transition-transform shadow-sm border border-base-300/10 z-10"
                    aria-label={note.favorite ? "Quitar de favoritos" : "Añadir a favoritos"}
                >
                    <Heart className={`w-4 h-4 transition-transform duration-200 ${note.favorite ? "fill-red-500 text-red-500 scale-110" : "text-base-content/75"}`} />
                </button>
            </div>
            <p className="mt-3.5 font-serif italic text-center text-base-content/85 text-xs sm:text-sm truncate w-full px-1">{note.title}</p>
            <span className="text-base-content/50 text-[10px] sm:text-xs mt-1.5 text-center font-mono">{parseDateTime(note.created_at)}</span>
        </div>
    )
}
