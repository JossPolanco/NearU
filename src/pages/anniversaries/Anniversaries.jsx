import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createAnniversary, getAnniversaries, updateAnniversary, deleteAnniversary } from '@/services/anniversaries';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from 'react-hook-form';
import { ArrowLeft, Calendar, Loader2, Plus, Heart } from 'lucide-react';
import { FabAdd, Modal, AnniversaryItem } from '@/components';
import { useNavigate } from 'react-router';
import { DayPicker } from "react-day-picker";
import { es } from "date-fns/locale";
import { useRef, useState } from 'react';
import { z } from 'zod';
import "react-day-picker/dist/style.css";

const anniversarySchema = z.object({
    title: z.string().min(1, "Debes escribir un título para tu aniversario"),
    description: z.string().min(1, "Debes escribir una descripción para tu aniversario"),
    eventDate: z.any().refine(val => val !== undefined && val !== null && val !== "", "La fecha es requerida"),
    recurrence_type: z.string(),
    reminder_days_before: z.preprocess((val) => Number(val), z.number().min(0, "Debe ser mayor o igual a 0"))
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

export default function Anniversaries() {
    const navigate = useNavigate();
    const refModal = useRef(null);
    const refCalendarModal = useRef(null);
    const [editingAnniversaryId, setEditingAnniversaryId] = useState(null);
    const queryClient = useQueryClient();

    const { register, handleSubmit, formState: { errors }, reset, setValue, control, watch } = useForm({
        resolver: zodResolver(anniversarySchema),
        defaultValues: {
            title: "",
            description: "",
            eventDate: new Date(),
            recurrence_type: "nop",
            reminder_days_before: 7
        }
    })

    const { data, isLoading, error } = useQuery({
        queryKey: ["anniversaries"],
        queryFn: getAnniversaries,
    })

    const addAnniversaryMutation = useMutation({
        mutationFn: createAnniversary,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["anniversaries"] })
            refModal.current?.close()
            reset()
        },
        onError: (error) => {
            console.error("Error creating anniversary:", error)
        }
    })

    const updateAnniversaryMutation = useMutation({
        mutationFn: updateAnniversary,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["anniversaries"] })
            refModal.current?.close()
            reset()
            setEditingAnniversaryId(null)
        },
        onError: (error) => {
            console.error("Error updating anniversary:", error)
        }
    })

    const deleteAnniversaryMutation = useMutation({
        mutationFn: deleteAnniversary,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["anniversaries"] })
        },
        onError: (error) => {
            console.error("Error deleting anniversary:", error)
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

    const handleSubmitAnni = (formData) => {
        const formattedDate = formatDateForDB(formData.eventDate)

        const payload = {
            title: formData.title,
            description: formData.description,
            eventDate: formattedDate,
            recurrenceType: formData.recurrence_type,
            reminderDaysBefore: Number(formData.reminder_days_before)
        }

        if (editingAnniversaryId) {
            updateAnniversaryMutation.mutate({
                id: editingAnniversaryId,
                ...payload
            })
        } else {
            addAnniversaryMutation.mutate(payload)
        }
    }

    const handleOpenCreateModal = () => {
        setEditingAnniversaryId(null)
        reset({
            title: "",
            description: "",
            eventDate: new Date(),
            recurrence_type: "nop",
            reminder_days_before: 7
        })
        refModal.current?.open()
    }

    const handleOpenEditModal = (anniversary) => {
        setEditingAnniversaryId(anniversary.id)
        setValue("title", anniversary.title)
        setValue("description", anniversary.description)
        setValue("eventDate", parseDateStringToLocalDate(anniversary.event_date) || new Date())
        setValue("recurrence_type", anniversary.recurrence_type || "nop")
        setValue("reminder_days_before", anniversary.reminder_days_before ?? 7)
        refModal.current?.open()
    }

    const handleDeleteAnniversary = (id) => {
        if (confirm("¿Estás seguro de que quieres borrar este aniversario? 😢")) {
            deleteAnniversaryMutation.mutate(id)
        }
    }

    const modalTitle = editingAnniversaryId ? "Editar aniversario" : "Aniversario"
    const modalSubtitle = editingAnniversaryId ? "Actualiza los detalles de nuestro aniversario." : "Añade un nuevo aniversario"
    const isPending = addAnniversaryMutation.isPending || updateAnniversaryMutation.isPending
    const isEmpty = !data || data.length === 0

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-6">
            {/* Header / Navigation */}
            <div className="relative flex items-center justify-center border-b border-base-200/90 dark:border-base-800/40 mb-2">
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

            {/* List / Loading / Empty states */}
            {isLoading ? (
                <div className="flex flex-col gap-4">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="w-full bg-base-100 dark:bg-base-900/40 border border-base-200 dark:border-base-800/60 rounded-3xl p-5 animate-pulse flex flex-col gap-3"
                        >
                            <div className="flex items-center gap-3.5">
                                <div className="w-12 h-12 rounded-2xl bg-base-250 dark:bg-base-850 shrink-0 animate-pulse" />
                                <div className="flex flex-col flex-1 gap-2">
                                    <div className="h-5 bg-base-250 dark:bg-base-850 rounded-lg w-1/3 animate-pulse" />
                                    <div className="h-3 bg-base-250 dark:bg-base-850 rounded-lg w-2/3 animate-pulse" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : isEmpty ? (
                <div className="flex flex-col items-center justify-center py-14 px-6 text-center dark:bg-base-900/10 rounded-3xl border border-dashed border-base-300 dark:border-base-800/80 my-4 shadow-3xs">
                    <div className="w-16 h-16 rounded-2xl bg-pink-100 dark:bg-pink-950/30 flex items-center justify-center mb-5 text-pink-500">
                        <Heart className="w-8 h-8 text-pink-500 animate-pulse" style={{ animationDuration: '3s' }} />
                    </div>
                    <h3 className="text-lg font-bold text-base-content leading-snug">¿Nuestro primer aniversario?</h3>
                    <p className="text-xs text-base-content/50 max-w-sm mt-2 leading-relaxed">
                        Aún no hay aniversarios registrados. Añade uno para recordar cada momento especial de nuestro camino.
                    </p>
                    <button className="btn btn-primary btn-sm rounded-xl mt-6 gap-1.5 shadow-xs active:scale-[0.98] md:hover:scale-[1.02] transition-all font-semibold" onClick={handleOpenCreateModal}>
                        <Plus className="w-4 h-4" /> Registrar primer aniversario
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {data?.map((anniversary) => (
                        <AnniversaryItem
                            key={anniversary.id}
                            anniversary={anniversary}
                            onEdit={() => handleOpenEditModal(anniversary)}
                            onDelete={() => handleDeleteAnniversary(anniversary.id)}
                            isDeleting={deleteAnniversaryMutation.isPending && deleteAnniversaryMutation.variables === anniversary.id}
                        />
                    ))}
                </div>
            )}

            {!isLoading && (
                <FabAdd onClick={handleOpenCreateModal} />
            )}

            {/* Modal for Creating / Editing anniversaries */}
            <Modal ref={refModal} modalTitle={modalTitle} modalSubtitle={modalSubtitle}>
                <form onSubmit={handleSubmit(handleSubmitAnni)} className="space-y-4">
                    <div className="space-y-3">
                        {/* TITLE */}
                        <div className="form-control">
                            <label className="label pb-1.5">
                                <span className="label-text font-semibold text-xs text-base-content/70">
                                    Título de tu aniversario
                                </span>
                            </label>
                            <input className={`input input-bordered rounded-2xl w-full focus:outline-none focus:border-primary transition-all duration-200 ${errors.title ? "input-error" : ""}`}
                                type="text"
                                placeholder="Ej. Nuestro primer mes"
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

                        {/* DESCRIPCION */}
                        <div className="form-control">
                            <label className="label pb-1.5">
                                <span className="label-text font-semibold text-xs text-base-content/70">
                                    Descripción o detalles
                                </span>
                            </label>
                            <input className={`input input-bordered rounded-2xl w-full focus:outline-none focus:border-primary transition-all duration-200 ${errors.description ? "input-error" : ""}`}
                                type="text"
                                placeholder="Ej. El día que decidimos ser noviecitos"
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

                        {/* RECURENCY_TYPE */}
                        <div className="form-control">
                            <label className="label pb-1.5">
                                <span className="label-text font-semibold text-xs text-base-content/70">
                                    Tipo de recurrencia
                                </span>
                            </label>
                            <select className={`select select-bordered rounded-2xl w-full focus:outline-none focus:border-primary transition-all duration-200 ${errors.recurrence_type ? "input-error" : ""}`}
                                {...register("recurrence_type")}>
                                <option value="nop">No recurrente</option>
                                <option value="anual">Anualito</option>
                                <option value="mensual">Mensualito</option>
                            </select>
                            {errors.recurrence_type && (
                                <label className="label pt-1">
                                    <span className="label-text-alt text-error font-medium flex items-center gap-1">
                                        <span>⚠️</span> {errors.recurrence_type.message}
                                    </span>
                                </label>
                            )}
                        </div>

                        {/* REMINDER_DAYS_BEFORE */}
                        <div className="form-control">
                            <label className="label pb-1.5">
                                <span className="label-text font-semibold text-xs text-base-content/70">
                                    ¿Cuántos días antes quieres que te lo recordemos, mi amor?
                                </span>
                            </label>
                            <input className={`input input-bordered rounded-2xl w-full focus:outline-none focus:border-primary transition-all duration-200 ${errors.reminder_days_before ? "input-error" : ""}`}
                                type="number"
                                placeholder="Ej. 7"
                                {...register("reminder_days_before")}
                            />
                            {errors.reminder_days_before && (
                                <label className="label pt-1">
                                    <span className="label-text-alt text-error font-medium flex items-center gap-1">
                                        <span>⚠️</span> {errors.reminder_days_before.message}
                                    </span>
                                </label>
                            )}
                        </div>

                        {/* Calendar Selector (DayPicker) */}
                        <div className="form-control">
                            <label className="label pb-1.5">
                                <span className="label-text font-semibold text-xs text-base-content/70">
                                    ¿Cuándo fue?
                                </span>
                            </label>
                            {(() => {
                                const eventDateValue = watch("eventDate");
                                const selectedDate = parseDateStringToLocalDate(eventDateValue);
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
                            {errors.eventDate && (
                                <span className="text-xs text-error font-medium mt-1 block">
                                    ⚠️ {errors.eventDate.message}
                                </span>
                            )}
                        </div>

                        <button className="btn btn-primary w-full rounded-2xl mt-4 flex items-center justify-center gap-2" type="submit" disabled={isPending} >
                            {isPending ? (
                                <>
                                    <Loader2 className="w-4.5 h-4.5 animate-spin" />
                                    <span>{editingAnniversaryId ? "Guardando..." : "Creando..."}</span>
                                </>
                            ) : (
                                <>
                                    <span>{editingAnniversaryId ? "Guardar cambios" : "Guardar"}</span>
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
                    name="eventDate"
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
        <h2 className="text-2xl font-black tracking-tight text-center drop-shadow-xs bg-base-100 px-5 py-2 rounded-full border border-base-200/40 shadow-2xs">
            <span className="text-red-400">A</span>
            <span className="text-orange-400">n</span>
            <span className="text-amber-400">i</span>
            <span className="text-emerald-400">v</span>
            <span className="text-sky-400">e</span>
            <span className="text-indigo-400">r</span>
            <span className="text-pink-400">s</span>
            <span className="text-red-400">a</span>
            <span className="text-orange-400">r</span>
            <span className="text-amber-400">i</span>
            <span className="text-emerald-400">o</span>
            <span className="text-sky-400">s</span>
        </h2>
    );
}