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
            <div className="relative flex items-center justify-center py-2 border-b border-base-200/90 dark:border-base-800/40 mb-2">
                <button className="absolute left-0 btn btn-circle btn-primary text-white active:text-white md:hover:text-white active:bg-primary/80 md:hover:bg-primary/80 transition-all duration-200"
                    onClick={() => navigate(-1)}
                    aria-label="Volver"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center justify-center py-4">
                    <Title />
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

export function Title() {
    return (
        <h2 className="text-3xl font-extrabold tracking-tight text-center drop-shadow-xs py-1">
            <span className="text-orange-500">P</span>
            <span className="text-orange-400">a</span>
            <span className="text-amber-400">g</span>
            <span className="text-yellow-400">i</span>
            <span className="text-lime-500">n</span>
            <span className="text-green-500">i</span>
            <span className="text-emerald-500">t</span>
            <span className="text-cyan-400">a</span>
            <span> </span>
            <span className="text-sky-500">d</span>
            <span className="text-blue-500">e</span>
            <span> </span>
            <span className="text-indigo-500">p</span>
            <span className="text-violet-500">r</span>
            <span className="text-fuchsia-500">u</span>
            <span className="text-pink-500">e</span>
            <span className="text-rose-500">b</span>
            <span className="text-red-500">a</span>
            <span className="text-orange-500">s</span>
        </h2>
    );
}