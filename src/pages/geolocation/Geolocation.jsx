import { setCurrentLocation, getCurrentUserLocation, getPartnerLocation } from '@/services/geolocation'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, MapPin, RefreshCw, Heart, LocateFixed } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

//  CALCULAR LA DISNTANCIA USANDO LA FORMULA DE HAVERSINE
function getDistance(lat1, lon1, lat2, lon2) {
    if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) return null;
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distancia en km
    return d;
}

// FORMATEAR LA DISTANCIA PARA QUE SE MUESTRE EN METROS O EN KM DEPENDIENDO DE LA DISTANCIA
function formatDistance(distKm) {
    if (distKm === null || distKm === undefined) return '';
    if (distKm < 1) {
        return `${Math.round(distKm * 1000)} metros`;
    }
    return `${distKm.toFixed(1)} km`;
}

// MOSTRAR UN MENSAJE INTIMO/CUTE BASADO EN LA DISTANCIA ENTRE LA PAREJA
function getDistanceMessage(distKm) {
    if (distKm === null || distKm === undefined) return '';
    if (distKm < 0.05) return "¡Estamos Juntos YAAAYYY! ❤️";
    if (distKm < 0.5) return "¡Estamos cerquita! 🥰";
    if (distKm < 2) return "A unos minutos de verse 🥺";
    if (distKm < 10) return "Cerca, pero falta para vernos ⏳";
    return "Muy lejitos mi amor 😢";
}

// FORMATER LA HORA EN LA QUE SE REGISTRO LA UBICACIÓN
function formatTimeAgo(dateStr) {
    if (!dateStr) return "Sin datos";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Hace un momento";
    if (diffMins < 60) return `Hace ${diffMins} ${diffMins === 1 ? 'min' : 'mins'}`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

// CUSTOR MARKER PARA EL USUARIO AUTENTICADO
const getTúIcon = () => L.divIcon({
    html: `
        <div class="relative flex items-center justify-center w-10 h-10">
            <span class="absolute inline-flex h-full w-full rounded-full bg-primary/30 animate-ping opacity-75"></span>
            <div class="relative flex items-center justify-center w-8 h-8 rounded-full bg-primary border-2 border-base-100 shadow-md text-white font-bold text-[11px]">
                Tú
            </div>
        </div>
    `,
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
});

// CUSTOR MARKER PARA LA PAREJA
const getPartnerIcon = () => L.divIcon({
    html: `
        <div class="relative flex items-center justify-center w-10 h-10">
            <span class="absolute inline-flex h-full w-full rounded-full bg-secondary/30 animate-ping opacity-75"></span>
            <div class="relative flex items-center justify-center w-8 h-8 rounded-full bg-secondary border-2 border-base-100 shadow-md text-white font-bold text-xs">
                Bby
            </div>
        </div>
    `,
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
});

// MAPCONTROLLER PARA QUE EL MAPA SE CENTRE EN EL PUNTO MEDIO ENTRE EL USUARIO Y LA PAREJA, Y QUE SE AJUSTE AUTOMÁTICAMENTE AL MAPA
function MapController({ userLocation, partnerLocation, resetTrigger }) {
    const map = useMap();

    useEffect(() => {
        if (!userLocation?.latitude || !userLocation?.longitude) return;

        if (partnerLocation?.latitude && partnerLocation?.longitude) {
            const bounds = [
                [userLocation.latitude, userLocation.longitude],
                [partnerLocation.latitude, partnerLocation.longitude]
            ];
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
        } else {
            map.setView([userLocation.latitude, userLocation.longitude], 14);
        }
    }, [userLocation?.latitude, userLocation?.longitude, partnerLocation?.latitude, partnerLocation?.longitude, resetTrigger, map]);

    return null;
}

export default function Geolocation() {
    const navigate = useNavigate();
    const [locationPermission, setLocationPermission] = useState("prompt");
    const [isRefreshing, setIsRefreshing] = useState(false);
    const queryClient = useQueryClient();
    const [resetTrigger, setResetTrigger] = useState(0);

    const { data: userLocation } = useQuery({
        queryKey: ['current-location'],
        queryFn: getCurrentUserLocation,
        enabled: locationPermission === 'granted',
    });

    const { data: partnerLocation } = useQuery({
        queryKey: ['partner-location'],
        queryFn: getPartnerLocation,
        enabled: locationPermission === 'granted',
    });

    const updateLocationMutation = useMutation({
        mutationFn: setCurrentLocation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['current-location'] });
            queryClient.invalidateQueries({ queryKey: ['partner-location'] });
        },
    });

    const triggerInitialLocation = useCallback(() => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            (position) => {
                updateLocationMutation.mutate({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy_meters: position.coords.accuracy
                });
            },
            (error) => {
                console.error("Error al obtener posición inicial:", error);
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0
            }
        );
    }, [updateLocationMutation]);

    const handleRefresh = () => {
        if (!navigator.geolocation) return;
        setIsRefreshing(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                updateLocationMutation.mutate({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy_meters: position.coords.accuracy
                }, {
                    onSettled: () => {
                        setIsRefreshing(false);
                    }
                });
            },
            (error) => {
                console.error("Error al refrescar posición:", error);
                setIsRefreshing(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0
            }
        );
    };

    useEffect(() => {
        let isMounted = true;

        async function checkPermission() {
            if (!navigator.permissions) return;

            try {
                const permission = await navigator.permissions.query({
                    name: "geolocation",
                });

                if (!isMounted) return;

                setLocationPermission(permission.state);

                if (permission.state === "granted") {
                    triggerInitialLocation();
                }

                permission.onchange = () => {
                    if (isMounted) {
                        setLocationPermission(permission.state);
                    }
                    if (permission.state === "granted") {
                        triggerInitialLocation();
                    }
                };
            } catch (error) {
                console.error(error);
            }
        }

        checkPermission();

        return () => {
            isMounted = false;
        };
    }, []);

    const resetOptions = () => {
        console.log('hola');
        if (userLocation) {
            console.log(userLocation.latitude, userLocation.longitude);
        }
        setResetTrigger(prev => prev + 1);
    }

    return (
        <div className="max-w-2xl mx-auto p-4 flex flex-col gap-5 min-h-[90vh]">
            {/* Header / Navigation */}
            <div className="relative flex items-center justify-center border-b border-base-200/90 dark:border-base-800/40 mb-2">
                <button type="button" className="absolute left-0 btn btn-circle btn-primary text-white active:text-white md:hover:text-white active:bg-primary/80 md:hover:bg-primary/80 transition-transform duration-200"
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
                            NearU utiliza tu ubicación mi amor, para mostrarte en el mapa y que nos podamos ver. Solo nosotros dos podremos vernos.
                        </p>
                    </div>
                    <button type="button" className="btn btn-primary rounded-full px-8 font-semibold shadow-md active:scale-95 transition-transform"
                        onClick={() => navigate('/config')}
                    >
                        Configurar Permisos
                    </button>
                </div>
            )}

            {locationPermission === "granted" && (
                <>
                    {userLocation?.latitude && userLocation?.longitude ? (
                        <div className="flex flex-col gap-4">
                            {/* Leaflet Map Card */}
                            <div className="relative w-full rounded-3xl overflow-hidden shadow-sm border border-base-200/70 dark:border-base-800/50 bg-base-100 h-96">
                                <MapContainer
                                    center={[userLocation.latitude, userLocation.longitude]}
                                    zoom={13}
                                    scrollWheelZoom={true}
                                    className="h-full w-full z-0"
                                    zoomControl={true}
                                >
                                    <TileLayer
                                        attribution='Hoooola mi amooooooor     .'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />

                                    <Marker
                                        key={`user-${userLocation.id}`}
                                        position={[userLocation.latitude, userLocation.longitude]}
                                        icon={getTúIcon()}
                                    >
                                        <Popup>
                                            <div className="text-center font-semibold">Tú estás aquí</div>
                                        </Popup>
                                    </Marker>

                                    {partnerLocation?.latitude && partnerLocation?.longitude && (
                                        <Marker
                                            key={`partner-${partnerLocation.id}`}
                                            position={[partnerLocation.latitude, partnerLocation.longitude]}
                                            icon={getPartnerIcon()}
                                        >
                                            <Popup>
                                                <div className="text-center font-semibold">Tu bby está aquí</div>
                                            </Popup>
                                        </Marker>
                                    )}

                                    <MapController userLocation={userLocation} partnerLocation={partnerLocation} resetTrigger={resetTrigger} />
                                </MapContainer>
                            </div>

                            {/* CARD DE DISTANCIA Y CONEXIÓN */}
                            <div className="flex flex-col gap-4 p-5 rounded-3xl border border-base-200/70 dark:border-base-800/50 bg-base-100 dark:bg-base-900/10 transition-transform duration-300 shadow-2xs select-none active:border-primary/20">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-3xs bg-error/10 dark:bg-error/15 text-pink-500">
                                            <Heart className="w-6 h-6 animate-pulse" style={{ animationDuration: '3s' }} />
                                        </div>
                                        <div className="space-y-0.5 min-w-0 flex-1">
                                            <h3 className="font-bold text-base leading-tight text-base-content">
                                                {partnerLocation?.latitude && partnerLocation?.longitude ? (
                                                    <span>Distancia entre us</span>
                                                ) : (
                                                    <span>Conexión NearU</span>
                                                )}
                                            </h3>
                                            <p className="text-xs text-base-content/60 leading-relaxed">
                                                {partnerLocation?.latitude && partnerLocation?.longitude ? (
                                                    getDistanceMessage(getDistance(userLocation.latitude, userLocation.longitude, partnerLocation.latitude, partnerLocation.longitude))
                                                ) : (
                                                    "Esperando la ubicación de tu bby..."
                                                )}
                                            </p>
                                        </div>
                                        <button type="button" className='btn btn-primary btn-sm btn-circle shadow-md shadow-primary/20 hover:shadow-lg active:shadow-sm transition-transform duration-300' onClick={() => resetOptions()} aria-label="Centrar mapa">
                                            <LocateFixed className='w-4 h-4' />
                                        </button>
                                    </div>

                                    {partnerLocation?.latitude && partnerLocation?.longitude && (
                                        <div className="badge badge-primary badge-lg py-3 px-4 font-bold text-white text-sm shadow-sm rounded-xl shrink-0">
                                            {formatDistance(getDistance(userLocation.latitude, userLocation.longitude, partnerLocation.latitude, partnerLocation.longitude))}
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-base-150/40 dark:border-base-800/40">
                                    <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-base-100/95 dark:bg-base-950/95 border border-base-200 dark:border-base-800">
                                        <div className="w-2 h-2 rounded-full bg-primary shrink-0"></div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-[10px] text-base-content/40 font-bold uppercase tracking-wider">
                                                Tú
                                            </span>
                                            <span className="text-xs font-bold text-base-content/80 truncate">
                                                {formatTimeAgo(userLocation.recorded_at)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-base-100/95 dark:bg-base-950/95 border border-base-200 dark:border-base-800">
                                        <div className="w-2 h-2 rounded-full bg-secondary shrink-0"></div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-[10px] text-base-content/40 font-bold uppercase tracking-wider">
                                                Tu bby
                                            </span>
                                            <span className="text-xs font-bold text-base-content/80 truncate">
                                                {partnerLocation ? formatTimeAgo(partnerLocation.recorded_at) : "Sin datos"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2.5 pt-1">
                                    <button
                                        onClick={handleRefresh}
                                        disabled={isRefreshing || updateLocationMutation.isPending}
                                        className="flex-1 btn btn-outline btn-primary rounded-xl gap-2 font-semibold min-h-11 h-11 text-xs transition-transform active:scale-[0.98]"
                                        type="button"
                                    >
                                        <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing || updateLocationMutation.isPending ? 'animate-spin' : ''}`} />
                                        {isRefreshing || updateLocationMutation.isPending ? "Actualizando..." : "Actualizar mi posición"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center flex-1 py-16 text-center max-w-md mx-auto space-y-4">
                            <span className="loading loading-spinner loading-lg text-primary" />
                            <p className="text-sm font-semibold text-base-content/70">Obteniendo ubicación...</p>
                            <p className="text-xs text-base-content/40 leading-relaxed px-6">
                                Buscando tu rincón en el mapa para conectarnos mi vira... ✨
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
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