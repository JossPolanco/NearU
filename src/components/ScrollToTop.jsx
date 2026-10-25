import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router';

export default function ScrollToTop() {
    const { pathname, search } = useLocation();

    // Desactivar la restauración automática del scroll del navegador
    useEffect(() => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
    }, []);

    useLayoutEffect(() => {
        const scrollToTop = () => {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            if (document.documentElement) {
                document.documentElement.scrollTop = 0;
            }
            if (document.body) {
                document.body.scrollTop = 0;
            }
        };

        scrollToTop();

        // Para componentes cargados con lazy loading o suspensos
        const animId = requestAnimationFrame(scrollToTop);
        const timeoutId = setTimeout(scrollToTop, 50);

        return () => {
            cancelAnimationFrame(animId);
            clearTimeout(timeoutId);
        };
    }, [pathname, search]);

    return null;
}
