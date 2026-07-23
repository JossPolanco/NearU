import { MoreVertical, Edit2, Trash2, Loader2, CalendarHeart } from "lucide-react"
import { useNavigate } from "react-router";

const parseDate = (dateString) => {
    if (!dateString) return ""
    const datePart = dateString.split(/[T ]/)[0]
    const date = new Date(datePart + 'T00:00:00')
    return date.toLocaleDateString()
}

export default function DateItem({ date, onEdit, onDelete, isDeleting }) {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate(`/date/${date.id}`)
    }

    return (
        <div onClick={handleNavigate} className="group flex items-center justify-between gap-4 p-5 rounded-3xl border border-base-200/70 dark:border-base-800/50 bg-base-100 dark:bg-base-900/10 transition-transform duration-300 shadow-2xs select-none active:scale-[0.99] md:hover:shadow-xs active:border-primary/20 md:hover:border-primary/20">
            <div className="flex items-center gap-4 flex-1 min-w-0">
                {/* Cover Image/Placeholder on the Left */}
                <div className="w-20 h-20 shrink-0 bg-base-200 dark:bg-base-800 rounded-2xl flex items-center justify-center border border-base-300/40 text-base-content/30 shadow-3xs overflow-hidden">
                    {date.coverUrl ? (
                        <img 
                            src={date.coverUrl} 
                            alt={date.title} 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <CalendarHeart className="w-8 h-8 opacity-45 text-primary/80 animate-pulse" style={{ animationDuration: '3s' }} />
                    )}
                </div>

                {/* Title, Description, Status Badge & Date */}
                <div className="space-y-1 min-w-0 flex-1">
                    <h3 className="font-bold text-sm leading-tight text-base-content">
                        {date.title}
                    </h3>
                    {date.short_description ? (
                        <p className="text-xs text-base-content/50 line-clamp-2 leading-relaxed">
                            {date.short_description}
                        </p>
                    ) : (
                        <p className="text-xs text-base-content/30 italic">
                            Sin descripción
                        </p>
                    )}
                    
                    {/* Status & Date row at the bottom */}
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {date.status && (
                            <span className={`badge badge-xs sm:badge-sm font-bold px-2 py-0.5 rounded-lg text-[10px] uppercase tracking-wider ${
                                date.status.toLowerCase() === 'yap' 
                                    ? 'bg-success/10 text-success border border-success/20' 
                                    : 'bg-error/10 text-error border border-error/20'
                            }`}>
                                {date.status}
                            </span>
                        )}
                        <span className="text-[11px] text-base-content/40 font-semibold">
                            {parseDate(date.realization_date)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Options Dropdown */}
            <div className="dropdown dropdown-end shrink-0" onClick={(e) => e.stopPropagation()}>
                <button 
                    type="button"
                    tabIndex={0} 
                    className="btn btn-ghost btn-circle btn-xs text-base-content/40 active:text-primary active:bg-base-250/20 md:hover:text-primary md:hover:bg-base-250/20 transition-colors opacity-80"
                    aria-label="Opciones de cita"
                >
                    {isDeleting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                        <MoreVertical className="w-3.5 h-3.5" />
                    )}
                </button>
                {!isDeleting && (
                    <ul 
                        className="dropdown-content menu p-1.5 shadow-xl bg-base-100/95 dark:bg-base-950/95 border border-base-200 dark:border-base-800 rounded-2xl w-36 z-1 backdrop-blur"
                    >
                        <li>
                            <button type="button" 
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    e.currentTarget.blur(); 
                                    onEdit(); 
                                }} 
                                className="flex items-center gap-2 text-xs font-medium py-2 rounded-xl text-base-content active:bg-base-200/60 md:hover:bg-base-200/60 transition-colors"
                            >
                                <Edit2 className="w-3.5 h-3.5" /> Editar
                            </button>
                        </li>
                        <li>
                            <button type="button" 
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    e.currentTarget.blur(); 
                                    onDelete(); 
                                }}
                                className="flex items-center gap-2 text-xs font-medium py-2 rounded-xl text-error active:text-error active:bg-error/10 md:hover:text-error md:hover:bg-error/10 transition-colors"
                            >
                                <Trash2 className="w-3.5 h-3.5" /> Eliminar
                            </button>
                        </li>
                    </ul>
                )}
            </div>
        </div>
    )
}
