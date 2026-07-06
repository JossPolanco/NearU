import { useQueryClient, useQuery } from "@tanstack/react-query";
import { getUserId } from "../../services/user/userService";
import { fetchStarredMessages } from "../../services/chat";
import { ArrowLeft, Star } from 'lucide-react';
import { StarredBubble } from "@/components";
import { useNavigate } from "react-router";
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

    const starredLength = starredMessages?.length || 0;

    return (
        <div className="fixed inset-0 flex flex-col bg-base-200">
            <div className="bg-base-100/80 backdrop-blur-md border-b border-base-content/5 px-3 py-2.5 flex items-center gap-3 z-10 shadow-xs select-none">
                {/* VOLVER */}
                <button 
                    className="btn btn-primary btn-circle text-base-content/70 hover:bg-base-200/50 hover:text-base-content active:scale-95 transition-all duration-200" 
                    onClick={() => navigate(-1)}
                    aria-label="Volver"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="min-w-0">
                    <h1 className="font-semibold text-sm text-base-content leading-tight">Mensajes Destacados</h1>
                    <p className="text-[10px] text-primary/70 font-medium mt-0.5">
                        {starredLength === 0 
                            ? "Ningún mensaje" 
                            : starredLength === 1 
                                ? "1 mensaje guardado" 
                                : `${starredLength} mensajes guardados`
                        }
                    </p>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto px-4 py-2 scrollbar-thin">
                {starredLength > 0 ? (
                    <div className="flex flex-col gap-1 py-1">
                        {starredMessages.map((starred) => (
                            <div className="animate-fade-in" key={starred.id}>
                                <StarredBubble
                                    message={starred}
                                    isOwn={starred.sender_id === userId}
                                    messageRef={(el) => { starredRefs.current[starred.id] = el; }}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full p-6 text-center select-none animate-fade-in">
                        <div className="bg-primary/10 text-primary p-4.5 rounded-full mb-3.5">
                            <Star size={36} className="text-primary/70 fill-primary/10" />
                        </div>
                        <h3 className="font-semibold text-base text-base-content">Sin mensajes destacados</h3>
                        <p className="text-xs text-base-content/65 max-w-[240px] mt-1 leading-relaxed">
                            Mantén presionado cualquier mensaje en el chat y selecciona "Destacar" para guardarlo aquí.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

