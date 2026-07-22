import { unStarredMessage } from "../../services/chat";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Star } from "lucide-react";

const parseDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default function StarredBubble({ message, isOwn, messageRef, onScrollToParent }) {
    const [showMenu, setShowMenu] = useState(false);
    const longPressTimer = useRef(null);
    const pointerPos = useRef({ x: 0, y: 0 });
    const queryClient = useQueryClient();

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

    const handleUnStarredMessage = async () => {
        await unStarredMessage(message.id);
        queryClient.invalidateQueries({
            queryKey: ['starred-messages']
        });
        setShowMenu(false);
    }

    return (
        <div ref={messageRef} className={`chat ${isOwn ? 'chat-end' : 'chat-start'} relative ${showMenu ? 'z-50' : 'z-0'} transition-transform duration-200 my-1.5`} data-message-id={message.id} >

            <div className={`chat-bubble max-w-[75%] cursor-pointer select-none rounded-[18px] px-3.5 py-2.5 text-sm shadow-xs before:hidden ${isOwn ? 'chat-bubble-primary rounded-tr-none text-primary-content' : 'chat-bubble-secondary rounded-tl-none text-secondary-content'}`}
                style={{ overflowWrap: 'anywhere' }}
                onMouseDown={handlePressStart}
                onMouseUp={handlePressEnd}
                onTouchStart={handlePressStart}
                onTouchEnd={handlePressEnd}
                onContextMenu={(e) => { e.preventDefault(); const clientX = e.clientX; const clientY = e.clientY; pointerPos.current = { x: clientX, y: clientY }; setShowMenu(true); }}>

                {/* Bloque de respuesta (si es una respuesta) */}
                {message.reply_to_id && (
                    <div className={`mb-2 px-2.5 py-1.5 rounded-lg border-l-3 text-[11px] cursor-pointer select-none truncate transition-colors ${isOwn
                            ? 'bg-black/15 border-primary-content/60 text-primary-content/95 hover:bg-black/20'
                            : 'bg-base-300/50 border-secondary text-base-content/90 hover:bg-base-300/75'
                            }`}
                        onClick={onScrollToParent ? () => onScrollToParent(message.reply_to_id) : undefined}
                    >
                        <p className="font-bold tracking-wider text-[9px] uppercase opacity-75 mb-0.5">
                            {message.replied_message?.sender_id === message.sender_id ? "Tú" : "Tu amor"}
                        </p>
                        <p className="truncate max-w-50">
                            {message.reply_preview ?? "Mensaje eliminado"}
                        </p>
                    </div>
                )}

                <div className="flex flex-col gap-0.5">
                    <p className="whitespace-pre-wrap leading-relaxed pr-10 text-[14px]">{message.content}</p>

                    {/* METADATOS INTEGRADOS */}
                    <div className={`flex items-center justify-end gap-1 text-[9px] mt-1 -mr-1 -mb-1 select-none pointer-events-none ${isOwn ? 'text-primary-content/70' : 'text-base-content/50'}`}>
                        <Star size={10} className={`${isOwn ? 'text-yellow-300 fill-yellow-300' : 'text-yellow-500 fill-yellow-500'} shrink-0`} />
                        <time className="text-white">{parseDateTime(message.created_at) || "16:40"}</time>
                    </div>
                </div>
            </div>

            {/* Menú contextual */}
            {showMenu && (() => {
                // Compute fixed-position coordinates for the menu so it never goes off-screen
                const menuWidth = 200;
                const menuHeightEstimate = 100;
                const padding = 12;
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

                return createPortal(
                    <>
                        <div className="fixed inset-0 z-9998 bg-base-300/30 backdrop-blur-xs transition-opacity duration-300 animate-fade-in" onClick={() => setShowMenu(false)} />
                        <div className="fixed z-9999 bg-base-100/95 backdrop-blur-md shadow-xl rounded-2xl flex flex-col gap-0.5 p-1.5 border border-base-content/5 animate-scale-in" style={{ left: `${left}px`, top: `${top}px`, width: `${menuWidth}px` }} >
                            <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-base-content/85 hover:bg-base-200/60 active:scale-98 transition-transform text-left"
                                onClick={handleUnStarredMessage}
                            >
                                <Star size={16} className="text-yellow-500 fill-yellow-500 shrink-0" />
                                <span>Quitar destacado</span>
                            </button>
                            <div className="px-3 py-1.5 border-t border-base-content/5 mt-1 select-none">
                                <p className="text-[9px] text-base-content/40 font-medium uppercase tracking-wider">
                                    Destacado: {parseDateTime(message.created_at)}
                                </p>
                            </div>
                        </div>
                    </>,
                    document.body
                );
            })()}
        </div>
    );
}
