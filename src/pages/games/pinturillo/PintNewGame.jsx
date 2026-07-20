import React, { useState } from 'react'
import { ArrowLeft, Sparkles, RefreshCw, Smile, Zap, Flame, ChevronRight, Check, Palette } from 'lucide-react'
import { useNavigate } from 'react-router'
import { default as words } from '../../../utils/words.json'
import Drawer from '../../../components/drawer/Drawer'

export default function PintNewGame() {
    const navigate = useNavigate()
    const [difficulty, setDifficulty] = useState("")
    const [wordsList, setWordsList] = useState([])
    const [selectedWord, setSelectedWord] = useState("")

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
        } else if (wordsList.length > 0) {
            setWordsList([])
            setDifficulty("")
        } else {
            navigate(-1)
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-6">
            {/* Header / Navigation */}
            <div className="relative flex items-center justify-center py-2 mb-2">
                <button
                    className="absolute left-0 btn btn-circle btn-primary text-white active:text-white md:hover:text-white active:bg-primary/80 md:hover:bg-primary/80 transition-all duration-200"
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
            {wordsList.length === 0 && (
                <div className="space-y-6">
                    <div className="text-center space-y-1">
                        <h1 className="text-xl font-bold text-base-content">
                            ¿Qué tan difícil quieres jugar?
                        </h1>
                        <p className="text-xs text-base-content/60">
                            Selecciona el nivel para generar las palabras
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        <button
                            className="group flex items-center justify-between p-4 rounded-2xl bg-base-100 border border-base-200/80 shadow-xs active:scale-[0.98] active:border-primary md:hover:border-primary/50 transition-all text-left"
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

                        <button
                            className="group flex items-center justify-between p-4 rounded-2xl bg-base-100 border border-base-200/80 shadow-xs active:scale-[0.98] active:border-primary md:hover:border-primary/50 transition-all text-left"
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

                        <button
                            className="group flex items-center justify-between p-4 rounded-2xl bg-base-100 border border-base-200/80 shadow-xs active:scale-[0.98] active:border-primary md:hover:border-primary/50 transition-all text-left"
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
                        <button
                            onClick={() => getFiveWords(difficulty)}
                            className="btn btn-ghost btn-xs gap-1.5 text-xs text-primary active:scale-95 transition-all"
                            title="Regenerar palabras"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Cambiar
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                        {wordsList.map((word, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedWord(word)}
                                className="group flex items-center justify-between p-4 bg-base-100 border border-base-200/80 active:border-primary active:bg-primary/5 md:hover:border-primary/60 rounded-2xl shadow-xs transition-all duration-150 text-left min-h-14"
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

                    {/* Lienzo */}
                    <Drawer />

                    {/* Botón para guardar */}
                    <button
                        type="button"
                        className="btn btn-primary btn-lg w-full rounded-2xl font-bold shadow-md active:scale-[0.98] transition-all min-h-12.5 text-base gap-2 flex items-center justify-center"
                    >
                        <Check className="w-5 h-5" />
                        Guardar Dibujo
                    </button>
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
