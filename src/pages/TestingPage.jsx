import { UploadPanel, GalleryPanel, Modal } from "@/components";
import { getCurrentUser } from '../services/user/userService';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useRef, useState } from "react";
import { ArrowLeft, Heart } from "lucide-react";

export default function TestingPage() {
    const navigate = useNavigate()
    const modalRef = useRef(null)
    const [activeGallery, setActiveGallery] = useState('default')

    const { data: user, isLoading } = useQuery({
        queryKey: ["user"],
        queryFn: getCurrentUser,
    });

    return (
        <div className="max-w-md mx-auto p-4 space-y-6 pb-24 animate-fade-in">
            {/* Header / Navigation */}
            <div className="flex items-center justify-between py-2 border-b border-base-200/90 dark:border-base-800/40 mb-2">
                <button className="btn btn-circle btn-primary text-white active:text-white md:hover:text-white active:bg-primary/80 md:hover:bg-primary/80 transition-all duration-200"
                    onClick={() => navigate(-1)}
                    aria-label="Volver" >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex items-end gap-1.5 text-xs font-semibold text-base-content/60 bg-base-100 px-4 py-1.5 rounded-full border border-base-300/40 shadow-3xs">
                    <Heart className="w-3.5 h-3.5 text-primary fill-primary/15 animate-pulse" />
                    <span>Detalles de la cita</span>
                </div>
            </div>

            {/* Selector de galería */}
            <div className="space-y-2">
                <p className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">Galería Activa</p>
                <div role="tablist" className="tabs tabs-boxed">
                    <button role="tab" className={`tab ${activeGallery === 'default' ? 'tab-active' : ''}`} onClick={() => setActiveGallery('default')} >
                        Por Defecto (default)
                    </button>
                    <button role="tab" className={`tab ${activeGallery === 'citas' ? 'tab-active' : ''}`} onClick={() => setActiveGallery('citas')} >
                        Citas (citas)
                    </button>
                </div>
            </div>

            <button className="btn btn-primary" onClick={() => modalRef.current?.open()}>
                Abrir Modal de Prueba ({activeGallery})
            </button>

            <Modal ref={modalRef}>
                {/* Panel de subida */}
                <UploadPanel bucket='photos' gallery={activeGallery} user={user} />
            </Modal>

            {/* Galería de fotos del bucket "photos" */}
            <GalleryPanel bucket='photos' gallery={activeGallery} enableDelete={true} />

        </div>
    )
}