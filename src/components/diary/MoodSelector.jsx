const MOODS = [
    {
        value: 'feliz',
        photo: "http://dummyimage.com/131x100.png/cc0000/ffffff",
        label: 'Feliz',
        selectedClass: 'border-success bg-success/10 text-success ring-2 ring-success/20',
        hoverClass: 'md:hover:border-success/30 md:hover:bg-success/5'
    },
    {
        value: 'triste',
        photo: "http://dummyimage.com/131x100.png/cc0000/ffffff",
        label: 'Triste',
        selectedClass: 'border-info bg-info/10 text-info ring-2 ring-info/20',
        hoverClass: 'md:hover:border-info/30 md:hover:bg-info/5'
    },
    {
        value: 'neutral',
        photo: "http://dummyimage.com/131x100.png/cc0000/ffffff",
        label: 'Neutral',
        selectedClass: 'border-neutral bg-neutral/15 text-base-content ring-2 ring-neutral/20',
        hoverClass: 'md:hover:border-neutral/30 md:hover:bg-neutral/5'
    },
    {
        value: 'enojado',
        photo: "http://dummyimage.com/131x100.png/cc0000/ffffff",
        label: 'Enojado',
        selectedClass: 'border-error bg-error/10 text-error ring-2 ring-error/20',
        hoverClass: 'md:hover:border-error/30 md:hover:bg-error/5'
    },
    {
        value: 'emocionado',
        photo: "http://dummyimage.com/131x100.png/cc0000/ffffff",
        label: 'Emocionado',
        selectedClass: 'border-secondary bg-secondary/10 text-secondary ring-2 ring-secondary/20',
        hoverClass: 'md:hover:border-secondary/30 md:hover:bg-secondary/5'
    },
    {
        value: 'hot',
        photo: "http://dummyimage.com/131x100.png/cc0000/ffffff",
        label: 'Hot',
        selectedClass: 'border-primary bg-primary/10 text-primary ring-2 ring-primary/20',
        hoverClass: 'md:hover:border-primary/30 md:hover:bg-primary/5'
    }
];

export default function MoodSelector({ value, onChange, selectedMood, onSelectMood, label, error, disabled = false }) {
    const activeValue = value !== undefined ? value : selectedMood;
    const handleSelect = onChange || onSelectMood;

    return (
        <div className="form-control w-full">
            {label && (
                <label className="label mb-1.5 justify-start">
                    <span className="label-text font-medium text-base-content/85">{label}</span>
                </label>
            )}

            <div
                role="radiogroup"
                aria-label={label || "Seleccionar estado de ánimo"}
                className="grid grid-cols-3 sm:grid-cols-6 gap-2 w-full"
            >
                {MOODS.map((mood) => {
                    const isSelected = activeValue === mood.value;
                    return (
                        <button
                            key={mood.value}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            disabled={disabled}
                            onClick={() => handleSelect && handleSelect(mood.value)}
                            className={`
                                flex flex-col items-center justify-center py-3 px-1 rounded-2xl border
                                transition-all duration-200 min-h-24 focus:outline-none 
                                active:scale-95
                                ${disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}
                                ${isSelected
                                    ? mood.selectedClass
                                    : `border-base-300 dark:border-base-800 bg-base-100 text-base-content/70 ${mood.hoverClass}`
                                }
                                ${error && !isSelected ? 'border-error/60 dark:border-error/40' : ''}
                            `}
                        >
                            <img 
                                src={mood.photo} 
                                alt={mood.label}
                                className={`w-10 h-10 object-cover rounded-xl mb-1.5 transition-all duration-200 select-none ${isSelected ? 'scale-110 shadow-sm border-2 border-primary/20' : 'opacity-85'}`} 
                            />
                            <span className={`text-[10px] sm:text-xs font-semibold tracking-wide select-none ${isSelected ? 'font-bold' : ''}`}>
                                {mood.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            {error && (
                <label className="label mt-1 animate-fade-in">
                    <span className="label-text-alt text-error font-medium">{error}</span>
                </label>
            )}
        </div>
    );
}
