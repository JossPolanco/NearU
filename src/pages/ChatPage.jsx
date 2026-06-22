import { fetchMessages, subscribeToMessages } from "../services/chat/messagesService";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useReadReceipts } from "../hooks/useReadReceipts";
import { getUserId } from "../services/user/userService";
import { useReplyState } from "../hooks/useReplyState";
import MessageBubble from "../components/MessageBubble";
import MessageField from "../components/MessageField";
import ChatHeader from "../components/ChatHeader";
import { useEffect, useRef, useMemo } from "react";

export default function ChatPage() {
    const { replyingTo, startReply, cancelReply } = useReplyState();
    const queryClient = useQueryClient();
    const messageRefs = useRef({});
    const bottomRef = useRef(null);

    const { data: messages } = useQuery({
        queryKey: ['messages'],
        queryFn: fetchMessages,
    });

    const { data: userId } = useQuery({
        queryKey: ["user"],
        queryFn: getUserId,
    });

    useReadReceipts(messages, userId);

    useEffect(() => {
        const unsubscribe = subscribeToMessages(queryClient);
        return () => unsubscribe();
    }, [queryClient]);

    // AUTO-SCROLL AL FINAL CUANDO LLEGAN NUEVOS MENSAJES
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // CALCULA EL PRIMER MENSAJE NO LEÍDO DEL OTRO USUARIO PARA POSIBLE SCROLL AUTOMÁTICO
    const firstUnreadIndex = useMemo(() => {
        if (!messages || !userId) return -1;
        return messages.findIndex(m => m.sender_id !== userId && !m.read_at);
    }, [
        messages?.length,
        userId
    ]);

    return (
        <div className="fixed inset-0 flex flex-col bg-base-300">
            <ChatHeader />
            <div className="flex-1 overflow-y-auto px-4">
                {messages?.map((message, index) => (
                    <div key={message.id}>
                        {/* SEPARADOR DE MENSAJES NO LEIDOS */}
                        {index === firstUnreadIndex && (
                            <UnreadSeparator count={messages.length - firstUnreadIndex} />
                        )}
                        {/* MENSAJE */}
                        <MessageBubble
                            key={message.id}
                            message={message}
                            isOwn={message.sender_id === userId}
                            onReply={startReply}
                            messageRef={(el) => { messageRefs.current[message.id] = el; }}
                            onScrollToParent={(id) => {
                                messageRefs.current[id]?.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'center'
                                });
                            }}
                        />
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>
            <MessageField
                replyingTo={replyingTo}
                onCancelReply={cancelReply}
                isOwn={replyingTo?.sender_id === userId}
            />
        </div>
    );
}

function UnreadSeparator({ count }) {
    return (
        <div className="flex items-center gap-3 my-3 px-2">
            <div className="flex-1 h-px bg-base-content/20" />
            <span className="text-xs text-base-content/50 whitespace-nowrap">
                {count === 1 ? "1 mensaje nuevo" : `${count} mensajes nuevos`}
            </span>
            <div className="flex-1 h-px bg-base-content/20" />
        </div>
    );
}