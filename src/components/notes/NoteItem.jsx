import React from 'react'

export default function NoteItem({ note, onClick }) {

    const parseDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    return (
        <div className="flex flex-col bg-base-200 p-4 pb-10 rounded-2xl shadow-md border border-base-300/40 w-full max-w-40 transition-all duration-300 md:hover:scale-[1.02] justify-self-center cursor-pointer active:scale-98"
            onClick={onClick}
        >
            <img
                src={note.coverUrl || note.image_metadata?.storage_path}
                className="rounded-xl w-full aspect-square object-cover pointer-events-none"
                alt="Nuestros momentos"
            />
            <p className="mt-4 font-serif italic text-center text-base-content/85 text-sm truncate w-full">{note.title}</p>
            <span className="text-base-content/60 text-xs mt-2 text-center">{parseDateTime(note.created_at)}</span>
        </div>
    )
}
