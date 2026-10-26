import { getUserMood, getPartnerMood, updateUserMood } from "@/services/user";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { touchHover, tapFeedback, mobileSpring } from "@/utils/motion";
import { getMoodsByGender, getMoodData } from "@/utils/getMoods";
import { Edit3, Loader2, Sparkles, Heart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Modal } from "@/components";
import { z } from "zod";

const moodFormSchema = z.object({
    mood: z.string().min(1, "Selecciona un estado de ánimo"),
});

export default function UserMoodCard() {
    const queryClient = useQueryClient();
    const moodModalRef = useRef(null);
    const [activeMood, setActiveMood] = useState("Normal");

    const modalTitle = "Actualiza tu estado de ánimo";
    const modalSubtitle = "Cuéntale a tu parejita cómo te sientes hoy";

    const { register, handleSubmit, setValue } = useForm({
        resolver: zodResolver(moodFormSchema),
        defaultValues: {
            mood: activeMood,
        },
    });

    const { data: userMood, isLoading: isLoadingUserMood } = useQuery({
        queryKey: ["userMood"],
        queryFn: getUserMood,
    });

    const { data: partnerMood, isLoading: isLoadingPartnerMood } = useQuery({
        queryKey: ["partnerMood"],
        queryFn: getPartnerMood,
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

    const userMoodData = getMoodData(userMood?.gender, userMood?.mood || activeMood);
    const partnerMoodData = getMoodData(partnerMood?.gender, partnerMood?.mood);
    const moodsList = getMoodsByGender(userMood?.gender);

    const selectedMoodData = moodsList.find(
        (m) => m.title.toLowerCase() === activeMood.toLowerCase()
    );

    const handleCardClick = () => {
        moodModalRef.current?.open();
    };

    if (isLoadingUserMood || isLoadingPartnerMood) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full bg-base-100 dark:bg-base-900/40 rounded-3xl border border-base-200/80 dark:border-base-800/50 p-4 sm:p-5 shadow-xs space-y-3"
            >
                <div className="h-4 w-32 bg-base-300/50 rounded-full animate-pulse" />
                <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="h-24 bg-base-200/60 dark:bg-base-800/40 rounded-2xl animate-pulse" />
                    <div className="h-24 bg-base-200/60 dark:bg-base-800/40 rounded-2xl animate-pulse" />
                </div>
            </motion.div>
        );
    }

    return (
        <>
            {/* CARD PRINCIPAL*/}
            <motion.div
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { handleCardClick(); } }}
                onClick={handleCardClick}
                whileHover={touchHover({ y: -2 })}
                whileTap={tapFeedback.card}
                transition={mobileSpring}
                className="group relative overflow-hidden rounded-3xl bg-base-100/50 dark:from-base-900/70 dark:via-base-900/50 dark:to-primary/10 border border-base-200/90 dark:border-base-800/60 p-4 sm:p-5 shadow-xs hover:shadow-md transition-shadow duration-200 cursor-pointer"
            >
                {/* HEADER*/}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
                        <motion.div
                            whileHover={touchHover({ rotate: 180 })}
                            transition={{ duration: 0.3 }}
                        >
                            <Sparkles className="w-3.5 h-3.5 fill-primary/20" />
                        </motion.div>
                        <span>Nuestros Ánimos</span>
                    </div>

                    <motion.button
                        type="button"
                        whileHover={touchHover({ scale: 1.06 })}
                        whileTap={tapFeedback.button}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCardClick();
                        }}
                        className="btn btn-ghost btn-xs rounded-full gap-1 text-xs text-base-content/70 group-hover:text-primary transition-colors cursor-pointer"
                        aria-label="Cambiar mi mood"
                    >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline font-medium">Cambiar</span>
                    </motion.button>
                </div>

                {/* MOODS CONTENEDOR */}
                <div className="grid grid-cols-2 gap-3">
                    {/* MOOD DEL USUARIO*/}
                    <motion.div
                        whileHover={touchHover({ scale: 1.02, y: -2 })}
                        transition={mobileSpring}
                        className={`p-3 rounded-2xl border transition-colors duration-200 flex flex-col items-center justify-center text-center shadow-2xs ${userMoodData.className || "bg-base-200/50 border-base-300/80"}`}
                    >
                        <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/60 mb-1">
                            Tú
                        </span>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={userMoodData.title}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.2 }}
                                className="w-12 h-12 rounded-xl flex items-center justify-center mb-1"
                            >
                                {userMoodData.photo ? (
                                    <img
                                        src={userMoodData.photo}
                                        alt={userMoodData.title}
                                        className="w-10 h-10 object-contain drop-shadow-xs"
                                    />
                                ) : (
                                    <span className="text-2xl select-none" role="img" aria-label={userMoodData.title}>
                                        {userMoodData.emoji}
                                    </span>
                                )}
                            </motion.div>
                        </AnimatePresence>
                        <span className="text-xs font-bold text-base-content truncate w-full">
                            {userMoodData.title}
                        </span>
                    </motion.div>

                    {/* MOOD DE LA PAREJA*/}
                    <motion.div
                        whileHover={touchHover({ scale: 1.02, y: -2 })}
                        transition={mobileSpring}
                        className={`p-3 rounded-2xl border transition-colors duration-200 flex flex-col items-center justify-center text-center shadow-2xs ${partnerMoodData.className || "bg-base-200/50 border-base-300/80"}`}
                    >
                        <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/60 mb-1 flex items-center gap-1">
                            <Heart className="w-2.5 h-2.5 fill-secondary text-secondary animate-pulse" />
                            Parejita
                        </span>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={partnerMoodData.title}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.2 }}
                                className="w-12 h-12 rounded-xl flex items-center justify-center mb-1"
                            >
                                {partnerMoodData.photo ? (
                                    <img
                                        src={partnerMoodData.photo}
                                        alt={partnerMoodData.title}
                                        className="w-10 h-10 object-contain drop-shadow-xs"
                                    />
                                ) : (
                                    <span className="text-2xl select-none" role="img" aria-label={partnerMoodData.title}>
                                        {partnerMoodData.emoji}
                                    </span>
                                )}
                            </motion.div>
                        </AnimatePresence>
                        <span className="text-xs font-bold text-base-content truncate w-full">
                            {partnerMoodData.title}
                        </span>
                    </motion.div>
                </div>
            </motion.div>

            {/* MODAL PARA ACTUALIZAR EL MOOD */}
            <Modal ref={moodModalRef} modalTitle={modalTitle} modalSubtitle={modalSubtitle}>
                <form onSubmit={handleSubmit(onSubmitMood)} className="space-y-4">
                    <div className="space-y-4">
                        <input type="hidden" {...register("mood")} />

                        <div className="grid grid-cols-3 gap-3">
                            {moodsList.map((mood) => {
                                const isSelected = activeMood.toLowerCase() === mood.title.toLowerCase();
                                return (
                                    <motion.button
                                        key={mood.id || mood.title}
                                        type="button"
                                        whileHover={touchHover({ scale: 1.04, y: -2 })}
                                        whileTap={tapFeedback.card}
                                        transition={mobileSpring}
                                        onClick={() => {
                                            setActiveMood(mood.title);
                                            setValue("mood", mood.title);
                                        }}
                                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-colors duration-200 cursor-pointer ${isSelected
                                            ? "border-primary bg-primary/10 dark:bg-primary/15 shadow-xs ring-2 ring-primary/40"
                                            : "border-base-200 active:border-primary/20 md:hover:border-base-300 dark:border-base-800 dark:md:hover:border-base-750 bg-base-100 dark:bg-base-950/20"
                                            }`}
                                    >
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-3xs mb-2 transition-transform duration-200 ${isSelected ? "scale-110" : ""}`}>
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
                                    </motion.button>
                                );
                            })}
                        </div>

                        <AnimatePresence mode="wait">
                            {selectedMoodData && (
                                <motion.div
                                    key={selectedMoodData.title}
                                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -4, scale: 0.97 }}
                                    transition={{ duration: 0.2 }}
                                    className={`p-3.5 rounded-2xl border ${selectedMoodData.className}`}
                                >
                                    <p className="text-[10px] font-bold uppercase tracking-wider">Tu estado de ánimo</p>
                                    <p className="text-xs font-medium mt-1 leading-relaxed">
                                        {selectedMoodData.description}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="pt-2">
                            <motion.button
                                whileHover={touchHover({ scale: 1.02 })}
                                whileTap={tapFeedback.button}
                                transition={mobileSpring}
                                type="submit"
                                className="btn btn-primary w-full rounded-2xl flex items-center justify-center gap-2 cursor-pointer"
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
                            </motion.button>
                        </div>
                    </div>
                </form>
            </Modal>
        </>
    );
}
