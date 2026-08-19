import { QUICK_COLORS, PASTEL_COLORS, SOFT_PASTEL_COLORS, CANDY_COLORS, RAINBOW_COLORS, SUNSET_COLORS, OCEAN_COLORS, NATURE_COLORS, SAKURA_COLORS, AUTUMN_COLORS, GALAXY_COLORS, MONOCHROME_COLORS, VINTAGE_COLORS, TROPICAL_COLORS } from '@/utils/colors';
import { ChromePicker } from 'react-color';
import { Check } from 'lucide-react';
import { useRef } from 'react';
import Modal from '../Modal';

const colorSchema = " bg-[conic-gradient(from_0deg,_#ff0000,_#ff8000,_#ffff00,_#80ff00,_#00ff00,_#00ff80,_#00ffff,_#0080ff,_#0000ff,_#8000ff,_#ff00ff,_#ff0080,_#ff0000)]";

// FUNCION PARA DETECTAR SI EL COLOR ES CLARO O OSCURO PARA CAMBIAR EL COLOR DEL CHECK DEL COLOR EN EL MENU
const isLightColor = (color) => {
    if (!color) return false;
    const lower = color.toLowerCase();
    if (lower.startsWith('#')) {
        let c = lower.substring(1);
        if (c.length === 3) {
            c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
        }
        const r = parseInt(c.substring(0, 2), 16);
        const g = parseInt(c.substring(2, 4), 16);
        const b = parseInt(c.substring(4, 6), 16);
        return (r * 299 + g * 587 + b * 114) / 1000 > 125;
    }
    if (lower.startsWith('rgba') || lower.startsWith('rgb')) {
        const match = lower.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (match) {
            const r = parseInt(match[1]);
            const g = parseInt(match[2]);
            const b = parseInt(match[3]);
            return (r * 299 + g * 587 + b * 114) / 1000 > 125;
        }
    }
    return false;
};

export default function ColorConfig({ strokeColor, setStrokeColor }) {
    const customColorModalRef = useRef(null);

    const handleCustomColorClick = () => {
        customColorModalRef.current?.open();
    };

    return (
        <div className="space-y-4 animate-fade-in w-full text-left">
            <h3 className="text-sm font-bold text-base-content/85">Color del pincelito</h3>

            <div className="flex flex-wrap items-center gap-3">
                <div className="w-full -mb-1">
                    <h4 className="text-xs font-medium text-base-content/60 select-none">Colores básicos</h4>
                </div>
                {/* Custom Color Picker */}
                <button
                    type="button"
                    onClick={handleCustomColorClick}
                    aria-label="Color personalizado"
                    className={`w-11 h-11 rounded-full border border-base-300 active:scale-95 shadow-xs flex items-center justify-center
                        ${!QUICK_COLORS.includes(strokeColor.toLowerCase())
                            ? 'ring-2 ring-primary/40'
                            : colorSchema
                        }`}
                    style={!QUICK_COLORS.includes(strokeColor.toLowerCase()) ? { backgroundColor: strokeColor } : {}}
                >
                    {!QUICK_COLORS.includes(strokeColor.toLowerCase()) && (
                        <Check className={`w-4 h-4 ${isLightColor(strokeColor) ? 'text-black' : 'text-white'}`} />
                    )}
                </button>

                {QUICK_COLORS.map((color) => (
                    <button
                        key={color}
                        type="button"
                        onClick={() => setStrokeColor(color)}
                        aria-label={`Color ${color}`}
                        className={`w-11 h-11 rounded-full border transition-transform active:scale-95 flex items-center justify-center shadow-xs ${strokeColor.toLowerCase() === color.toLowerCase()
                            ? 'border-primary ring-2 ring-primary/40'
                            : 'border-base-300'
                            }`}
                        style={{ backgroundColor: color }}
                    >
                        {strokeColor.toLowerCase() === color.toLowerCase() && (
                            <Check className={`w-5 h-5 ${color === '#ffffff' ? 'text-black' : 'text-white'}`} />
                        )}
                    </button>
                ))}

                <div className="w-full mt-2 -mb-1">
                    <h4 className="text-xs font-medium text-base-content/60 select-none">Colores chulitos</h4>
                </div>

                {CANDY_COLORS.map((color) => (
                    <button
                        key={color}
                        type="button"
                        onClick={() => setStrokeColor(color)}
                        aria-label={`Color ${color}`}
                        className={`w-11 h-11 rounded-full border transition-transform active:scale-95 flex items-center justify-center shadow-xs ${strokeColor.toLowerCase() === color.toLowerCase()
                            ? 'border-primary ring-2 ring-primary/40'
                            : 'border-base-300'
                            }`}
                        style={{ backgroundColor: color }}
                    >
                        {strokeColor.toLowerCase() === color.toLowerCase() && (
                            <Check className={`w-5 h-5 ${color === '#ffffff' ? 'text-black' : 'text-white'}`} />
                        )}
                    </button>
                ))}

                <div className="w-full mt-2 -mb-1">
                    <h4 className="text-xs font-medium text-base-content/60 select-none">Colores pastelitos</h4>
                </div>

                {PASTEL_COLORS.map((color) => (
                    <button
                        key={color}
                        type="button"
                        onClick={() => setStrokeColor(color)}
                        aria-label={`Color ${color}`}
                        className={`w-11 h-11 rounded-full border transition-transform active:scale-95 flex items-center justify-center shadow-xs ${strokeColor.toLowerCase() === color.toLowerCase()
                            ? 'border-primary ring-2 ring-primary/40'
                            : 'border-base-300'
                            }`}
                        style={{ backgroundColor: color }}
                    >
                        {strokeColor.toLowerCase() === color.toLowerCase() && (
                            <Check className={`w-5 h-5 ${color === '#ffffff' ? 'text-black' : 'text-white'}`} />
                        )}
                    </button>
                ))}

                <div className="w-full mt-2 -mb-1">
                    <h4 className="text-xs font-medium text-base-content/60 select-none">Colores suavecitos</h4>
                </div>

                {SOFT_PASTEL_COLORS.map((color) => (
                    <button
                        key={color}
                        type="button"
                        onClick={() => setStrokeColor(color)}
                        aria-label={`Color ${color}`}
                        className={`w-11 h-11 rounded-full border transition-transform active:scale-95 flex items-center justify-center shadow-xs ${strokeColor.toLowerCase() === color.toLowerCase()
                            ? 'border-primary ring-2 ring-primary/40'
                            : 'border-base-300'
                            }`}
                        style={{ backgroundColor: color }}
                    >
                        {strokeColor.toLowerCase() === color.toLowerCase() && (
                            <Check className={`w-5 h-5 ${color === '#ffffff' ? 'text-black' : 'text-white'}`} />
                        )}
                    </button>
                ))}

                <div className="w-full mt-2 -mb-1">
                    <h4 className="text-xs font-medium text-base-content/60 select-none">Colores arcoiris</h4>
                </div>

                {RAINBOW_COLORS.map((color) => (
                    <button
                        key={color}
                        type="button"
                        onClick={() => setStrokeColor(color)}
                        aria-label={`Color ${color}`}
                        className={`w-11 h-11 rounded-full border transition-transform active:scale-95 flex items-center justify-center shadow-xs ${strokeColor.toLowerCase() === color.toLowerCase()
                            ? 'border-primary ring-2 ring-primary/40'
                            : 'border-base-300'
                            }`}
                        style={{ backgroundColor: color }}
                    >
                        {strokeColor.toLowerCase() === color.toLowerCase() && (
                            <Check className={`w-5 h-5 ${color === '#ffffff' ? 'text-black' : 'text-white'}`} />
                        )}
                    </button>
                ))}

                <div className="w-full mt-2 -mb-1">
                    <h4 className="text-xs font-medium text-base-content/60 select-none">Colores tropicales</h4>
                </div>

                {TROPICAL_COLORS.map((color) => (
                    <button
                        key={color}
                        type="button"
                        onClick={() => setStrokeColor(color)}
                        aria-label={`Color ${color}`}
                        className={`w-11 h-11 rounded-full border transition-transform active:scale-95 flex items-center justify-center shadow-xs ${strokeColor.toLowerCase() === color.toLowerCase()
                            ? 'border-primary ring-2 ring-primary/40'
                            : 'border-base-300'
                            }`}
                        style={{ backgroundColor: color }}
                    >
                        {strokeColor.toLowerCase() === color.toLowerCase() && (
                            <Check className={`w-5 h-5 ${color === '#ffffff' ? 'text-black' : 'text-white'}`} />
                        )}
                    </button>
                ))}

                <div className="w-full mt-2 -mb-1">
                    <h4 className="text-xs font-medium text-base-content/60 select-none">Colores atardecer</h4>
                </div>

                {SUNSET_COLORS.map((color) => (
                    <button
                        key={color}
                        type="button"
                        onClick={() => setStrokeColor(color)}
                        aria-label={`Color ${color}`}
                        className={`w-11 h-11 rounded-full border transition-transform active:scale-95 flex items-center justify-center shadow-xs ${strokeColor.toLowerCase() === color.toLowerCase()
                            ? 'border-primary ring-2 ring-primary/40'
                            : 'border-base-300'
                            }`}
                        style={{ backgroundColor: color }}
                    >
                        {strokeColor.toLowerCase() === color.toLowerCase() && (
                            <Check className={`w-5 h-5 ${color === '#ffffff' ? 'text-black' : 'text-white'}`} />
                        )}
                    </button>
                ))}

                <div className="w-full mt-2 -mb-1">
                    <h4 className="text-xs font-medium text-base-content/60 select-none">Colores del mar</h4>
                </div>

                {OCEAN_COLORS.map((color) => (
                    <button
                        key={color}
                        type="button"
                        onClick={() => setStrokeColor(color)}
                        aria-label={`Color ${color}`}
                        className={`w-11 h-11 rounded-full border transition-transform active:scale-95 flex items-center justify-center shadow-xs ${strokeColor.toLowerCase() === color.toLowerCase()
                            ? 'border-primary ring-2 ring-primary/40'
                            : 'border-base-300'
                            }`}
                        style={{ backgroundColor: color }}
                    >
                        {strokeColor.toLowerCase() === color.toLowerCase() && (
                            <Check className={`w-5 h-5 ${color === '#ffffff' ? 'text-black' : 'text-white'}`} />
                        )}
                    </button>
                ))}

                <div className="w-full mt-2 -mb-1">
                    <h4 className="text-xs font-medium text-base-content/60 select-none">Colores de la naturaleza</h4>
                </div>

                {NATURE_COLORS.map((color) => (
                    <button
                        key={color}
                        type="button"
                        onClick={() => setStrokeColor(color)}
                        aria-label={`Color ${color}`}
                        className={`w-11 h-11 rounded-full border transition-transform active:scale-95 flex items-center justify-center shadow-xs ${strokeColor.toLowerCase() === color.toLowerCase()
                            ? 'border-primary ring-2 ring-primary/40'
                            : 'border-base-300'
                            }`}
                        style={{ backgroundColor: color }}
                    >
                        {strokeColor.toLowerCase() === color.toLowerCase() && (
                            <Check className={`w-5 h-5 ${color === '#ffffff' ? 'text-black' : 'text-white'}`} />
                        )}
                    </button>
                ))}

                <div className="w-full mt-2 -mb-1">
                    <h4 className="text-xs font-medium text-base-content/60 select-none">Colores japoneses itarakimaaas 😍</h4>
                </div>

                {SAKURA_COLORS.map((color) => (
                    <button
                        key={color}
                        type="button"
                        onClick={() => setStrokeColor(color)}
                        aria-label={`Color ${color}`}
                        className={`w-11 h-11 rounded-full border transition-transform active:scale-95 flex items-center justify-center shadow-xs ${strokeColor.toLowerCase() === color.toLowerCase()
                            ? 'border-primary ring-2 ring-primary/40'
                            : 'border-base-300'
                            }`}
                        style={{ backgroundColor: color }}
                    >
                        {strokeColor.toLowerCase() === color.toLowerCase() && (
                            <Check className={`w-5 h-5 ${color === '#ffffff' ? 'text-black' : 'text-white'}`} />
                        )}
                    </button>
                ))}

                <div className="w-full mt-2 -mb-1">
                    <h4 className="text-xs font-medium text-base-content/60 select-none">Colores de otoño</h4>
                </div>

                {AUTUMN_COLORS.map((color) => (
                    <button
                        key={color}
                        type="button"
                        onClick={() => setStrokeColor(color)}
                        aria-label={`Color ${color}`}
                        className={`w-11 h-11 rounded-full border transition-transform active:scale-95 flex items-center justify-center shadow-xs ${strokeColor.toLowerCase() === color.toLowerCase()
                            ? 'border-primary ring-2 ring-primary/40'
                            : 'border-base-300'
                            }`}
                        style={{ backgroundColor: color }}
                    >
                        {strokeColor.toLowerCase() === color.toLowerCase() && (
                            <Check className={`w-5 h-5 ${color === '#ffffff' ? 'text-black' : 'text-white'}`} />
                        )}
                    </button>
                ))}

                <div className="w-full mt-2 -mb-1">
                    <h4 className="text-xs font-medium text-base-content/60 select-none">Colores galaxia 💀</h4>
                </div>

                {GALAXY_COLORS.map((color) => (
                    <button
                        key={color}
                        type="button"
                        onClick={() => setStrokeColor(color)}
                        aria-label={`Color ${color}`}
                        className={`w-11 h-11 rounded-full border transition-transform active:scale-95 flex items-center justify-center shadow-xs ${strokeColor.toLowerCase() === color.toLowerCase()
                            ? 'border-primary ring-2 ring-primary/40'
                            : 'border-base-300'
                            }`}
                        style={{ backgroundColor: color }}
                    >
                        {strokeColor.toLowerCase() === color.toLowerCase() && (
                            <Check className={`w-5 h-5 ${color === '#ffffff' ? 'text-black' : 'text-white'}`} />
                        )}
                    </button>
                ))}

                <div className="w-full mt-2 -mb-1">
                    <h4 className="text-xs font-medium text-base-content/60 select-none">Colores Monocromáticos</h4>
                </div>

                {MONOCHROME_COLORS.map((color) => (
                    <button
                        key={color}
                        type="button"
                        onClick={() => setStrokeColor(color)}
                        aria-label={`Color ${color}`}
                        className={`w-11 h-11 rounded-full border transition-transform active:scale-95 flex items-center justify-center shadow-xs ${strokeColor.toLowerCase() === color.toLowerCase()
                            ? 'border-primary ring-2 ring-primary/40'
                            : 'border-base-300'
                            }`}
                        style={{ backgroundColor: color }}
                    >
                        {strokeColor.toLowerCase() === color.toLowerCase() && (
                            <Check className={`w-5 h-5 ${color === '#ffffff' ? 'text-black' : 'text-white'}`} />
                        )}
                    </button>
                ))}

                <div className="w-full mt-2 -mb-1">
                    <h4 className="text-xs font-medium text-base-content/60 select-none">Colores vintage</h4>
                </div>

                {VINTAGE_COLORS.map((color) => (
                    <button
                        key={color}
                        type="button"
                        onClick={() => setStrokeColor(color)}
                        aria-label={`Color ${color}`}
                        className={`w-11 h-11 rounded-full border transition-transform active:scale-95 flex items-center justify-center shadow-xs ${strokeColor.toLowerCase() === color.toLowerCase()
                            ? 'border-primary ring-2 ring-primary/40'
                            : 'border-base-300'
                            }`}
                        style={{ backgroundColor: color }}
                    >
                        {strokeColor.toLowerCase() === color.toLowerCase() && (
                            <Check className={`w-5 h-5 ${color === '#ffffff' ? 'text-black' : 'text-white'}`} />
                        )}
                    </button>
                ))}                

                {/* PREMIUM COLOR PICKER MODAL */}
                <Modal className="max-w-xs" modalTitle="Color personalizado" modalSubtitle="Elige el color y opacidad para tu pincel" ref={customColorModalRef}>
                    <div className="flex flex-col items-center justify-center gap-4 pt-2">
                        <ChromePicker
                            color={strokeColor}
                            onChange={(color) => {
                                const { r, g, b, a } = color.rgb;
                                setStrokeColor(`rgba(${r}, ${g}, ${b}, ${a})`);
                            }}
                            disableAlpha={false}
                            className="shadow-none! !border! border-base-200! bg-base-100! "
                            styles={{
                                default: {
                                    picker: {
                                        boxShadow: 'none',
                                        background: 'transparent',
                                    }
                                }
                            }}
                        />
                        <div className="flex items-center gap-3 w-full justify-between bg-base-200/50 p-3 rounded-2xl border border-base-200">
                            <div className="flex items-center gap-2 overflow-hidden">
                                <div className="w-8 h-8 rounded-full border border-base-300 shadow-sm shrink-0" style={{ backgroundColor: strokeColor }} />
                                <div className="flex flex-col text-left overflow-hidden">
                                    <span className="text-[10px] font-semibold text-base-content/60">Color actual</span>
                                    <span className="font-mono text-xs font-bold text-base-content truncate max-w-35">
                                        {strokeColor}
                                    </span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => customColorModalRef.current?.close()}
                                className="btn btn-primary btn-sm rounded-xl px-4 shrink-0"
                            >
                                Listo
                            </button>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
}
