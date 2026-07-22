import { Check, CheckCheck } from "lucide-react";

export default function ReadIndicator({ readAt, className = "" }) {
    if (readAt) {
        return (
            <CheckCheck size={14} className={`text-primary shrink-0 transition-transform duration-200 ${className}`} title="Leído" />
        );
    }
    return (
        <Check size={14} className={`text-base-content/40 shrink-0 ${className}`} title="Enviado" />
    );
}
