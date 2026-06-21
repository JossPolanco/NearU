import { getPartnerProfile } from '../services/user/userService';
import { useQuery } from '@tanstack/react-query';
import { Star, ArrowLeft } from 'lucide-react';

export default function ChatHeader() {
  const { data: partnerProfile } = useQuery({
    queryKey: ['partnerProfile'],
    queryFn: getPartnerProfile,
  });

  return (
    <div className="bg-base-100 px-4 py-2 gap-2 flex items-center">
      {/* VOLVER */}
      <button className="btn btn-primary btn-circle" onClick={() => window.history.back()}>
        <ArrowLeft size={24} />
      </button>

      <div className="avatar avatar-online size-12">
        <div className="w-20 rounded-full">
          <img src={partnerProfile?.avatar_url || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPySnqxeKdKLTPzZFpDszmCg-e0NGSsFxqaw&s"} alt="Avatar" />
        </div>
      </div>

      <div>
        <h2 className="card-title">{partnerProfile?.nickname || "Usuario"} </h2>
      </div>

      {/* MENSAJES DESTACADOS */}
      <button className="btn btn-ghost btn-circle">
        <Star size={24} />
      </button>
    </div>
  )
}
