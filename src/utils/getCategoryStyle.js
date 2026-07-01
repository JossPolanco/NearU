import { Heart, Sparkles, ClipboardList, BookOpen, Utensils, Plane, Home, Calendar } from "lucide-react"

export const getCategoryStyle = (title = "") => {
    const lower = title.toLowerCase();
    if (lower.includes("amor") || lower.includes("love") || lower.includes("cita") || lower.includes("juntos") || lower.includes("corazon") || lower.includes("corazón")) {
        return { icon: Heart, bg: "bg-rose-100 dark:bg-rose-950/40 text-rose-500 dark:text-rose-400" };
    }
    if (lower.includes("comida") || lower.includes("cocinar") || lower.includes("restaurante") || lower.includes("receta") || lower.includes("cena") || lower.includes("almuerzo")) {
        return { icon: Utensils, bg: "bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400" };
    }
    if (lower.includes("viaje") || lower.includes("vacacion") || lower.includes("visita") || lower.includes("conocer") || lower.includes("paseo") || lower.includes("playa")) {
        return { icon: Plane, bg: "bg-sky-100 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400" };
    }
    if (lower.includes("casa") || lower.includes("hogar") || lower.includes("limpieza") || lower.includes("compras") || lower.includes("super")) {
        return { icon: Home, bg: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400" };
    }
    if (lower.includes("estudio") || lower.includes("libro") || lower.includes("aprender") || lower.includes("leer") || lower.includes("curso")) {
        return { icon: BookOpen, bg: "bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400" };
    }
    if (lower.includes("evento") || lower.includes("fecha") || lower.includes("cumple") || lower.includes("aniversario") || lower.includes("calendario")) {
        return { icon: Calendar, bg: "bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400" };
    }
    if (lower.includes("idea") || lower.includes("proyecto") || lower.includes("plan") || lower.includes("sueño") || lower.includes("sueño")) {
        return { icon: Sparkles, bg: "bg-yellow-100 dark:bg-yellow-950/40 text-yellow-600 dark:text-yellow-400" };
    }
    return { icon: ClipboardList, bg: "bg-primary/10 dark:bg-primary/15 text-primary" };
};