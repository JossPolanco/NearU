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
        console.log("Enviando mensaje:", { message, replyingTo });
        sendMessageMutation.mutate({
            content: message,
            replyToId: replyingTo?.id ?? null,
            replyPreview: replyingTo?.content ?? null,
        });
    };

    return (
        <div className="flex flex-col p-2 gap-2">
            {/* Preview del mensaje que se está respondiendo */}
            {replyingTo && (
                <div className={`flex items-center gap-2 bg-base-200 rounded-xl px-3 py-2 border-l-4 ${isOwn ? 'border-primary' : 'border-secondary'}`}>
                    <CornerUpLeft size={16} className={`${isOwn ? 'text-primary' : 'text-secondary'}  shrink-0`} />
                    <div className="flex-1 min-w-0">
                        <p className={`text-xs ${isOwn ? 'text-primary' : 'text-secondary'} font-semibold`}>Respondiendo</p>
                        <p className="text-sm truncate opacity-70">{replyingTo.content}</p>
                    </div>
                    <button className="btn btn-ghost btn-xs btn-circle shrink-0" onClick={onCancelReply} >
                        <X size={14} />
                    </button>
                </div>
            )}

            <div className="flex gap-2 justify-center items-center">
                <textarea
                    rows={1}
                    placeholder="Mensaje..."
                    className="textarea textarea-primary rounded-xl flex-1 h-12
                     min-h-0 resize-none overflow-y-auto"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />

                <Camera size={26} />

                {message.length === 0 ? (
                    <button className="btn btn-circle btn-primary">
                        <Mic size={20} />
                    </button>
                ) : (
                    <button className="btn btn-circle btn-primary" onClick={handleSend} disabled={sendMessageMutation.isPending} >
                        <Send size={20} />
                    </button>
                )}
            </div>
        </div>
    );
}