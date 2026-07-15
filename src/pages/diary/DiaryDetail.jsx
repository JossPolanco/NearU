import { React, useRef } from 'react'
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { getDiaryEntryByDate } from "@/services/diary"
import { useQuery, useMutation } from "@tanstack/react-query";
import { Modal } from "@/components"
import { z } from "zod";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";

const createDiaryEntrySchema = z.object({
    title: z.string().min(1, "El título es obligatorio").max(100, "El título debe tener menos de 100 caracteres"),
    content: z.string().min(1, "El contenido es obligatorio"),
    mood: z.enum(["feliz", "triste", "neutral", "enojado", "emocionado"]),
})

export default function DiaryDetail() {
    const { currentDate } = useParams()
    const navigate = useNavigate()
    const refModal = useRef(null)

    const { data, isLoading } = useQuery({
        queryKey: ["diary", currentDate],
        queryFn: () => getDiaryEntryByDate(currentDate),
    })

    // const editDateMutation = useMutation({
    //     mutationFn: updateDate,
    //     onSuccess: () => {
    //         queryClient.invalidateQueries({ queryKey: ["dates"] })
    //         refModal.current?.close()
    //         reset()
    //         setEditingDateId(null)
    //     },
    //     onError: (error) => {
    //         console.error("Error updating date:", error)
    //     }
    // })

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
            {currentDate}
            {isLoading ? (
                <div className="flex items-center justify-center h-32">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : (
                <>
                    {data && data.length > 0 ? (
                        <div className="flex items-center justify-center h-32">
                            <p className="text-center">No hay entrada de diario para esta fecha</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            <h2 className="text-2xl font-bold">{data?.title}</h2>
                            <p>{data?.content}</p>
                        </div>
                    )}
                </>
            )}

            <button className="btn btn-primary" onClick={() => refModal.current?.open()}>Crear entrada</button>

            <Modal modalTitle="Crear entrada" modalSubtitle="Modifica tu entrada de diario" ref={refModal} className="max-w-md">
                <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                    <label className="label" htmlFor="title">Título</label>
                    <input className="input input-bordered w-full" type="text" id="title" name="title" />
                    <label className="label" htmlFor="content">Contenido</label>
                    <input className="input input-bordered w-full" type="text" id="content" name="content" />
                </form>
            </Modal>
        </div>
    )
}

export function Title() {
    return (
        <h2 className="text-3xl font-extrabold tracking-tight text-center drop-shadow-xs bg-base-100 px-4 py-1.5 rounded-full">
            <span className="text-red-400">D</span>
            <span className="text-orange-400">e</span>
            <span className="text-yellow-400">t</span>
            <span className="text-green-400">a</span>
            <span className="text-blue-400">l</span>
            <span className="text-purple-400">l</span>
            <span className="text-purple-400">e</span>
            <span> </span>
            <span> </span>
            <span className="text-purple-400">d</span>
            <span className="text-purple-400">e</span>
            <span className="text-purple-400">l</span>
            <span> </span>
            <span> </span>
            <span className="text-red-400">D</span>
            <span className="text-orange-400">i</span>
            <span className="text-yellow-400">a</span>
            <span className="text-green-400">r</span>
            <span className="text-blue-400">i</span>
            <span className="text-purple-400">o</span>
        </h2>
    );
}