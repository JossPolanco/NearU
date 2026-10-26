import { Heart, Sparkles, MoreVertical, Edit2, Trash2 } from "lucide-react"
import { touchHover, tapFeedback, mobileSpring } from "../../utils/motion"
import { getCategoryIcon } from "../../utils/getCategoryIcon"
import { useNavigate } from "react-router"
import { motion } from "motion/react"

export default function TasksCategory({ idCategory, title, description, icon, totalTask = 0, completedTask = 0, onEdit, onDelete, variants }) {
    const navigate = useNavigate()
    const percentage = totalTask > 0 ? (completedTask / totalTask) * 100 : 0;
    const isCompleted = totalTask > 0 && completedTask === totalTask;

    const handleNavigate = () => {
        navigate(`/task/${idCategory}`)
    }

    const { icon: IconComponent, bg: iconBgClass } = getCategoryIcon(icon);
    const isImageUrl = typeof icon === 'string' && (icon.startsWith('http') || icon.startsWith('/') || icon.startsWith('.') || icon.startsWith('data:'));

    return (
        <motion.div
            variants={variants}
            whileHover={touchHover({ y: -2, scale: 1.005 })}
            whileTap={tapFeedback.card}
            transition={mobileSpring}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleNavigate(); } }}
            className="w-full bg-base-100 dark:bg-base-900/40 border border-base-200 dark:border-base-800/60 rounded-3xl p-5 mb-4 shadow-2xs hover:shadow-md active:border-primary/20 dark:active:border-primary/30 md:hover:border-primary/20 dark:md:hover:border-primary/30 transition-shadow duration-200 cursor-pointer group select-none"
            onClick={handleNavigate}
        >
            <div className="flex gap-4 items-start pb-4 border-b border-base-100 dark:border-base-850/30">
                {isImageUrl ? (
                    <motion.img
                        whileHover={touchHover({ scale: 1.06 })}
                        src={icon}
                        alt={title || "Category Icon"}
                        className="w-12 h-12 rounded-2xl bg-base-200 p-1 object-cover shrink-0"
                    />
                ) : (
                    <motion.div
                        whileHover={touchHover({ rotate: [-4, 4, -2, 2, 0], scale: 1.06 })}
                        transition={{ duration: 0.4 }}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-3xs ${iconBgClass}`}
                    >
                        <IconComponent className="w-6 h-6 animate-pulse" style={{ animationDuration: '3s' }} />
                    </motion.div>
                )}

                <div className="flex flex-col min-w-0 flex-1">
                    <h2 className="text-lg font-bold text-base-content group-hover:text-primary transition-colors duration-200 leading-snug">
                        {title || "Categoría sin título"}
                    </h2>
                    {description && (
                        <p className="text-xs text-base-content/50 mt-1 leading-relaxed line-clamp-2">
                            {description}
                        </p>
                    )}
                </div>

                {/* Opciones de categoría */}
                <div className="dropdown dropdown-end shrink-0 left-4" onClick={(e) => e.stopPropagation()}>
                    <motion.button
                        whileHover={touchHover({ scale: 1.1 })}
                        whileTap={tapFeedback.icon}
                        type="button"
                        tabIndex={0}
                        className="btn btn-ghost btn-circle btn-sm text-base-content/60 active:text-primary active:bg-base-200/50 md:hover:text-primary md:hover:bg-base-200/50 transition-colors cursor-pointer"
                        aria-label="Opciones de categoría"
                    >
                        <MoreVertical className="w-4.5 h-4.5" />
                    </motion.button>
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
                                className="flex items-center gap-2 text-xs font-medium py-2 rounded-xl text-base-content active:bg-base-200/60 md:hover:bg-base-200/60 transition-colors cursor-pointer"
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
                                className="flex items-center gap-2 text-xs font-medium py-2 rounded-xl text-error active:text-error active:bg-error/10 md:hover:text-error md:hover:bg-error/10 transition-colors cursor-pointer"
                            >
                                <Trash2 className="w-3.5 h-3.5" /> Eliminar
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="pt-4">
                {totalTask > 0 ? (
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs font-medium">
                            {isCompleted ? (
                                <span className="text-success flex items-center gap-1 animate-pulse">
                                    <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                                    ¡Todo listo! 💕
                                </span>
                            ) : (
                                <span className="text-base-content/50 flex items-center gap-1">
                                    <Heart className="w-3 h-3 text-rose-400 fill-rose-300" />
                                    Progreso
                                </span>
                            )}
                            <span className={`font-semibold ${isCompleted ? 'text-success' : 'text-primary'}`}>
                                {completedTask}/{totalTask} {totalTask === 1 ? 'tarea' : 'tareas'} ({Math.round(percentage)}%)
                            </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-base-200/70 overflow-hidden">
                            <motion.div
                                className={`h-full rounded-full ${isCompleted ? "bg-success" : "bg-primary"}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-1.5 text-xs text-base-content/40">
                        <span>🌱</span>
                        <span className="italic">Aún no hay tareas creadas</span>
                    </div>
                )}
            </div>
        </motion.div>
    )
}

