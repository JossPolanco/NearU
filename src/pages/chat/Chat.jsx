import { UnreadSeparator, MessageField, MessageBubble, ChatHeader } from "@/components";
import { fetchMessages } from "../../services/chat/messagesService";
import { subscribeToMessages } from "../../services/chat/subscriptionService";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { getUserId } from "../../services/user/userService";
import { useReadReceipts, useReplyState } from "@/hooks";
import { useEffect, useRef, useMemo } from "react";
import { Heart } from "lucide-react";

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
            
            <div className="flex-1 overflow-y-auto px-4 py-2 scrollbar-thin">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full">
                        <span className="loading loading-heart text-primary loading-lg"></span>
                    </div>
                ) : messages?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-6 text-center select-none animate-fade-in">
                        <div className="bg-primary/10 text-primary p-4.5 rounded-full mb-3.5 animate-pulse">
                            <Heart size={36} className="fill-primary/20" />
                        </div>
                        <h3 className="font-semibold text-base text-base-content">Comienza su conversación</h3>
                        <p className="text-xs text-base-content/65 max-w-60 mt-1 leading-relaxed">
                            Este es su espacio privado para compartir amor, risas y recuerdos cotidianos.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-1">
                        {messages?.map((message, index) => (
                            <div key={message.id} className="animate-fade-in">
                                {/* SEPARADOR DE MENSAJES NO LEIDOS */}
                                {index === firstUnreadIndex && (
                                    <UnreadSeparator count={messages.length - firstUnreadIndex} />
                                )}
                                {/* MENSAJE */}
                                <MessageBubble
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
                        ))}
                    </div>
                )}
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
