import { ArrowLeft, Loader2, X, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { getNotes, toggleFavorite, getFavoriteNotes } from '@/services/notes';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useResolveSignedUrls } from '@/hooks';
import { useNavigate } from 'react-router';
import { NoteItem } from '@/components';
import { useState } from 'react';

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

            {/* FILTRO DE NOTAS */}
            <div className="flex justify-center my-2">
                <div className="grid grid-cols-2 gap-1 bg-base-200/60 dark:bg-base-900/40 p-1 rounded-full border border-base-200/40 dark:border-base-800/40 w-full max-w-65 backdrop-blur-md">
                    {[
                        { id: "todas", label: "Todas" },
                        { id: "favoritos", label: "Favoritas ❤️" }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setSelectedTab(tab.id)}
                            className={`py-2 px-4 rounded-full text-xs font-bold transition-all duration-200 active:scale-95 ease-in-out ${selectedTab === tab.id
                                ? "bg-primary text-white shadow-sm"
                                : "text-base-content/60 hover:text-base-content active:bg-base-300/20 dark:active:bg-base-900/20"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="backdrop-blur-md bg-base-100/40 dark:bg-base-950/20 rounded-3xl p-4 sm:p-6 border border-base-200/50 dark:border-base-800/30 shadow-xs">
                {isLoading ? (
                    <div className="flex w-full justify-center">
                        <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                ) : data?.length === 0 ? (
                    <p className="text-sm text-base-600 dark:text-base-400 text-center py-4">
                        {selectedTab === "favoritos"
                            ? "Aún no tienes notitas marcadas como favoritas. ❤️"
                            : "Aún no hay notitas guardadas."}
                    </p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-items-center">
                        {data.map((note) => (
                            <NoteItem
                                key={note.id}
                                note={note}
                                onClick={() => setSelectedNote(note)}
                                onToggleFavorite={handleToggleFavorite}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* LIGHTBOX MODAL PREMIUM */}
            {selectedNote && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in"
                    onClick={() => setSelectedNote(null)}
                >
                    {/* BOTON CERRAR */}
                    <button className="absolute top-4 right-4 btn btn-circle btn-ghost text-white/80 hover:text-white z-50"
                        onClick={() => setSelectedNote(null)}
                        type="button"
                        aria-label="Cerrar"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* FLECHA IZQUIERDA */}
                    {data?.length > 1 && (
                        <button className="absolute left-4 btn btn-circle btn-ghost text-white/80 hover:text-white hover:bg-white/10 hidden md:flex z-50"
                            onClick={handlePrev}
                            type="button"
                            aria-label="Anterior"
                        >
                            <ChevronLeft className="w-8 h-8" />
                        </button>
                    )}

                    {/* IMAGEN PRINCIPAL Y CONTENEDOR */}
                    <div className="max-w-4xl max-h-[85vh] px-4 flex flex-col items-center justify-center relative select-none animate-scale-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative max-w-full max-h-[75vh]">
                            <img className="max-w-full max-h-[75vh] rounded-3xl object-contain shadow-2xl border border-white/10"
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
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleFavorite(selectedNote);
                                    // Update selectedNote favorite state in the lightbox locally
                                    setSelectedNote(prev => ({ ...prev, favorite: !prev.favorite }));
                                }}
                                className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:scale-90 transition-all text-white border border-white/10"
                                aria-label={selectedNote.favorite ? "Quitar de favoritos" : "Añadir a favoritos"}
                            >
                                <Heart className={`w-5 h-5 transition-all duration-200 ${selectedNote.favorite ? "fill-red-500 text-red-500 scale-110" : "text-white/80"}`} />
                            </button>
                        </div>
                    </div>

                    {/* FLECHA NEXT */}
                    {data?.length > 1 && (
                        <button className="absolute right-4 btn btn-circle btn-ghost text-white/80 hover:text-white hover:bg-white/10 hidden md:flex z-50"
                            onClick={handleNext}
                            type="button"
                            aria-label="Siguiente"
                        >
                            <ChevronRight className="w-8 h-8" />
                        </button>
                    )}

                    {/* CONTROLES DE SWIPE/NAVIGATION MÓVILES (ABAJO) */}
                    {data?.length > 1 && (
                        <div className="absolute bottom-6 flex gap-4 md:hidden z-50">
                            <button className="btn btn-circle btn-sm btn-ghost text-white border border-white/20" onClick={handlePrev} type="button">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button className="btn btn-circle btn-sm btn-ghost text-white border border-white/20" onClick={handleNext} type="button">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
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