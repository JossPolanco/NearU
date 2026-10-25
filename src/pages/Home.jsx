import { BookHeart, CalendarHeart, StickyNote, CheckSquare, Sparkles, MapPin, Palette, FlaskConical, Settings, Heart, RotateCw, X, Mail } from 'lucide-react';
import { getUserPosition } from '@/utils/geolocation';
import { UserMoodCard } from '@/components';
import { useNavigate } from 'react-router';
import confetti from 'canvas-confetti';
import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import razones from '@/utils/razones.json';

var heart = confetti.shapeFromPath({
    path: 'M167 72c19,-38 37,-56 75,-56 42,0 76,33 76,75 0,76 -76,151 -151,227 -76,-76 -151,-151 -151,-227 0,-42 33,-75 75,-75 38,0 57,18 76,56z',
    matrix: [0.03333333333333333, 0, 0, 0.03333333333333333, -5.566666666666666, -5.533333333333333]
});

const COLORS = [
    "#FF6B9A", // Rosa chicle
    "#FF8FAB", // Rosa pastel intenso
    "#F472B6", // Pink 400
    "#EC4899", // Fucsia suave
    "#FB7185", // Coral rosado
    "#F59E8B", // Salmón
    "#FDBA74", // Durazno
    "#FACC15", // Amarillo cálido
    "#86EFAC", // Verde menta
    "#6EE7B7", // Turquesa pastel
    "#67E8F9", // Cian pastel
    "#7DD3FC", // Azul cielo
    "#93C5FD", // Azul pastel
    "#A5B4FC", // Índigo pastel
    "#C4B5FD", // Lavanda
    "#D8B4FE", // Lila
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.09,
            delayChildren: 0.04,
        },
    },
};

const headerVariants = {
    hidden: { opacity: 0, y: -22, scale: 0.98 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 280,
            damping: 24,
        },
    },
};

const moodVariants = {
    hidden: { opacity: 0, y: 16, scale: 0.98 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 280,
            damping: 24,
        },
    },
};

const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.06,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 22, scale: 0.94 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 280,
            damping: 22,
        },
    },
};

export default function Home() {
    const navigate = useNavigate();
    const [razonActual, setRazonActual] = useState(null);
    const [timeLeft, setTimeLeft] = useState(20);
    const timerRef = useRef(null);
    const progressIntervalRef = useRef(null);

    useEffect(() => {
        getUserPosition();
    }, []);

    const cerrarRazon = useCallback(() => {
        setRazonActual(null);
        if (timerRef.current) clearTimeout(timerRef.current);
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    }, []);

    const obtenerRazonAleatoria = useCallback(() => {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 }, shapes: [heart], colors: [COLORS] });

        if (timerRef.current) clearTimeout(timerRef.current);
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

        const index = Math.floor(Math.random() * razones.length);
        setRazonActual(razones[index]);
        setTimeLeft(20);

        const startTime = Date.now();
        const DURATION = 20000;

        timerRef.current = setTimeout(() => {
            setRazonActual(null);
        }, DURATION);

        progressIntervalRef.current = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, Math.ceil((DURATION - elapsed) / 1000));
            setTimeLeft(remaining);
            if (elapsed >= DURATION) {
                clearInterval(progressIntervalRef.current);
            }
        }, 200);
    }, []);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        };
    }, []);

    return (
        <motion.div
            className="max-w-3xl mx-auto p-4 sm:p-6 space-y-5 pb-20"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* HEADER / BANNER DE LA APP */}
            <motion.div
                variants={headerVariants}
                className="relative overflow-hidden rounded-3xl bg-linear-to-r from-primary/15 via-secondary/10 to-accent/15 border border-primary/20 p-5 sm:p-6 shadow-sm"
            >
                <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center gap-4">
                    <motion.div
                        className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0 text-primary shadow-inner"
                        whileHover={{ rotate: [0, -10, 10, -5, 5, 0], scale: 1.08 }}
                        transition={{ duration: 0.45 }}
                    >
                        <Heart className="w-6 h-6 fill-primary animate-pulse" />
                    </motion.div>
                    <div className="space-y-0.5">
                        <h1 className="text-lg sm:text-xl font-bold tracking-tight text-base-content">
                            NearU <span className="text-primary font-normal">|</span> Our app bbyyyy ✨
                        </h1>
                        <p className="text-xs sm:text-sm text-base-content/70 font-medium">
                            Juntitos siempre, sin importar la distancia 💕
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* TARJETA DE ESTADO DE ÁNIMO */}
            <motion.div variants={moodVariants}>
                <UserMoodCard />
            </motion.div>

            {/* GRID PARA LOS BOTONES */}
            <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-4"
                variants={gridVariants}
            >
                {/* DIARIO (2 COLUMNAS DE ANCHO) */}
                <motion.button
                    type="button"
                    variants={cardVariants}
                    whileHover={{ y: -4, scale: 1.015 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate('/diary')}
                    className="btn btn-soft btn-primary col-span-2 min-h-35 sm:min-h-40 h-full w-full rounded-3xl p-5 flex flex-col justify-between items-start text-left group shadow-sm hover:shadow-md transition-shadow duration-200 border-none cursor-pointer"
                >
                    <div className="w-full flex items-center justify-between">
                        <span className="badge badge-primary badge-sm font-medium tracking-wide">
                            HISTORIAS
                        </span>
                        <div className="p-2.5 rounded-2xl bg-primary/15 text-primary group-hover:scale-110 transition-transform duration-200">
                            <BookHeart className="w-7 h-7" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Diario</h2>
                        <p className="text-xs sm:text-sm opacity-80 line-clamp-1 font-normal">
                            Nuestros momentos juntos ✨
                        </p>
                    </div>
                </motion.button>

                {/* CITAS (1 COLUMNA DE ANCHO - 2 FILAS DE ALTO) */}
                <motion.button
                    type="button"
                    variants={cardVariants}
                    whileHover={{ y: -4, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate('/dates')}
                    className="btn btn-soft btn-secondary col-span-1 row-span-2 min-h-55 h-full w-full rounded-3xl p-4 flex flex-col justify-between items-center text-center group shadow-sm hover:shadow-md transition-shadow duration-200 border-none cursor-pointer"
                >
                    <div className="p-3 rounded-2xl bg-secondary/15 text-secondary group-hover:scale-110 transition-transform duration-200 mt-2">
                        <CalendarHeart className="w-9 h-9" />
                    </div>
                    <div className="mb-2">
                        <span className="badge badge-secondary badge-xs mb-1">Citas</span>
                        <h2 className="text-base sm:text-lg font-bold">Nuestras Cititas</h2>
                        <p className="text-[11px] sm:text-xs opacity-75 mt-0.5">Planes juntos 💖</p>
                    </div>
                </motion.button>

                {/* NOTAS (1 COLUMNA DE ANCHO - 1 FILA DE ALTO) */}
                <motion.button
                    type="button"
                    variants={cardVariants}
                    whileHover={{ y: -3, scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => navigate('/notes')}
                    className="btn btn-soft btn-info col-span-1 min-h-26.25 h-full w-full rounded-3xl p-3.5 flex flex-col items-center justify-center text-center gap-1.5 group shadow-sm hover:shadow-md transition-shadow duration-200 border-none cursor-pointer"
                >
                    <div className="p-2 rounded-2xl bg-info/15 text-info group-hover:scale-110 transition-transform duration-200">
                        <StickyNote className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold">Notitas</span>
                </motion.button>

                {/* TAREAS (1 COLUMNA DE ANCHO - 1 FILA DE ALTO) */}
                <motion.button
                    type="button"
                    variants={cardVariants}
                    whileHover={{ y: -3, scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => navigate('/tasks')}
                    className="btn btn-soft btn-success col-span-1 min-h-26.25 h-full w-full rounded-3xl p-3.5 flex flex-col items-center justify-center text-center gap-1.5 group shadow-sm hover:shadow-md transition-shadow duration-200 border-none cursor-pointer"
                >
                    <div className="p-2 rounded-2xl bg-success/15 text-success group-hover:scale-110 transition-transform duration-200">
                        <CheckSquare className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold">Tareitas</span>
                </motion.button>

                {/* ANIVERSARIOS (1 COLUMNA DE ANCHO - 1 FILA DE ALTO) */}
                <motion.button
                    type="button"
                    variants={cardVariants}
                    whileHover={{ y: -3, scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => navigate('/anniversaries')}
                    className="btn btn-soft btn-warning col-span-1 min-h-26.25 h-full w-full rounded-3xl p-3.5 flex flex-col items-center justify-center text-center gap-1.5 group shadow-sm hover:shadow-md transition-shadow duration-200 border-none cursor-pointer"
                >
                    <div className="p-2 rounded-2xl bg-warning/15 text-warning group-hover:scale-110 transition-transform duration-200">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold">Waniversarios</span>
                </motion.button>

                {/* UBICACIÓN (1 COLUMNA DE ANCHO - 2 FILAS DE ALTO) */}
                <motion.button
                    type="button"
                    variants={cardVariants}
                    whileHover={{ y: -4, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate('/geolocation')}
                    className="btn btn-soft btn-error col-span-1 row-span-2 min-h-55 h-full w-full rounded-3xl p-4 flex flex-col justify-between items-center text-center group shadow-sm hover:shadow-md transition-shadow duration-200 border-none cursor-pointer"
                >
                    <div className="p-3 rounded-2xl bg-error/15 text-error group-hover:scale-110 transition-transform duration-200 mt-2">
                        <MapPin className="w-9 h-9" />
                    </div>
                    <div className="mb-2">
                        <span className="badge badge-error badge-xs mb-1">GPS</span>
                        <h2 className="text-base sm:text-lg font-bold">Mapita</h2>
                        <p className="text-[11px] sm:text-xs opacity-75 mt-0.5">Nuestra ubicación 📍</p>
                    </div>
                </motion.button>

                {/* CARTITAS (1 COLUMNA DE ANCHO - 1 FILA DE ALTO) */}
                <motion.button
                    type="button"
                    variants={cardVariants}
                    whileHover={{ y: -3, scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => navigate('/letters')}
                    className="btn btn-soft btn-primary col-span-1 min-h-26.25 h-full w-full rounded-3xl p-3.5 flex flex-col items-center justify-center text-center gap-1.5 group shadow-sm hover:shadow-md transition-shadow duration-200 border-none cursor-pointer"
                >
                    <div className="p-2 rounded-2xl bg-primary/15 text-primary group-hover:scale-110 transition-transform duration-200">
                        <Mail className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold">Cartitas</span>
                </motion.button>

                {/* RAZONES PARA AMARTE (2 COLUMNAS DE ANCHO) */}
                <motion.button
                    type="button"
                    variants={cardVariants}
                    whileHover={{ y: -3, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={obtenerRazonAleatoria}
                    className="btn btn-soft btn-secondary col-span-2 min-h-23.75 h-full w-full rounded-3xl p-4 flex flex-row items-center justify-between group transition-shadow duration-200 shadow-sm hover:shadow-md cursor-pointer border-none"
                >
                    <div className="flex items-center gap-3 text-left">
                        <div className="p-2.5 rounded-2xl bg-secondary/20 text-secondary group-hover:scale-110 transition-transform duration-200 shrink-0">
                            <Heart className="w-6 h-6 fill-secondary/30 text-secondary animate-pulse" />
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-sm sm:text-base font-bold text-base-content">¿Por qué te amo? 💕</span>
                            </div>
                            <span className="text-xs opacity-75 font-normal block">Toca para descubrir una razón</span>
                        </div>
                    </div>
                </motion.button>

                {/* JUEGOS (2 COLUMNAS DE ANCHO) */}
                <motion.button
                    type="button"
                    variants={cardVariants}
                    whileHover={{ y: -3, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate('/games')}
                    className="btn btn-soft btn-secondary col-span-2 min-h-23.75 h-full w-full rounded-3xl p-4 flex flex-row items-center justify-center gap-3 group border-2 transition-shadow duration-200 cursor-pointer"
                >
                    <div className="p-2 rounded-2xl bg-secondary/10 group-hover:scale-110 transition-transform duration-200">
                        <Palette className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                        <span className="text-sm sm:text-base font-bold block">Juegos</span>
                        <span className="text-xs opacity-70 font-normal block">Juegitos para jugar jeje</span>
                    </div>
                </motion.button>

                {/* PRUEBAS (1 COLUMNA DE ANCHO - 1 FILA DE ALTO) */}
                <motion.button
                    type="button"
                    variants={cardVariants}
                    whileHover={{ y: -3, scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => navigate('/testing')}
                    className="btn btn-soft btn-neutral col-span-1 min-h-23.75 h-full w-full rounded-3xl p-3 flex flex-col items-center justify-center text-center gap-1 group border-2 transition-all duration-200 opacity-80 hover:opacity-100 cursor-pointer"
                >
                    <FlaskConical className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    <span className="text-xs font-semibold">Pruebas</span>
                </motion.button>

                {/* AJUSTES (1 COLUMNA DE ANCHO - 1 FILA DE ALTO) */}
                <motion.button
                    type="button"
                    variants={cardVariants}
                    whileHover={{ y: -3, scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => navigate('/config')}
                    className="btn btn-soft btn-neutral col-span-1 min-h-23.75 h-full w-full rounded-3xl p-3 flex flex-col items-center justify-center text-center gap-1 group border-2 transition-all duration-200 opacity-80 hover:opacity-100 cursor-pointer"
                >
                    <Settings className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    <span className="text-xs font-semibold">Ajustes</span>
                </motion.button>
            </motion.div>

            {/* MODAL / OVERLAY PARA MOSTRAR LA RAZÓN DE AMOR */}
            <AnimatePresence>
                {razonActual && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        onClick={cerrarRazon}
                    >
                        <motion.div
                            className="relative w-full max-w-lg bg-base-100 rounded-3xl p-6 sm:p-8 shadow-2xl border border-secondary/30 text-center overflow-hidden"
                            initial={{ opacity: 0, scale: 0.88, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 12 }}
                            transition={{ type: "spring", damping: 25, stiffness: 320 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* ADORNOS DE FONDO */}
                            <div className="absolute -right-12 -top-12 w-36 h-36 bg-secondary/15 rounded-full blur-2xl pointer-events-none" />
                            <div className="absolute -left-12 -bottom-12 w-36 h-36 bg-primary/15 rounded-full blur-2xl pointer-events-none" />

                            <div className="flex items-center justify-end mb-2 relative z-10">
                                <motion.button
                                    type="button"
                                    whileTap={{ scale: 0.9 }}
                                    onClick={cerrarRazon}
                                    className="btn btn-sm btn-circle btn-ghost text-base-content/60 hover:text-base-content hover:bg-base-200"
                                    aria-label="Cerrar"
                                >
                                    <X className="w-4 h-4" />
                                </motion.button>
                            </div>

                            <div className="my-2 flex justify-center items-center gap-2">
                                <motion.div
                                    className="w-14 h-14 rounded-2xl bg-secondary/15 flex items-center justify-center text-secondary shadow-inner"
                                    initial={{ scale: 0.6, rotate: -15 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
                                >
                                    <Heart className="w-8 h-8 fill-secondary text-secondary animate-pulse" />
                                </motion.div>
                            </div>

                            <div className="my-4 min-h-20 flex items-center justify-center">
                                <p className="text-base sm:text-lg font-medium text-base-content leading-relaxed px-1">
                                    "{razonActual.texto}"
                                </p>
                            </div>

                            <p className="text-xs text-base-content/60 font-medium mb-5">
                                Una de las muchas razones por las que te amo 💕
                            </p>

                            {/* BARRA DE PROGRESO */}
                            <div className="w-full bg-base-200 h-2 rounded-full overflow-hidden mb-4">
                                <div
                                    className="bg-linear-to-r from-secondary to-primary h-full transition-all duration-200 ease-linear rounded-full"
                                    style={{ width: `${(timeLeft / 20) * 100}%` }}
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                                <span className="text-xs text-base-content/50 font-mono order-2 sm:order-1">
                                    Desaparece en {timeLeft}s
                                </span>
                                <div className="flex gap-2 w-full sm:w-auto justify-end order-1 sm:order-2">
                                    <motion.button
                                        type="button"
                                        whileTap={{ scale: 0.95 }}
                                        onClick={obtenerRazonAleatoria}
                                        className="btn btn-soft btn-secondary btn-sm rounded-xl flex-1 sm:flex-none gap-1.5 cursor-pointer"
                                    >
                                        <RotateCw className="w-3.5 h-3.5" />
                                        Otra razón
                                    </motion.button>
                                    <motion.button
                                        type="button"
                                        whileTap={{ scale: 0.95 }}
                                        onClick={cerrarRazon}
                                        className="btn btn-neutral btn-sm rounded-xl flex-1 sm:flex-none cursor-pointer"
                                    >
                                        Muuuy bien ❤️
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}


