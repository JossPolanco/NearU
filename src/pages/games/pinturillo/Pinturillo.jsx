import React, { useState } from 'react'
import { ArrowLeft, Plus, Play, History, ChevronLeft, ChevronRight, Gamepad2, CheckCircle2, Clock } from 'lucide-react'
import { useNavigate } from 'react-router'
import { getNoResolvedDraws, getPinturilloHistory } from '@/services/games/pinturillo'
import { useQuery } from '@tanstack/react-query'
import { getPartnerProfile } from '@/services/user'
import PinturilloScore from '@/components/games/pinturillo/PinturilloScore'

export default function Pinturillo() {
    const navigate = useNavigate()
    const [historyPage, setHistoryPage] = useState(1)
    const HISTORY_LIMIT = 5

    const parseDateTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }) + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    const { data: noResolvedDraws, isLoading: isLoadingPending } = useQuery({
        queryKey: ["pinturillo-no-resolved-draws"],
        queryFn: getNoResolvedDraws,
    })

    const { data: partnerProfile } = useQuery({
        queryKey: ["partner-profile"],
        queryFn: getPartnerProfile,
    })

    const { data: historyData, isLoading: isLoadingHistory } = useQuery({
        queryKey: ["pinturillo-history", historyPage],
        queryFn: () => getPinturilloHistory({ page: historyPage, limit: HISTORY_LIMIT }),
    })

    const pastDraws = historyData?.draws || []
    const totalPages = historyData?.totalPages || 1

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-6 pb-12">
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

            {/* SCORE COMPONENT */}
            <PinturilloScore />

            {/* NUEVA PARTIDA */}
            <div className="pt-1">
                <button
                    className="btn btn-primary btn-lg w-full rounded-2xl font-extrabold shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 min-h-14 text-base"
                    onClick={() => navigate('/pinturillo/newgame')}
                >
                    <Plus className="w-5 h-5 stroke-[2.5]" />
                    <span>Nueva Partida</span>
                </button>
            </div>

            {/* JUEGOS PENDIENTES */}
            <div className="bg-base-100 border border-base-200/80 dark:border-base-800/50 rounded-3xl p-4 sm:p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-base-200/60 pb-3">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-xl bg-primary/10 text-primary">
                            <Gamepad2 className="w-4 h-4" />
                        </div>
                        <h3 className="text-sm font-extrabold text-base-content tracking-tight">
                            Juegos Pendientes
                        </h3>
                    </div>
                    {noResolvedDraws?.length > 0 && (
                        <span className="badge badge-primary font-bold text-xs">
                            {noResolvedDraws.length}
                        </span>
                    )}
                </div>

                {isLoadingPending ? (
                    <div className="py-6 flex flex-col items-center justify-center gap-2 text-base-content/50">
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs font-medium">Cargando partidas pendientes...</span>
                    </div>
                ) : noResolvedDraws && noResolvedDraws.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3">
                        {noResolvedDraws.map((draw) => (
                            <button
                                key={draw.id}
                                onClick={() => navigate(`/pinturillo/play/${draw.id}`)}
                                className="group w-full flex items-center justify-between p-3.5 rounded-2xl bg-base-200/40 dark:bg-base-900/20 border border-base-200/80 dark:border-base-800/60 hover:bg-base-200/80 active:bg-base-300/60 active:scale-[0.99] transition-all text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        {partnerProfile?.avatar_url ? (
                                            <img
                                                className="h-11 w-11 rounded-full object-cover border-2 border-primary/30 shadow-2xs"
                                                src={partnerProfile.avatar_url}
                                                alt={partnerProfile?.display_name || "Pareja"}
                                            />
                                        ) : (
                                            <div className="h-11 w-11 rounded-full bg-primary/10 text-primary flex items-center justify-center border-2 border-primary/20 font-bold">
                                                {partnerProfile?.display_name?.charAt(0) || "P"}
                                            </div>
                                        )}
                                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-base-100" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <span className="text-xs font-bold text-base-content block">
                                            {partnerProfile?.display_name || "Tu pareja"} te retó
                                        </span>
                                        <div className="flex items-center gap-1 text-[11px] font-medium text-base-content/60">
                                            <Clock className="w-3 h-3 text-base-content/40" />
                                            <span>{parseDateTime(draw.created_at)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="btn btn-sm btn-primary rounded-xl font-bold gap-1 shadow-2xs group-hover:shadow-xs">
                                    <Play className="w-3.5 h-3.5 fill-current" />
                                    <span>Adivinar</span>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="py-6 text-center space-y-1">
                        <p className="text-xs font-semibold text-base-content/60">
                            No hay partidas pendientes mi vira
                        </p>
                        <p className="text-[11px] text-base-content/40">
                            Crea una partida para que yo adivine mi amor
                        </p>
                    </div>
                )}
            </div>

            {/* SECCION DEL HISTORIAL */}
            <div className="bg-base-100 border border-base-200/80 dark:border-base-800/50 rounded-3xl p-4 sm:p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-base-200/60 pb-3">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-xl bg-secondary/10 text-secondary">
                            <History className="w-4 h-4" />
                        </div>
                        <h3 className="text-sm font-extrabold text-base-content tracking-tight">
                            Historial de Partidas Anteriores
                        </h3>
                    </div>
                </div>

                {isLoadingHistory ? (
                    <div className="py-6 flex flex-col items-center justify-center gap-2 text-base-content/50">
                        <div className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs font-medium">Cargando historial...</span>
                    </div>
                ) : pastDraws.length > 0 ? (
                    <div className="space-y-3">
                        <div className="grid grid-cols-1 gap-2.5">
                            {pastDraws.map((draw) => (
                                <button
                                    key={draw.id}
                                    onClick={() => navigate(`/pinturillo/play/${draw.id}`)}
                                    className="group w-full flex items-center justify-between p-3 sm:p-3.5 rounded-2xl bg-base-200/30 dark:bg-base-900/20 border border-base-200/80 dark:border-base-800/60 hover:bg-base-200/70 active:bg-base-300/60 active:scale-[0.99] transition-all text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-black uppercase tracking-wider text-base-content">
                                                    {draw.secret_word || "Completado"}
                                                </span>
                                                <span className="badge badge-xs badge-success font-bold text-[10px] px-1.5">
                                                    Resuelto
                                                </span>
                                            </div>
                                            <div className="text-[11px] font-medium text-base-content/60">
                                                {parseDateTime(draw.solved_at || draw.created_at)}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-primary group-hover:underline shrink-0">
                                        Ver →
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* CONTROLES DE PAGINACION */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between pt-2 border-t border-base-200/60 dark:border-base-800/60">
                                <button onClick={() => setHistoryPage((prev) => Math.max(prev - 1, 1))} disabled={historyPage <= 1} className="btn btn-xs sm:btn-sm btn-ghost rounded-xl font-bold gap-1 disabled:opacity-40" >
                                    <ChevronLeft className="w-4 h-4" />
                                    <span>Anterior</span>
                                </button>

                                <span className="text-xs font-semibold text-base-content/70">
                                    Página {historyPage} de {totalPages}
                                </span>

                                <button onClick={() => setHistoryPage((prev) => Math.min(prev + 1, totalPages))} disabled={historyPage >= totalPages} className="btn btn-xs sm:btn-sm btn-ghost rounded-xl font-bold gap-1 disabled:opacity-40" >
                                    <span>Siguiente</span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="py-6 text-center space-y-1">
                        <p className="text-xs font-semibold text-base-content/60">
                            Aún no hay partidas en el historial mi amor
                        </p>
                        <p className="text-[11px] text-base-content/40">
                            Las partidas resueltas aparecerán aquí
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export function Title() {
    return (
        <h2 className="text-2xl font-black tracking-tight text-center drop-shadow-xs bg-base-100 px-5 py-2 rounded-full border border-base-200/40 shadow-2xs">
            <span className="text-red-400">P</span>
            <span className="text-orange-400">i</span>
            <span className="text-amber-400">n</span>
            <span className="text-emerald-400">t</span>
            <span className="text-sky-400">u</span>
            <span className="text-indigo-400">r</span>
            <span className="text-pink-400">i</span>
            <span className="text-red-400">l</span>
            <span className="text-orange-400">l</span>
            <span className="text-amber-400">o</span>
        </h2>
    );
}