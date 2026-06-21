import { fetchMessages, subscribeToMessages } from "../services/chat/messagesService";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { getUserId } from "../services/user/userService";
import MessageField from "../components/MessageField";
import ChatHeader from "../components/ChatHeader";
import { useEffect, useRef } from "react";

export default function ChatPage() {
    const queryClient = useQueryClient();
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
        <div className="fixed inset-0  flex flex-col bg-base-300" >
            <ChatHeader />

            <div className="flex-1 overflow-y-auto px-4 ">
                {messages?.map((message) => (
                    message.sender_id !== userId ? (
                        // ES EL DEL OTRO USUARIO
                        <div key={message.id} className="chat chat-start ">
                            <div className="chat-header">
                                <time className="text-xs opacity-50 ">{message.timestamp}</time>
                            </div>
                            <div className="chat-bubble chat-bubble-secondary max-w-[75%]" style={{ overflowWrap: 'anywhere' }}>
                                <p className=" whitespace-pre-wrap">
                                    {message.content}
                                </p>
                            </div>
                        </div>

                    ) : (
                        // ES EL DEL USUARIO LOGUEADO
                        <div key={message.id} className="chat chat-end ">
                            <div className="chat-header">
                                <time className="text-xs opacity-50">{message.timestamp}</time>
                            </div>
                            <div className="chat-bubble chat-bubble-primary max-w-[75%]" style={{ overflowWrap: 'anywhere' }}>
                                <p className="whitespace-pre-wrap">
                                    {message.content}
                                </p>
                            </div>
                        </div>
                    )
                ))}
                <div ref={bottomRef} />
            </div>

            <MessageField />
        </div>
    );
}