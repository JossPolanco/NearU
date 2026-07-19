import { getPartnerProfile } from '../../services/user/userService';
import { useQuery } from '@tanstack/react-query';
import { Star, ArrowLeft } from 'lucide-react';
import { useNavigate } from "react-router";

export default function ChatHeader() {
    const navigate = useNavigate();

    const { data: partnerProfile } = useQuery({
        queryKey: ['partnerProfile'],
        queryFn: getPartnerProfile,
    });

    return (
        <div className="bg-base-100/80 backdrop-blur-md border-b border-base-content/5 px-3 py-2.5 flex items-center justify-between z-10 shadow-xs select-none">
            <div className="flex items-center gap-2 min-w-0">
                {/* VOLVER */}
                <button className="btn btn-circle btn-primary text-white active:text-white md:hover:text-white active:bg-primary/80 md:hover:bg-primary/80 transition-all duration-200"
                    onClick={() => navigate(-1)}
                    aria-label="Volver"
                >
                    <ArrowLeft size={20} />
                </button>

                {/* PERFIL */}
                <div className="flex items-center gap-3 min-w-0">
                    <div className="avatar avatar-online shrink-0">
                        <div className="w-10 h-10 rounded-full ring-2 ring-primary/20 ring-offset-2 ring-offset-base-100">
                            <img
                                src={partnerProfile?.avatar_url || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPySnqxeKdKLTPzZFpDszmCg-e0NGSsFxqaw&s"}
                                alt="Avatar"
                                className="object-cover"
                            />
                        </div>
                    </div>

                    <div className="min-w-0">
                        <h2 className="font-semibold text-sm text-base-content truncate leading-tight">
                            {partnerProfile?.nickname || "Tu amor"}
                        </h2>
                        <p className="text-[10px] text-primary/70 font-medium flex items-center gap-1 mt-0.5">
                            Te amo mucho mi niña 😚😚
                            {/* <span className="w-1.5 h-1.5 rounded-full bg-success inline-block animate-pulse" /> */}
                        </p>
                    </div>
                </div>
            </div>

            {/* MENSAJES DESTACADOS */}
            <button className="btn btn-ghost btn-circle text-base-content/70 hover:bg-base-200/50 hover:text-yellow-500 active:scale-95 transition-all duration-200"
                onClick={() => navigate("/starred-messages")}
                aria-label="Mensajes destacados"
            >
                <Star size={20} />
            </button>
        </div>
    )
}
