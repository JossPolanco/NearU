import { Heart, Sparkles, ClipboardList, BookOpen, Utensils, Plane, Home, Calendar, Star } from "lucide-react"

export const PRESET_ICONS = [
    { id: "clipboardlist", label: "Lista / Tareas", icon: ClipboardList, bg: "bg-primary/10 dark:bg-primary/15 text-primary" },
    { id: "heart", label: "Corazón / Amor", icon: Heart, bg: "bg-error/10 dark:bg-error/15 text-error" },
    { id: "sparkles", label: "Brillo / Idea", icon: Sparkles, bg: "bg-accent/10 dark:bg-accent/15 text-accent" },
    { id: "bookopen", label: "Libro / Estudio", icon: BookOpen, bg: "bg-info/10 dark:bg-info/15 text-info" },
    { id: "utensils", label: "Utensilios / Comida", icon: Utensils, bg: "bg-warning/10 dark:bg-warning/15 text-warning" },
    { id: "plane", label: "Avión / Viajes", icon: Plane, bg: "bg-info/10 dark:bg-info/15 text-info" },
    { id: "home", label: "Hogar / Casa", icon: Home, bg: "bg-success/10 dark:bg-success/15 text-success" },
    { id: "calendar", label: "Calendario / Eventos", icon: Calendar, bg: "bg-secondary/10 dark:bg-secondary/15 text-secondary" },
    // { id: "star", label: "Estrella / Favorito", icon: Star, bg: "bg-warning/10 dark:bg-warning/15 text-warning" },
];

export const getCategoryIcon = (iconName = "") => {
    const name = typeof iconName === "string" ? iconName.trim().toLowerCase() : "";
    const found = PRESET_ICONS.find(item => item.id === name);
    return found || PRESET_ICONS[0];
};