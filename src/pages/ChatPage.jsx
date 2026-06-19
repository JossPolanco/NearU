import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { fetchMessages, subscribeToMessages } from "../services/chat/messagesService";
import MessageField from "../components/MessageField";

import ChatConf from "../components/ChatConf";
import { supabaseClient } from "../utils/supabase";
import { useEffect } from "react";
import { getUserId } from "../services/user/userService";

export default function ChatPage() {

    const queryClient = useQueryClient();

    const { data: messages } = useQuery({
        queryKey: ['messages'],
        queryFn: fetchMessages,
    });

    const { data: userId } = useQuery({
        queryKey: ["user"],
        queryFn: getUserId,
    });

    useEffect(() => {
        const channel = supabaseClient
            .channel('messages')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'tbl_messages',
                },
                (payload) => {
                    queryClient.setQueryData(
                        ['messages'],
                        (oldMessages = []) => [
                            ...oldMessages,
                            payload.new
                        ]
                    );
                }
            )
            .subscribe();

        return () => {
            supabaseClient.removeChannel(channel);
        };
    }, [queryClient]);

    console.log(messages);

    return (
        <div className="h-screen flex flex-col pb-16">
            <ChatConf />

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
            </div>

            <MessageField />
        </div>
    );
}