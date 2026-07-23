import { ArrowLeft, Lightbulb, Eye, EyeOff, Send, Sparkles, Trophy, HelpCircle, CheckCircle2, XCircle, Loader2, ZoomIn, Palette, History, X} from 'lucide-react';
import { useResolveSignedUrls } from '../../../hooks/images/useResolveSignedUrls';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createGuess, getGameGuesses, getPinturilloGame, updateGameStatus } from '@/services/games/pinturillo';
import { useParams, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

// Ráfaga principal de confeti
const triggerConfetti = () => {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    })
    // Ráfagas laterales de confeti
    setTimeout(() => {
        confetti({
            particleCount: 40,
            angle: 60,
            spread: 55,
            origin: { x: 0.1, y: 0.6 }
        })
        confetti({
            particleCount: 40,
            angle: 120,
            spread: 55,
            origin: { x: 0.9, y: 0.6 }
        })
    }, 250)
}

export default function PinturilloGuess() {
    const { id } = useParams()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const [hint1Shown, setHint1Shown] = useState(false)
    const [hint2Shown, setHint2Shown] = useState(false)
    const [hint3Shown, setHint3Shown] = useState(false)

    const [userWord, setUserWord] = useState("")
    const [isWon, setIsWon] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [isZoomOpen, setIsZoomOpen] = useState(false)

    // HACE FETCH A LA INFORMACIÓN DE LA PARTIDA Y RESUELVE LA URL DE LA IMAGEN
    const { data: game, isLoading: isLoadingGame } = useResolveSignedUrls(
        ["pinturillo-guess", id],
        async () => {
            const res = await getPinturilloGame(id)
            return [res]
        },
        {
            select: (data) => data?.[0]
        }
    )

    // HACE FETCH A LOS INTENTOS PREVIOS DE LA PARTIDA
    const { data: pastGuesses = [], isLoading: isLoadingGuesses } = useQuery({
        queryKey: ['pinturillo-guesses', id],
        queryFn: () => getGameGuesses(id),
        enabled: !!id,
    })

    // VERIFICA SI LA PARTIDA YA HA SIDO GANADA
    useEffect(() => {
        if (pastGuesses && pastGuesses.length > 0) {
            const hasCorrect = pastGuesses.some(g => g.correct)
            if (hasCorrect) {
                setIsWon(true)
            }
        }
    }, [pastGuesses])

    // MUTACIÓN PARA ENVIAR EL INTENTO
    const createGuessMutation = useMutation({
        mutationFn: createGuess,
        onSuccess: async (data, variables) => {
            // INVALIDA LAS QUERIES
            queryClient.invalidateQueries({ queryKey: ['pinturillo-guesses', id] })
            queryClient.invalidateQueries({ queryKey: ['pinturillo-no-resolved-draws'] })
            queryClient.invalidateQueries({ queryKey: ['pinturillo-guess', id] })

            if (variables.isCorrect) {
                try {
                    await updateGameStatus(id, 'solved')
                } catch (error) {
                    console.error("Error al actualizar el estado del juego:", error)
                }
                setIsWon(true)
                setErrorMessage("")
                triggerConfetti()
            } else {
                setErrorMessage(`"${variables.guess}" no es la palabra correcta. ¡Sigue intentando!`)
                setUserWord("")
            }
        },
        onError: (error) => {
            console.error("Error al guardar el intento:", error)
            setErrorMessage("Ocurrió un error al enviar tu respuesta. Inténtalo de nuevo.")
        }
    })

    // HANDLER DE ENVÍO DE INTENTOS
    const handleGuessSubmit = async (e) => {
        e.preventDefault()
        const trimmedGuess = userWord.trim()
        if (!trimmedGuess || createGuessMutation.isPending || isWon) return

        const secret = game?.secret_word?.trim().toLowerCase() || ""
        const isCorrect = trimmedGuess.toLowerCase() === secret
        const currentAttempt = pastGuesses.length + 1

        createGuessMutation.mutate({
            gameId: id,
            guess: trimmedGuess,
            isCorrect,
            attempt: currentAttempt
        })
    }

    // VERIFICA SI HAY PISTAS DISPONIBLES
    const hasHint1 = Boolean(game?.hint_1 && game.hint_1.trim())
    const hasHint2 = Boolean(game?.hint_2 && game.hint_2.trim())
    const hasHint3 = Boolean(game?.hint_3 && game.hint_3.trim())

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-6 pb-12">
            {/* Header / Navigation */}
            <div className="relative flex items-center justify-center border-b border-base-200/90 dark:border-base-800/40 pb-3 mb-2">
                <button type="button"
                    className="absolute left-0 btn btn-circle btn-primary text-white active:text-white md:hover:text-white active:bg-primary/80 md:hover:bg-primary/80 transition-transform duration-200"
                    onClick={() => navigate('/pinturillo')}
                    aria-label="Volver"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center justify-center">
                    <Title />
                </div>
            </div>

            {/* DIBUJO CARD */}
            <div className="bg-base-100 border border-base-200/80 dark:border-base-800/50 rounded-3xl p-4 shadow-xs space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-base-200/60 pb-2">
                    <div className="flex items-center gap-2">
                        <Palette className="w-4 h-4 text-primary shrink-0" />
                        <span className="text-sm font-bold text-base-content">
                            Dibujo misterioso
                        </span>
                    </div>
                    {pastGuesses.length > 0 && (
                        <span className="badge badge-subtle badge-primary font-bold text-xs gap-1">
                            <History className="w-3 h-3" />
                            {pastGuesses.length} {pastGuesses.length === 1 ? 'intento' : 'intentos'}
                        </span>
                    )}
                </div>

                {isLoadingGame ? (
                    <div className="w-full h-64 sm:h-80 bg-base-200/60 rounded-2xl animate-pulse flex flex-col items-center justify-center gap-2">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        <span className="text-xs text-base-content/60 font-medium">Cargando dibujo...</span>
                    </div>
                ) : (
                    <div className="flex justify-center w-full">
                        <div className="relative group inline-flex items-center justify-center rounded-2xl overflow-hidden bg-base-200/30 dark:bg-base-900/30 p-1.5 border border-base-200/80 dark:border-base-800/80 shadow-xs transition-transform duration-300 hover:shadow-md">
                            <img
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setIsZoomOpen(true); } }}
                                src={game?.coverUrl}
                                alt="Dibujo de Pinturillo"
                                className="max-h-85 sm:max-h-105 w-auto max-w-full h-auto object-contain rounded-xl transition-transform duration-300 group-hover:scale-[1.01] cursor-pointer"
                                onClick={() => setIsZoomOpen(true)}
                            />
                            <button type="button"
                                onClick={() => setIsZoomOpen(true)}
                                className="absolute bottom-3 right-3 btn btn-circle btn-sm bg-base-100/90 dark:bg-base-800/90 text-base-content hover:bg-base-100 dark:hover:bg-base-800 shadow-md border border-base-200/60 dark:border-base-700/60 active:scale-95 transition-transform opacity-85 group-hover:opacity-100"
                                title="Ampliar imagen"
                            >
                                <ZoomIn className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL ZOOM DIBUJO */}
            {isZoomOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <button type="button" aria-label="Cerrar vista ampliada" className="fixed inset-0 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200" onClick={() => setIsZoomOpen(false)} />
                    <div className="relative z-10 max-w-4xl w-full max-h-[90vh] bg-base-100 rounded-3xl p-3 sm:p-5 shadow-2xl border border-base-200/20 flex flex-col items-center justify-center">
                        <button type="button"
                            onClick={() => setIsZoomOpen(false)}
                            aria-label="Cerrar dibujo ampliado"
                            className="absolute top-3 right-3 btn btn-circle btn-sm btn-ghost text-base-content/70 hover:bg-base-200"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <img
                            src={game?.coverUrl}
                            alt="Dibujo Pinturillo Ampliado"
                            className="max-h-[80vh] w-full object-contain rounded-2xl"
                        />
                    </div>
                </div>
            )}

            {/* PISTAS CARD */}
            <div className="bg-base-100 border border-base-200/80 dark:border-base-800/50 rounded-2xl p-4 shadow-xs space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-base-200/60">
                    <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="text-sm font-bold text-base-content">Pistas disponibles</span>
                    <span className="text-[11px] text-base-content/50 ml-auto font-normal">
                        Toca para revelar
                    </span>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                    {/* PISTA 1 */}
                    {hasHint1 ? (
                        <button
                            type="button"
                            onClick={() => setHint1Shown(!hint1Shown)}
                            className={`w-full flex flex-col p-3 rounded-2xl border transition-transform duration-200 text-left ${
                                hint1Shown
                                    ? "bg-amber-500/10 border-amber-500/30 text-base-content"
                                    : "bg-base-100 border-base-200/80 active:bg-base-200/60 active:border-primary"
                            }`}
                        >
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-2 text-xs font-bold text-base-content/80">
                                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                                    <span>Pista 1</span>
                                </div>
                                <span className="text-xs font-semibold text-primary flex items-center gap-1.5 shrink-0">
                                    {hint1Shown ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                    {hint1Shown ? "Ocultar" : "Mostrar"}
                                </span>
                            </div>
                            {hint1Shown && (
                                <div className="mt-2.5 text-sm font-semibold text-base-content/90 bg-base-100/90 p-3 rounded-xl border border-amber-500/20 shadow-2xs">
                                    {game.hint_1}
                                </div>
                            )}
                        </button>
                    ) : (
                        <button
                            type="button"
                            disabled
                            className="w-full flex items-center justify-between p-3 rounded-2xl bg-base-200/40 text-base-content/40 cursor-not-allowed border border-base-200/40 opacity-60"
                        >
                            <div className="flex items-center gap-2 text-xs font-medium">
                                <HelpCircle className="w-4 h-4 shrink-0" />
                                <span>Pista 1</span>
                            </div>
                            <span className="text-[11px] italic font-medium">Sin pista</span>
                        </button>
                    )}

                    {/* PISTA 2 */}
                    {hasHint2 ? (
                        <button
                            type="button"
                            onClick={() => setHint2Shown(!hint2Shown)}
                            className={`w-full flex flex-col p-3 rounded-2xl border transition-transform duration-200 text-left ${
                                hint2Shown
                                    ? "bg-amber-500/10 border-amber-500/30 text-base-content"
                                    : "bg-base-100 border-base-200/80 active:bg-base-200/60 active:border-primary"
                            }`}
                        >
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-2 text-xs font-bold text-base-content/80">
                                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                                    <span>Pista 2</span>
                                </div>
                                <span className="text-xs font-semibold text-primary flex items-center gap-1.5 shrink-0">
                                    {hint2Shown ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                    {hint2Shown ? "Ocultar" : "Mostrar"}
                                </span>
                            </div>
                            {hint2Shown && (
                                <div className="mt-2.5 text-sm font-semibold text-base-content/90 bg-base-100/90 p-3 rounded-xl border border-amber-500/20 shadow-2xs">
                                    {game.hint_2}
                                </div>
                            )}
                        </button>
                    ) : (
                        <button
                            type="button"
                            disabled
                            className="w-full flex items-center justify-between p-3 rounded-2xl bg-base-200/40 text-base-content/40 cursor-not-allowed border border-base-200/40 opacity-60"
                        >
                            <div className="flex items-center gap-2 text-xs font-medium">
                                <HelpCircle className="w-4 h-4 shrink-0" />
                                <span>Pista 2</span>
                            </div>
                            <span className="text-[11px] italic font-medium">Sin pista</span>
                        </button>
                    )}

                    {/* PISTA 3 */}
                    {hasHint3 ? (
                        <button
                            type="button"
                            onClick={() => setHint3Shown(!hint3Shown)}
                            className={`w-full flex flex-col p-3 rounded-2xl border transition-transform duration-200 text-left ${
                                hint3Shown
                                    ? "bg-amber-500/10 border-amber-500/30 text-base-content"
                                    : "bg-base-100 border-base-200/80 active:bg-base-200/60 active:border-primary"
                            }`}
                        >
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-2 text-xs font-bold text-base-content/80">
                                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                                    <span>Pista 3</span>
                                </div>
                                <span className="text-xs font-semibold text-primary flex items-center gap-1.5 shrink-0">
                                    {hint3Shown ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                    {hint3Shown ? "Ocultar" : "Mostrar"}
                                </span>
                            </div>
                            {hint3Shown && (
                                <div className="mt-2.5 text-sm font-semibold text-base-content/90 bg-base-100/90 p-3 rounded-xl border border-amber-500/20 shadow-2xs">
                                    {game.hint_3}
                                </div>
                            )}
                        </button>
                    ) : (
                        <button
                            type="button"
                            disabled
                            className="w-full flex items-center justify-between p-3 rounded-2xl bg-base-200/40 text-base-content/40 cursor-not-allowed border border-base-200/40 opacity-60"
                        >
                            <div className="flex items-center gap-2 text-xs font-medium">
                                <HelpCircle className="w-4 h-4 shrink-0" />
                                <span>Pista 3</span>
                            </div>
                            <span className="text-[11px] italic font-medium">Sin pista</span>
                        </button>
                    )}
                </div>
            </div>

            {/* VICTORIA O FORMULARIO DE INTENTOS */}
            {isWon ? (
                <div className="bg-base-100/80 border border-emerald-500/30 rounded-3xl p-6 text-center space-y-4 shadow-sm animate-in zoom-in-95 duration-300">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 mx-auto flex items-center justify-center">
                        <Trophy className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                            ¡Felicidades! 🎉
                        </h3>
                        <p className="text-xs text-base-content/70 font-medium">
                            Has adivinado la palabra secreta
                        </p>
                    </div>

                    <div className="inline-block px-5 py-2.5 bg-base-100 rounded-2xl border border-emerald-500/30 shadow-xs">
                        <span className="text-2xl font-black text-primary uppercase tracking-widest">
                            {game?.secret_word}
                        </span>
                    </div>

                    <p className="text-xs text-base-content/60 font-semibold">
                        Logrado en {pastGuesses.length} {pastGuesses.length === 1 ? 'intento' : 'intentos'}
                    </p>

                    <button type="button"
                        onClick={() => navigate('/pinturillo')}
                        className="btn btn-primary btn-lg w-full rounded-2xl font-bold shadow-md active:scale-[0.98] transition-transform"
                    >
                        Volver a partidas
                    </button>
                </div>
            ) : (
                <form onSubmit={handleGuessSubmit} className="bg-base-100 border border-base-200/80 dark:border-base-800/50 rounded-2xl p-4 shadow-xs space-y-4">
                    <div className="form-control space-y-2">
                        <label className="label pb-0">
                            <span className="label-text font-bold text-xs text-base-content/80">
                                Tu respuesta:
                            </span>
                        </label>
                        <input
                            type="text"
                            value={userWord}
                            onChange={(e) => {
                                setUserWord(e.target.value)
                                if (errorMessage) setErrorMessage("")
                            }}
                            placeholder="Escribe la palabra aquí..."
                            disabled={createGuessMutation.isPending || isLoadingGame}
                            className="input input-bordered rounded-2xl w-full text-center text-lg font-bold uppercase tracking-wider focus:outline-none focus:border-primary transition-transform shadow-2xs placeholder:normal-case placeholder:font-normal placeholder:tracking-normal placeholder:text-base-content/40 min-h-12"
                        />
                    </div>

                    {errorMessage && (
                        <div className="alert alert-error text-xs rounded-2xl shadow-2xs py-2.5 px-3 flex items-center gap-2">
                            <XCircle className="w-4 h-4 shrink-0" />
                            <span className="font-medium">{errorMessage}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={!userWord.trim() || createGuessMutation.isPending || isLoadingGame}
                        className="btn btn-primary btn-lg w-full rounded-2xl font-bold shadow-md active:scale-[0.98] transition-transform min-h-12 text-base flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {createGuessMutation.isPending ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Comprobando...
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                                Adivinar
                            </>
                        )}
                    </button>
                </form>
            )}

            {/* HISTORIAL DE INTENTOS */}
            {pastGuesses.length > 0 && (
                <div className="bg-base-100 border border-base-200/80 dark:border-base-800/50 rounded-2xl p-4 shadow-xs space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-base-200/60">
                        <History className="w-4 h-4 text-base-content/70 shrink-0" />
                        <span className="text-xs font-bold text-base-content">
                            Historial de intentos ({pastGuesses.length})
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {pastGuesses.map((item, idx) => (
                            <div
                                key={item.id || idx}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold ${
                                    item.correct
                                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                                        : "bg-base-200/60 border-base-200/80 text-base-content/70"
                                }`}
                            >
                                {item.correct ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                ) : (
                                    <XCircle className="w-3.5 h-3.5 text-error shrink-0" />
                                )}
                                <span>#{item.attempt || idx + 1}:</span>
                                <span className="capitalize">{item.guess}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export function Title() {
    return (
        <h2 className="text-2xl font-black tracking-tight text-center drop-shadow-xs bg-base-100 px-5 py-2 rounded-full border border-base-200/40 shadow-2xs">
            <span className="text-red-400">A</span>
            <span className="text-orange-400">d</span>
            <span className="text-amber-400">i</span>
            <span className="text-emerald-400">v</span>
            <span className="text-sky-400">i</span>
            <span className="text-indigo-400">n</span>
            <span className="text-pink-400">a</span>
        </h2>
    );
}

