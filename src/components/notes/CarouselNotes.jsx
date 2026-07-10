import React from 'react'

export default function CarouselNotes({ notes, isLoading }) {
    return (
        <>
            {isLoading ? (
                <Skeleton
                    height="100%"
                    width="100%"
                    className="rounded-3xl"
                />
            ) : (
                <>
                    <div className="carousel carousel-centerbackdrop-blur-xs rounded-3xl max-w-sm space-x-6 p-6 border border-base-200 shadow-sm mx-auto">
                        {/* ITEMS */}
                        {notes.map((note, index) => (
                            <div key={note.id} id={`item${index + 1}`} className="carousel-item flex-col bg-white dark:bg-base-200 p-4 pb-10 rounded-2xl shadow-md border border-base-300/40 max-w-70 rotate-[-1.5deg] transition-all duration-300 md:hover:rotate-0 md:hover:scale-[1.02]">
                                <img
                                    src={note.image_metadata?.storage_path}
                                    className="rounded-xl w-full aspect-square object-cover pointer-events-none"
                                    alt="Nuestros momentos"
                                />
                                <p className="mt-4 font-serif italic text-center text-base-content/85 text-sm">{note.title}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex w-full justify-center gap-3 py-2 max-w-xs mx-auto">
                        {notes.map((note, index) => (
                            <a key={note.id} href={`#item${index + 1}`} className="btn btn-xs btn-primary mask mask-heart text-white w-7 h-7 flex items-center justify-center p-0 transition-transform active:scale-125 duration-150">
                                {index + 1}
                            </a>
                        ))}
                    </div>
                </>
            )}
        </>
    )
}
