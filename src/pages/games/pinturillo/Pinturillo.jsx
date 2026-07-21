import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router'
import { getNoResolvedDraws } from '@/services/games/pinturillo'
import { useQuery } from '@tanstack/react-query'
import { getPartnerProfile } from '@/services/user'

export default function Pinturillo() {
    const navigate = useNavigate()

    const parseDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    const { data: noResolvedDraws, isLoading } = useQuery({
        queryKey: ["pinturillo-no-resolved-draws"],
        queryFn: getNoResolvedDraws,
    })

    const { data: userProfile } = useQuery({
        queryKey: ["user-profile"],
        queryFn: getPartnerProfile,
    })

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

            <div className='grid grid-cols-1 gap-4 mt-10'>
                <button className='btn btn-soft btn-primary'>Juegos anteriores</button>
                <button className='btn btn-primary' onClick={() => navigate('/pinturillo/newgame')}>Nueva partida</button>
            </div>

            { !isLoading && noResolvedDraws?.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 mt-10">
                        <h1>Juegos pendientes</h1>
                        {noResolvedDraws.map((draw) => (
                            <button key={draw.id} className='btn btn-soft btn-primary' onClick={() => navigate(`/pinturillo/play/${draw.id}`)}>
                                <div className='flex flex-row items-center gap-4'>
                                    {parseDateTime(draw.created_at)}
                                    {userProfile.display_name}
                                    <img className='h-12 w-12' src={userProfile.avatar_url} alt="" />
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center py-4">
                        <p className="text-base-content/70">No hay partidas disponibles</p>
                    </div>
                )}
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