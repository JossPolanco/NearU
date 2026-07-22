// components/MessageField.jsx
import { Send, Mic, Camera, X, CornerUpLeft } from 'lucide-react';
import { useMutation } from "@tanstack/react-query";
import { sendMessage } from "../../services/chat";
import { useState } from "react";

export default function MessageField({ replyingTo, onCancelReply, isOwn }) {
    const [message, setMessage] = useState("");

    const sendMessageMutation = useMutation({
        mutationFn: sendMessage,
        onSuccess: () => {
            setMessage("");
            onCancelReply();  // Limpiar respuesta al enviar
        },
        onError: (error) => {
            console.error("Error sending message:", error);
        }
    });

    const handleSend = () => {
        if (!message.trim()) return;
        sendMessageMutation.mutate({
            content: message,
            replyToId: replyingTo?.id ?? null,
            replyPreview: replyingTo?.content ?? null,
        });
    };

    return (
        <div className="flex flex-col p-3 gap-2 bg-linear-to-t from-base-300 via-base-300/90 to-base-300/0 z-10">
            {/* Preview del mensaje que se está respondiendo */}
            {replyingTo && (
                <div className={`flex items-center gap-2.5 bg-base-100/95 backdrop-blur-md rounded-2xl px-3.5 py-2 border-l-4 ${isOwn ? 'border-primary' : 'border-secondary'} shadow-sm animate-slide-up`}>
                    <CornerUpLeft size={14} className={`${isOwn ? 'text-primary' : 'text-secondary'} shrink-0`} />
                    <div className="flex-1 min-w-0">
                        <p className={`text-[10px] ${isOwn ? 'text-primary' : 'text-secondary'} font-bold tracking-wider uppercase`}>
                            Respondiendo a {isOwn ? "ti" : "tu amorcito"}
                        </p>
                        <p className="text-xs truncate text-base-content/85 mt-0.5">{replyingTo.content}</p>
                    </div>
                    <button  className="btn btn-ghost btn-xs btn-circle shrink-0 hover:bg-base-200/60 text-base-content/60" 
                        type="button"
                        onClick={onCancelReply} 
                    >
                        <X size={14} />
                    </button>
                </div>
            )}

            <div className="flex gap-2 items-end justify-center animate-slide-up">
                <div className="flex items-end gap-1.5 bg-base-100 border border-base-content/5 rounded-[22px] px-2.5 py-1.5 shadow-xs focus-within:border-primary/25 transition-all duration-200 flex-1">
                    <button 
                        type="button" 
                        className="btn btn-ghost btn-circle btn-sm text-base-content/50 hover:text-primary hover:bg-base-200/50 shrink-0 mb-0.5 active:scale-90 transition-all duration-150"
                        aria-label="Cámara"
                    >
                        {/* <Camera size={18} /> */}
                    </button>
                    
                    <textarea
                        rows={1}
                        placeholder="Mensaje..."
                        className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 resize-none flex-1 max-h-24 min-h-8 py-1.5 px-1 text-sm text-base-content placeholder-base-content/40 scrollbar-none"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                    />
                </div>

                {message.trim().length === 0 ? (
                   <button 
                        type="button"
                        className="btn mask mask-heart btn-primary shrink-0 shadow-md shadow-primary/15 hover:scale-102 active:scale-95 transition-all duration-150"                         
                        disabled={true}
                        aria-label="Enviar mensaje"
                    >
                        <Send size={18} />
                    </button>
                ) : (
                    <button 
                        type="button"
                        className="btn mask mask-heart btn-primary shrink-0 shadow-md shadow-primary/15 hover:scale-102 active:scale-95 transition-all duration-150" 
                        onClick={handleSend} 
                        disabled={sendMessageMutation.isPending}
                        aria-label="Enviar mensaje"
                    >
                        <Send size={18} />
                    </button>
                )}
            </div>
        </div>
    );
}
