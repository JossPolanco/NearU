import Dockbar from './navigation/Dockbar';
import React, { useLayoutEffect } from 'react';
import { useLocation } from 'react-router';

export default function Layout({ children, centered = false, className = '' }) {
    const { pathname } = useLocation();

    useLayoutEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        if (document.documentElement) document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;
    }, [pathname]);

    if (centered) {
        return (
            <Dockbar>
                <div className={`min-h-screen bg-base-300 flex items-center justify-center p-4 pb-28 ${className}`}>
                    {children}
                </div>
            </Dockbar>
        );
    }

    return (
        <div className={`min-h-screen bg-base-300 pb-28 sm:pb-32 ${className}`}>
            <Dockbar>
                {children}
            </Dockbar>
        </div>
    );
}