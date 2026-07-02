import { ArrowLeft, ClipboardList, Plus, Loader2 } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { useRef, useState } from "react"
import z from "zod"

export default function Dates() {
    const navigate = useNavigate()
    const refModal = useRef(null)
    return (
        <div className="max-w-2xl mx-auto p-4 space-y-6">
            {/* Header / Navigation */}
            <div className="flex items-center justify-between py-2 border-b border-base-200/90 dark:border-base-800/40 mb-2">
                <button
                    className="btn btn-circle btn-primary text-white active:text-white md:hover:text-white active:bg-primary/80 md:hover:bg-primary/80 transition-all duration-200"
                    onClick={() => navigate(-1)}
                    aria-label="Volver"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex items-end gap-1.5 text-xs font-semibold text-base-content/60 bg-base-100 px-4 py-1.5 rounded-full border border-base-300/40 shadow-3xs">
                    <ClipboardList className="w-3.5 h-3.5 text-primary fill-primary/15 animate-pulse" />
                    <span>Citas mi amoooor</span>
                </div>
            </div>
        </div>
    )
}
