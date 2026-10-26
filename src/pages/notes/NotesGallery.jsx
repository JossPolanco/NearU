import { ArrowLeft, Loader2, X, ChevronLeft, ChevronRight, Heart, RotateCw } from 'lucide-react';
import { getNotes, toggleFavorite, getFavoriteNotes } from '@/services/notes';
import { touchHover, tapFeedback, mobileSpring } from '@/utils/motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useResolveSignedUrls } from '@/hooks';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { NoteItem } from '@/components';
import { useState } from 'react';

const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.04,
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

const filterVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: mobileSpring,
    },
};

const listVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.035,
            delayChildren: 0.015,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 12, scale: 0.98 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: mobileSpring,
    },
};

export default function NotesGallery() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [selectedTab, setSelectedTab] = useState("todas")

    const { data, isLoading } = useResolveSignedUrls(
        ["notes", selectedTab],
        selectedTab === "favoritos" ? getFavoriteNotes : getNotes
    )
    const [selectedNote, setSelectedNote] = useState(null)

    const toggleFavoriteMutation = useMutation({
        mutationFn: ({ id, favorite }) => toggleFavorite(id, favorite),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] })
            queryClient.invalidateQueries({ queryKey: ["last-five-notes"] })
        }
    })

    const handleToggleFavorite = (note) => {
        toggleFavoriteMutation.mutate({ id: note.id, favorite: note.favorite })
    }

    const handlePrev = (e) => {
        e.stopPropagation()
        if (!data || data.length <= 1) return
        const index = data.findIndex((note) => note.id === selectedNote.id)
        if (index > 0) {
            setSelectedNote(data[index - 1])
        } else {
            setSelectedNote(data[data.length - 1])
        }
    }

    const handleNext = (e) => {
        e.stopPropagation()
        if (!data || data.length <= 1) return
        const index = data.findIndex((note) => note.id === selectedNote.id)
        if (index < data.length - 1) {
            setSelectedNote(data[index + 1])
        } else {
            setSelectedNote(data[0])
        }
    }

    const handleRefresh = () => {
        queryClient.invalidateQueries({ queryKey: ["notes"] })
    }

    return (
        <motion.div
            className="max-w-2xl mx-auto p-4 space-y-6"
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

                <motion.button
                    whileHover={touchHover({ rotate: 180, scale: 1.05 })}
                    whileTap={tapFeedback.icon}
                    transition={{ duration: 0.35 }}
                    type="button"
                    className="absolute right-0 btn btn-sm btn-circle btn-primary text-white cursor-pointer transition-shadow shadow-xs hover:shadow-md"
                    onClick={() => handleRefresh()}
                    aria-label="Refrescar"
                >
                    <RotateCw className="w-5 h-5" />
                </motion.button>
            </motion.div>

            {/* FILTRO DE NOTAS */}
            <motion.div variants={filterVariants} className="flex justify-center my-2">
                <div className="grid grid-cols-2 gap-1 bg-base-200/60 dark:bg-base-900/40 p-1 rounded-full border border-base-200/40 dark:border-base-800/40 w-full max-w-65 backdrop-blur-md">
                    {[
                        { id: "todas", label: "Todas" },
                        { id: "favoritos", label: "Favoritas ❤️" }
                    ].map((tab) => (
                        <motion.button
                            key={tab.id}
                            type="button"
                            whileTap={tapFeedback.button}
                            onClick={() => setSelectedTab(tab.id)}
                            className={`py-2 px-4 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${selectedTab === tab.id
                                ? "bg-primary text-white shadow-sm"
                                : "text-base-content/60 hover:text-base-content active:bg-base-300/20 dark:active:bg-base-900/20"
                                }`}
                        >
                            {tab.label}
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            <motion.div
                variants={filterVariants}
                className="backdrop-blur-md bg-base-100/40 dark:bg-base-950/20 rounded-3xl p-4 sm:p-6 border border-base-200/50 dark:border-base-800/30 shadow-xs"
            >
                {isLoading ? (
                    <div className="flex w-full justify-center py-6">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                ) : data?.length === 0 ? (
                    <p className="text-sm text-base-content/60 text-center py-6 font-medium">
                        {selectedTab === "favoritos"
                            ? "Aún no tienes notitas marcadas como favoritas. ❤️"
                            : "Aún no hay notitas guardadas."}
                    </p>
                ) : (
                    <motion.div
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-items-center"
                        variants={listVariants}
                    >
                        {data.map((note) => (
                            <NoteItem
                                key={note.id}
                                note={note}
                                variants={itemVariants}
                                onClick={() => setSelectedNote(note)}
                                onToggleFavorite={handleToggleFavorite}
                            />
                        ))}
                    </motion.div>
                )}
            </motion.div>

            {/* LIGHTBOX MODAL PREMIUM CON FRAMER MOTION */}
            <AnimatePresence>
                {selectedNote && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md"
                        onClick={() => setSelectedNote(null)}
                    >
                        {/* BOTON CERRAR */}
                        <motion.button
                            whileHover={touchHover({ scale: 1.1 })}
                            whileTap={tapFeedback.icon}
                            type="button"
                            className="absolute top-4 right-4 btn btn-circle btn-ghost text-white/80 hover:text-white z-50"
                            onClick={() => setSelectedNote(null)}
                            aria-label="Cerrar"
                        >
                            <X className="w-6 h-6" />
                        </motion.button>

                        {/* FLECHA IZQUIERDA */}
                        {data?.length > 1 && (
                            <motion.button
                                whileHover={touchHover({ scale: 1.1 })}
                                whileTap={tapFeedback.icon}
                                className="absolute left-4 btn btn-circle btn-ghost text-white/80 hover:text-white hover:bg-white/10 hidden md:flex z-50"
                                onClick={handlePrev}
                                type="button"
                                aria-label="Anterior"
                            >
                                <ChevronLeft className="w-8 h-8" />
                            </motion.button>
                        )}

                        {/* IMAGEN PRINCIPAL Y CONTENEDOR */}
                        <motion.div
                            initial={{ scale: 0.92, opacity: 0, y: 15 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.92, opacity: 0, y: 10 }}
                            transition={mobileSpring}
                            className="max-w-4xl max-h-[85vh] px-4 flex flex-col items-center justify-center relative select-none"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative max-w-full max-h-[75vh]">
                                <img
                                    className="max-w-full max-h-[75vh] rounded-3xl object-contain shadow-2xl border border-white/10"
                                    src={selectedNote.coverUrl || selectedNote.image_metadata?.storage_path}
                                    alt={selectedNote.title ?? 'Nota'}
                                />
                            </div>
                            <div className="text-center mt-4 text-white space-y-1 relative px-10">
                                <p className="font-semibold text-sm truncate max-w-xs md:max-w-md">
                                    {selectedNote.title ?? 'Nota de amor'}
                                </p>
                                <p className="text-xs text-white/60">
                                    {new Date(selectedNote.created_at).toLocaleDateString() + " " + new Date(selectedNote.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                                <motion.button
                                    whileTap={tapFeedback.icon}
                                    whileHover={touchHover({ scale: 1.1 })}
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggleFavorite(selectedNote);
                                        // Update selectedNote favorite state in the lightbox locally
                                        setSelectedNote(prev => ({ ...prev, favorite: !prev.favorite }));
                                    }}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 cursor-pointer"
                                    aria-label={selectedNote.favorite ? "Quitar de favoritos" : "Añadir a favoritos"}
                                >
                                    <Heart className={`w-5 h-5 transition-transform duration-200 ${selectedNote.favorite ? "fill-red-500 text-red-500 scale-110" : "text-white/80"}`} />
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* FLECHA NEXT */}
                        {data?.length > 1 && (
                            <motion.button
                                whileHover={touchHover({ scale: 1.1 })}
                                whileTap={tapFeedback.icon}
                                className="absolute right-4 btn btn-circle btn-ghost text-white/80 hover:text-white hover:bg-white/10 hidden md:flex z-50"
                                onClick={handleNext}
                                type="button"
                                aria-label="Siguiente"
                            >
                                <ChevronRight className="w-8 h-8" />
                            </motion.button>
                        )}

                        {/* CONTROLES DE SWIPE/NAVIGATION MÓVILES (ABAJO) */}
                        {data?.length > 1 && (
                            <div className="absolute bottom-6 flex gap-4 md:hidden z-50">
                                <motion.button
                                    whileTap={tapFeedback.icon}
                                    className="btn btn-circle btn-sm btn-ghost text-white border border-white/20"
                                    onClick={handlePrev}
                                    type="button"
                                    aria-label="Nota anterior"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </motion.button>
                                <motion.button
                                    whileTap={tapFeedback.icon}
                                    className="btn btn-circle btn-sm btn-ghost text-white border border-white/20"
                                    onClick={handleNext}
                                    type="button"
                                    aria-label="Siguiente nota"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </motion.button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export function Title() {
    return (
        <h2 className="text-3xl font-extrabold tracking-tight text-center drop-shadow-xs bg-base-100 px-4 py-1.5 rounded-full">
            <span className="text-orange-500">G</span>
            <span className="text-orange-400">a</span>
            <span className="text-amber-400">l</span>
            <span className="text-yellow-400">e</span>
            <span className="text-lime-400">r</span>
            <span className="text-green-500">í</span>
            <span className="text-emerald-500">a</span>
            <span> </span>
            <span className="text-cyan-400">d</span>
            <span className="text-sky-500">e</span>
            <span> </span>
            <span className="text-blue-500">N</span>
            <span className="text-indigo-500">o</span>
            <span className="text-violet-500">t</span>
            <span className="text-fuchsia-500">i</span>
            <span className="text-pink-500">t</span>
            <span className="text-rose-500">a</span>
            <span className="text-red-500">s</span>
        </h2>
    );
}