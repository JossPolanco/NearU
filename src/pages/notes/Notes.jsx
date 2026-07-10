import { ArrowLeft, Plus, Loader2, CalendarHeart, Calendar } from "lucide-react";
import { useNavigate } from 'react-router';
import React from 'react'


export default function Notes() {
    const navigate = useNavigate();

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-6">
            {/* Header / Navigation */}
            <div className="relative flex items-center justify-center py-2 border-b border-base-200/90 dark:border-base-800/40 mb-2">
                <button className="absolute left-0 btn btn-circle btn-primary text-white active:text-white md:hover:text-white active:bg-primary/80 md:hover:bg-primary/80 transition-all duration-200"
                    onClick={() => navigate(-1)}
                    aria-label="Volver"
                >
                    <ArrowLeft className="w-6 h-6" />
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
        <h2 className="text-2xl font-bold text-center">
            <span className="text-red-500">❤️</span>
            <span className="text-orange-500">N</span>
            <span className="text-yellow-400">O</span>
            <span className="text-green-500">T</span>
            <span className="text-cyan-400">A</span>
            <span className="text-violet-500">S</span>
            <span className="text-pink-500">❤️</span>
        </h2>
    )
}