import { createDate, updateDate, deleteDate, getDatesByStatus } from "@/services/dates";
import { ArrowLeft, Plus, Loader2, CalendarHeart, Calendar } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FabAdd, Modal, DateItem, UploadPanel } from "@/components";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResolveSignedUrls } from "@/hooks";
import { DayPicker } from "react-day-picker";
import { useNavigate } from "react-router";
import "react-day-picker/dist/style.css";
import { useRef, useState } from "react";
import { es } from "date-fns/locale";
import z from "zod";

const createDateSchema = z.object({
    title: z.string().min(1, "El título es requerido"),
    shortDescription: z.string().min(1, "La descripción es requerida"),
    realizationDate: z.any().refine(val => val !== undefined && val !== null && val !== "", "La fecha es requerida"),
    coverId: z.string().optional(),
    status: z.string().optional(),
})

const parseDateStringToLocalDate = (dateVal) => {
    if (!dateVal) return undefined
    if (dateVal instanceof Date) {
        return isNaN(dateVal.getTime()) ? undefined : dateVal
    }
    const str = String(dateVal)
    const datePart = str.split(/[T ]/)[0]
    const parsed = new Date(datePart + 'T00:00:00')
    return isNaN(parsed.getTime()) ? undefined : parsed
}

export default function Dates() {
    const [selectedTab, setSelectedTab] = useState("todas")
    const [editingDateId, setEditingDateId] = useState(null)
    const refCalendarModal = useRef(null)
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const refModal = useRef(null)

    const { register, handleSubmit, formState: { errors }, reset, setValue, control, watch } = useForm({
        resolver: zodResolver(createDateSchema),
        defaultValues: {
            title: "",
            shortDescription: "",
            realizationDate: new Date(),
            coverId: "",
            status: "nop"
        }
    })

    const watchStatus = watch("status")

    // Fetch dates and automatically resolve signed URLs using our custom general-purpose hook
    const { data, isLoading } = useResolveSignedUrls(["dates", selectedTab], () => getDatesByStatus(selectedTab))

    const addDateMutation = useMutation({
        mutationFn: createDate,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dates"] })
            refModal.current?.close()
            reset()
        },
        onError: (error) => {
            console.error("Error creating date:", error)
        }
    })

    const updateDateMutation = useMutation({
        mutationFn: updateDate,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dates"] })
            refModal.current?.close()
            reset()
            setEditingDateId(null)
        },
        onError: (error) => {
            console.error("Error updating date:", error)
        }
    })

    const deleteDateMutation = useMutation({
        mutationFn: deleteDate,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dates"] })
        },
        onError: (error) => {
            console.error("Error deleting date:", error)
        }
    })

    const formatDateForDB = (dateVal) => {
        if (!dateVal) return ""
        if (dateVal instanceof Date) {
            if (isNaN(dateVal.getTime())) return ""
            const year = dateVal.getFullYear()
            const month = String(dateVal.getMonth() + 1).padStart(2, '0')
            const day = String(dateVal.getDate()).padStart(2, '0')
            return `${year}-${month}-${day}`
        }
        return String(dateVal)
    }

    const handleSubmitDate = (formData) => {
        const formattedDate = formatDateForDB(formData.realizationDate)

        const payload = {
            title: formData.title,
            shotDescription: formData.shortDescription,
            realizationDate: formattedDate,
            coverId: formData.coverId || null,
            status: formData.status
        }

        if (editingDateId) {
            updateDateMutation.mutate({
                id: editingDateId,
                ...payload
            })
        } else {
            addDateMutation.mutate(payload)
        }
    }

    const handleOpenCreateModal = () => {
        setEditingDateId(null)
        reset({
            title: "",
            shortDescription: "",
            realizationDate: new Date(),
            coverId: "",
            status: "nop"
        })
        refModal.current?.open()
    }

    const handleOpenEditModal = (date) => {
        setEditingDateId(date.id)
        setValue("title", date.title)
        setValue("shortDescription", date.short_description || "")

        // Parse realization_date safely to a Date object for DayPicker
        setValue(
            "realizationDate",
            parseDateStringToLocalDate(date.realization_date) || new Date()
        )
        setValue("coverId", date.cover_image_id || "")
        setValue("status", date.status || "nop")
        refModal.current?.open()
    }

    const handleDeleteDate = (id) => {
        if (confirm("¿Estás seguro de que quieres borrar este momento especial? 😢")) {
            deleteDateMutation.mutate(id)
        }
    }

    const modalTitle = editingDateId ? "Editar cita" : "Nueva cita"
    const modalSubtitle = editingDateId ? "Actualiza los detalles de nuestra cita." : "Añade una nueva cita."
    const isPending = addDateMutation.isPending || updateDateMutation.isPending
    const isEmpty = !data || data.length === 0

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-6">
            {/* Header / Navigation */}
            <div className="relative flex items-center justify-center py-2 border-b border-base-200/90 dark:border-base-800/40 mb-2">
                <button className="absolute left-0 btn btn-circle btn-primary text-white active:text-white md:hover:text-white active:bg-primary/80 md:hover:bg-primary/80 transition-all duration-200"
                    onClick={() => navigate(-1)}
                    aria-label="Volver"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex items-center justify-center py-4">
                    <Title />
                </div>
            </div>

            {/* FILTRO DE CITAS */}
            <div className="flex justify-center">
                <div className="grid grid-cols-3 gap-1 bg-base-200/50 dark:bg-base-950/40 p-1.5 rounded-2xl border border-base-200/60 dark:border-base-850/60 w-full max-w-sm">
                    {[
                        { id: "todas", label: "Todas" },
                        { id: "yap", label: "Yap" },
                        { id: "nop", label: "Nop" }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setSelectedTab(tab.id)}
                            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 transform active:scale-105 ease-in-out ${selectedTab === tab.id
                                    ? "bg-primary text-white shadow-xs"
                                    : "text-base-content/60 active:bg-base-300/35 dark:active:bg-base-900/40"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* MAIN CONTENT LIST */}
            {isLoading ? (
                <div className="flex flex-col gap-4">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="w-full bg-base-100 dark:bg-base-900/40 border border-base-200 dark:border-base-800/60 rounded-3xl p-5 animate-pulse flex items-center justify-between gap-4"
                        >
                            <div className="flex items-center gap-3.5 flex-1 min-w-0">
                                <div className="w-12 h-12 rounded-2xl bg-base-200 dark:bg-base-850 shrink-0" />
                                <div className="flex flex-col flex-1 gap-2">
                                    <div className="h-5 bg-base-200 dark:bg-base-850 rounded-lg w-1/3" />
                                    <div className="h-3 bg-base-200 dark:bg-base-850 rounded-lg w-2/3" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : isEmpty ? (
                <div className="flex flex-col items-center justify-center py-14 px-6 text-center dark:bg-base-900/10 rounded-3xl border border-dashed border-base-300 dark:border-base-800/80 my-4 shadow-3xs">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-5 text-primary">
                        <CalendarHeart className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-base-content leading-snug">¿Nuestra primera cita?</h3>
                    <p className="text-xs text-base-content/50 max-w-sm mt-2 leading-relaxed">
                        Aún no hay citas registradas en el calendario. Añade una cita para recordar ese día especial por siempre.
                    </p>
                    <button className="btn btn-primary btn-sm rounded-xl mt-6 gap-1.5 shadow-xs active:scale-[0.98] md:hover:scale-[1.02] transition-all font-semibold" onClick={handleOpenCreateModal}>
                        <Plus className="w-4 h-4" /> Registrar primera cita
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {data?.map((date) => (
                        <DateItem
                            key={date.id}
                            date={date}
                            onEdit={() => handleOpenEditModal(date)}
                            onDelete={() => handleDeleteDate(date.id)}
                            isDeleting={deleteDateMutation.isPending && deleteDateMutation.variables === date.id}
                        />
                    ))}
                </div>
            )}

            {/* Floating Action Button */}
            {!isLoading && (
                <FabAdd onClick={handleOpenCreateModal} />
            )}

            {/* Modal for Creating / Editing dates */}
            <Modal ref={refModal} modalTitle={modalTitle} modalSubtitle={modalSubtitle}>
                <form onSubmit={handleSubmit(handleSubmitDate)} className="space-y-4">
                    <div className="space-y-3">
                        {/* Title */}
                        <div className="form-control">
                            <label className="label pb-1.5">
                                <span className="label-text font-semibold text-xs text-base-content/70">
                                    ¿Qué hicimos en esta cita?
                                </span>
                            </label>
                            <input className={`input input-bordered rounded-2xl w-full focus:outline-none focus:border-primary transition-all duration-200 ${errors.title ? "input-error" : ""}`}
                                type="text"
                                placeholder="Ej. Cena romántica en el mirador"
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

                        {/* Description */}
                        <div className="form-control">
                            <label className="label pb-1.5">
                                <span className="label-text font-semibold text-xs text-base-content/70">
                                    Descripción o recuerdos
                                </span>
                            </label>
                            <textarea
                                placeholder="Escribe aquí los mejores recuerdos de ese día..."
                                className={`textarea textarea-bordered rounded-2xl w-full h-20 resize-none focus:outline-none focus:border-primary transition-all duration-200 ${errors.shortDescription ? "input-error" : ""}`}
                                {...register("shortDescription")}
                            />
                            {errors.shortDescription && (
                                <label className="label pt-1">
                                    <span className="label-text-alt text-error font-medium flex items-center gap-1">
                                        <span>⚠️</span> {errors.shortDescription.message}
                                    </span>
                                </label>
                            )}
                        </div>

                        {/* Calendar Selector (DayPicker) */}
                        <div className="form-control">
                            <label className="label pb-1.5">
                                <span className="label-text font-semibold text-xs text-base-content/70">
                                    ¿Cuándo fue la cita?
                                </span>
                            </label>
                            {(() => {
                                const realizationDateValue = watch("realizationDate");
                                const selectedDate = parseDateStringToLocalDate(realizationDateValue);
                                const isValidDate = selectedDate instanceof Date && !isNaN(selectedDate.getTime());
                                const displayLabel = isValidDate
                                    ? selectedDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : "Escoger fecha";

                                return (
                                    <button className="btn btn-outline w-full rounded-2xl flex items-center justify-between px-4 font-semibold border-base-200 dark:border-base-800 text-sm active:scale-[0.99] transition-all bg-base-100 dark:bg-base-950/20 text-base-content/80 hover:bg-base-200/40 dark:hover:bg-base-900/40"
                                        type="button"
                                        onClick={() => refCalendarModal.current?.open()} >
                                        <span>{displayLabel}</span>
                                        <Calendar className="w-4.5 h-4.5 text-base-content/50" />
                                    </button>
                                );
                            })()}
                            {errors.realizationDate && (
                                <span className="text-xs text-error font-medium mt-1 block">
                                    ⚠️ {errors.realizationDate.message}
                                </span>
                            )}
                        </div>

                        <input type="hidden" {...register("coverId")} />

                        {/* ESTADO DE LA CITA "nop" POR DEFAULT */}
                        <div className="form-control">
                            <label className="label pb-1.5">
                                <span className="label-text font-semibold text-xs text-base-content/70">
                                    Estatus de la cita
                                </span>
                            </label>
                            <div className="grid grid-cols-2 gap-2 bg-base-200/40 dark:bg-base-950/30 p-1.5 rounded-2xl border border-base-200/60 dark:border-base-850/60">
                                <label className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold cursor-pointer transition-all duration-200 active:scale-[0.97] select-none ${watchStatus === "yap"
                                        ? "bg-success/20 text-success border border-success/30 shadow-xs"
                                        : "text-base-content/50 border border-transparent active:bg-base-250/50 dark:active:bg-base-900/30"
                                    }`}>
                                    <input
                                        type="radio"
                                        value="yap"
                                        className="sr-only"
                                        {...register("status")}
                                    />
                                    <span>Yap</span>
                                </label>
                                <label className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold cursor-pointer transition-all duration-200 active:scale-[0.97] select-none ${watchStatus === "nop"
                                        ? "bg-error/20 text-error border border-error/30 shadow-xs"
                                        : "text-base-content/50 border border-transparent active:bg-base-250/50 dark:active:bg-base-900/30"
                                    }`}>
                                    <input
                                        type="radio"
                                        value="nop"
                                        className="sr-only"
                                        {...register("status")}
                                    />
                                    <span>Nop</span>
                                </label>
                            </div>
                        </div>

                        {/* Cover */}
                        <Controller
                            name="coverId"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <UploadPanel
                                    label="Imagen de portadita (en horizontal se ve mejor)"
                                    value={value}
                                    onChange={onChange}
                                />
                            )}
                        />

                        {/* Submit Button */}
                        <button className="btn btn-primary w-full rounded-2xl mt-4 flex items-center justify-center gap-2" type="submit" disabled={isPending} >
                            {isPending ? (
                                <>
                                    <Loader2 className="w-4.5 h-4.5 animate-spin" />
                                    <span>{editingDateId ? "Guardando..." : "Creando..."}</span>
                                </>
                            ) : (
                                <>
                                    <span>{editingDateId ? "Guardar cambios" : "Registrar cita"}</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Modal for choosing date (outside of the main form to avoid nested <form> nesting) */}
            <Modal ref={refCalendarModal} modalTitle="Seleccionar fecha" className="max-w-sm md:max-w-sm">
                <Controller
                    control={control}
                    name="realizationDate"
                    render={({ field }) => {
                        const selectedDate = parseDateStringToLocalDate(field.value);
                        return (
                            <div className="flex flex-col items-center justify-center p-1.5 overflow-hidden max-w-full">
                                <DayPicker
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={(date) => {
                                        if (date) {
                                            field.onChange(date);
                                            refCalendarModal.current?.close();
                                        }
                                    }}
                                    locale={es}
                                />
                            </div>
                        );
                    }}
                />
            </Modal>
        </div>
    )
}

export function Title() {
    return (
        <h2 className="text-3xl font-extrabold tracking-tight text-center drop-shadow-xs  bg-base-100  px-4 py-1.5 rounded-full">
            <span className="text-orange-500">C</span>
            <span className="text-amber-400">I</span>
            <span className="text-yellow-400">T</span>
            <span className="text-green-400">A</span>
            <span className="text-cyan-400">A</span>
            <span className="text-blue-500">A</span>
            <span className="text-violet-500">S</span>
        </h2>
    );
}