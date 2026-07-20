import React from 'react'
import { ArrowLeft, Palette } from 'lucide-react'
import { useNavigate } from 'react-router'

export default function Games() {
    const navigate = useNavigate()

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

            {/* GRID PARA LOS BOTONES */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-4">

                {/* DIARIO (2C COLUMNAS DE ANCHO) */}
                <button onClick={() => navigate('/pinturillo')} className="btn btn-soft btn-primary col-span-2 min-h-35 sm:min-h-40 h-full w-full rounded-3xl p-5 flex flex-col justify-between items-start text-left group shadow-sm hover:shadow-md active:scale-[0.98] transition-all duration-200 border-none">
                    <div className="w-full flex items-center justify-between">
                        <span className="badge badge-primary badge-sm font-medium tracking-wide">
                            PINTURILLO
                        </span>
                        <div className="p-2.5 rounded-2xl bg-primary/15 text-primary group-hover:scale-110 transition-transform duration-200">
                            <Palette className="w-7 h-7" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Pinturillo</h2>
                        <p className="text-xs sm:text-sm opacity-80 line-clamp-1 font-normal">
                            Adivina la palabra con dibujos 🎨
                        </p>
                    </div>
                </button>
            </div>
        </div>
    )
}

export function Title() {
    return (
        <h2 className="text-2xl font-black tracking-tight text-center drop-shadow-xs bg-base-100 px-5 py-2 rounded-full border border-base-200/40 shadow-2xs">
            <span className="text-red-400">J</span>
            <span className="text-orange-400">u</span>
            <span className="text-amber-400">e</span>
            <span className="text-emerald-400">g</span>
            <span className="text-sky-400">u</span>
            <span className="text-indigo-400">i</span>
            <span className="text-pink-400">t</span>
            <span className="text-red-400">o</span>
            <span className="text-orange-400">s</span>
        </h2>
    );
}