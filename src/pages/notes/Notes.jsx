import { ArrowLeft, Plus, Loader2, CalendarHeart, Calendar } from "lucide-react";
import { useImageUpload } from "../../hooks/images/useImageUpload";
import { imageKeys, useSingleImage } from "../../hooks/images/useImages";
import { useNavigate } from 'react-router';
import { FabAdd, Modal, Drawer, CarouselNotes } from "@/components";
import { useRef } from 'react'


export default function Notes() {
    const navigate = useNavigate();
    const refModal = useRef();
    const modalTitle = "Añadir nota";
    const modalSubtitle = "Crea una nota para recordar algo";

    const handleAddNote = () => {
        refModal.current.open();
    }

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

            {/* Polaroid Carousel */}
            <div className="flex flex-col items-center justify-center w-full">
                <div className="carousel carousel-centerbackdrop-blur-xs rounded-3xl max-w-sm space-x-6 p-6 border border-base-200 shadow-sm mx-auto">
                    {/* Item 1 */}
                    <div id="item1" className="carousel-item flex-col bg-white dark:bg-base-200 p-4 pb-10 rounded-2xl shadow-md border border-base-300/40 max-w-70 rotate-[-1.5deg] transition-all duration-300 md:hover:rotate-0 md:hover:scale-[1.02]">
                        <img
                            src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600&auto=format&fit=crop"
                            className="rounded-xl w-full aspect-square object-cover pointer-events-none"
                            alt="Nuestros momentos"
                        />
                        <p className="mt-4 font-serif italic text-center text-base-content/85 text-sm">Nuestros momentos ❤️</p>
                    </div>

                    {/* Item 2 */}
                    <div id="item2" className="carousel-item flex-col bg-white dark:bg-base-200 p-4 pb-10 rounded-2xl shadow-md border border-base-300/40 max-w-70 rotate-[1.5deg] transition-all duration-300 md:hover:rotate-0 md:hover:scale-[1.02]">
                        <img
                            src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=600&auto=format&fit=crop"
                            className="rounded-xl w-full aspect-square object-cover pointer-events-none"
                            alt="Trazos de amor"
                        />
                        <p className="mt-4 font-serif italic text-center text-base-content/85 text-sm">Trazos de amor ✨</p>
                    </div>

                    {/* Item 3 */}
                    <div id="item3" className="carousel-item flex-col bg-white dark:bg-base-200 p-4 pb-10 rounded-2xl shadow-md border border-base-300/40 max-w-70 -rotate-1 transition-all duration-300 md:hover:rotate-0 md:hover:scale-[1.02]">
                        <img
                            src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=600&auto=format&fit=crop"
                            className="rounded-xl w-full aspect-square object-cover pointer-events-none"
                            alt="Para recordar siempre"
                        />
                        <p className="mt-4 font-serif italic text-center text-base-content/85 text-sm">Para recordar siempre 💫</p>
                    </div>

                    {/* Item 4 */}
                    <div id="item4" className="carousel-item flex-col bg-white dark:bg-base-200 p-4 pb-10 rounded-2xl shadow-md border border-base-300/40 max-w-70 rotate-2 transition-all duration-300 md:hover:rotate-0 md:hover:scale-[1.02]">
                        <img
                            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=600&auto=format&fit=crop"
                            className="rounded-xl w-full aspect-square object-cover pointer-events-none"
                            alt="Juntos es mejor"
                        />
                        <p className="mt-4 font-serif italic text-center text-base-content/85 text-sm">Juntos es mejor 🌸</p>
                    </div>

                    {/* Item 5 */}
                    <div id="item5" className="carousel-item flex-col bg-white dark:bg-base-200 p-4 pb-10 rounded-2xl shadow-md border border-base-300/40 max-w-70 -rotate-2 transition-all duration-300 md:hover:rotate-0 md:hover:scale-[1.02]">
                        <img
                            src="https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=600&auto=format&fit=crop"
                            className="rounded-xl w-full aspect-square object-cover pointer-events-none"
                            alt="Tú y yo"
                        />
                        <p className="mt-4 font-serif italic text-center text-base-content/85 text-sm">Tú y yo 🧸</p>
                    </div>
                </div>
            </div>

            {/* Navigation Indicators */}
            <div className="flex w-full justify-center gap-3 py-2 max-w-xs mx-auto">
                <a href="#item1" className="btn btn-xs btn-primary mask mask-heart text-white w-7 h-7 flex items-center justify-center p-0 transition-transform active:scale-125 duration-150">1</a>
                <a href="#item2" className="btn btn-xs btn-primary mask mask-heart text-white w-7 h-7 flex items-center justify-center p-0 transition-transform active:scale-125 duration-150">2</a>
                <a href="#item3" className="btn btn-xs btn-primary mask mask-heart text-white w-7 h-7 flex items-center justify-center p-0 transition-transform active:scale-125 duration-150">3</a>
                <a href="#item4" className="btn btn-xs btn-primary mask mask-heart text-white w-7 h-7 flex items-center justify-center p-0 transition-transform active:scale-125 duration-150">4</a>
                <a href="#item5" className="btn btn-xs btn-primary mask mask-heart text-white w-7 h-7 flex items-center justify-center p-0 transition-transform active:scale-125 duration-150">5</a>
            </div>

            <FabAdd onClick={handleAddNote} />

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