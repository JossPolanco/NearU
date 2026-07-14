import React from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

const MONTH_NAMES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const WEEKDAYS = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];

export default function MonthlyCalendar({ currentDate, setCurrentDate }) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // OBTIENE EL PRIMER DIA DEL MES
    const firstDay = new Date(year, month, 1);
    const startDay = firstDay.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    // AJUSTA PARA QUE EL DIA SEA EL INDICE 0
    const startDayOffset = startDay === 0 ? 6 : startDay - 1;

    // OBTIENE EL NUMERO DE DIAS EN EL MES ACTUAL
    const totalDays = new Date(year, month + 1, 0).getDate();

    // OBTIENE EL NUMERO DE DIAS EN EL MES ANTERIOR
    const prevMonthTotalDays = new Date(year, month, 0).getDate();

    // CREA 42 POSICIONES (6 SEMANAS * 7 DIAS)
    const cells = [];

    // DIAS DEL MES ANTERIOR
    for (let i = startDayOffset - 1; i >= 0; i--) {
        const dayNum = prevMonthTotalDays - i;
        cells.push({
            day: dayNum,
            isCurrentMonth: false,
            date: new Date(year, month - 1, dayNum),
        });
    }

    // DIAS DEL MES ACTUAL
    for (let i = 1; i <= totalDays; i++) {
        cells.push({
            day: i,
            isCurrentMonth: true,
            date: new Date(year, month, i),
        });
    }

    // DIAS DEL MES SIGUIENTE
    const remainingCells = 42 - cells.length;
    for (let i = 1; i <= remainingCells; i++) {
        cells.push({
            day: i,
            isCurrentMonth: false,
            date: new Date(year, month + 1, i),
        });
    }

    // HELPER PARA VERIFICAR SI UNA FECHA ES HOY
    const today = new Date();
    const isToday = (date) =>
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

    // HELPER PARA VERIFICAR SI UNA FECHA ES LA FECHA ACTUAL
    const isSelected = (date) =>
        date.getDate() === currentDate.getDate() &&
        date.getMonth() === currentDate.getMonth() &&
        date.getFullYear() === currentDate.getFullYear();

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const handleGoToday = () => {
        setCurrentDate(new Date());
    };

    const handleSelectDay = (cellDate) => {
        setCurrentDate(cellDate);
    };

    return (
        <div className="w-full bg-base-100/40 dark:bg-base-950/15 backdrop-blur-md rounded-3xl border border-base-200/80 dark:border-base-800/40 p-6 shadow-xl animate-fade-in">
            {/* Calendar Header */}
            <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                        <CalendarDays className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-extrabold text-xl text-base-content tracking-tight leading-tight">
                            {MONTH_NAMES[month]}
                        </h3>
                        <span className="text-xs text-base-content/50 font-semibold">{year}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="btn btn-ghost btn-sm rounded-xl font-bold text-xs px-3 border border-base-200 dark:border-base-800/60 active:bg-base-200/50 md:hover:bg-base-200/50 text-base-content/80 active:text-primary md:hover:text-primary transition-all duration-200"
                        onClick={handleGoToday}
                    >
                        Hoy
                    </button>
                    <div className="join border border-base-200 dark:border-base-800/60 rounded-xl overflow-hidden">
                        <button className="btn btn-ghost btn-sm join-item px-2.5 active:bg-base-200/50 md:hover:bg-base-200/50 text-base-content/75 active:text-primary md:hover:text-primary transition-colors"
                            onClick={handlePrevMonth}
                            aria-label="Mes anterior"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleNextMonth}
                            className="btn btn-ghost btn-sm join-item px-2.5 active:bg-base-200/50 md:hover:bg-base-200/50 text-base-content/75 active:text-primary md:hover:text-primary transition-colors"
                            aria-label="Mes siguiente"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Weekday Labels */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {WEEKDAYS.map((day) => (
                    <div
                        key={day}
                        className="text-xs font-bold text-base-content/40 py-2 select-none uppercase tracking-wider"
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* 42 Positions Day Grid */}
            <div className="grid grid-cols-7 gap-1.5">
                {cells.map((cell, idx) => {
                    const isCellToday = isToday(cell.date);
                    const isCellSelected = isSelected(cell.date);

                    return (
                        <button
                            key={`${cell.date.getTime()}-${idx}`}
                            onClick={() => handleSelectDay(cell.date)}
                            className={`
                                aspect-square w-full rounded-2xl flex flex-col items-center justify-center relative transition-all duration-300 select-none text-sm font-semibold
                                ${cell.isCurrentMonth
                                    ? "text-base-content active:bg-base-200/65 md:hover:bg-base-200/65 cursor-pointer"
                                    : "text-base-content/25 font-normal active:bg-base-250/20 md:hover:bg-base-250/20 cursor-pointer"
                                }
                                ${isCellSelected
                                    ? "bg-primary! text-primary-content! font-extrabold shadow-md scale-95 z-2"
                                    : ""
                                }
                                ${isCellToday && !isCellSelected
                                    ? "border border-primary/40 text-primary bg-primary/5 dark:bg-primary/10"
                                    : ""
                                }
                            `}
                        >
                            <span>{cell.day}</span>

                            {/* INDICADOR DE DIA ACTUAL, SUBTILE PERO VISIBLE */}
                            {isCellToday && (
                                <span className={`absolute bottom-1 w-1 h-1 rounded-full ${isCellSelected ? "bg-primary-content" : "bg-primary"}`} />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
