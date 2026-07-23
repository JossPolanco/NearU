// components/MessageBubble.jsx
import { setStarredMessage, unStarredMessage } from "../../services/chat/starredService";
import { deleteMessage, editMessage } from "../../services/chat/messagesService";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Reply, Star, Trash2, Pencil, Send } from "lucide-react";
import ReadIndicator from "./ReadIndicator";
import { useState, useRef } from "react";
import { createPortal } from "react-dom";

const parseTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const parseDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default function MessageBubble({ message, isOwn, onReply, messageRef, onScrollToParent, user }) {
    const [messageEdited, setMessageEdited] = useState('');
    const [showMenu, setShowMenu] = useState(false);
    const [editMode, setEditMode] = useState(false);
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

    const handleSetStarredMessage = async (messageId) => {
        await setStarredMessage(message.id);

        queryClient.invalidateQueries({
            queryKey: ['messages']
        });

        setShowMenu(false);
    }

    const handleUnStarredMessage = async (messageId) => {
        await unStarredMessage(message.id);

        queryClient.invalidateQueries({
            queryKey: ['messages']
        });

        setShowMenu(false);
    }

    const editMessageMutation = useMutation({
        mutationFn: ({ messageId, newContent }) =>
            editMessage(messageId, newContent),
        onSuccess: () => {
            setEditMode(false);
            queryClient.invalidateQueries({
                queryKey: ["messages"]
            });
        },
        onError: (error) => {
            console.error("Error sending message:", error);
        }
    })

    const handleEditMessage = (messageId, newContent) => {
        if (!newContent.trim()) return;
        editMessageMutation.mutate({
            messageId: messageId,
            newContent: newContent
        });
    };

    const deleteMessageMutation = useMutation({
        mutationFn: deleteMessage,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["messages"]
            });
        },
        onError: (error) => {
            console.error("Error deleting message:", error);
        }
    })

    const handleDeleteMessage = (messageId) => {
        deleteMessageMutation.mutate(messageId);
    }

    return (
        <div ref={messageRef} className={`chat ${isOwn ? 'chat-end' : 'chat-start'} relative ${showMenu ? 'z-50' : 'z-0'} transition-transform duration-200 my-1.5`} data-message-id={message.id} >

            <div role="button" tabIndex={0} className={`chat-bubble max-w-[75%] cursor-pointer select-none rounded-[18px] px-3.5 py-2.5 text-sm shadow-xs before:hidden ${isOwn ? 'chat-bubble-primary rounded-br-none text-primary-content' : 'chat-bubble-secondary rounded-bl-none text-secondary-content'}`}
                style={{ overflowWrap: 'anywhere' }}
                onMouseDown={handlePressStart}
                onMouseUp={handlePressEnd}
                onTouchStart={handlePressStart}
                onTouchEnd={handlePressEnd}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        pointerPos.current = { x: 100, y: 100 };
                        setShowMenu(true);
                    }
                }}
                onContextMenu={(e) => { e.preventDefault(); const clientX = e.clientX; const clientY = e.clientY; pointerPos.current = { x: clientX, y: clientY }; setShowMenu(true); }}>

                {/* BLOQUE DE RESPUESTA (SI ES UNA RESPUESTA) */}
                {message.reply_to_id && (
                    <button type="button" className={`w-full text-left mb-2 px-2.5 py-1.5 rounded-lg border-l-3 text-[11px] cursor-pointer select-none truncate transition-colors ${isOwn
                            ? 'bg-black/15 border-primary-content/60 text-primary-content/95 hover:bg-black/20'
                            : 'bg-base-300/50 border-secondary text-base-content/90 hover:bg-base-300/75'
                            }`}
                        onClick={() => onScrollToParent(message.reply_to_id)}
                    >
                        <p className="font-bold tracking-wider text-[9px] uppercase opacity-75 mb-0.5">
                            {message.replied_message?.sender_id === message.sender_id ? "Tú" : "Tu amor"}
                        </p>
                        <p className="truncate max-w-50">
                            {message.reply_preview ?? "Mensaje eliminado"}
                        </p>
                    </button>
                )}

                <div className="flex flex-col ">
                    <p className="whitespace-pre-wrap leading-relaxed pr-10 text-[14px]">{message.content}</p>

                    {/* METADATOS INTEGRADOS */}
                    <div className={`flex items-center justify-end gap-1 text-[9px]  -mr-1 -mb-1 select-none pointer-events-none ${isOwn ? 'text-primary-content/70' : 'text-base-content/50'}`}>
                        {message.starred && message.starred_by == user && (
                            <Star size={10} className={`${isOwn ? 'text-yellow-300 fill-yellow-300' : 'text-yellow-500 fill-yellow-500'} shrink-0`} />
                        )}
                        <time className="text-white">{parseTime(message.created_at) || "16:40"}</time>
                        {isOwn && (
                            <ReadIndicator readAt={message.read_at} className="text-primary-content/85" />
                        )}
                    </div>
                </div>
            </div>

            {/* Menú contextual */}
            {showMenu && (() => {
                // Compute fixed-position coordinates for the menu so it never goes off-screen
                const menuWidth = 200;
                const menuHeightEstimate = 180;
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
                        <button type="button" aria-label="Cerrar menú" className="fixed inset-0 z-9998 bg-base-300/30 backdrop-blur-xs transition-opacity duration-300 animate-fade-in" onClick={() => setShowMenu(false)} />
                        <div className="fixed z-9999 bg-base-100 backdrop-blur-md shadow-xl rounded-2xl flex flex-col gap-0.5 p-1.5 border border-base-200 animate-scale-in" style={{ left: `${left}px`, top: `${top}px`, width: `${menuWidth}px` }}  >
                            <button type="button" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-base-content/85 hover:bg-base-200/60 active:scale-98 transition-transform text-left" onClick={() => { onReply(message); setShowMenu(false); }} >
                                <Reply size={16} className="text-base-content/40" />
                                <span>Responder</span>
                            </button>
                            {isOwn && (
                                <button type="button" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-base-content/85 hover:bg-base-200/60 active:scale-98 transition-transform text-left" onClick={() => { setMessageEdited(message.content); setShowMenu(false); setEditMode(true); }} >
                                    <Pencil size={16} className="text-base-content/40" />
                                    <span>Editar</span>
                                </button>
                            )}
                            {message.starred && message.starred_by == user ? (
                                <button type="button" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-base-content/85 hover:bg-base-200/60 active:scale-98 transition-transform text-left" onClick={() => { handleUnStarredMessage(message.id); setShowMenu(false); }} >
                                    <Star size={16} className="text-yellow-500 fill-yellow-500 shrink-0" />
                                    <span>Quitar destacado</span>
                                </button>
                            ) : (
                                <button type="button" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-base-content/85 hover:bg-base-200/60 active:scale-98 transition-transform text-left" onClick={() => { handleSetStarredMessage(message.id); setShowMenu(false); }} >
                                    <Star size={16} className="text-base-content/40 shrink-0" />
                                    <span>Destacar</span>
                                </button>
                            )}
                            {isOwn && (
                                <button type="button" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-error hover:bg-error/10 active:scale-98 transition-transform text-left" onClick={() => { handleDeleteMessage(message.id); setShowMenu(false); }} >
                                    <Trash2 size={16} className="shrink-0" />
                                    <span>Eliminar</span>
                                </button>
                            )}
                            {message.read_at && (
                                <div className="px-3 py-1.5 border-t border-base-content/5 mt-1">
                                    <p className="text-[9px] text-base-content/40 font-medium uppercase tracking-wider">
                                        Leído el {parseDateTime(message.read_at)}
                                    </p>
                                </div>
                            )}
                        </div>
                    </>,
                    document.body
                );
            })()}

            {editMode && createPortal(
                <div className="fixed inset-0 z-9998 flex items-center justify-center p-4">
                    <button type="button" aria-label="Cerrar edición" className="fixed inset-0 bg-base-300/40 backdrop-blur-sm animate-fade-in" onClick={() => setEditMode(false)} />
                    <div className="relative z-10 bg-base-100 shadow-2xl rounded-2xl p-4 border border-base-content/5 w-full max-w-sm flex flex-col gap-3 animate-scale-in">
                        <h3 className="font-bold text-[11px] text-base-content/50 uppercase tracking-widest px-1">Editar mensaje</h3>
                        <div className="flex gap-2 items-end">
                            <textarea
                                rows={2}
                                className="textarea textarea-primary rounded-xl flex-1 min-h-15 max-h-32 p-3 text-sm resize-none border-base-content/10 focus:border-primary"
                                value={messageEdited}
                                onChange={(e) => setMessageEdited(e.target.value)}
                            />
                            <button type="button"
                                className="btn btn-circle btn-primary shrink-0 shadow-md shadow-primary/15 active:scale-90 transition-transform duration-150"
                                onClick={() => handleEditMessage(message.id, messageEdited)}
                                disabled={editMessageMutation.isPending || !messageEdited.trim()}
                                aria-label="Guardar cambios"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}