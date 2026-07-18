import { useNavigate } from 'react-router';
import { ArrowLeft, MapPin } from 'lucide-react';
import { React, useEffect, useState } from 'react'
import { getUserPosition } from '../../utils/geolocation';
import { setCurrentLocation } from '@/services/geolocation'


export default function Geolocation() {
    const navigate = useNavigate();

    const [locationPermission, setLocationPermission] = useState("prompt");


    useEffect(() => {
        async function checkPermission() {
            if (!navigator.permissions) return;

            try {
                const permission = await navigator.permissions.query({
                    name: "geolocation",
                });

                setLocationPermission(permission.state);

                if (permission.state === "granted") {
                    getUserPosition();
                }

                permission.onchange = () => {
                    setLocationPermission(permission.state);
                    if (permission.state === "granted") {
                        getUserPosition();
                    }
                };
            } catch (error) {
                console.error(error);
            }
        }

        checkPermission();
    }, []);


    return (
        <div className="max-w-2xl mx-auto p-4 space-y-6 flex flex-col gap-6">
            {/* Header / Navigation */}
            <div className="relative flex items-center justify-center py-2 border-b border-base-200/90 dark:border-base-800/40 mb-2">
                <button className="absolute left-0 btn btn-circle btn-primary text-white active:text-white md:hover:text-white active:bg-primary/80 md:hover:bg-primary/80 transition-all duration-200"
                    onClick={() => navigate(-1)}
                    aria-label="Volver"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center justify-center py-4">
                    <Title />
                </div>
            </div>
            {locationPermission !== "granted" && (
                <div className="flex flex-col items-center justify-center flex-1 py-16 text-center max-w-md mx-auto space-y-6">
                    <div className="p-5 bg-primary/10 text-primary rounded-full animate-pulse shadow-md">
                        <MapPin size={48} className="stroke-[1.5]" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-base-content">
                            Se requiere ubicación
                        </h3>
                        <p className="text-sm text-base-content/60 px-4 leading-relaxed">
                            NearU utiliza tu ubicación para mostrarte en el mapa y que puedas ver a tu persona especial. Solo ustedes dos podrán verla.
                        </p>
                    </div>
                    <button
                        className="btn btn-primary rounded-full px-8 font-semibold shadow-md active:scale-95 transition-transform"
                        onClick={() => navigate('/config')}
                        type="button"
                    >
                        Configurar Permisos
                    </button>
                </div>
            )}
        </div>
    )
}



export function Title() {
    return (
        <h2 className="text-2xl font-black tracking-tight text-center drop-shadow-xs bg-base-100 px-5 py-2 rounded-full border border-base-200/40 shadow-2xs">
            <span className="text-red-400">M</span>
            <span className="text-orange-400">a</span>
            <span className="text-amber-400">p</span>
            <span className="text-emerald-400">i</span>
            <span className="text-sky-400">t</span>
            <span className="text-indigo-400">a</span>
        </h2>
    );
}