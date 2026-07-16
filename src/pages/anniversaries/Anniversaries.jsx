import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createAnniversary, getAnniversaries } from '@/services/anniversaries';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from 'react-hook-form';
import { ArrowLeft, Calendar } from 'lucide-react';
import { FabAdd, Modal, Anniversary } from '@/components';
import { useNavigate } from 'react-router';
import { DayPicker } from "react-day-picker";
import { es } from "date-fns/locale";
import { useRef } from 'react';
import { z } from 'zod'

const anniversarySchema = z.object({
    title: z.string().min(1, "Debes escribir un titulo para tu aniversario"),
    description: z.string().min(1, "Debes escribir una descripcion para tu aniversario"),
    eventDate: z.any().refine(val => val instanceof Date, "La fecha es requerida"),
    recurrence_type: z.string(),
    reminder_days_before: z.number()
})

export default function Anniversaries() {
    const navigate = useNavigate();
    const refModal = useRef(null);
    const refCalendarModal = useRef(null);
    const modalTitle = "Aniversario"
    const modalSubtitle = "Añade un nuevo aniversario"
    const queryClient = useQueryClient()

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

    const handleSubmitAnni = (formData) => {
        addAnniversaryMutate.mutate(formData)
    }

    const handleOpenModal = () => {
        refModal.current?.open();
    }


    const { data, isLoading, error } = useQuery({
        queryKey: ["anniversaries"],
        queryFn: getAnniversaries,
    })

    const addAnniversaryMutate = useMutation({
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

            <div className="flex flex-col gap-1">
                {data?.map((anniversary) => (
                    <Anniversary key={anniversary.id} anniversary={anniversary} />
                ))}
            </div>

            <FabAdd onClick={handleOpenModal} />

            <Modal ref={refModal} modalTitle={modalTitle} modalSubtitle={modalSubtitle}>
                <form onSubmit={handleSubmit(handleSubmitAnni)} className="space-y-4">
                    <div className="space-y-3">
                        {/* TITLE */}
                        <div className="form-control">
                            <label className="label pb-1.5">
                                <span className="label-text font-semibold text-xs text-base-content/70">
                                    Titulo de tu aniversario
                                </span>
                            </label>
                            <input className={`input input-bordered rounded-2xl w-full focus:outline-none focus:border-primary transition-all duration-200 ${errors.title ? "input-error" : ""}`}
                                type="text"
                                placeholder="Ej. Aniversario 1"
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
                                    Descripcion
                                </span>
                            </label>
                            <input className={`input input-bordered rounded-2xl w-full focus:outline-none focus:border-primary transition-all duration-200 ${errors.description ? "input-error" : ""}`}
                                type="text"
                                placeholder="Ej. Aniversario 1"
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
                                <option value="nop">Nop</option>
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
                                    ¿Cuando quieres que te lo recordemos mi amor?
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
                                const selectedDate = new Date(eventDateValue);
                                const isValidDate = selectedDate instanceof Date;
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

                        <button className="btn btn-primary w-full rounded-2xl mt-4 flex items-center justify-center gap-2" type="submit"  >
                            {/* {isPending ? (
                                <>
                                    <Loader2 className="w-4.5 h-4.5 animate-spin" />
                                    <span>Guardando...</span>
                                </>
                            ) : (
                                <>
                                    <span>Guardar</span>
                                </>
                            )} */} guardar
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
                        return (
                            <div className="flex flex-col items-center justify-center p-1.5 overflow-hidden max-w-full">
                                <DayPicker
                                    mode="single"
                                    selected={field.value}
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