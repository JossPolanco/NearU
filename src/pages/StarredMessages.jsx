import { fetchStarredMessages } from "../services/chat/messagesService";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { getUserId } from "../services/user/userService";
import StarredBubble from "../components/StarredBubble";
import { useNavigate } from "react-router";
import { ArrowLeft } from 'lucide-react';
import { useRef } from "react";

export default function StarredMessages() {
    const queryClient = useQueryClient();
    const starredRefs = useRef({});
    const navigate = useNavigate();

    const { data: starredMessages } = useQuery({
        queryKey: ['starred-messages'],
        queryFn: fetchStarredMessages,
    });

    const { data: userId } = useQuery({
        queryKey: ["user"],
        queryFn: getUserId,
    });

    const starredLenght = starredMessages?.length || 0;

    return (
        <div className="fixed inset-0 flex flex-col bg-base-300">
            <div className="bg-base-100 px-4 py-2 gap-2 flex items-center mb-2">
                {/* VOLVER */}
                <button className="btn btn-primary btn-circle" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>
                <h1 className='text-primary font-bold text-2xl'>{starredLenght} Mensajes Destacados</h1>
            </div>
            <div className="flex-1 overflow-y-auto px-4 ">
                {starredMessages?.length > 0 ? (
                    starredMessages.map((starred) => (
                        <div className="mb-2 border-b-2 border-base-100" key={starred.id}>
                            <StarredBubble
                                key={starred.id}
                                message={starred}
                                isOwn={starred.sender_id === userId}
                                messageRef={(el) => { starredRefs.current[starred.id] = el; }}
                            />
                        </div>
                    ))
                ) : (
                    <div className="flex flex-1 items-center justify-center h-full">
                        <p className="text-center text-base-content/70">
                            No hay mensajes destacados.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
