import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import MessageField from "../components/MessageField";
import ChatConf from "../components/ChatConf";

export default function ChatPage() {
    return (
        <div className="h-screen flex flex-col pb-16">
            <ChatConf />

            <div className="flex-1 overflow-y-auto px-4 ">
                <div className="max-w-2xl mx-auto flex flex-col gap-4">
                    <div className="chat chat-start">
                        <div className="chat-header">
                            <time className="text-xs opacity-50">2 hours ago</time>
                        </div>
                        <div className="chat-bubble bg-base-200">
                            You were the Chosen One!
                        </div>
                    </div>

                    <div className="chat chat-end">
                        <div className="chat-header">
                            <time className="text-xs opacity-50">4:45 p.m</time>
                        </div>
                        <div className="chat-bubble bg-base-200">
                            You were the Chosen One!
                        </div>
                    </div>
                </div>
            </div>

            <MessageField />
        </div>
    );
}