import { getDateById, getDateTasks, createDateTask, updateDateTask, completeDateTask, deleteDateTask, updateDateDescription } from "@/services/dates";
import { ArrowLeft, Sparkles, ClipboardList, CalendarHeart, Plus, Calendar, Edit2, RotateCw } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useResolveSignedUrls } from "@/hooks/images/useResolveSignedUrls";
import { TaskItem, Modal, GalleryPanel, UploadPanel } from "@/components";
import { touchHover, tapFeedback, mobileSpring } from "@/utils/motion";
import { addImageToDate } from "@/services/images/imageMetadata";
import { useParams, useNavigate } from 'react-router';
import { imageKeys } from "@/hooks/images/useImages";
import { useRef, useState } from 'react';
import { motion } from 'motion/react';

const parseDate = (dateString) => {
    if (!dateString) return ""
    const datePart = dateString.split(/[T ]/)[0]
    const date = new Date(datePart + 'T00:00:00')
    return date.toLocaleDateString()
}

const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.04,
            delayChildren: 0.02,
        },
    },
};

const headerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: mobileSpring,
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 12, scale: 0.98 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: mobileSpring,
    },
};

const taskListVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.035,
            delayChildren: 0.015,
        },
    },
};

const taskItemVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.98 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: mobileSpring,
    },
};

export default function DateDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const refModal = useRef(null)
    const refDescriptionModal = useRef(null)

    const [taskTitle, setTaskTitle] = useState("")
    const [editingTaskId, setEditingTaskId] = useState(null)
    const [descriptionText, setDescriptionText] = useState("")

    // Fetch Date details and resolve cover image URL
    const { data: date, isLoading: isLoadingDate } = useResolveSignedUrls(
        ["date", id],
        async () => {
            const res = await getDateById(id)
            return [res]
        },
        {
            select: (data) => data?.[0]
        }
    )

    // Fetch Date Tasks
    const { data: tasks, isLoading: isLoadingTasks } = useQuery({
        queryKey: ["DateTasks", id],
        queryFn: () => getDateTasks(id),
    })

    // Mutations for Date Tasks
    const toggleTaskMutation = useMutation({
        mutationFn: ({ taskId, completed }) => completeDateTask({ id: taskId, completed }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["DateTasks", id] })
        },
        onError: (err) => console.error("Error toggling task:", err)
    })

    const deleteTaskMutation = useMutation({
        mutationFn: ({ taskId }) => deleteDateTask({ id: taskId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["DateTasks", id] })
        },
        onError: (err) => console.error("Error deleting task:", err)
    })

    const createTaskMutation = useMutation({
        mutationFn: ({ title }) => createDateTask({ dateId: id, title }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["DateTasks", id] })
            refModal.current?.close()
            setTaskTitle("")
        },
        onError: (err) => console.error("Error creating task:", err)
    })

    const updateTaskMutation = useMutation({
        mutationFn: ({ taskId, title }) => updateDateTask({ id: taskId, title }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["DateTasks", id] })
            refModal.current?.close()
            setTaskTitle("")
            setEditingTaskId(null)
        },
        onError: (err) => console.error("Error updating task:", err)
    })

    const updateDescriptionMutation = useMutation({
        mutationFn: ({ description }) => updateDateDescription({ id, description }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["date", id] })
            refDescriptionModal.current?.close()
        },
        onError: (err) => console.error("Error updating description:", err)
    })

    const linkImageMutation = useMutation({
        mutationFn: ({ imageId }) => addImageToDate(id, imageId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: imageKeys.list("photos", "dates", id) })
        },
        onError: (err) => console.error("Error al vincular imagen a la cita:", err)
    })

    // Interactive Handlers
    const handleToggle = (taskId, currentCompleted) => {
        toggleTaskMutation.mutate({ taskId, completed: !currentCompleted })
    }

    const handleDelete = (taskId) => {
        if (confirm("¿Estás seguro de que quieres borrar este plan? 😢")) {
            deleteTaskMutation.mutate({ taskId })
        }
    }

    const handleOpenCreateModal = () => {
        setEditingTaskId(null)
        setTaskTitle("")
        refModal.current?.open()
    }

    const handleOpenEditModal = (task) => {
        setEditingTaskId(task.id)
        setTaskTitle(task.title)
        refModal.current?.open()
    }

    const handleSubmitTask = (e) => {
        e.preventDefault()
        if (!taskTitle.trim()) return

        if (editingTaskId) {
            updateTaskMutation.mutate({ taskId: editingTaskId, title: taskTitle.trim() })
        } else {
            createTaskMutation.mutate({ title: taskTitle.trim() })
        }
    }

    const handleOpenDescriptionModal = () => {
        setDescriptionText(date?.description || "")
        refDescriptionModal.current?.open()
    }

    const handleSubmitDescription = (e) => {
        e.preventDefault()
        updateDescriptionMutation.mutate({ description: descriptionText.trim() })
    }

    const handleRefresh = () => {
        queryClient.invalidateQueries({ queryKey: ["date", id] })
        queryClient.invalidateQueries({ queryKey: ["DateTasks", id] })
    }

    return (
        <motion.div
            className="max-w-md mx-auto p-4 space-y-6 pb-24"
            initial="hidden"
            animate="visible"
            variants={pageVariants}
        >
            {/* Header / Navigation */}
            <motion.div
                variants={headerVariants}
                className="relative flex items-center justify-center border-b border-base-200/90 dark:border-base-800/40 mb-2"
            >
                <motion.button
                    whileHover={touchHover({ scale: 1.05 })}
                    whileTap={tapFeedback.button}
                    type="button"
                    className="absolute left-0 btn btn-circle btn-primary text-white cursor-pointer transition-shadow shadow-xs hover:shadow-md"
                    onClick={() => navigate(-1)}
                    aria-label="Volver"
                >
                    <ArrowLeft className="w-5 h-5" />
                </motion.button>

                <div className="flex items-center justify-center py-4">
                    <Title />
                </div>

                <motion.button
                    whileHover={touchHover({ rotate: 180, scale: 1.05 })}
                    whileTap={tapFeedback.icon}
                    transition={{ duration: 0.35 }}
                    type="button"
                    className="absolute right-0 btn btn-sm btn-circle btn-primary text-white cursor-pointer transition-shadow shadow-xs hover:shadow-md"
                    onClick={() => handleRefresh()}
                    aria-label="Refrescar"
                >
                    <RotateCw className="w-5 h-5" />
                </motion.button>
            </motion.div>

            {isLoadingDate ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-3">
                    <span className="loading loading-spinner loading-md text-primary"></span>
                    <p className="text-sm text-base-content/50 font-medium">Cargando detalles...</p>
                </div>
            ) : (
                <>
                    {/* Cover image & main title details */}
                    <motion.div
                        variants={cardVariants}
                        className="relative overflow-hidden bg-base-100 dark:bg-base-900/40 rounded-3xl border border-base-200/80 dark:border-base-800/60 shadow-xs flex flex-col"
                    >
                        <div className="relative w-full overflow-hidden bg-base-200 dark:bg-base-800 flex items-center justify-center border-b border-base-200/50 dark:border-base-800/30">
                            {date?.coverUrl ? (
                                <motion.img
                                    src={date.coverUrl}
                                    alt={date.title}
                                    whileHover={touchHover({ scale: 1.03 })}
                                    transition={{ duration: 0.4 }}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-linear-to-tr from-rose-100/40 to-orange-100/30 dark:from-rose-950/10 dark:to-amber-950/10 flex flex-col items-center justify-center p-6 text-center">
                                    <CalendarHeart className="w-12 h-12 text-primary/80 opacity-60 animate-pulse" style={{ animationDuration: '3s' }} />
                                    <span className="text-xs text-base-content/40 font-medium mt-2">Un momento para recordar</span>
                                </div>
                            )}
                        </div>

                        <div className="p-5 space-y-3">
                            <h1 className="text-2xl font-extrabold text-base-content tracking-tight leading-tight">
                                {date?.title || "Cita Especial"}
                            </h1>

                            {date?.realization_date && (
                                <div className="flex items-center gap-2 text-xs font-semibold text-base-content/50">
                                    <Calendar className="w-3.5 h-3.5 text-primary/75" />
                                    <span className="capitalize">
                                        {parseDate(date.realization_date)}
                                    </span>
                                </div>
                            )}

                            {date?.short_description && (
                                <p className="text-sm text-base-content/70 font-medium leading-relaxed border-l-2 border-primary/20 pl-3 italic">
                                    {date.short_description}
                                </p>
                            )}
                        </div>
                    </motion.div>

                    {/* Memories card (Description) */}
                    {date?.description ? (
                        <motion.div
                            variants={cardVariants}
                            className="bg-base-100 dark:bg-base-900/30 border border-base-200/60 dark:border-base-850/50 rounded-3xl p-5 shadow-3xs space-y-3"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-primary/80 tracking-wide uppercase">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>Nuestros Recuerdos</span>
                                </div>
                                <motion.button
                                    whileHover={touchHover({ scale: 1.1 })}
                                    whileTap={tapFeedback.icon}
                                    type="button"
                                    onClick={handleOpenDescriptionModal}
                                    className="btn btn-ghost btn-circle btn-xs text-base-content/40 active:text-primary active:bg-base-200/50 md:hover:text-primary md:hover:bg-base-200/50 transition-colors cursor-pointer"
                                    aria-label="Editar recuerdos"
                                >
                                    <Edit2 className="w-3.5 h-3.5" />
                                </motion.button>
                            </div>
                            <p className="text-sm text-base-content/75 leading-relaxed font-medium whitespace-pre-wrap">
                                {date.description}
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            variants={cardVariants}
                            className="bg-base-100 dark:bg-base-900/30 border border-base-200/60 dark:border-base-850/50 rounded-3xl p-5 shadow-3xs space-y-3"
                        >
                            <div className="flex items-center gap-1.5 text-xs font-bold text-base-content/40 tracking-wide uppercase">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Nuestros Recuerdos</span>
                            </div>
                            <div className="flex flex-col items-center justify-center py-4 text-center">
                                <p className="text-sm text-base-content/40 font-medium">
                                    Aún no hay recuerdos escritos para esta cita.
                                </p>
                                <motion.button
                                    whileHover={touchHover({ scale: 1.03 })}
                                    whileTap={tapFeedback.button}
                                    type="button"
                                    onClick={handleOpenDescriptionModal}
                                    className="btn btn-outline border-primary/20 hover:border-primary/45 active:border-primary/45 text-primary btn-sm rounded-xl mt-3 gap-1.5 font-bold shadow-3xs text-xs cursor-pointer"
                                >
                                    <Plus className="w-3.5 h-3.5" /> Escribir recuerdos
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {/* Tasks/Plans Checklist */}
                    <motion.div variants={cardVariants} className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ClipboardList className="w-5 h-5 text-primary" />
                                <h2 className="text-lg font-bold text-base-content">Planes juntos</h2>
                            </div>
                            <motion.button
                                whileHover={touchHover({ scale: 1.1 })}
                                whileTap={tapFeedback.icon}
                                type="button"
                                className="btn btn-ghost btn-circle btn-sm text-primary active:bg-primary/10 md:hover:bg-primary/10 transition-colors cursor-pointer"
                                onClick={handleOpenCreateModal}
                                aria-label="Añadir plan"
                            >
                                <Plus className="w-5 h-5" />
                            </motion.button>
                        </div>

                        {isLoadingTasks ? (
                            <div className="flex flex-col gap-3">
                                {[1, 2].map((i) => (
                                    <div key={i} className="h-16 w-full rounded-2xl bg-base-250/20 dark:bg-base-900/20 animate-pulse border border-base-200/40" />
                                ))}
                            </div>
                        ) : tasks?.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-10 px-4 text-center bg-base-100 dark:bg-base-900/10 rounded-3xl border border-dashed border-base-300 dark:border-base-800/80 shadow-3xs"
                            >
                                <span className="text-3xl mb-3">💕</span>
                                <p className="text-sm font-semibold text-base-content/60">¿Qué haremos?</p>
                                <p className="text-xs text-base-content/40 mt-1 max-w-60">Añade actividades o cositas pendientes para hacer juntos durante esta cita.</p>
                                <motion.button
                                    whileHover={touchHover({ scale: 1.03 })}
                                    whileTap={tapFeedback.button}
                                    type="button"
                                    onClick={handleOpenCreateModal}
                                    className="btn btn-primary btn-sm rounded-xl mt-4 gap-1.5 font-bold shadow-xs text-xs cursor-pointer"
                                >
                                    <Plus className="w-3.5 h-3.5" /> Agregar primer plan
                                </motion.button>
                            </motion.div>
                        ) : (
                            <motion.div
                                className="flex flex-col gap-3"
                                variants={taskListVariants}
                            >
                                {tasks?.map((task) => (
                                    <TaskItem
                                        key={task.id}
                                        task={task}
                                        variants={taskItemVariants}
                                        onToggle={handleToggle}
                                        onDelete={() => handleDelete(task.id)}
                                        onEdit={() => handleOpenEditModal(task)}
                                        isToggling={toggleTaskMutation.isPending && toggleTaskMutation.variables?.taskId === task.id}
                                        isDeleting={deleteTaskMutation.isPending && deleteTaskMutation.variables?.taskId === task.id}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Galería y Subida de fotos */}
                    <motion.div variants={cardVariants} className="space-y-4 pt-4 border-t border-base-200/90 dark:border-base-800/40">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                            <h2 className="text-lg font-bold text-base-content">Fotitos de la cita</h2>
                        </div>
                        <GalleryPanel
                            bucket="photos"
                            gallery="dates"
                            dateId={id}
                            enableDelete={true}
                        />
                        <UploadPanel
                            bucket="photos"
                            gallery="dates"
                            mode="multi"
                            invalidateQueries={[imageKeys.list("photos", "dates", id)]}
                            onSuccess={(image) => {
                                linkImageMutation.mutate({ imageId: image.id });
                            }}
                        />
                    </motion.div>
                </>
            )}

            {/* MODAL FOR ADDING/EDITING TASKS */}
            <Modal ref={refModal} modalTitle={editingTaskId ? "Editar plan" : "Nuevo plan"} modalSubtitle={editingTaskId ? "Modifica los detalles de esta actividad." : "Añade un nuevo plan para nuestra cita."} className="max-w-md">
                <form onSubmit={handleSubmitTask} className="space-y-4 mt-2">
                    <div className="form-control">
                        <label className="label pb-1.5">
                            <span className="label-text font-semibold text-xs text-base-content/75">
                                ¿Qué plan tienes en mente?
                            </span>
                        </label>
                        <input
                            className="input input-bordered rounded-2xl w-full focus:outline-none focus:border-primary transition-transform duration-200 text-sm"
                            type="text"
                            placeholder="Ej. Comprar helados de fresa"
                            value={taskTitle}
                            onChange={(e) => setTaskTitle(e.target.value)}
                            maxLength={100}
                            required
                            autoFocus
                        />
                    </div>

                    <button
                        className="btn btn-primary w-full rounded-2xl mt-4 flex items-center justify-center gap-2 font-bold shadow-xs text-white"
                        type="submit"
                        disabled={createTaskMutation.isPending || updateTaskMutation.isPending}
                    >
                        {(createTaskMutation.isPending || updateTaskMutation.isPending) ? (
                            <>
                                <span className="loading loading-spinner loading-xs text-white"></span>
                                <span>Guardando...</span>
                            </>
                        ) : (
                            <span>{editingTaskId ? "Guardar cambios" : "Añadir a la cita"}</span>
                        )}
                    </button>
                </form>
            </Modal>

            {/* MODAL FOR ADDING/EDITING DATE DESCRIPTION */}
            <Modal className="max-w-md" ref={refDescriptionModal} modalTitle={date?.description ? "Editar recuerdos" : "Escribir recuerdos"} modalSubtitle="Comparte lo más bonito de este día especial para recordarlo por siempre.">
                <form onSubmit={handleSubmitDescription} className="space-y-4 mt-2">
                    <div className="form-control">
                        <label className="label pb-1.5">
                            <span className="label-text font-semibold text-xs text-base-content/75">
                                ¿Cómo fue este momento?
                            </span>
                        </label>
                        <textarea className="textarea textarea-bordered rounded-2xl w-full h-32 resize-none focus:outline-none focus:border-primary transition-transform duration-200 text-sm leading-relaxed"
                            placeholder="Escribe aquí los mejores recuerdos, anécdotas o sentimientos de este día..."
                            value={descriptionText}
                            onChange={(e) => setDescriptionText(e.target.value)}
                            required
                            autoFocus />
                    </div>

                    <button className="btn btn-primary w-full rounded-2xl mt-2 flex items-center justify-center gap-2 font-bold shadow-xs text-white"
                        type="submit"
                        disabled={updateDescriptionMutation.isPending}>
                        {updateDescriptionMutation.isPending ? (
                            <>
                                <span className="loading loading-spinner loading-xs text-white"></span>
                                <span>Guardando recuerdos...</span>
                            </>
                        ) : (
                            <span>{date?.description ? "Guardar cambios" : "Publicar recuerdos"}</span>
                        )}
                    </button>
                </form>
            </Modal>
        </motion.div>
    )
}

export function Title() {
    return (
        <h2 className="text-3xl font-extrabold tracking-tight text-center drop-shadow-xs bg-base-100 px-4 py-1.5 rounded-full">
            <span className="text-orange-500">D</span>
            <span className="text-orange-400">e</span>
            <span className="text-amber-400">t</span>
            <span className="text-yellow-400">a</span>
            <span className="text-lime-500">l</span>
            <span className="text-green-500">l</span>
            <span className="text-emerald-500">e</span>
            <span className="text-cyan-400">s</span>
            <span> </span>
            <span className="text-sky-500">d</span>
            <span className="text-blue-500">e</span>
            <span> </span>
            <span className="text-indigo-500">l</span>
            <span className="text-violet-500">a</span>
            <span> </span>
            <span className="text-fuchsia-500">C</span>
            <span className="text-pink-500">i</span>
            <span className="text-rose-500">t</span>
            <span className="text-red-500">a</span>
        </h2>
    );
}