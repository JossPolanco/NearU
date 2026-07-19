import { MonthlyCalendar, YearlyCalendar } from "@/components";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";

export default function Diary() {
    const navigate = useNavigate();
    const [view, setView] = useState("monthly"); // "monthly" or "yearly"
    const [currentDate, setCurrentDate] = useState(new Date());

    return (
        <div className={`mx-auto p-4 space-y-6 flex flex-col gap-6 transition-all duration-300 ${view === 'yearly' ? 'max-w-7xl' : 'max-w-2xl'}`}>
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

            {/* View Switcher Tabs */}
            <div className="flex justify-center">
                <div className="bg-base-200/60 dark:bg-base-900/40 p-1.5 rounded-2xl flex gap-1 border border-base-200/80 dark:border-base-800/50">
                    <button onClick={() => setView("monthly")}
                        className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${view === "monthly"
                                ? "bg-base-100 dark:bg-base-800 text-primary shadow-sm"
                                : "text-base-content/60 active:text-primary md:hover:text-primary"
                            }`}
                    >
                        Vista Mensual
                    </button>
                    <button onClick={() => setView("yearly")}
                        className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${view === "yearly"
                                ? "bg-base-100 dark:bg-base-800 text-secondary shadow-sm"
                                : "text-base-content/60 active:text-secondary md:hover:text-secondary"
                            }`}
                    >
                        Vista Anual
                    </button>
                </div>
            </div>

            {/* Selected Date Detail Card */}
            <div className="bg-base-100/40 dark:bg-base-950/15 backdrop-blur-md rounded-3xl border border-base-200/80 dark:border-base-800/40 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
                <div className="space-y-1 text-center sm:text-left">
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider ${view === 'yearly' ? 'text-secondary/80' : 'text-primary/80'
                        }`}>
                        Fecha Seleccionada
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-base-content capitalize">
                        {currentDate.toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </h3>
                </div>
                <button
                    onClick={() => setCurrentDate(new Date())}
                    className={`btn btn-sm rounded-xl font-extrabold text-white transition-colors shrink-0 ${view === 'yearly'
                            ? 'btn-secondary active:bg-secondary/80 md:hover:bg-secondary/80'
                            : 'btn-primary active:bg-primary/80 md:hover:bg-primary/80'
                        }`}
                >
                    Volver a Hoy
                </button>
            </div>

            {/* View Render */}
            <div className="w-full">
                {view === "monthly" ? (
                    <MonthlyCalendar
                        currentDate={currentDate}
                        setCurrentDate={setCurrentDate}
                    />
                ) : (
                    <YearlyCalendar
                        currentDate={currentDate}
                        setCurrentDate={setCurrentDate}
                        onViewMonth={(date) => {
                            setCurrentDate(date);
                            setView("monthly");
                        }}
                    />
                )}
            </div>
        </div>
    );
}

export function Title() {
    return (
        <h2 className="text-3xl font-extrabold tracking-tight text-center drop-shadow-xs bg-base-100 px-4 py-1.5 rounded-full">
            <span className="text-red-400">D</span>
            <span className="text-orange-400">i</span>
            <span className="text-yellow-400">a</span>
            <span className="text-green-400">r</span>
            <span className="text-blue-400">i</span>
            <span className="text-purple-400">o</span>
        </h2>
    );
}