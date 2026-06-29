import { UnreadSeparator, MessageField, MessageBubble, ChatHeader } from "@/components";
import { fetchMessages, subscribeToMessages } from "../../services/chat";
import { useReadReceipts, useReplyState } from "@/hooks";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { getUserId } from "../../services/user/userService";
import { useEffect, useRef, useMemo } from "react";

export default function Chat() {
    const { replyingTo, startReply, cancelReply } = useReplyState();
    const queryClient = useQueryClient();
    const messageRefs = useRef({});
    const bottomRef = useRef(null);
    
    const { data: messages } = useQuery({
        queryKey: ['messages'],
        queryFn: fetchMessages,
    });

    const { data: userId, isLoading } = useQuery({
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
                {messages?.length === 0 && !isLoading && (
                    <div className="flex flex-1 items-center justify-center h-full">
                        <p className="text-center text-base-content/70">Aún no hay mensajes</p>
                    </div>
                )}

                {(isLoading ? (
                    <div className="flex flex-1 items-center justify-center h-full">
                        <span className="loading loading-spinner text-primary"></span>
                    </div>
                ) : (

                    messages?.map((message, index) => (
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
                                user={userId}
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
                    ))))}
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