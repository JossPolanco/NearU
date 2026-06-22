// components/MessageBubble.jsx
import { Reply, Star, Trash2 } from "lucide-react";
import ReadIndicator from "./ReadIndicator";
import { useState, useRef } from "react";

export default function MessageBubble({ message, isOwn, onReply, messageRef, onScrollToParent }) {
    const [showMenu, setShowMenu] = useState(false);
    const longPressTimer = useRef(null);
    const pointerPos = useRef({ x: 0, y: 0 });

    const handlePressStart = (e) => {
        // Capture pointer/touch coordinates for later menu placement
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        pointerPos.current = { x: clientX, y: clientY };

        longPressTimer.current = setTimeout(() => setShowMenu(true), 500);
    };

    const handlePressEnd = () => {
        clearTimeout(longPressTimer.current);
    };

    const parseTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    const parseDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    return (
        <div ref={messageRef} className={`chat ${isOwn ? 'chat-end' : 'chat-start'}`} data-message-id={message.id} >

            <div className={`chat-bubble max-w-[75%] cursor-pointer select-none ${isOwn ? 'chat-bubble-primary' : 'chat-bubble-secondary'}`}
                style={{ overflowWrap: 'anywhere' }}
                onMouseDown={handlePressStart}
                onMouseUp={handlePressEnd}
                onTouchStart={handlePressStart}
                onTouchEnd={handlePressEnd}
                onContextMenu={(e) => { e.preventDefault(); const clientX = e.clientX; const clientY = e.clientY; pointerPos.current = { x: clientX, y: clientY }; setShowMenu(true); }}>
                {/* Bloque de respuesta (si es una respuesta) */}
                {message.reply_to_id && (
                    <div className="mb-2 px-1 py-1 rounded border-l-2 border-white/60 bg-black/20 text-xs opacity-80 cursor-pointer" onClick={() => onScrollToParent(message.reply_to_id)}>
                        <p className="font-semibold mb-0.5">
                            {message.replied_message?.sender_id === message.sender_id ? "Tú mismo" : "Respuesta"}
                        </p>
                        <p className="truncate max-w-50">
                            {/* reply_preview si el padre fue eliminado, o el contenido del padre */}
                            {message.reply_preview ?? "Mensaje eliminado"}
                        </p>
                    </div>
                )}


                <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
            {/* FOOTER MESSAGE */}
            <div className="chat-footer flex flex-row items-center gap-2">
                <time className="text-xs opacity-50">{parseTime(message.created_at) || "16:40"}</time>
                {isOwn && (
                    <ReadIndicator readAt={message.read_at} />
                )}
            </div>

            {/* Menú contextual */}
            {showMenu && (() => {
                // Compute fixed-position coordinates for the menu so it never goes off-screen
                const menuWidth = 200;
                const menuHeightEstimate = 160;
                const padding = 8;
                const winW = window.innerWidth;
                const winH = window.innerHeight;
                let left = pointerPos.current.x;
                let top;

                if (left + menuWidth > winW - padding) left = winW - menuWidth - padding;
                if (left < padding) left = padding;

                if (pointerPos.current.y + menuHeightEstimate > winH - padding) {
                    // show above the touch point
                    top = pointerPos.current.y - menuHeightEstimate - 10;
                    if (top < padding) top = padding;
                } else {
                    // show below the touch point
                    top = pointerPos.current.y + 10;
                }

                return (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                        <div style={{ left: `${left}px`, top: `${top}px`, width: `${menuWidth}px` }} className="fixed z-50 bg-base-100 shadow-lg rounded-xl flex flex-col gap-1 p-2 border border-base-300">
                            <button className="btn btn-ghost btn-sm gap-1 text-left" onClick={() => { onReply(message); setShowMenu(false); }} >
                                <Reply size={16} /> Responder
                            </button>
                            <button className="btn btn-ghost btn-sm gap-1 text-left">
                                <Star size={16} /> Destacar
                            </button>
                            <button className="btn btn-ghost btn-sm text-error gap-1 text-left">
                                <Trash2 size={16} /> Eliminar
                            </button>
                            <time className="text-xs opacity-50">Leído el: {parseDateTime(message.read_at) || "16:40"}</time>
                        </div>
                    </>
                );
            })()}

            {/* Overlay para cerrar menú */}
            {showMenu && (
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
            )}
        </div>
    );
}