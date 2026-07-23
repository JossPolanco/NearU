import { MoreVertical, Edit2, Trash2, Loader2 } from "lucide-react"

export default function TaskItem({ task, onToggle, onEdit, onDelete, isToggling, isDeleting }) {
    return (
        <div role="button" tabIndex={0} aria-label={`Tarea: ${task.title}`} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (!isToggling && !isDeleting) onToggle(task.id, task.completed); } }} onClick={() => !isToggling && !isDeleting && onToggle(task.id, task.completed)}
            className={`group flex items-center justify-between gap-4 p-4 rounded-2xl border transition-transform duration-300 cursor-pointer select-none active:scale-98
                ${task.completed
                    ? "bg-base-200/30 border-base-200 text-base-content/40"
                    : "bg-base-100 border-base-200/60 text-base-content active:border-primary/20 active:shadow-xs md:hover:border-primary/20 md:hover:shadow-xs"
                }
                ${isDeleting ? "opacity-50 pointer-events-none scale-95" : ""}
            `}
        >
            <div className="flex items-center gap-3.5 flex-1 min-w-0">
                {/* Custom Checkbox Area */}
                <div className="relative flex items-center justify-center w-6 h-6 shrink-0">
                    {isToggling ? (
                        <span className="loading loading-spinner loading-xs text-primary"></span>
                    ) : (
                        <input
                            type="checkbox"
                            checked={task.completed || false}
                            onChange={() => { }} // Handled by parent div onClick
                            className="checkbox checkbox-primary checkbox-sm rounded-lg border-base-300/80 transition-transform duration-300 pointer-events-none"
                        />
                    )}
                </div>

                {/* Title & Description */}
                <div className="space-y-0.5 min-w-0">
                    <h3 className={`font-semibold text-sm leading-tight transition-transform duration-300 ${task.completed ? 'line-through text-base-content/40' : 'text-base-content'}`}>
                        {task.title}
                    </h3>
                    {task.description && (
                        <p className={`text-xs transition-transform duration-300 ${task.completed ? 'text-base-content/30' : 'text-base-content/50'} line-clamp-2 leading-relaxed`}>
                            {task.description}
                        </p>
                    )}
                </div>
            </div>

            {/* Options Dropdown */}
            <div className="dropdown dropdown-end shrink-0" onClick={(e) => e.stopPropagation()}>
                <button type="button" tabIndex={0} className="btn btn-ghost btn-circle btn-xs text-base-content/30 active:text-primary active:bg-base-200/50 md:hover:text-primary md:hover:bg-base-200/50 transition-colors opacity-80"
                    aria-label="Opciones de tarea">
                    {isDeleting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                        <MoreVertical className="w-3.5 h-3.5" />
                    )}
                </button>
                {!isDeleting && (
                    <ul className="dropdown-content menu p-1.5 shadow-xl bg-base-100/95 dark:bg-base-950/95 border border-base-200 dark:border-base-800 rounded-2xl w-36 z-1 backdrop-blur">
                        <li>
                            <button type="button" onClick={(e) => { e.stopPropagation(); e.currentTarget.blur(); onEdit(); }} className="flex items-center gap-2 text-xs font-medium py-2 rounded-xl text-base-content active:bg-base-200/60 md:hover:bg-base-200/60 transition-colors">
                                <Edit2 className="w-3.5 h-3.5" /> Editar
                            </button>
                        </li>
                        <li>
                            <button type="button" onClick={(e) => { e.stopPropagation(); e.currentTarget.blur(); onDelete(); }}
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
