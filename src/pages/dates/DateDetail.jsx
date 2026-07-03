import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Sparkles, Heart, ClipboardList, CalendarHeart } from "lucide-react"
import { useParams, useNavigate } from 'react-router'
import { useRef, useState } from 'react'
import { getDateById, getDateTasks } from "@/services/dates"

export default function DateDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const refModal = useRef(null)
    const [editingDateId, setEditingDateId] = useState(null)

    const { data: date, isLoading: isLoadingDate } = useQuery({
        queryKey: ["date", id],
        queryFn: () => getDateById(id),
    })

    const { data: tasks, isLoading: isLoadingTasks } = useQuery({
        queryKey: ["DateTasks", id],
        queryFn: () => getDateTasks(id),
    })

    return (
        <div className="max-w-md mx-auto p-4 space-y-6 pb-24 animate-fade-in">
            {/* Header / Navigation */}
            <div className="flex items-center justify-between py-2 border-b border-base-200/90 dark:border-base-800/40 mb-2">
                <button
                    className="btn btn-circle btn-primary text-white active:text-white md:hover:text-white active:bg-primary/80 md:hover:bg-primary/80 transition-all duration-200"
                    onClick={() => navigate(-1)}
                    aria-label="Volver"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex items-end gap-1.5 text-xs font-semibold text-base-content/60 bg-base-100 px-4 py-1.5 rounded-full border border-base-300/40 shadow-3xs">
                    <Heart className="w-3.5 h-3.5 text-primary fill-primary/15 animate-pulse" />
                    <span>Detalles de la cita</span>
                </div>
            </div>

            {isLoadingDate ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-3">
                    <span className="loading loading-spinner loading-md text-primary"></span>
                    <p className="text-sm text-base-content/50 font-medium">Cargando detalles...</p>
                </div>
            ) : (
                <>
                    {/* Category Details Header Card */}
                    <div className="bg-gradient-to-br from-base-200/60 via-base-100/30 to-base-100 dark:from-base-900/50 dark:via-base-900/20 dark:to-base-950 p-5 rounded-3xl border border-base-200/60 dark:border-base-800/60 shadow-xs space-y-3">
                        <div className="flex items-center gap-4">
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
                            <div>
                                <h1 className="text-xl font-bold text-base-content tracking-tight">
                                    {date?.title || "Detalles de la Cita"}
                                </h1>
                                <p className="text-xs text-base-content/50 font-medium">
                                    Detalles de la cita
                                </p>
                            </div>
                        </div>

                        {date.short_description && (
                            <div className="relative pl-3 border-l-2 border-primary/30 py-0.5">
                                <p className="text-sm text-base-content/70 italic leading-relaxed">
                                    {date.short_description}
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="bg-base-100 border border-base-200/80 rounded-3xl p-5 shadow-2xs space-y-3">
                        {date.description && (
                            <div className="relative py-0.5">
                                <p className="text-sm text-base-content/70 italic leading-relaxed">
                                    {date.description}
                                </p>
                            </div>
                        )}
                    </div>
                    <div>
                        {tasks?.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-16 space-y-3">
                                <p className="text-sm text-base-content/50 font-medium">No hay tareas</p>
                            </div>
                        )}

                        {tasks?.map((task) => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                onToggle={handleToggle}
                                onDelete={handleDelete}
                                onEdit={handleOpenEditModal}
                                isPending={toggleTaskMutation.isPending}
                            />
                        ))}
                        <button>Añadir tarea</button>
                    </div>
                </>
            )}

        </div>
    )
}
