import Dockbar from './navigation/Dockbar';
import React from 'react';

export default function Layout({ children, centered = false, className = '' }) {
    if (centered) {
        return (
            <Dockbar>
                <div className={`min-h-screen bg-base-300 flex items-center justify-center p-4 ${className}`}>
                    {children}
                </div>
            </Dockbar>
        );
    }

    return (
        <div className={`min-h-screen bg-base-300 ${className}`}>
            <Dockbar>
                {children}
            </Dockbar>
        </div>
    );
}