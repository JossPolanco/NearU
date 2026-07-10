import { ArrowLeft, Plus, Loader2, CalendarHeart, Calendar } from "lucide-react";
import { useImageUpload } from "../../hooks/images/useImageUpload";
import { imageKeys, useSingleImage } from "../../hooks/images/useImages";
import { useNavigate } from 'react-router';
import { FabAdd, Modal, Drawer, CarouselNotes } from "@/components";
import { useRef } from 'react'
import { createNote, getLast5Notes } from "@/services/notes";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

export default function Notes() {
    const navigate = useNavigate();
    const refModal = useRef();
    const queryClient = useQueryClient();
    const modalTitle = "Añadir nota";
    const modalSubtitle = "Crea una nota para recordar algo";

    const { data: notes, isLoading } = useQuery({
        queryKey: ["last-five-notes"],
        queryFn: getLast5Notes,
    });

    const saveNoteMutation = useMutation({
        mutationFn: createNote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["last-five-notes"] });
        },
    });

    const { upload, state, reset } = useImageUpload({
        bucket: "photos",
        profile: "profile",
        gallery: "notes",
        invalidateQueries: [imageKeys.list("photos", "notes")],
        onSuccess: (image) => {
            if (onSuccess) {
                onSuccess(image);
            }
            if (onChange) {
                onChange(image.id);
                saveNoteMutation.mutate({
                    title: title,                    
                    noteId: image.id,
                });
                refModal.current?.close()

            }
            if (mode === "multi") {
                setTimeout(() => {
                    reset();
                }, 1500);
            }
        }
    })

    const handleSaveNote = () => {
        console.log("se guardo jajaja");
        refModal.current.close();
    }

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-6">
            {/* Header / Navigation */}
            <div className="relative flex items-center justify-center py-2 border-b border-base-200/90 dark:border-base-800/40 mb-2">
                <button className="absolute left-0 btn btn-circle btn-primary text-white active:text-white md:hover:text-white active:bg-primary/80 md:hover:bg-primary/80 transition-all duration-200"
                    onClick={() => navigate(-1)}
                    aria-label="Volver"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex items-center justify-center py-4">
                    <Title />
                </div>
            </div>

            <CarouselNotes notes={notes} isLoading={isLoading} />

            <FabAdd onClick={() => refModal.current.open()} />

            {/* View Previous Notes Button */}
            <button className="btn btn-outline btn-primary rounded-2xl w-full min-h-12 flex items-center justify-center gap-2 border-2 text-sm font-semibold transition-all duration-200 active:scale-[0.98] shadow-xs">
                <CalendarHeart className="w-5 h-5" />
                Notitas 🐜eriores
            </button>

            <Modal ref={refModal} modalTitle={modalTitle} modalSubtitle={modalSubtitle}>
                <Drawer />

                <button className="btn btn-primary w-full mt-4 rounded-xl transform active:scale-110 ease-in-out " onClick={handleSaveNote}>
                    Guardar notita
                </button>
            </Modal>
        </div>
    )
}

export function Title() {
    return (
        <h2 className="text-2xl font-bold text-center">
            <span className="text-red-500">❤️</span>
            <span className="text-orange-500">N</span>
            <span className="text-yellow-400">O</span>
            <span className="text-green-500">T</span>
            <span className="text-cyan-400">A</span>
            <span className="text-violet-500">S</span>
            <span className="text-pink-500">❤️</span>
        </h2>
    )
}