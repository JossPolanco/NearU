import { Heart, Sparkles, ClipboardList, BookOpen, Utensils, Plane, Home, Calendar } from "lucide-react"

export const getCategoryIcon = (iconName = "") => {

    switch (iconName) {
        case "heart":
            return <Heart className="w-6 h-6" />
        case "sparkles":
            return <Sparkles className="w-6 h-6" />
        case "clipboardlist":
            return <ClipboardList className="w-6 h-6" />
        case "bookopen":
            return <BookOpen className="w-6 h-6" />
        case "utensils":
            return <Utensils className="w-6 h-6" />
        case "plane":
            return <Plane className="w-6 h-6" />
        case "home":
            return <Home className="w-6 h-6" />
        case "calendar":
            return <Calendar className="w-6 h-6" />
        default:
            return <ClipboardList className="w-6 h-6" />
    }
};