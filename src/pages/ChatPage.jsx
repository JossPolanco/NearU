import { fetchMessages, subscribeToMessages } from "../services/chat/messagesService";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { getUserId } from "../services/user/userService";
import { useReplyState } from "../hooks/useReplyState";
import MessageBubble from "../components/MessageBubble";
import MessageField from "../components/MessageField";
import ChatHeader from "../components/ChatHeader";
import { useEffect, useRef } from "react";

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

    useEffect(() => {
        const unsubscribe = subscribeToMessages(queryClient);
        return () => unsubscribe();
    }, [queryClient]);

    // Auto-scroll al fondo cuando lleguen mensajes
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="fixed inset-0 flex flex-col bg-base-300">
            <ChatHeader />
            <div className="flex-1 overflow-y-auto px-4">
                {messages?.map((message) => (
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
                ))}
                <div ref={bottomRef} />
            </div>
            <MessageField
                replyingTo={replyingTo}
                onCancelReply={cancelReply}
            />
        </div>
    );
}