import { X, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { useState } from 'react';

export default function CarouselNotes({ notes, isLoading }) {
    const [selectedNote, setSelectedNote] = useState(null);

    const parseDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    const getJustifyClass = () => {
        if (isLoading) return "justify-center";
        const count = notes?.length || 0;
        if (count === 1) return "justify-center";
        if (count === 2) return "justify-start md:justify-center";
        return "justify-start";
    };

    const handlePrev = (e) => {
        e.stopPropagation()
        if (!notes || notes.length <= 1) return
        const index = notes.findIndex((note) => note.id === selectedNote.id)
        if (index > 0) {
            setSelectedNote(notes[index - 1])
        } else {
            setSelectedNote(notes[notes.length - 1])
        }
    }

    const handleNext = (e) => {
        e.stopPropagation()
        if (!notes || notes.length <= 1) return
        const index = notes.findIndex((note) => note.id === selectedNote.id)
        if (index < notes.length - 1) {
            setSelectedNote(notes[index + 1])
        } else {
            setSelectedNote(notes[0])
        }
    }

    return (
        <>
            {isLoading ? (
                <>
                    <div className="carousel carousel-center backdrop-blur-md rounded-3xl w-full gap-6 p-6 mx-auto justify-center animate-pulse">
                        <div className="carousel-item flex-col bg-base-100 dark:bg-base-900/50 p-3.5 pb-6 rounded-3xl shadow-md border border-base-200/60 dark:border-base-800/40 w-72 min-w-72 rotate-[-1.5deg]">
                            <div className="skeleton rounded-2xl w-full aspect-square bg-base-250 dark:bg-base-800" />
                            <div className="skeleton h-4 w-2/3 mx-auto mt-5 bg-base-250 dark:bg-base-800" />
                        </div>
                    </div>

                    <div className="flex w-full justify-center gap-3 py-2 max-w-xs mx-auto animate-pulse">
                        <div className="skeleton w-7 h-7 mask mask-heart bg-base-200 dark:bg-base-800" />
                        <div className="skeleton w-7 h-7 mask mask-heart bg-base-200 dark:bg-base-800" />
                        <div className="skeleton w-7 h-7 mask mask-heart bg-base-200 dark:bg-base-800" />
                    </div>
                </>
            ) : (
                <>
                    <div className={`carousel carousel-center backdrop-blur-md rounded-3xl w-full gap-6 p-6 ${getJustifyClass()}`}>
                        {/* ITEMS */}
                        {notes?.map((note, index) => (
                            <div className="carousel-item flex-col bg-base-100 dark:bg-base-900/50 p-3.5 pb-6 rounded-3xl shadow-md border border-base-200/60 dark:border-base-800/40 w-72 min-w-72 rotate-[-1.5deg] transition-all duration-300 md:hover:rotate-0 md:hover:scale-[1.02] cursor-pointer active:scale-98"
                                key={note.id}
                                id={`item${index + 1}`}
                                onClick={() => setSelectedNote(note)}
                            >
                                <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-base-200/50 dark:bg-base-950/20 border border-base-200/30 dark:border-base-850/20">
                                    <img className="w-full h-full object-cover pointer-events-none"
                                        src={note.coverUrl || note.image_metadata?.storage_path}
                                        alt="Nuestros momentos"
                                    />
                                    {note.favorite && (
                                        <div className="absolute top-2.5 right-2.5 w-8.5 h-8.5 flex items-center justify-center rounded-full bg-base-100/90 dark:bg-base-950/90 text-red-500 shadow-sm border border-base-300/10">
                                            <Heart className="w-4 h-4 fill-red-500 text-red-500 animate-pulse" />
                                        </div>
                                    )}
                                </div>
                                <p className="mt-4 font-serif italic text-center text-base-content/85 text-sm px-2 truncate w-full">{note.title}</p>
                                <span className="text-base-content/50 text-xs mt-1.5 text-center font-mono">{parseDateTime(note.created_at)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex w-full justify-center gap-3 py-2 max-w-xs mx-auto">
                        {notes?.map((note, index) => (
                            <a key={note.id} href={`#item${index + 1}`} className="btn btn-xs btn-primary mask mask-heart text-white w-7 h-7 flex items-center justify-center p-0 transition-transform active:scale-125 duration-150">
                                {index + 1}
                            </a>
                        ))}
                    </div>
                </>
            )}

            {/* Lightbox Modal Premium */}
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

                    {/* FLECHA ANTERIOR */}
                    {notes?.length > 1 && (
                        <button className="absolute left-4 btn btn-circle btn-ghost text-white/80 hover:text-white hover:bg-white/10 hidden md:flex z-50"
                            onClick={handlePrev}
                            type="button"
                            aria-label="Anterior"
                        >
                            <ChevronLeft className="w-8 h-8" />
                        </button>
                    )}

                    {/* IMAGEN PRINCIPAL Y CONTENEDOR*/}
                    <div className="max-w-4xl max-h-[85vh] px-4 flex flex-col items-center justify-center relative select-none animate-scale-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={selectedNote.coverUrl || selectedNote.image_metadata?.storage_path}
                            alt={selectedNote.title ?? 'Nota'}
                            className="max-w-full max-h-[75vh] rounded-3xl object-contain shadow-2xl border border-white/10"
                        />
                        <div className="text-center mt-4 text-white space-y-1">
                            <p className="font-semibold text-sm truncate max-w-xs md:max-w-md">
                                {selectedNote.title ?? 'Nota de amor'}
                            </p>
                            <p className="text-xs text-white/60">
                                {parseDateTime(selectedNote.created_at)}
                            </p>
                        </div>
                    </div>

                    {/* FLECHA DERECHA */}
                    {notes?.length > 1 && (
                        <button
                            className="absolute right-4 btn btn-circle btn-ghost text-white/80 hover:text-white hover:bg-white/10 hidden md:flex z-50"
                            onClick={handleNext}
                            type="button"
                            aria-label="Siguiente"
                        >
                            <ChevronRight className="w-8 h-8" />
                        </button>
                    )}

                    {/* CONTROLES DE SWIPE/NAVIGATION MÓVILES (ABAJO) */}
                    {notes?.length > 1 && (
                        <div className="absolute bottom-6 flex gap-4 md:hidden z-50">
                            <button className="btn btn-circle btn-sm btn-ghost text-white border border-white/20" onClick={handlePrev} type="button">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button className="btn btn-circle btn-sm btn-ghost text-white border border-white/20" onClick={handleNext} type="button" >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </>
    )
}
