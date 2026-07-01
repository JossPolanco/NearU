import { getTasks, getTaskCategory, createTask, deleteTask, completeTask, updateTask } from "../../services/tasks"
import { ArrowLeft, Trash2, Sparkles, Heart, ClipboardList, Plus, Loader2 } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams, useNavigate } from "react-router"
import { Modal, FabAdd, TaskItem } from "@/components"
import { useForm } from "react-hook-form"
import { useRef, useState } from "react"
import z from "zod"

const createTaskSchema = z.object({
    title: z.string().min(1, "El título es requerido"),
    description: z.string().optional(),
})

export default function TaskDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const refModal = useRef(null)
    const [editingTaskId, setEditingTaskId] = useState(null)

    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
        resolver: zodResolver(createTaskSchema)
    })

    const { data: category, isLoading: isLoadingCategory } = useQuery({
        queryKey: ["task-category", id],
        queryFn: () => getTaskCategory(id),
    })

    const { data: tasks, isLoading: isLoadingTasks } = useQuery({
        queryKey: ["tasks", id],
        queryFn: () => getTasks(id),
    })

    const toggleTaskMutation = useMutation({
        mutationFn: ({ taskId, completed }) => completeTask({ id: taskId, completed }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks", id] })
            queryClient.invalidateQueries({ queryKey: ["task-categories"] })
        },
        onError: (error) => {
            console.error("Error toggling task:", error)
        }
    })

    const deleteTaskMutation = useMutation({
        mutationFn: (taskId) => deleteTask({ id: taskId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks", id] })
            queryClient.invalidateQueries({ queryKey: ["task-categories"] })
        },
        onError: (error) => {
            console.error("Error deleting task:", error)
        }
    })

    const createTaskMutation = useMutation({
        mutationFn: (taskData) => createTask({ category_id: id, ...taskData }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks", id] })
            queryClient.invalidateQueries({ queryKey: ["task-categories"] })
            refModal.current?.close()
            reset()
        },
        onError: (error) => {
            console.error("Error creating task:", error)
        }
    })

    const updateTaskMutation = useMutation({
        mutationFn: ({ taskId, taskData }) => updateTask({ id: taskId, category_id: id, ...taskData }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks", id] })
            queryClient.invalidateQueries({ queryKey: ["task-categories"] })
            refModal.current?.close()
            reset()
            setEditingTaskId(null)
        },
        onError: (error) => {
            console.error("Error updating task:", error)
        }
    })

    const handleSubmitTask = (data) => {
        if (editingTaskId) {
            updateTaskMutation.mutate({ taskId: editingTaskId, taskData: data })
        } else {
            createTaskMutation.mutate(data)
        }
    }

    const handleOpenCreateModal = () => {
        setEditingTaskId(null)
        reset({ title: "", description: "" })
        refModal.current?.open()
    }

    const handleOpenEditModal = (task) => {
        setEditingTaskId(task.id)
        setValue("title", task.title)
        setValue("description", task.description || "")
        refModal.current?.open()
    }

    const handleToggle = (taskId, currentStatus) => {
        toggleTaskMutation.mutate({ taskId, completed: !currentStatus })
    }

    const handleDelete = (taskId) => {
        if (confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
            deleteTaskMutation.mutate(taskId)
        }
    }

    const totalTasksCount = tasks ? tasks.length : 0
    const completedTasksCount = tasks ? tasks.filter(t => t.completed).length : 0
    const percentage = totalTasksCount > 0 ? (completedTasksCount / totalTasksCount) * 100 : 0
    const allCompleted = totalTasksCount > 0 && completedTasksCount === totalTasksCount

    const modalTitle = editingTaskId ? "Editar Tarea ✏️" : "Nueva Tarea ✨"
    const modalSubtitle = editingTaskId ? "Actualiza los detalles de la tarea." : "Añade una tarea para hacer juntos en esta lista."
    const isPending = createTaskMutation.isPending || updateTaskMutation.isPending
    const isLoading = isLoadingCategory || isLoadingTasks

    return (
        <div className="max-w-md mx-auto p-4 space-y-6 pb-24 animate-fade-in">
            {/* Header / Navigation */}
            <div className="flex items-center justify-between py-2 border-b border-base-200/90 dark:border-base-800/40 mb-2">
                <button
                    className="btn btn-circle btn-ghost text-base-content/60 hover:text-primary hover:bg-base-200/50 transition-all duration-200"
                    onClick={() => navigate(-1)}
                    aria-label="Volver"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex items-end gap-1.5 text-xs font-semibold text-base-content/60 bg-base-100 px-4 py-1.5 rounded-full border border-base-300/40 shadow-3xs">
                    <Heart className="w-3.5 h-3.5 text-primary fill-primary/15 animate-pulse" />
                    <span>Detalles de la tarea</span>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-3">
                    <span className="loading loading-spinner loading-md text-primary"></span>
                    <p className="text-sm text-base-content/50 font-medium">Cargando detalles...</p>
                </div>
            ) : (
                <>
                    {/* Category Details Header Card */}
                    <div className="bg-gradient-to-br from-base-200/60 via-base-100/30 to-base-100 dark:from-base-900/50 dark:via-base-900/20 dark:to-base-950 p-5 rounded-3xl border border-base-200/60 dark:border-base-800/60 shadow-xs space-y-3">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 dark:bg-primary/15 flex items-center justify-center text-primary shadow-xs">
                                <ClipboardList className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-base-content tracking-tight">
                                    {category?.title || "Detalles de la Categoría"}
                                </h1>
                                <p className="text-xs text-base-content/50 font-medium">
                                    Categoría de tareas
                                </p>
                            </div>
                        </div>
                        {category?.description && (
                            <div className="relative pl-3 border-l-2 border-primary/30 py-0.5">
                                <p className="text-sm text-base-content/70 italic leading-relaxed">
                                    {category.description}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Progress Card */}
                    <div className="bg-base-100 border border-base-200/80 rounded-3xl p-5 shadow-2xs space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-semibold text-base-content/70">Progreso que llevamos</span>
                            <span className="text-xs font-bold text-primary">
                                {completedTasksCount}/{totalTasksCount} completadas
                            </span>
                        </div>
                        <progress
                            className="progress progress-primary w-full h-2.5 rounded-full bg-base-200/50"
                            value={percentage}
                            max="100"
                        />

                        {/* Personalized Warm Vibe Message */}
                        <div className="text-xs text-center pt-1 font-medium">
                            {totalTasksCount === 0 ? (
                                <span className="text-base-content/50 flex items-center justify-center gap-1">
                                    🌸 No hay tareas creadas todavía en esta lista.
                                </span>
                            ) : allCompleted ? (
                                <span className="text-success flex items-center justify-center gap-1 animate-bounce">
                                    <Sparkles className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400" />
                                    ¡Completamos todas las tareas! ¡Buen trabajo mi amooor! 💕✨
                                </span>
                            ) : (
                                <span className="text-base-content/60 flex items-center justify-center gap-1">
                                    <Heart className="w-3 h-3 text-rose-400 fill-rose-300" />
                                    Llevamos el {Math.round(percentage)}% completado 🧑‍❤️‍👩
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Tasks List */}
                    <div className="space-y-3">
                        {tasks && tasks.length > 0 ? (
                            tasks.map((task) => (
                                <TaskItem
                                    key={task.id}
                                    task={task}
                                    onToggle={handleToggle}
                                    onEdit={() => handleOpenEditModal(task)}
                                    onDelete={() => handleDelete(task.id)}
                                    isToggling={toggleTaskMutation.isPending && toggleTaskMutation.variables?.taskId === task.id}
                                    isDeleting={deleteTaskMutation.isPending && deleteTaskMutation.variables === task.id}
                                />
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center p-8 border border-dashed border-base-300 rounded-3xl text-center space-y-2">
                                <span className="text-2xl">🌱</span>
                                <p className="text-sm font-semibold text-base-content/60">No hay tareas creadas</p>
                                <p className="text-xs text-base-content/40 max-w-xs">Agrega una tarea utilizando el botón de abajo para empezar a trabajar juntos.</p>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Floating Action Button (FabAdd) to Add Task */}
            {!isLoading && (
                <FabAdd onClick={handleOpenCreateModal} />
            )}

            {/* Modal for Creating/Editing Task */}
            <Modal ref={refModal} modalTitle={modalTitle} modalSubtitle={modalSubtitle}>
                <form onSubmit={handleSubmit(handleSubmitTask)} className="space-y-4">
                    <div className="space-y-3">
                        {/* Title Field */}
                        <div className="form-control">
                            <label className="label pb-1.5">
                                <span className="label-text font-semibold text-xs text-base-content/70">
                                    ¿Qué hay que hacer?
                                </span>
                            </label>
                            <input
                                type="text"
                                placeholder="Ej: Esconder el cadaver de quien te hable 🥰💕"
                                className={`input input-bordered input-md w-full rounded-2xl text-sm ${errors.title ? "input-error" : ""}`}
                                {...register("title")}
                            />
                            {errors.title && (
                                <label className="label pt-1 pb-0">
                                    <span className="label-text-alt text-error text-xs">
                                        {errors.title.message}
                                    </span>
                                </label>
                            )}
                        </div>

                        {/* Description Field */}
                        <div className="form-control">
                            <label className="label pb-1.5">
                                <span className="label-text font-semibold text-xs text-base-content/70">
                                    Detalles o notas (opcional)
                                </span>
                            </label>
                            <textarea
                                placeholder="Ej: Ir a buscarlo, sacarle los ojos, taparle la nariz, cuando lo metamos al hoyo, no lo dejemos respirar..."
                                className={`textarea textarea-bordered textarea-md w-full rounded-2xl text-sm h-24 ${errors.description ? "textarea-error" : ""}`}
                                {...register("description")}
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                className="btn btn-primary w-full rounded-2xl flex items-center justify-center gap-2"
                                type="submit"
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <>
                                        <span className="loading loading-spinner loading-xs"></span>
                                        <span>Guardando...</span>
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4" />
                                        <span>{editingTaskId ? "Guardar cambios" : "Añadir para los dos"}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
