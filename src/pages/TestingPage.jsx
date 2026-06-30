import { UploadPanel, GalleryPanel, Modal } from "@/components"
import { getCurrentUser } from '../services/user/userService'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router';
import { useRef, useState } from "react";

export default function TestingPage() {
    const navigate = useNavigate()
    const modalRef = useRef(null)
    const [activeGallery, setActiveGallery] = useState('default')

    const { data: user, isLoading } = useQuery({
        queryKey: ["user"],
        queryFn: getCurrentUser,
    });

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-6">

            <div className="flex items-center gap-3">
                <button className="btn btn-ghost btn-sm" onClick={() => navigate('/home')}>
                    ← Volver
                </button>
                <h1 className="font-semibold text-lg">Testing: Sistema de imágenes</h1>
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
            <GalleryPanel bucket='photos' gallery={activeGallery} />

        </div>
    )
}