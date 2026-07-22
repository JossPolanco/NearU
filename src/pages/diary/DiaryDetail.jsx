import { getCurrentUser, getUserProfile, getPartnerProfile } from "@/services/user/userService";
import { getDiaryEntryByDate, createDiaryEntry, updateDiaryEntry } from "@/services/diary"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams, } from 'react-router';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, MoodSelector } from "@/components";
import { ArrowLeft, Loader2 } from 'lucide-react';
import { React, useRef } from 'react';
import { z } from "zod";

import { getMoodData } from "@/utils/getMoods";

const createDiaryEntrySchema = z.object({
    title: z.string().min(1, "El título es obligatorio").max(100, "El título debe tener menos de 100 caracteres"),
    content: z.string().min(1, "El contenido es obligatorio"),
    mood: z.string().min(1, "Selecciona un estado de ánimo"),
})

export default function DiaryDetail() {
    const { currentDate } = useParams()
    const navigate = useNavigate()
    const refModal = useRef(null)
    const queryClient = useQueryClient()

    const { control, handleSubmit, formState: { errors }, register, reset } = useForm({
        resolver: zodResolver(createDiaryEntrySchema),
        defaultValues: {
            title: "",
            content: "",
            mood: "normal",
        }
    })

    // Fetch entries for the date
    const { data: diaryEntries = [], isLoading } = useQuery({
        queryKey: ["diary", currentDate],
        queryFn: () => getDiaryEntryByDate(currentDate),
    })

    // Fetch user context
    const { data: currentUser } = useQuery({
        queryKey: ["currentUser"],
        queryFn: getCurrentUser,
    });

    const { data: myProfile } = useQuery({
        queryKey: ["myProfile"],
        queryFn: getUserProfile,
    });

    const { data: partnerProfile } = useQuery({
        queryKey: ["partnerProfile"],
        queryFn: getPartnerProfile,
    });

    // Identify user's entry vs partner's entry
    const myEntry = diaryEntries.find(entry => entry.author_id === currentUser?.id);
    const partnerEntry = diaryEntries.find(entry => entry.author_id !== currentUser?.id);

    const createDiaryMutation = useMutation({
        mutationFn: createDiaryEntry,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["diary", currentDate] })
            refModal.current?.close()
            reset()
        },
        onError: (error) => {
            console.error("Error creating diary entry:", error)
        }
    })

    const updateDiaryMutation = useMutation({
        mutationFn: updateDiaryEntry,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["diary", currentDate] })
            refModal.current?.close()
            reset()
        },
        onError: (error) => {
            console.error("Error updating diary entry:", error)
        }
    })

    const handleOpenModal = () => {
        if (myEntry) {
            reset({
                title: myEntry.title,
                content: myEntry.content,
                mood: myEntry.mood
            });
        } else {
            reset({
                title: "",
                content: "",
                mood: "normal"
            });
        }
        refModal.current?.open();
    };

    const handleSubmitDiary = (data) => {
        if (myEntry) {
            updateDiaryMutation.mutate({
                id: myEntry.id,
                title: data.title,
                content: data.content,
                entryDate: currentDate,
                mood: data.mood
            })
        } else {
            createDiaryMutation.mutate({
                title: data.title,
                content: data.content,
                entryDate: currentDate,
                mood: data.mood
            })
        }
    }

    const isPending = createDiaryMutation.isPending || updateDiaryMutation.isPending;

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-6">
            {/* Header / Navigation */}
            <div className="relative flex items-center justify-center border-b border-base-200/90 dark:border-base-800/40 mb-2">
                <button
                    className="absolute left-0 btn btn-circle btn-primary text-white active:text-white md:hover:text-white active:bg-primary/80 md:hover:bg-primary/80 transition-transform duration-200"
                    onClick={() => navigate(-1)}
                    aria-label="Volver"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex items-center justify-center py-4">
                    <Title />
                </div>
            </div>

            {/* Display formatted date */}
            <div className="text-center py-4 px-6 rounded-3xl bg-base-200/30 dark:bg-base-950/10 border border-base-200/60 dark:border-base-800/20 backdrop-blur-xs">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary/70">
                    Diario de la pareja
                </span>
                <h3 className="text-lg font-black text-base-content capitalize mt-1.5">
                    {new Date(currentDate + "T00:00:00").toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </h3>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-32">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {diaryEntries.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-14 px-6 text-center bg-base-100/40 dark:bg-base-950/10 border border-dashed border-base-300 dark:border-base-800 rounded-3xl gap-4">
                            <span className="text-4xl animate-bounce">✍️</span>
                            <div>
                                <h4 className="text-base font-bold text-base-content">Aún no hay entradas</h4>
                                <p className="text-xs text-base-content/50 max-w-xs mt-1">Ninguno de los dos ha escrito una entrada hoy. ¡Escribe la tuya para empezar!</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-5">
                            {/* Sort entries so user's entry is shown first or consistent order */}
                            {[myEntry, partnerEntry].filter(Boolean).map((entry) => {
                                const isMe = entry.author_id === currentUser?.id;
                                const profile = isMe ? myProfile : partnerProfile;
                                const authorName = profile?.nickname || profile?.display_name || (isMe ? "Yo" : "Mi pareja");
                                const avatarUrl = profile?.avatar_url;
                                const moodData = getMoodData(profile?.gender, entry.mood);

                                return (
                                    <div
                                        key={entry.id}
                                        className={`card bg-base-100 border rounded-3xl p-5 space-y-4 shadow-2xs relative overflow-hidden transition-transform duration-300 ${isMe
                                            ? "from-primary/2 to-base-100 dark:from-primary/1 dark:to-base-950/15 border-primary/20 dark:border-primary/30"
                                            : "from-secondary/2 to-base-100 dark:from-secondary/1 dark:to-base-950/15 border-secondary/20 dark:border-secondary/30"
                                            }`}
                                    >
                                        {/* Author Header */}
                                        <div className="flex items-center justify-between border-b border-base-200/60 dark:border-base-800/20 pb-3">
                                            <div className="flex items-center gap-3">
                                                {avatarUrl ? (
                                                    <img src={avatarUrl} alt={authorName} className={`w-16 h-16 rounded-full object-cover border ${isMe ? "border-primary/20" : "border-secondary/20"}`} />
                                                ) : (
                                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-sm ${isMe ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"}`}>
                                                        {authorName.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <div>
                                                    <h4 className="text-sm font-extrabold text-base-content">{authorName}</h4>
                                                    <span className="text-[10px] text-base-content/40 font-semibold uppercase tracking-wider">
                                                        {isMe ? "Tu entrada" : "Entrada de tu pareja"}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Mood Badge */}
                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border text-[11px] font-bold shadow-2xs ${moodData.className || "bg-base-200/50 border-base-300/80"}`}>
                                                {moodData.photo ? (
                                                    <img src={moodData.photo} alt={moodData.title} className="w-5 h-5 object-contain drop-shadow-xs" />
                                                ) : (
                                                    <span className="text-sm select-none" role="img" aria-label={moodData.title}>
                                                        {moodData.emoji}
                                                    </span>
                                                )}
                                                <span>{moodData.title}</span>
                                            </div>
                                        </div>

                                        {/* Title and Content */}
                                        <div className="space-y-2">
                                            <h3 className="text-base font-extrabold text-base-content leading-snug">{entry.title}</h3>
                                            <p className="text-sm text-base-content/85 whitespace-pre-wrap leading-relaxed">{entry.content}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Action button */}
                    <div className="pt-2">
                        <button
                            className="btn btn-primary rounded-2xl w-full min-h-12 font-bold text-white shadow-xs active:scale-98 active:bg-primary/90 transition-transform duration-150 flex items-center justify-center gap-2"
                            onClick={handleOpenModal}
                        >
                            {myEntry ? "✏️ Editar mi entrada" : "✍️ Escribir mi entrada"}
                        </button>
                    </div>
                </div>
            )}

            {/* Modal for creating/editing */}
            <Modal
                modalTitle={myEntry ? "Editar mi entrada" : "Crear entrada"}
                modalSubtitle={myEntry ? "Actualiza lo que sentiste y pensaste hoy" : "Escribe lo que sentiste y pensaste hoy"}
                ref={refModal}
                className="max-w-md"
            >
                <form className="flex flex-col gap-5 pt-2" onSubmit={handleSubmit(handleSubmitDiary)}>
                    <div className="form-control">
                        <label className="label pb-1.5">
                            <span className="label-text font-semibold text-xs text-base-content/70">
                                ¿Qué hicimos en esta cita?
                            </span>
                        </label>
                        <input className={`input input-bordered rounded-2xl w-full focus:outline-none focus:border-primary transition-transform duration-200 ${errors.title ? "input-error" : ""}`}
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

                    <div className="form-control">
                        <label className="label pb-1.5">
                            <span className="label-text font-semibold text-xs text-base-content/70">
                                Descripción o recuerdos
                            </span>
                        </label>
                        <textarea
                            placeholder="Escribe aquí los mejores recuerdos de ese día..."
                            className={`textarea textarea-bordered rounded-2xl w-full h-20 resize-none focus:outline-none focus:border-primary transition-transform duration-200 ${errors.content ? "input-error" : ""}`}
                            {...register("content")}
                        />
                        {errors.content && (
                            <label className="label pt-1">
                                <span className="label-text-alt text-error font-medium flex items-center gap-1">
                                    <span>⚠️</span> {errors.content.message}
                                </span>
                            </label>
                        )}
                    </div>

                    <Controller
                        control={control}
                        name="mood"
                        render={({ field }) => (
                            <MoodSelector
                                selectedMood={field.value}
                                onSelectMood={field.onChange}
                                disabled={isPending}
                            />
                        )}
                    />

                    <button
                        type="submit"
                        className={`btn btn-primary mt-4 rounded-2xl min-h-12 font-bold text-white shadow-xs active:scale-98 transition-transform duration-150`}
                        disabled={isPending}
                    >
                        {isPending && (
                            <span className="loading loading-spinner loading-sm mr-2"></span>
                        )}
                        Guardar
                    </button>
                </form>
            </Modal>
        </div>
    );
}

export function Title() {
    return (
        <h2 className="text-2xl font-black tracking-tight text-center drop-shadow-xs bg-base-100 px-5 py-2 rounded-full border border-base-200/40 shadow-2xs">
            <span className="text-red-400">D</span>
            <span className="text-orange-400">e</span>
            <span className="text-amber-400">t</span>
            <span className="text-emerald-400">a</span>
            <span className="text-sky-400">l</span>
            <span className="text-indigo-400">l</span>
            <span className="text-pink-400">e</span>
            <span> </span>
            <span className="text-red-400">d</span>
            <span className="text-orange-400">e</span>
            <span className="text-amber-400">l</span>
            <span> </span>
            <span className="text-emerald-400">D</span>
            <span className="text-sky-400">i</span>
            <span className="text-indigo-400">a</span>
            <span className="text-pink-400">r</span>
            <span className="text-red-400">i</span>
            <span className="text-orange-400">o</span>
        </h2>
    );
}