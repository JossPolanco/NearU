import { MonthlyCalendar, YearlyCalendar } from "@/components";
import { touchHover, tapFeedback, mobileSpring } from "@/utils/motion";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";

const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.02,
        },
    },
};

const headerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: mobileSpring,
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 12, scale: 0.98 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: mobileSpring,
    },
};

export default function Diary() {
    const navigate = useNavigate();
    const [view, setView] = useState("monthly"); // "monthly" or "yearly"
    const [currentDate, setCurrentDate] = useState(new Date());

    return (
        <motion.div
            className={`mx-auto p-4 space-y-6 flex flex-col gap-6 transition-all duration-300 ${view === 'yearly' ? 'max-w-7xl' : 'max-w-2xl'}`}
            initial="hidden"
            animate="visible"
            variants={pageVariants}
        >
            {/* Header / Navigation */}
            <motion.div
                variants={headerVariants}
                className="relative flex items-center justify-center border-b border-base-200/90 dark:border-base-800/40 mb-2"
            >
                <motion.button
                    whileHover={touchHover({ scale: 1.05 })}
                    whileTap={tapFeedback.button}
                    type="button"
                    className="absolute left-0 btn btn-circle btn-primary text-white cursor-pointer transition-shadow shadow-xs hover:shadow-md"
                    onClick={() => navigate(-1)}
                    aria-label="Volver"
                >
                    <ArrowLeft className="w-5 h-5" />
                </motion.button>

                <div className="flex items-center justify-center py-4">
                    <Title />
                </div>
            </motion.div>

            {/* View Switcher Tabs */}
            <motion.div variants={cardVariants} className="flex justify-center">
                <div className="bg-base-200/60 dark:bg-base-900/40 p-1.5 rounded-2xl flex gap-1 border border-base-200/80 dark:border-base-800/50 shadow-xs">
                    <motion.button
                        whileTap={tapFeedback.button}
                        type="button"
                        onClick={() => setView("monthly")}
                        className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${view === "monthly"
                                ? "bg-base-100 dark:bg-base-800 text-primary shadow-xs"
                                : "text-base-content/60 active:text-primary md:hover:text-primary"
                            }`}
                    >
                        Vista Mensual
                    </motion.button>
                    <motion.button
                        whileTap={tapFeedback.button}
                        type="button"
                        onClick={() => setView("yearly")}
                        className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${view === "yearly"
                                ? "bg-base-100 dark:bg-base-800 text-secondary shadow-xs"
                                : "text-base-content/60 active:text-secondary md:hover:text-secondary"
                            }`}
                    >
                        Vista Anual
                    </motion.button>
                </div>
            </motion.div>

            {/* Selected Date Detail Card */}
            <motion.div
                variants={cardVariants}
                className="bg-base-100/40 dark:bg-base-950/15 backdrop-blur-md rounded-3xl border border-base-200/80 dark:border-base-800/40 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs"
            >
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
                <motion.button
                    whileHover={touchHover({ scale: 1.04 })}
                    whileTap={tapFeedback.button}
                    type="button"
                    onClick={() => setCurrentDate(new Date())}
                    className={`btn btn-sm rounded-xl font-extrabold text-white shrink-0 cursor-pointer shadow-xs ${view === 'yearly'
                            ? 'btn-secondary'
                            : 'btn-primary'
                        }`}
                >
                    Volver a Hoy
                </motion.button>
            </motion.div>

            {/* View Render with AnimatePresence */}
            <motion.div variants={cardVariants} className="w-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={view}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={mobileSpring}
                    >
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
                    </motion.div>
                </AnimatePresence>
            </motion.div>
        </motion.div>
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