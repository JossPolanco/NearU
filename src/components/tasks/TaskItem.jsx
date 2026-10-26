import { MoreVertical, Edit2, Trash2, Loader2, Check } from "lucide-react"
import { touchHover, tapFeedback, mobileSpring } from "../../utils/motion"
import { motion } from "motion/react"

export default function TaskItem({ task, onToggle, onEdit, onDelete, isToggling, isDeleting, variants }) {
    return (
        <motion.div
            variants={variants}
            whileHover={touchHover({ y: -1, scale: 1.005 })}
            whileTap={tapFeedback.card}
            transition={mobileSpring}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (!isToggling && !isDeleting) onToggle(task.id, task.completed); } }}
            onClick={() => !isToggling && !isDeleting && onToggle(task.id, task.completed)}
            className={`group flex items-center justify-between gap-4 p-4 rounded-2xl border transition-colors duration-200 cursor-pointer select-none
                ${task.completed
                    ? "bg-base-200/30 border-base-200 text-base-content/40"
                    : "bg-base-100 border-base-200/60 text-base-content shadow-2xs hover:shadow-md hover:border-primary/20"
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
                        <motion.div
                            whileTap={tapFeedback.icon}
                            className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors duration-200 ${
                                task.completed
                                    ? "bg-primary border-primary text-white"
                                    : "border-base-300 group-hover:border-primary/60 bg-base-100"
                            }`}
                        >
                            {task.completed && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                                >
                                    <Check className="w-3.5 h-3.5 stroke-3" />
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </div>

                {/* Title & Description */}
                <div className="space-y-0.5 min-w-0">
                    <h3 className={`font-semibold text-sm leading-tight transition-all duration-200 ${task.completed ? 'line-through text-base-content/40' : 'text-base-content group-hover:text-primary'}`}>
                        {task.title}
                    </h3>
                    {task.description && (
                        <p className={`text-xs transition-colors duration-200 ${task.completed ? 'text-base-content/30' : 'text-base-content/50'} line-clamp-2 leading-relaxed`}>
                            {task.description}
                        </p>
                    )}
                </div>
            </div>

            {/* Options Dropdown */}
            <div className="dropdown dropdown-end shrink-0" onClick={(e) => e.stopPropagation()}>
                <motion.button
                    whileHover={touchHover({ scale: 1.1 })}
                    whileTap={tapFeedback.icon}
                    type="button"
                    tabIndex={0}
                    className="btn btn-ghost btn-circle btn-xs text-base-content/40 active:text-primary active:bg-base-200/50 md:hover:text-primary md:hover:bg-base-200/50 transition-colors opacity-80 cursor-pointer"
                    aria-label="Opciones de tarea"
                >
                    {isDeleting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                        <MoreVertical className="w-3.5 h-3.5" />
                    )}
                </motion.button>
                {!isDeleting && (
                    <ul className="dropdown-content menu p-1.5 shadow-xl bg-base-100/95 dark:bg-base-950/95 border border-base-200 dark:border-base-800 rounded-2xl w-36 z-1 backdrop-blur">
                        <li>
                            <button type="button" onClick={(e) => { e.stopPropagation(); e.currentTarget.blur(); onEdit(); }} className="flex items-center gap-2 text-xs font-medium py-2 rounded-xl text-base-content active:bg-base-200/60 md:hover:bg-base-200/60 transition-colors cursor-pointer">
                                <Edit2 className="w-3.5 h-3.5" /> Editar
                            </button>
                        </li>
                        <li>
                            <button type="button" onClick={(e) => { e.stopPropagation(); e.currentTarget.blur(); onDelete(); }}
                                className="flex items-center gap-2 text-xs font-medium py-2 rounded-xl text-error active:text-error active:bg-error/10 md:hover:text-error md:hover:bg-error/10 transition-colors cursor-pointer"
                            >
                                <Trash2 className="w-3.5 h-3.5" /> Eliminar
                            </button>
                        </li>
                    </ul>
                )}
            </div>
        </motion.div>
    )
}

