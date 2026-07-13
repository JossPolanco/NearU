import React from 'react'

export default function NoteItem({ notes }) {
    return (
        <div className={`carousel carousel-center backdrop-blur-xs rounded-3xl w-full gap-6 p-6 ${getJustifyClass()}`}>
            {/* ITEMS */}
            {notes?.map((note, index) => (
                <div key={note.id} id={`item${index + 1}`} className="carousel-item flex-col bg-base-200 p-4 pb-10 rounded-2xl shadow-md border border-base-300/40 w-70 min-w-70 rotate-[-1.5deg] transition-all duration-300 md:hover:rotate-0 md:hover:scale-[1.02]">
                    <img
                        src={note.coverUrl || note.image_metadata?.storage_path}
                        className="rounded-xl w-full aspect-square object-cover pointer-events-none"
                        alt="Nuestros momentos"
                    />
                    <p className="mt-4 font-serif italic text-center text-base-content/85 text-sm">{note.title}</p>
                    <span className="text-base-content/60 text-xs mt-2">{parseDateTime(note.created_at)}</span>
                </div>
            ))}
        </div>
    )
}
