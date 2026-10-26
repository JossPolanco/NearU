import { ArrowLeft, BookHeart, Heart, Sparkles } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { touchHover, tapFeedback, mobileSpring } from "@/utils/motion";

const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.05,
        },
    },
};

const headerVariants = {
    hidden: { opacity: 0, y: -12 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 380,
            damping: 28,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 16, scale: 0.98 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 360,
            damping: 26,
        },
    },
};

export default function Letters() {
    const navigate = useNavigate();

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={pageVariants}
            className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6 pb-24"
        >
            {/* Header / Navigation */}
            <motion.div
                variants={headerVariants}
                className="relative flex items-center justify-center border-b border-base-200/90 dark:border-base-800/40 pb-4 mb-2"
            >
                <motion.button
                    type="button"
                    whileHover={touchHover({ scale: 1.08 })}
                    whileTap={tapFeedback.icon}
                    transition={mobileSpring}
                    className="absolute left-0 btn btn-circle btn-primary text-white active:bg-primary/80"
                    onClick={() => navigate(-1)}
                    aria-label="Volver"
                >
                    <ArrowLeft className="w-5 h-5" />
                </motion.button>
                <Title />
            </motion.div>

            {/* Grid para los botones */}
            <div className="grid grid-cols-2 gap-3.5 sm:gap-4">

                {/* 6 MESESOTES (2 COLUMNAS DE ANCHO - RESALTADO Y ESPECIAL) */}
                <motion.button
                    type="button"
                    variants={cardVariants}
                    whileHover={touchHover({ y: -3, scale: 1.015 })}
                    whileTap={tapFeedback.card}
                    transition={mobileSpring}
                    onClick={() => navigate('/letters/sixthmonth')}
                    className="btn btn-soft btn-secondary col-span-2 min-h-36 sm:min-h-40 h-full w-full rounded-3xl p-5 sm:p-6 flex flex-col justify-between items-start text-left group shadow-sm hover:shadow-md border-2 border-secondary/40 relative overflow-hidden"
                >
                    <div className="w-full flex items-center justify-between">
                        <span className="badge badge-secondary badge-sm font-semibold tracking-wide gap-1">
                            6 MESESOTES
                        </span>
                        <div className="p-2.5 rounded-2xl bg-secondary/20 text-secondary group-hover:scale-110 active:scale-95 transition-transform duration-200">
                            <Heart className="w-7 h-7 fill-secondary animate-pulse" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-base-content">
                            Six Mesesotes Mi Viraa 🥺
                        </h2>
                        <p className="text-xs sm:text-sm opacity-80 font-normal mt-0.5 line-clamp-1">
                            Medio año siendo wovios, para mi personita favorita 💕
                        </p>
                    </div>
                </motion.button>

                {/* DÍA DE LA NOVIA (1 COLUMNA DE ANCHO) */}
                <motion.button
                    type="button"
                    variants={cardVariants}
                    whileHover={touchHover({ y: -3, scale: 1.02 })}
                    whileTap={tapFeedback.card}
                    transition={mobileSpring}
                    onClick={() => navigate('/girlfriendsday')}
                    className="btn btn-soft btn-primary col-span-1 min-h-44 sm:min-h-48 h-full w-full rounded-3xl p-4 flex flex-col justify-between items-start text-left group shadow-sm hover:shadow-md border-none"
                >
                    <div className="w-full flex items-center justify-between">
                        <span className="badge badge-primary badge-xs font-medium">01/08</span>
                        <div className="p-2.5 rounded-2xl bg-primary/15 text-primary group-hover:scale-110 transition-transform duration-200">
                            <Sparkles className="w-6 h-6" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-base sm:text-lg font-bold tracking-tight">Día de la Novia</h3>
                        <p className="text-[11px] sm:text-xs opacity-75 font-normal mt-0.5 line-clamp-2">
                            Para recordarte lo perfecta que eres 😚
                        </p>
                    </div>
                </motion.button>

                {/* 2DO MES (1 COLUMNA DE ANCHO) */}
                <motion.button
                    type="button"
                    variants={cardVariants}
                    whileHover={touchHover({ y: -3, scale: 1.02 })}
                    whileTap={tapFeedback.card}
                    transition={mobileSpring}
                    onClick={() => navigate('/anniversary')}
                    className="btn btn-soft btn-accent col-span-1 min-h-44 sm:min-h-48 h-full w-full rounded-3xl p-4 flex flex-col justify-between items-start text-left group shadow-sm hover:shadow-md border-none"
                >
                    <div className="w-full flex items-center justify-between">
                        <span className="badge badge-accent badge-xs font-medium">2 Meses</span>
                        <div className="p-2.5 rounded-2xl bg-accent/15 text-accent group-hover:scale-110 transition-transform duration-200">
                            <BookHeart className="w-6 h-6" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-base sm:text-lg font-bold tracking-tight">2do Mes</h3>
                        <p className="text-[11px] sm:text-xs opacity-75 font-normal mt-0.5 line-clamp-2">
                            Nuestros primeros pasitos juntos ✨
                        </p>
                    </div>
                </motion.button>

            </div>
        </motion.div>
    );
}

export function Title() {
    return (
        <h2 className="text-2xl font-black tracking-tight text-center drop-shadow-xs bg-base-100 px-5 py-2 rounded-full border border-base-200/40 shadow-2xs">
            <span className="text-red-400">C</span>
            <span className="text-orange-400">a</span>
            <span className="text-amber-400">r</span>
            <span className="text-emerald-400">t</span>
            <span className="text-sky-400">i</span>
            <span className="text-indigo-400">t</span>
            <span className="text-pink-400">a</span>
            <span className="text-rose-400">s</span>
        </h2>
    );
}