import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useRef } from 'react';
import { Drawer, NoteItem } from '@/components';
import { ArrowLeft, Loader2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getNotes } from '@/services/notes';
import { useResolveSignedUrls } from '@/hooks';

export default function NotesGallery() {
    const navigate = useNavigate()
    const { data, isLoading } = useResolveSignedUrls(["notes"], getNotes)
    const [selectedNote, setSelectedNote] = useState(null)    

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
                <button
                    onClick={() => navigate('/notes')}
                    className="absolute left-0 btn btn-ghost btn-sm text-base-600 hover:text-primary active:scale-95 transition-all duration-200"
                    aria-label="Back to notes"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center justify-center py-4">
                    <Title />
                </div>
            </div>

            <div className="backdrop-blur-xs bg-base-200/40 dark:bg-base-900/20 rounded-3xl p-6 border border-base-100">
                {isLoading ? (
                    <div className="flex w-full justify-center">
                        <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                ) : data?.length === 0 ? (
                    <p className="text-sm text-base-600 dark:text-base-400 text-center py-4">
                        Aún no hay notitas guardadas.
                    </p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-items-center">
                        {data.map((note) => (
                            <NoteItem
                                key={note.id}
                                note={note}
                                onClick={() => setSelectedNote(note)}
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
                        <img className="max-w-full max-h-[75vh] rounded-3xl object-contain shadow-2xl border border-white/10"
                            src={selectedNote.coverUrl || selectedNote.image_metadata?.storage_path}
                            alt={selectedNote.title ?? 'Nota'}
                        />
                        <div className="text-center mt-4 text-white space-y-1">
                            <p className="font-semibold text-sm truncate max-w-xs md:max-w-md">
                                {selectedNote.title ?? 'Nota de amor'}
                            </p>
                            <p className="text-xs text-white/60">
                                {new Date(selectedNote.created_at).toLocaleDateString() + " " + new Date(selectedNote.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
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
        <h2 className="text-2xl font-bold text-center">
            <span className="text-orange-500">G</span>
            <span className="text-orange-500">A</span>
            <span className="text-yellow-400">L</span>
            <span className="text-green-500">E</span>
            <span className="text-cyan-400">R</span>
            <span className="text-violet-500">I</span>
            <span className="text-pink-500">A</span>
        </h2>
    )
}