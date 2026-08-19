import { useState, useEffect } from 'react';

export default function FabScrollTop({ showAt = 300, ...props }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > showAt) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, [showAt]);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <div
            className={`fixed bottom-18 right-4 z-50 transition-all duration-300 
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
        >
            <button
                className="btn btn-lg btn-circle btn-primary shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer select-none active:scale-98"
                type="button"
                onClick={scrollToTop}
                aria-label="Volver arriba"
                {...props}
            >
                {/* Ícono de flecha hacia arriba */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                </svg>
            </button>
        </div>
    );
}
