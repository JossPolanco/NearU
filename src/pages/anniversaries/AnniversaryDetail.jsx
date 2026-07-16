import React from 'react'
import { ArrowLeft } from 'lucide-react'

export default function AnniversaryDetail() {
    return (
        <div className="max-w-2xl mx-auto p-4 space-y-6">
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
        </div>
    )
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
            <span className="text-emerald-400">A</span>
            <span className="text-sky-400">n</span>
            <span className="text-indigo-400">i</span>
            <span className="text-pink-400">v</span>
            <span className="text-red-400">e</span>
            <span className="text-orange-400">r</span>
            <span className="text-amber-400">s</span>
            <span className="text-emerald-400">a</span>
            <span className="text-sky-400">r</span>
            <span className="text-indigo-400">i</span>
            <span className="text-pink-400">o</span>
        </h2>
    );
}