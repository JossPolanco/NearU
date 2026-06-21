import { sendMessage } from "../services/chat/messagesService";
import { useMutation } from "@tanstack/react-query";
import { Send, Mic, Camera } from 'lucide-react';
import { useState } from "react";

export default function MessageField() {
    const [message, setMessage] = useState("");

    const sendMessageMutation = useMutation({
        mutationFn: sendMessage,
        onSuccess: () => {
            setMessage("")
        },

        onError: (error) => {
            console.error("Error sending message:", error);
        }
    });

    return (
        <div className="p-2 flex gap-2 justify-center items-center">
            <textarea
                rows={1}
                placeholder="Mensaje..."
                className="textarea  textarea-primary rounded-xl flex-1 h-12 min-h-0 resize-none overflow-y-auto"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />

            <div>
                <Camera size={26} />
            </div>

            {(message.length === 0) ? (
                <button className="btn btn-circle btn-primary">
                    <Mic size={20} />
                </button>
            ) : (

                <button className="btn btn-circle btn-primary" onClick={() => { sendMessageMutation.mutate({ contain: message }) }}>
                    <Send size={20} />
                </button>
            )}
        </div>
    );
}