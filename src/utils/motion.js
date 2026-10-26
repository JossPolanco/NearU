// Utilidades y configuraciones de animación optimizadas para Mobile-First

// Detecta si el dispositivo admite hover real (mouse en escritorio vs pantalla táctil en móvil)
export const canHover = typeof window !== 'undefined'
    ? window.matchMedia('(hover: hover) and (pointer: fine)').matches
    : false;

// Retorna hover solo si no es pantalla táctil, evitando que los hovers se queden pegados al tocar en celulares
export const touchHover = (hoverProps) => (canHover ? hoverProps : undefined);

// Física de resorte instantánea y ágil para móviles (evita sensación de lentitud al usar la pantalla táctil)
export const mobileSpring = {
    type: "spring",
    stiffness: 420,
    damping: 28,
};

// Presets de respuesta táctil (haptic/tap) adaptados a dedos y pantallas móviles
export const tapFeedback = {
    card: { scale: 0.98 },
    button: { scale: 0.95 },
    icon: { scale: 0.88 },
};

// Variantes de entrada optimizadas para móvil (desplazamientos cortos de 10-12px y stagger rápido)
export const mobilePageVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.04,
            delayChildren: 0.02,
        },
    },
};

export const mobileHeaderVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: mobileSpring,
    },
};

export const mobileItemVariants = {
    hidden: { opacity: 0, y: 12, scale: 0.98 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: mobileSpring,
    },
};

export const mobileCardVariants = {
    hidden: { opacity: 0, y: 14, scale: 0.98 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: mobileSpring,
    },
};
