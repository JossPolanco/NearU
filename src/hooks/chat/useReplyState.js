import { useState, useCallback } from "react";

export function useReplyState() {
    const [replyingTo, setReplyingTo] = useState(null);
    // { id: string, content: string, sender_id: string }

    const startReply = useCallback((message) => {
        setReplyingTo({
            id: message.id,
            content: message.content,  // YA DESCIFRADO
            sender_id: message.sender_id,
        });
    }, []);

    const cancelReply = useCallback(() => setReplyingTo(null), []);

    return { replyingTo, startReply, cancelReply };
}