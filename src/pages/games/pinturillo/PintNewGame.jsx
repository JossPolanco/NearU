import { useState, useRef, useEffect, React } from 'react'
import { ArrowLeft, Sparkles, RefreshCw, Smile, Zap, Flame, ChevronRight, Check, Palette, Lightbulb, Loader2, Edit3 } from 'lucide-react'
import { useNavigate } from 'react-router'
import { default as words } from '../../../utils/words.json'
import Drawer from '../../../components/drawer/Drawer'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod'
import { createGame } from '@/services/games/pinturillo'
import { useImageUpload } from "../../../hooks/images/useImageUpload";
import { imageKeys } from "../../../hooks/images/useImages";
import { getUserId } from "../../../services/user/userService";

const pinturilloSchema = z.object({
    secretWord: z.string().min(1, "La palabra secreta es requerida"),
    hint1: z.string().min(1, "Mínimo una pista es requerida"),
    hint2: z.string().optional(),
    hint3: z.string().optional(),
})

const handleValidationError = (errors) => {
    console.log("Errores de validación en el formulario:", errors)
}

export default function PintNewGame() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [difficulty, setDifficulty] = useState("")
    const [wordsList, setWordsList] = useState([])
    const [selectedWord, setSelectedWord] = useState("")
    const [customWord, setCustomWord] = useState("")
    const drawerRef = useRef(null)

    const { data: userId } = useQuery({
        queryKey: ["user-id"],
        queryFn: getUserId,
    })

    const getFiveWords = (diff) => {
        const w = words[diff] || []
        const fiveWords = []
        const availableWords = [...w]

        for (let i = 0; i < 5 && availableWords.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * availableWords.length)
            fiveWords.push(availableWords.splice(randomIndex, 1)[0])
        }

        setDifficulty(diff)
        setWordsList(fiveWords)
    }

    const handleBack = () => {
        if (selectedWord) {
            setSelectedWord("")
            setCustomWord("")
        } else if (wordsList.length > 0) {
            setWordsList([])
            setDifficulty("")
            setCustomWord("")
        } else {
            navigate(-1)
        }
    }

    const createGameMutation = useMutation({
        mutationFn: createGame,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pinturillo-draws"] });
            drawerRef.current?.resetCanvas();
            reset();
            navigate('/pinturillo');
        },
    })

    const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm({
        resolver: zodResolver(pinturilloSchema),
        defaultValues: {
            secretWord: selectedWord,
            hint1: "",
            hint2: "",
            hint3: "",
        }
    })

    useEffect(() => {
        if (selectedWord) {
            setValue("secretWord", selectedWord);
        }
    }, [selectedWord, setValue]);

    const { upload, state } = useImageUpload({
        bucket: "drawings",
        profile: "drawing",
        gallery: "pinturillo",
        invalidateQueries: [imageKeys.list("drawings", "pinturillo")],
        onSuccess: (image) => {            
            createGameMutation.mutate({
                secretWord: selectedWord,
                hint1: watch("hint1"),
                hint2: watch("hint2") || "",
                hint3: watch("hint3") || "",
                drawId: image.id,
            });
        }
    });

    const isSaving =
        (state.stage !== "idle" && state.stage !== "success" && state.stage !== "error") ||
        createGameMutation.isPending;

    const handleSubmitGame = async () => {
        try {            
            if (!drawerRef.current) return;
            const data = await drawerRef.current.getDrawingData();
            if (!data || data.isEmpty) {
                alert("Por favor, realiza un dibujo antes de guardar.");
                return;
            }

            const response = await fetch(data.dataUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const blob = await response.blob();
            const cleanTitle = selectedWord || "dibujo";
            const filename = `${cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, "_") || "dibujo"}.png`;
            const file = new File([blob], filename, { type: "image/png" });

            if (!userId) {
                alert("Usuario no autenticado.");
                return;
            }

            await upload(file, userId);
        } catch (error) {
            console.error("Error al guardar el dibujo:", error);
            alert("Ocurrió un error al guardar el dibujo.");
        }
    }

    const handleValidationError = (errors) => {
        console.log("Errores de validación en el formulario:", errors)
    }

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-6">
            {/* Header / Navigation */}
            <div className="relative flex items-center justify-center py-2 mb-2">
                <button type="button"
                    className="absolute left-0 btn btn-circle btn-primary text-white active:text-white md:hover:text-white active:bg-primary/80 md:hover:bg-primary/80 transition-transform duration-200"
                    onClick={handleBack}
                    aria-label="Volver"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center justify-center">
                    <Title />
                </div>
            </div>

            {/* SELECTOR DE DIFICULTAD */}
            {wordsList.length === 0 && !selectedWord && (
                <div className="space-y-6">
                    <div className="text-center space-y-1">
                        <h1 className="text-xl font-bold text-base-content">
                            ¿Qué tan difícil quieres jugar?
                        </h1>
                        <p className="text-xs text-base-content/60">
                            Selecciona el nivel para generar las palabras o escribe la tuya
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        <button type="button"
                            className="group flex items-center justify-between p-4 rounded-2xl bg-base-100 border border-base-200/80 shadow-xs active:scale-[0.98] active:border-primary md:hover:border-primary/50 transition-transform text-left"
                            onClick={() => getFiveWords("facil")}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                                    <Smile className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-bold text-base-content text-base">Fácil</div>
                                    <div className="text-xs text-base-content/60">Palabras sencillas e intuitivas</div>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-base-content/40 group-active:text-primary transition-colors shrink-0" />
                        </button>

                        <button type="button"
                            className="group flex items-center justify-between p-4 rounded-2xl bg-base-100 border border-base-200/80 shadow-xs active:scale-[0.98] active:border-primary md:hover:border-primary/50 transition-transform text-left"
                            onClick={() => getFiveWords("medio")}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                                    <Zap className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-bold text-base-content text-base">Medio</div>
                                    <div className="text-xs text-base-content/60">Un desafío divertido y equilibrado</div>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-base-content/40 group-active:text-primary transition-colors shrink-0" />
                        </button>

                        <button type="button"
                            className="group flex items-center justify-between p-4 rounded-2xl bg-base-100 border border-base-200/80 shadow-xs active:scale-[0.98] active:border-primary md:hover:border-primary/50 transition-transform text-left"
                            onClick={() => getFiveWords("dificil")}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                                    <Flame className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-bold text-base-content text-base">Difícil</div>
                                    <div className="text-xs text-base-content/60">Para poner a prueba tu creatividad</div>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-base-content/40 group-active:text-primary transition-colors shrink-0" />
                        </button>
                    </div>

                    {/* PALABRA PERSONALIZADA EN PANTALLA INICIAL */}
                    <div className="relative flex py-1 items-center">
                        <div className="grow border-t border-base-200/80"></div>
                        <span className="shrink-0 mx-3 text-xs text-base-content/50 font-medium">O escribe la tuya</span>
                        <div className="grow border-t border-base-200/80"></div>
                    </div>

                    <div className="bg-base-100 border border-base-200/80 rounded-2xl p-4 shadow-xs space-y-3">
                        <div className="flex items-center gap-2">
                            <Edit3 className="w-4 h-4 text-primary shrink-0" />
                            <span className="text-xs font-bold text-base-content">
                                Palabra personalizada:
                            </span>
                        </div>
                        <form className="flex gap-2"
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (customWord.trim()) {
                                    setSelectedWord(customWord.trim());
                                }
                            }}
                        >
                            <input onChange={(e) => setCustomWord(e.target.value)} type="text" value={customWord} placeholder="Ej. Empanadas polvorientas de estas del bimbo mmmmmm ya no las hacen como antes vdd..." className="input input-bordered rounded-2xl w-full text-sm font-bold capitalize focus:outline-none focus:border-primary transition-transform shadow-2xs" />
                            <button type="submit" disabled={!customWord.trim()} className="btn btn-primary rounded-2xl font-bold min-h-12 text-xs px-4 shrink-0 active:scale-95 transition-transform disabled:opacity-50" >
                                Elegir
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* SELECTOR DE PALABRAS */}
            {wordsList.length > 0 && !selectedWord && (
                <div className="space-y-5">
                    <div className="flex items-center justify-between bg-base-100 px-4 py-3 rounded-2xl border border-base-200/80 shadow-xs">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-sm font-bold text-base-content capitalize">
                                Elige una palabra ({difficulty})
                            </span>
                        </div>
                        <button type="button"
                            onClick={() => getFiveWords(difficulty)}
                            className="btn btn-ghost btn-xs gap-1.5 text-xs text-primary active:scale-95 transition-transform"
                            title="Regenerar palabras"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Cambiar
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                        {wordsList.map((word, index) => (
                            <button type="button"
                                key={word}
                                onClick={() => setSelectedWord(word)}
                                className="group flex items-center justify-between p-4 bg-base-100 border border-base-200/80 active:border-primary active:bg-primary/5 md:hover:border-primary/60 rounded-2xl shadow-xs transition-transform duration-150 text-left min-h-14"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="w-6 h-6 rounded-full bg-base-200/70 text-base-content/70 flex items-center justify-center text-xs font-semibold shrink-0">
                                        {index + 1}
                                    </span>
                                    <span className="text-base font-bold text-base-content capitalize tracking-wide">
                                        {word}
                                    </span>
                                </div>
                                <span className="text-xs font-semibold text-primary opacity-90 group-active:opacity-100 flex items-center gap-1 shrink-0">
                                    Elegir
                                    <ChevronRight className="w-4 h-4" />
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* PALABRA PERSONALIZADA SI NINGUNA DE LAS GENERADAS LE GUSTA */}
                    <div className="bg-base-100 border border-base-200/80 rounded-2xl p-4 shadow-xs space-y-3">
                        <div className="flex items-center gap-2">
                            <Edit3 className="w-4 h-4 text-primary shrink-0" />
                            <span className="text-xs font-bold text-base-content">
                                ¿No te gusta ninguna? Escribe la tuya:
                            </span>
                        </div>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (customWord.trim()) {
                                    setSelectedWord(customWord.trim());
                                }
                            }}
                            className="flex gap-2"
                        >
                            <input
                                type="text"
                                value={customWord}
                                onChange={(e) => setCustomWord(e.target.value)}
                                placeholder="Escribe tu palabra personalizada..."
                                className="input input-bordered rounded-2xl w-full text-sm font-bold capitalize focus:outline-none focus:border-primary transition-transform shadow-2xs"
                            />
                            <button
                                type="submit"
                                disabled={!customWord.trim()}
                                className="btn btn-primary rounded-2xl font-bold min-h-12 text-xs px-4 shrink-0 active:scale-95 transition-transform disabled:opacity-50"
                            >
                                Elegir
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* PANTALLA PARA DIBUJAR */}
            {selectedWord && (
                <div className="space-y-4">
                    {/* BANNER DE LA PALABRA ELEGIDA */}
                    <div className="flex flex-col items-center justify-center p-3.5 bg-primary/10 rounded-2xl border border-primary/20 shadow-xs text-center">
                        <span className="text-[11px] uppercase tracking-wider font-bold text-primary/80 mb-0.5">
                            Tu palabra a dibujar
                        </span>
                        <span className="text-2xl font-extrabold text-primary capitalize tracking-wide">
                            {selectedWord}
                        </span>
                    </div>

                    {/* DRAWER */}
                    <Drawer ref={drawerRef} />

                    {/* FORM DE LAS 3 PISTAS */}
                    <form onSubmit={handleSubmit(handleSubmitGame, handleValidationError)} className="space-y-4 bg-base-100 p-4.5 rounded-2xl border border-base-200/80 shadow-xs">
                        <div className="flex items-center gap-2 pb-2.5 border-b border-base-200/60">
                            <Lightbulb className="w-4 h-4 text-primary shrink-0" />
                            <span className="text-sm font-bold text-base-content">Pistas de dibujo</span>
                            <span className="text-xs text-base-content/50 font-normal ml-auto">(mínimo 1 pista)</span>
                        </div>

                        {/* Pista 1 */}
                        <div className="form-control">
                            <label className="label pb-1.5 flex justify-between items-center">
                                <span className="label-text font-semibold text-xs text-base-content/70">
                                    Pista 1
                                </span>
                                <span className="text-[10px] text-primary font-bold">
                                    Requerida
                                </span>
                            </label>
                            <input
                                type="text"
                                className={`input input-bordered rounded-2xl w-full focus:outline-none focus:border-primary transition-transform duration-200 ${errors.hint1 ? "input-error" : ""}`}
                                placeholder="Ej. Es un animal doméstico"
                                {...register("hint1")}
                            />
                            {errors.hint1 && (
                                <label className="label pt-1 pb-0">
                                    <span className="label-text-alt text-error font-medium flex items-center gap-1">
                                        <span>⚠️</span> {errors.hint1.message}
                                    </span>
                                </label>
                            )}
                        </div>

                        {/* Pista 2 */}
                        <div className="form-control">
                            <label className="label pb-1.5 flex justify-between items-center">
                                <span className="label-text font-semibold text-xs text-base-content/70">
                                    Pista 2
                                </span>
                                <span className="text-[10px] text-base-content/40 font-medium">
                                    Opcional
                                </span>
                            </label>
                            <input
                                type="text"
                                className={`input input-bordered rounded-2xl w-full focus:outline-none focus:border-primary transition-transform duration-200 ${errors.hint2 ? "input-error" : ""}`}
                                placeholder="Ej. Le gusta cazar ratones"
                                {...register("hint2")}
                            />
                            {errors.hint2 && (
                                <label className="label pt-1 pb-0">
                                    <span className="label-text-alt text-error font-medium flex items-center gap-1">
                                        <span>⚠️</span> {errors.hint2.message}
                                    </span>
                                </label>
                            )}
                        </div>

                        {/* Pista 3 */}
                        <div className="form-control">
                            <label className="label pb-1.5 flex justify-between items-center">
                                <span className="label-text font-semibold text-xs text-base-content/70">
                                    Pista 3
                                </span>
                                <span className="text-[10px] text-base-content/40 font-medium">
                                    Opcional
                                </span>
                            </label>
                            <input
                                type="text"
                                className={`input input-bordered rounded-2xl w-full focus:outline-none focus:border-primary transition-transform duration-200 ${errors.hint3 ? "input-error" : ""}`}
                                placeholder="Ej. Hace miau"
                                {...register("hint3")}
                            />
                            {errors.hint3 && (
                                <label className="label pt-1 pb-0">
                                    <span className="label-text-alt text-error font-medium flex items-center gap-1">
                                        <span>⚠️</span> {errors.hint3.message}
                                    </span>
                                </label>
                            )}
                        </div>

                        {/* BOTON PARA GUARDAR */}
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="btn btn-primary btn-lg w-full rounded-2xl font-bold shadow-md active:scale-[0.98] transition-transform min-h-12.5 text-base gap-2 flex items-center justify-center mt-3 disabled:opacity-50"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Guardando Dibujo...
                                </>
                            ) : (
                                <>
                                    <Check className="w-5 h-5" />
                                    Guardar Dibujo
                                </>
                            )}
                        </button>

                        {errors.message && (
                            <span className="text-error text-xs text-center mt-2 font-semibold block">{errors.message}</span>
                        )}
                    </form>

                </div>
            )}
        </div>
    )
}

export function Title() {
    return (
        <h2 className="text-2xl font-black tracking-tight text-center drop-shadow-xs bg-base-100 px-5 py-2 rounded-full border border-base-200/40 shadow-2xs">
            <span className="text-red-400">N</span>
            <span className="text-orange-400">u</span>
            <span className="text-amber-400">e</span>
            <span className="text-emerald-400">v</span>
            <span className="text-sky-400">o</span>

            <span> </span>

            <span className="text-indigo-400">J</span>
            <span className="text-pink-400">u</span>
            <span className="text-red-400">e</span>
            <span className="text-orange-400">g</span>
            <span className="text-amber-400">o</span>
        </h2>
    );
}
