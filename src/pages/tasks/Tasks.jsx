import { createTaskCategory, getTaskCategories, updateTaskCategory, deleteTaskCategory } from "@/services/tasks"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ArrowLeft, ClipboardList, Plus, Loader2 } from "lucide-react"
import { FabAdd, Modal, TasksCategory } from "@/components"
import { PRESET_ICONS } from "../../utils/getCategoryIcon"
import { SUGGESTIONS } from "../../utils/getSuggestions"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { useRef, useState } from "react"
import z from "zod"

const createTaskCategorySchema = z.object({
    title: z.string().min(1, "El título es requerido"),
    description: z.string().min(1, "La descripción es requerida"),
    icon: z.string().optional(),
})

export default function Tasks() {
    const navigate = useNavigate()
    const refModal = useRef(null)
    const [editingCategoryId, setEditingCategoryId] = useState(null)
    const queryClient = useQueryClient()

    const { register, handleSubmit, formState: { errors }, watch, reset, setValue } = useForm({
        resolver: zodResolver(createTaskCategorySchema),
        defaultValues: {
            title: "",
            description: "",
            icon: "clipboardlist"
        }
    })

    const watchIcon = watch("icon", "clipboardlist")

    const { data, isLoading } = useQuery({
        queryKey: ["task-categories"],
        queryFn: getTaskCategories,
    })

    const addTaskCategoryMutation = useMutation({
        mutationFn: createTaskCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["task-categories"] })
            refModal.current?.close()
            reset()
        },
        onError: (error) => {
            console.log(error)
        }
    })

    const updateTaskCategoryMutation = useMutation({
        mutationFn: updateTaskCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["task-categories"] })
            refModal.current?.close()
            reset()
            setEditingCategoryId(null)
        },
        onError: (error) => {
            console.log(error)
        }
    })

    const deleteTaskCategoryMutation = useMutation({
        mutationFn: deleteTaskCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["task-categories"] })
        },
        onError: (error) => {
            console.log(error)
        }
    })

    const handleSubmitCategory = (formData) => {
        if (editingCategoryId) {
            updateTaskCategoryMutation.mutate({
                id: editingCategoryId,
                title: formData.title,
                description: formData.description,
                icon: formData.icon,
            })
        } else {
            addTaskCategoryMutation.mutate(formData)
        }
    }

    const handleOpenCreateModal = () => {
        setEditingCategoryId(null)
        reset({ title: "", description: "", icon: "clipboardlist" })
        refModal.current?.open()
    }

    const handleOpenEditModal = (category) => {
        setEditingCategoryId(category.id)
        setValue("title", category.title)
        setValue("description", category.description)
        setValue("icon", category.icon || "clipboardlist")
        refModal.current?.open()
    }

    const handleDeleteCategory = (id) => {
        if (confirm("¿Estás seguro de que quieres eliminar esta listita?")) {
            deleteTaskCategoryMutation.mutate({ id })
        }
    }

    const modalTitle = editingCategoryId ? "Editar listita" : "Nueva listita"
    const modalSubtitle = editingCategoryId ? "Actualiza los detalles de la listita." : "Añade una nueva listita."
    const isPending = addTaskCategoryMutation.isPending || updateTaskCategoryMutation.isPending

    const isEmpty = !data || data.length === 0

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-6">
            {/* Header / Navigation */}
            <div className="relative flex items-center justify-center py-2 border-b border-base-200/90 dark:border-base-800/40 mb-2">
                <button className="absolute left-0 btn btn-circle btn-primary text-white active:text-white md:hover:text-white active:bg-primary/80 md:hover:bg-primary/80 transition-all duration-200"
                    onClick={() => navigate(-1)}
                    aria-label="Volver"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center justify-center py-4">
                    <Title />
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="w-full bg-base-100 dark:bg-base-900/40 border border-base-200 dark:border-base-800/60 rounded-3xl p-5 animate-pulse">
                            <div className="flex gap-4 items-start pb-4 border-b border-base-200/20">
                                <div className="w-12 h-12 rounded-2xl bg-base-200 dark:bg-base-850 shrink-0" />
                                <div className="flex flex-col flex-1 gap-2">
                                    <div className="h-5 bg-base-200 dark:bg-base-850 rounded-lg w-1/3" />
                                    <div className="h-3 bg-base-200 dark:bg-base-850 rounded-lg w-2/3" />
                                </div>
                            </div>
                            <div className="pt-4 flex flex-col gap-2">
                                <div className="flex justify-between">
                                    <div className="h-3 bg-base-200 dark:bg-base-850 rounded-lg w-1/4" />
                                    <div className="h-3 bg-base-200 dark:bg-base-850 rounded-lg w-1/6" />
                                </div>
                                <div className="h-2 bg-base-200 dark:bg-base-850 rounded-full w-full" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : isEmpty ? (
                <div className="flex flex-col items-center justify-center py-14 px-6 text-center dark:bg-base-900/10 rounded-3xl border border-dashed border-base-300 dark:border-base-800/80 my-4 shadow-3xs">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-5 text-primary">
                        <ClipboardList className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-base-content leading-snug">¿Comenzamos algo juntitos?</h3>
                    <p className="text-xs text-base-content/50 max-w-sm mt-2 leading-relaxed">
                        Aún no hay listas de tareas creadas. Agrega una lista para organizar planes, peliculas o cositas por hacer.
                    </p>
                    <button
                        onClick={handleOpenCreateModal}
                        className="btn btn-primary btn-sm rounded-xl mt-6 gap-1.5 shadow-xs active:scale-[0.98] md:hover:scale-[1.02] transition-all font-semibold"
                    >
                        <Plus className="w-4 h-4" /> Crear primera listita
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-1">
                    {data?.map((category) => (
                        <TasksCategory
                            key={category.id}
                            idCategory={category.id}
                            title={category.title}
                            description={category.description}
                            totalTask={category.totalTask}
                            icon={category.icon}
                            completedTask={category.completedTask}
                            onEdit={() => handleOpenEditModal(category)}
                            onDelete={() => handleDeleteCategory(category.id)}
                        />
                    ))}
                </div>
            )}

            <FabAdd onClick={handleOpenCreateModal} />

            <Modal ref={refModal} modalTitle={modalTitle} modalSubtitle={modalSubtitle}>
                <form onSubmit={handleSubmit(handleSubmitCategory)} className="space-y-6">
                    {/* Suggestions */}
                    <div className="space-y-2.5">
                        <span className="text-xs font-semibold text-base-content/60 flex items-center gap-1.5">
                            {/* <Sparkles className="w-3.5 h-3.5 text-primary fill-primary/10" /> */}
                            💡 Ideas rápidas:
                        </span>
                        <div className="flex flex-wrap gap-2">
                            {SUGGESTIONS.map((sug, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => {
                                        setValue("title", sug.title);
                                        setValue("description", sug.description);
                                    }}
                                    className="btn btn-xs rounded-full bg-base-200/60 dark:bg-base-800/40 active:bg-primary/10 md:hover:bg-primary/10 border-none text-base-content/85 transition-all duration-200 font-medium py-1 px-3"
                                >
                                    <span>{sug.emoji}</span>
                                    <span>{sug.title.split(" ")[0]}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Nombre */}
                        <div className="form-control">
                            <label className="label pb-2">
                                <span className="label-text font-medium text-base-content/85">
                                    Nombre de la listita
                                </span>
                            </label>
                            <input
                                type="text"
                                placeholder="Ej. Películas por ver, Compras..."
                                className={`input input-bordered rounded-2xl w-full focus:outline-none focus:border-primary transition-all duration-200 ${errors.title ? "input-error" : ""
                                    }`}
                                {...register("title")}
                            />
                            {errors.title && (
                                <label className="label pt-1">
                                    <span className="label-text-alt text-error font-medium flex items-center gap-1">
                                        <span>⚠️</span> {errors.title.message}
                                    </span>
                                </label>
                            )}
                        </div>

                        {/* Descripción */}
                        <div className="form-control">
                            <label className="label pb-2">
                                <span className="label-text font-medium text-base-content/85">
                                    Descripción
                                </span>
                            </label>
                            <textarea
                                placeholder="Escribe aquí de qué trata esta lista..."
                                className={`textarea textarea-bordered rounded-2xl w-full h-24 resize-none focus:outline-none focus:border-primary transition-all duration-200 ${errors.description ? "input-error" : ""
                                    }`}
                                {...register("description")}
                            />
                            {errors.description && (
                                <label className="label pt-1">
                                    <span className="label-text-alt text-error font-medium flex items-center gap-1">
                                        <span>⚠️</span> {errors.description.message}
                                    </span>
                                </label>
                            )}
                        </div>

                        {/* Icon Selector */}
                        <div className="form-control">
                            <label className="label pb-1.5">
                                <span className="label-text font-semibold text-base-content/85 text-xs">
                                    Selecciona un ícono
                                </span>
                            </label>
                            <input type="hidden" {...register("icon")} />
                            <div className="grid grid-cols-4 gap-2.5">
                                {PRESET_ICONS.map((preset) => {
                                    const IconComponent = preset.icon;
                                    const isSelected = watchIcon === preset.id;
                                    return (
                                        <button
                                            key={preset.id}
                                            type="button"
                                            onClick={() => setValue("icon", preset.id)}
                                            className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all duration-200 md:hover:scale-102 active:scale-98 ${isSelected
                                                ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-xs ring-1 ring-primary/30"
                                                : "border-base-200 active:border-primary/20 md:hover:border-base-300 dark:border-base-800 dark:md:hover:border-base-750 bg-base-100 dark:bg-base-950/20"
                                                }`}
                                        >
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-3xs ${preset.bg}`}>
                                                <IconComponent className="w-5 h-5" />
                                            </div>
                                            <span className="text-[9px] font-medium text-base-content/70 mt-1.5 text-center truncate w-full">
                                                {preset.label.split(" / ")[0]}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            className="btn btn-primary w-full rounded-2xl mt-2 flex items-center justify-center gap-2"
                            type="submit"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="w-4.5 h-4.5 animate-spin" />
                                    <span>{editingCategoryId ? "Guardando..." : "Creando..."}</span>
                                </>
                            ) : (
                                <>
                                    <span>{editingCategoryId ? "Guardar cambios" : "Crear listita"}</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export function Title() {
    return (
        <h2 className="text-3xl font-extrabold tracking-tight text-center drop-shadow-xs bg-base-100 px-4 py-1.5 rounded-full">
            <span className="text-orange-500">L</span>
            <span className="text-orange-400">i</span>
            <span className="text-amber-400">s</span>
            <span className="text-yellow-400">t</span>
            <span className="text-lime-500">a</span>
            <span className="text-green-500">s</span>
            <span> </span>
            <span className="text-emerald-500">d</span>
            <span className="text-cyan-400">e</span>
            <span> </span>
            <span className="text-sky-500">t</span>
            <span className="text-blue-500">a</span>
            <span className="text-indigo-500">r</span>
            <span className="text-violet-500">e</span>
            <span className="text-fuchsia-500">i</span>
            <span className="text-pink-500">t</span>
            <span className="text-rose-500">a</span>
            <span className="text-red-500">s</span>
        </h2>
    );
}