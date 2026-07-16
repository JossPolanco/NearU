import { UploadPanel, GalleryPanel, Modal } from "@/components";
import { getCurrentUser, getPartnerMood, getUserMood, updateUserMood } from '@/services/user';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Heart, Loader2 } from "lucide-react";
import { MOODS_MALE, MOODS_FEMALE } from "../utils/getMoods";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const moodFormSchema = z.object({
    mood: z.string().min(1, "Selecciona un estado de ánimo")
})

export default function TestingPage() {
    const navigate = useNavigate()
    const queryClient = useQueryClient();
    const modalRef = useRef(null)
    const moodModalRef = useRef(null)
    const [activeGallery, setActiveGallery] = useState('default')
    const [activeMood, setActiveMood] = useState('Normal')
    const modalTitle = "Actualiza tu estado de ánimo"
    const modalSubtitle = "Cuéntale a tu parejita cómo te sientes hoy"

    const { register, handleSubmit, formState: { errors }, watch, reset, setValue } = useForm({
        resolver: zodResolver(moodFormSchema),
        defaultValues: {
            mood: activeMood,
        },
    })

    const { data: user, isLoading } = useQuery({
        queryKey: ["user"],
        queryFn: getCurrentUser,
    });

    const { data: partnerMood } = useQuery({
        queryKey: ["partnerMood"],
        queryFn: getPartnerMood,
    });

    const { data: userMood } = useQuery({
        queryKey: ["userMood"],
        queryFn: getUserMood,
    });

    useEffect(() => {
        if (userMood?.mood) {
            setActiveMood(userMood.mood);
            setValue("mood", userMood.mood);
        }
    }, [userMood, setValue]);

    const updateMoodMutation = useMutation({
        mutationFn: updateUserMood,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userMood"] });
            moodModalRef.current?.close();
        },
    });

    const onSubmitMood = (formData) => {
        updateMoodMutation.mutate(formData.mood);
    };

    const moodsList = userMood?.gender === "female" ? MOODS_FEMALE : MOODS_MALE;
    const selectedMoodData = moodsList.find(
        (m) => m.title.toLowerCase() === activeMood.toLowerCase()
    );

    return (
        <div className="max-w-md mx-auto p-4 space-y-6 pb-24 animate-fade-in">
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

            {/* Selector de galería */}
            <div className="space-y-2">
                <p className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">Galería Activa</p>
                <div role="tablist" className="tabs tabs-boxed">
                    <button role="tab" className={`tab ${activeGallery === 'default' ? 'tab-active' : ''}`} onClick={() => setActiveGallery('default')} >
                        Por Defecto (default)
                    </button>
                    <button role="tab" className={`tab ${activeGallery === 'citas' ? 'tab-active' : ''}`} onClick={() => setActiveGallery('citas')} >
                        Citas (citas)
                    </button>
                </div>
            </div>

            <button className="btn btn-primary" onClick={() => modalRef.current?.open()}>
                Abrir Modal de Prueba ({activeGallery})
            </button>

            <Modal ref={modalRef}>
                {/* Panel de subida */}
                <UploadPanel bucket='photos' gallery={activeGallery} user={user} />
            </Modal>

            {/* Galería de fotos del bucket "photos" */}
            <GalleryPanel bucket='photos' gallery={activeGallery} enableDelete={true} />

            <button className="btn btn-primary" onClick={() => moodModalRef.current?.open()}>
                Open Mood Modal
            </button>

            <Modal ref={moodModalRef} modalTitle={modalTitle} modalSubtitle={modalSubtitle}>
                <form onSubmit={handleSubmit(onSubmitMood)} className="space-y-4">
                    <div className="space-y-4">
                        <input type="hidden" {...register("mood")} />

                        <div className="grid grid-cols-3 gap-3">
                            {moodsList.map((mood, index) => {
                                const isSelected = activeMood.toLowerCase() === mood.title.toLowerCase();
                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => {
                                            setActiveMood(mood.title);
                                            setValue("mood", mood.title);
                                        }}
                                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-200 active:scale-95 ${isSelected
                                                ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-xs ring-1 ring-primary/30"
                                                : "border-base-200 active:border-primary/20 md:hover:border-base-300 dark:border-base-800 dark:md:hover:border-base-750 bg-base-100 dark:bg-base-950/20"
                                            }`}
                                    >
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-3xs mb-2 transition-transform duration-200 ${isSelected ? "scale-105" : ""
                                            }`}>
                                            {mood.photo ? (
                                                <img
                                                    src={mood.photo}
                                                    alt={mood.title}
                                                    className="w-10 h-10 object-contain rounded-lg"
                                                />
                                            ) : (
                                                <span className="text-2xl select-none" role="img" aria-label={mood.title}>
                                                    {mood.emoji}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs font-semibold text-base-content/85 text-center truncate w-full">
                                            {mood.title}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {selectedMoodData && (
                            <div className={`p-3.5 rounded-2xl border transition-all duration-300 animate-fade-in ${selectedMoodData.className}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider">Tu estado de ánimo</p>
                                <p className="text-xs font-medium mt-1 leading-relaxed">
                                    {selectedMoodData.description}
                                </p>
                            </div>
                        )}

                        <div className="pt-2">
                            <button
                                type="submit"
                                className="btn btn-primary w-full rounded-2xl flex items-center justify-center gap-2"
                                disabled={updateMoodMutation.isPending}
                            >
                                {updateMoodMutation.isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Guardando...</span>
                                    </>
                                ) : (
                                    <span>Guardar</span>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </Modal>

        </div>
    )
}

export function Title() {
    return (
        <h2 className="text-3xl font-extrabold tracking-tight text-center drop-shadow-xs bg-base-100 px-4 py-1.5 rounded-full">
            <span className="text-orange-500">P</span>
            <span className="text-orange-400">a</span>
            <span className="text-amber-400">g</span>
            <span className="text-yellow-400">i</span>
            <span className="text-lime-500">n</span>
            <span className="text-green-500">i</span>
            <span className="text-emerald-500">t</span>
            <span className="text-cyan-400">a</span>
            <span> </span>
            <span className="text-sky-500">d</span>
            <span className="text-blue-500">e</span>
            <span> </span>
            <span className="text-indigo-500">p</span>
            <span className="text-violet-500">r</span>
            <span className="text-fuchsia-500">u</span>
            <span className="text-pink-500">e</span>
            <span className="text-rose-500">b</span>
            <span className="text-red-500">a</span>
            <span className="text-orange-500">s</span>
        </h2>
    );
}