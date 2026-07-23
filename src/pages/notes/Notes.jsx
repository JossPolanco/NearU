import { useResolveSignedUrls } from "../../hooks/images/useResolveSignedUrls";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { FabAdd, Modal, Drawer, CarouselNotes } from "@/components";
import { useImageUpload } from "../../hooks/images/useImageUpload";
import { ArrowLeft, Loader2, StickyNote } from "lucide-react";
import { createNote, getLast5Notes } from "@/services/notes";
import { getUserId } from "../../services/user/userService";
import { imageKeys } from "../../hooks/images/useImages";
import { useNavigate } from 'react-router';
import { useRef } from 'react';

export default function Notes() {
    const navigate = useNavigate();
    const refModal = useRef();
    const drawerRef = useRef();
    const pendingTitleRef = useRef("Sin título");
    const queryClient = useQueryClient();
    const modalTitle = "Añadir nota";
    const modalSubtitle = "Crea una nota para recordar algo";

    const { data: userId } = useQuery({
        queryKey: ["user-id"],
        queryFn: getUserId,
    });

    const { data: notes, isLoading } = useResolveSignedUrls(
        ["last-five-notes"],
        getLast5Notes
    );

    const saveNoteMutation = useMutation({
        mutationFn: createNote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["last-five-notes"] });
            queryClient.invalidateQueries({ queryKey: ["notes"] });
            refModal.current?.close();
            drawerRef.current?.resetCanvas();
            reset();
        },
    });

    const { upload, state, reset } = useImageUpload({
        bucket: "drawings",
        profile: "drawing",
        gallery: "notes",
        invalidateQueries: [imageKeys.list("drawing", "notes")],
        onSuccess: (image) => {
            saveNoteMutation.mutate({
                title: pendingTitleRef.current,
                image_id: image.id,
            });
        }
    });

    const isSaving =
        (state.stage !== "idle" && state.stage !== "success" && state.stage !== "error") ||
        saveNoteMutation.isPending;

    const handleSaveNote = async () => {
        try {
            if (!drawerRef.current) return;
            const data = await drawerRef.current.getDrawingData();
            if (!data || data.isEmpty) {
                alert("Por favor, realiza un dibujo antes de guardar.");
                return;
            }

            const response = await fetch(data.dataUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const blob = await response.blob();
            const cleanTitle = data.title.trim() || "Sin título";
            const filename = `${cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, "_") || "dibujo"}.png`;
            const file = new File([blob], filename, { type: "image/png" });

            if (!userId) {
                alert("Usuario no autenticado.");
                return;
            }

            pendingTitleRef.current = cleanTitle;
            await upload(file, userId);
        } catch (error) {
            console.error("Error al guardar la nota:", error);
            alert("Ocurrió un error al guardar la nota.");
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-6">
            {/* Header / Navigation */}
            <div className="relative flex items-center justify-center border-b border-base-200/90 dark:border-base-800/40 mb-2">
                <button type="button" className="absolute left-0 btn btn-circle btn-primary text-white active:text-white md:hover:text-white active:bg-primary/80 md:hover:bg-primary/80 transition-transform duration-200"
                    onClick={() => navigate(-1)}
                    aria-label="Volver"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center justify-center py-4">
                    <Title />
                </div>
            </div>


            <div className="w-full">
                {/* <h2 className="text-xl font-semibold text-center">Ultimas 5 notitas</h2> */}
                <CarouselNotes notes={notes} isLoading={isLoading} />
            </div>

            <FabAdd onClick={() => refModal.current.open()} />

            {/* View Previous Notes Button */}
            <button type="button" className="btn btn-primary rounded-2xl w-full min-h-12.5 flex items-center justify-center gap-2 text-sm font-semibold transition-transform duration-200 active:scale-[0.98] shadow-md border-0"
                onClick={() => navigate("/notes-gallery")}>
                <StickyNote className="w-5 h-5" />
                Ver todas las notitas 🐜eriores
            </button>

            <Modal ref={refModal} modalTitle={modalTitle} modalSubtitle={modalSubtitle}>
                <Drawer ref={drawerRef} />

                <button type="button" className="btn btn-primary w-full mt-4 rounded-xl transform active:scale-110 ease-in-out" onClick={handleSaveNote} disabled={isSaving}>
                    {isSaving ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Guardando...
                        </>
                    ) : (
                        "Guardar notita"
                    )}
                </button>

                {state.error && (
                    <p className="text-error text-xs text-center mt-2 font-semibold">{state.error}</p>
                )}
            </Modal>
        </div>
    )
}

export function Title() {
    return (
        <h2 className="text-3xl font-extrabold tracking-tight text-center drop-shadow-xs bg-base-100 px-4 py-1.5 rounded-full">
            <span className="text-orange-500">N</span>
            <span className="text-amber-400">o</span>
            <span className="text-yellow-400">t</span>
            <span className="text-lime-500">i</span>
            <span className="text-green-500">t</span>
            <span className="text-emerald-500">a</span>
            <span className="text-cyan-400">s</span>
            <span> </span>
            <span className="text-sky-500">d</span>
            <span className="text-blue-500">e</span>
            <span> </span>
            <span className="text-indigo-500">A</span>
            <span className="text-violet-500">m</span>
            <span className="text-fuchsia-500">o</span>
            <span className="text-pink-500">r</span>
        </h2>
    );
}