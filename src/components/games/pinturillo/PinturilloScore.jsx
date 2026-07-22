import React from 'react';
import { Trophy, Crown, Sparkles, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getPinturilloScores } from '@/services/games/pinturillo';
import { getUserProfile, getPartnerProfile } from '@/services/user';

export default function PinturilloScore() {
    const { data: userProfile, isLoading: isLoadingUser } = useQuery({
        queryKey: ["user-profile"],
        queryFn: getUserProfile,
    });

    const { data: partnerProfile, isLoading: isLoadingPartner } = useQuery({
        queryKey: ["partner-profile"],
        queryFn: getPartnerProfile,
    });

    const { data: scores = {}, isLoading: isLoadingScores } = useQuery({
        queryKey: ["pinturillo-scores"],
        queryFn: getPinturilloScores,
    });

    const userScore = userProfile?.id ? (scores[userProfile.id] || 0) : 0;
    const partnerScore = partnerProfile?.id ? (scores[partnerProfile.id] || 0) : 0;

    const isUserLeader = userScore > partnerScore;
    const isPartnerLeader = partnerScore > userScore;
    const isTie = userScore === partnerScore && userScore > 0;

    const isLoading = isLoadingUser || isLoadingPartner || isLoadingScores;

    if (isLoading) {
        return (
            <div className="bg-base-100 border border-base-200/80 dark:border-base-800/50 rounded-3xl p-5 shadow-xs animate-pulse">
                <div className="h-5 w-40 bg-base-200 rounded-full mx-auto mb-4" />
                <div className="grid grid-cols-2 gap-4">
                    <div className="h-24 bg-base-200 rounded-2xl" />
                    <div className="h-24 bg-base-200 rounded-2xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-base-100 border border-base-200/80 dark:border-base-800/50 rounded-3xl p-4 sm:p-5 shadow-xs space-y-4 relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-base-200/60 dark:border-base-800/60 pb-3">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-xl bg-amber-500/10 text-amber-500">
                        <Trophy className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-extrabold text-base-content tracking-tight">
                        Marcador de Adivinanzas
                    </h3>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Pareja
                </span>
            </div>

            {/* CARDS DE SCORE*/}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {/* USUARIO ACTUAL CARD*/}
                <div className={`relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border transition-transform duration-200 ${isUserLeader
                    ? "bg-amber-500/5 border-amber-500/40 shadow-xs"
                    : "bg-base-200/30 dark:bg-base-900/20 border-base-200/80 dark:border-base-800/70"
                    }`}
                >
                    {isUserLeader && (
                        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-amber-500 text-white p-1 rounded-full shadow-xs">
                            <Crown className="w-3.5 h-3.5" />
                        </div>
                    )}

                    <div className="relative mb-2">
                        {userProfile?.avatar_url ? (
                            <img className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 shadow-xs ${isUserLeader ? "border-amber-400" : "border-base-300 dark:border-base-700"}`}
                                src={userProfile.avatar_url}
                                alt={userProfile?.display_name || "Tú"}
                            />
                        ) : (
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center border-2 border-primary/30">
                                <User className="w-6 h-6" />
                            </div>
                        )}
                    </div>

                    <span className="text-xs font-bold text-base-content/90 truncate max-w-full text-center mb-1">
                        {userProfile?.display_name || "Tú"}
                    </span>

                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-primary">
                            {userScore}
                        </span>
                        <span className="text-[11px] font-medium text-base-content/60">
                            {userScore === 1 ? 'adivinado' : 'adivinados'}
                        </span>
                    </div>
                </div>

                {/* CARD DE LA PAREJA*/}
                <div className={`relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border transition-transform duration-200 ${isPartnerLeader
                    ? "bg-amber-500/5 border-amber-500/40 shadow-xs"
                    : "bg-base-200/30 dark:bg-base-900/20 border-base-200/80 dark:border-base-800/70"
                    }`}>
                    
                    {isPartnerLeader && (
                        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-amber-500 text-white p-1 rounded-full shadow-xs">
                            <Crown className="w-3.5 h-3.5" />
                        </div>
                    )}

                    <div className="relative mb-2">
                        {partnerProfile?.avatar_url ? (
                            <img
                                src={partnerProfile.avatar_url}
                                alt={partnerProfile?.display_name || "Pareja"}
                                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 shadow-xs ${isPartnerLeader ? "border-amber-400" : "border-base-300 dark:border-base-700"
                                    }`}
                            />
                        ) : (
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-secondary/10 text-secondary flex items-center justify-center border-2 border-secondary/30">
                                <User className="w-6 h-6" />
                            </div>
                        )}
                    </div>

                    <span className="text-xs font-bold text-base-content/90 truncate max-w-full text-center mb-1">
                        {partnerProfile?.display_name || "Pareja"}
                    </span>

                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-secondary">
                            {partnerScore}
                        </span>
                        <span className="text-[11px] font-medium text-base-content/60">
                            {partnerScore === 1 ? 'adivinado' : 'adivinados'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Optional Status Banner */}
            {isTie && (
                <div className="text-center text-[11px] font-semibold text-base-content/70 bg-base-200/40 py-1.5 px-3 rounded-xl border border-base-200/50">
                    ¡Empate en el juego! 🤝
                </div>
            )}
        </div>
    );
}
