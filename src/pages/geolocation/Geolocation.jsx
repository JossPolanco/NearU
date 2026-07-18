import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { React, useEffect, useState } from 'react'



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

                permission.onchange = () => {
                    setLocationPermission(permission.state);
                };
            } catch (error) {
                console.error(error);
            }
        }

        checkPermission();
    }, []);

    const requestLocationPermission = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log(position.coords);

                setLocationPermission("granted");
            },
            (error) => {
                console.error(error);

                if (error.code === error.PERMISSION_DENIED) {
                    setLocationPermission("denied");
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    }

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
                <div className="alert alert-info flex flex-col items-start gap-3">

                    <h2 className="font-bold text-lg">
                        📍 Compartir ubicación
                    </h2>

                    <p className="text-sm">
                        NearU utiliza tu ubicación para que ambos puedan verse
                        en el mapa. Solo ustedes dos podrán verla.
                    </p>

                    {locationPermission === "prompt" && (
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={requestLocationPermission}
                        >
                            Compartir ubicación
                        </button>
                    )}

                    {locationPermission === "denied" && (
                        <div className="text-warning text-sm">
                            Has bloqueado el permiso de ubicación. Debes
                            habilitarlo desde la configuración del navegador.
                        </div>
                    )}

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