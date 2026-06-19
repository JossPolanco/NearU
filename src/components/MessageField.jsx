import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Send } from 'lucide-react';
import { useState } from "react";
import { sendMessage } from "../services/chat/messagesService";

export default function MessageField() {
    const [message, setMessage] = useState("");
    const queryClient = useQueryClient();

    const sendMessageMutation = useMutation({
        mutationFn: sendMessage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messages'] });
            setMessage("")
        },

        onError: (error) => {
            console.error("Error sending message:", error);
        }
    });

    return (
        <div className="sticky bottom-0 bg-base-300 px-4 py-2 flex gap-2">
            <input
                type="text"
                placeholder="Mensaje..."
                className="input input-bordered flex-1"
                onChange={(e) => setMessage(e.target.value)}
            />

            <button className="btn btn-circle btn-primary" onClick={() => {sendMessageMutation.mutate({ contain: message })}}>
                <Send size={20} />
            </button>
        </div>
    );
}