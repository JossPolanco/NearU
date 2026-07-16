import React from 'react';
import { Calendar, MoreVertical, Edit2, Trash2, Heart, Hourglass, CalendarDays } from "lucide-react";

export default function AnniversaryItem({ anniversary, onEdit, onDelete, isDeleting }) {
    const { id, title, description, event_date, recurrence_type, reminder_days_before } = anniversary;

    // Helper to calculate days and time passed or remaining
    const getAnniversaryStats = (eventDateStr, recurrenceType) => {
        if (!eventDateStr) return null;

        // Parse target date (eventDateStr is in "YYYY-MM-DD" format)
        const datePart = eventDateStr.split(/[T ]/)[0];
        const [year, month, day] = datePart.split('-').map(Number);
        const eventDate = new Date(year, month - 1, day);

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        // 1. Days passed since the event
        const timeDiffPassed = today.getTime() - eventDate.getTime();
        const daysPassed = Math.max(0, Math.floor(timeDiffPassed / (1000 * 60 * 60 * 24)));

        // 2. Days remaining until next anniversary occurrence
        let nextOccurrence = new Date(today.getFullYear(), month - 1, day);

        if (recurrenceType === "mensual") {
            nextOccurrence = new Date(today.getFullYear(), today.getMonth(), day);
            if (nextOccurrence < today) {
                nextOccurrence.setMonth(today.getMonth() + 1);
            }
        } else {
            // "anual" or "nop" default to annual calculation
            if (nextOccurrence < today) {
                nextOccurrence.setFullYear(today.getFullYear() + 1);
            }
        }

        const timeDiffRemaining = nextOccurrence.getTime() - today.getTime();
        const daysRemaining = Math.max(0, Math.ceil(timeDiffRemaining / (1000 * 60 * 60 * 24)));

        // 3. Units passed (years or months)
        let unitsPassed = 0;
        let labelUnits = "";

        if (recurrenceType === "mensual") {
            const yearsDiff = today.getFullYear() - eventDate.getFullYear();
            const monthsDiff = today.getMonth() - eventDate.getMonth();
            unitsPassed = yearsDiff * 12 + monthsDiff;
            if (today.getDate() < day) {
                unitsPassed--;
            }
            unitsPassed = Math.max(0, unitsPassed);
            labelUnits = unitsPassed === 1 ? "mes" : "meses";
        } else {
            unitsPassed = today.getFullYear() - eventDate.getFullYear();
            const currentYearOccurrence = new Date(today.getFullYear(), month - 1, day);
            if (today < currentYearOccurrence) {
                unitsPassed--;
            }
            unitsPassed = Math.max(0, unitsPassed);
            labelUnits = unitsPassed === 1 ? "año" : "años";
        }

        return { daysPassed, daysRemaining, unitsPassed, labelUnits };
    };

    const stats = getAnniversaryStats(event_date, recurrence_type);

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const datePart = dateStr.split(/[T ]/)[0];
        const [year, month, day] = datePart.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const displayRecurrence = (type) => {
        if (type === "mensual") return "Mensualito";
        if (type === "anual") return "Anualito";
        return "No recurrente";
    };

    return (
        <div className="group flex flex-col gap-4 p-5 rounded-3xl border border-base-200/70 dark:border-base-800/50 bg-base-100 dark:bg-base-900/10 transition-all duration-300 shadow-2xs select-none active:scale-[0.99] md:hover:shadow-xs active:border-primary/20 md:hover:border-primary/20">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    {/* Pink Heart Icon Box */}
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-3xs transition-transform duration-300 bg-pink-100 dark:bg-pink-950/30 text-pink-500">
                        <Heart className="w-6 h-6 animate-pulse" style={{ animationDuration: '3s' }} />
                    </div>

                    <div className="space-y-0.5 min-w-0 flex-1">
                        <h3 className="font-bold text-base leading-tight text-base-content">
                            {title}
                        </h3>
                        {description && (
                            <p className="text-xs text-base-content/60 leading-relaxed line-clamp-2">
                                {description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Dropdown Options Menu */}
                <div className="dropdown dropdown-end shrink-0" onClick={(e) => e.stopPropagation()}>
                    <div
                        tabIndex={0}
                        role="button"
                        className="btn btn-ghost btn-circle btn-sm text-base-content/40 active:text-primary active:bg-base-250/20 md:hover:text-primary md:hover:bg-base-250/20 transition-colors"
                        aria-label="Opciones de aniversario"
                    >
                        <MoreVertical className="w-4 h-4" />
                    </div>
                    <ul
                        tabIndex={0}
                        className="dropdown-content menu p-1.5 shadow-xl bg-base-100/95 dark:bg-base-950/95 border border-base-200 dark:border-base-800 rounded-2xl w-36 z-10 backdrop-blur"
                    >
                        <li>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.currentTarget.blur();
                                    onEdit();
                                }}
                                className="flex items-center gap-2 text-xs font-medium py-2 rounded-xl text-base-content active:bg-base-200/60 md:hover:bg-base-200/60 transition-colors"
                            >
                                <Edit2 className="w-3.5 h-3.5" /> Editar
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.currentTarget.blur();
                                    onDelete();
                                }}
                                className="flex items-center gap-2 text-xs font-medium py-2 rounded-xl text-error active:text-error active:bg-error/10 md:hover:text-error md:hover:bg-error/10 transition-colors"
                            >
                                <Trash2 className="w-3.5 h-3.5" /> Eliminar
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Calculations and Stats display */}
            {stats && (
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-base-150/40 dark:border-base-800/40">
                    <div className="flex items-center gap-2.5 bg-base-200/30 dark:bg-base-950/10 p-3 rounded-2xl border border-base-200/30 dark:border-base-850/20">
                        <CalendarDays className="w-4.5 h-4.5 text-primary/70 shrink-0" />
                        <div className="flex flex-col min-w-0">
                            <span className="text-[10px] text-base-content/40 font-bold uppercase tracking-wider">
                                Transcurrido
                            </span>
                            <span className="text-xs font-bold text-base-content/80 truncate">
                                {stats.daysPassed} {stats.daysPassed === 1 ? "día" : "días"}
                            </span>
                            {stats.unitsPassed > 0 && (
                                <span className="text-[10px] text-primary font-semibold">
                                    ({stats.unitsPassed} {stats.labelUnits})
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 bg-base-200/30 dark:bg-base-950/10 p-3 rounded-2xl border border-base-200/30 dark:border-base-850/20">
                        <Hourglass className="w-4.5 h-4.5 text-accent/70 shrink-0" />
                        <div className="flex flex-col min-w-0">
                            <span className="text-[10px] text-base-content/40 font-bold uppercase tracking-wider">
                                Siguiente
                            </span>
                            {stats.daysRemaining === 0 ? (
                                <span className="text-xs font-bold text-success animate-bounce">
                                    ¡Hoy es el día! 🎉
                                </span>
                            ) : (
                                <span className="text-xs font-bold text-base-content/80 truncate">
                                    Faltan {stats.daysRemaining} {stats.daysRemaining === 1 ? "día" : "días"}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Event date details footer */}
            <div className="flex flex-wrap gap-2 items-center justify-between text-[11px] text-base-content/40 font-semibold px-1">
                <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 opacity-60" />
                    <span>Desde el {formatDate(event_date)}</span>
                </div>
                <span className="badge badge-sm text-[10px] font-bold py-1 px-2.5 rounded-lg bg-base-200/50 dark:bg-base-800/40 text-base-content/60 border-none">
                    {displayRecurrence(recurrence_type)}
                </span>
            </div>
        </div>
    );
}
