import { setCurrentLocation } from '@/services/geolocation'
/**
 * Solicita permisos de ubicación al navegador y ejecuta los callbacks correspondientes.
 * 
 * @param {Function} onSuccess - Callback llamado cuando se concede el permiso. Recibe el objeto position.
 * @param {Function} onError - Callback llamado en caso de error o denegación. Recibe el objeto error.
 */
export const requestLocationPermission = (onSuccess, onError) => {
    if (!navigator.geolocation) {
        console.error("Geolocalización no está soportada en este navegador.");
        if (onError) {
            onError(new Error("Geolocalización no soportada"));
        }
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            if (onSuccess) onSuccess(position);
        },
        (error) => {
            console.error("Error al obtener ubicación:", error);
            if (onError) onError(error);
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
        }
    );
};

export const getUserPosition = () => {
    if (!navigator.geolocation) {
        console.error("Geolocalización no está soportada en este navegador.");
        return null;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {            
            setCurrentLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy_meters: position.coords.accuracy
            });
            return position.coords;
        },
        (error) => {
            console.error("Error al obtener ubicación:", error);
            return null;
        },
        {
            enableHighAccuracy: true,
            timeout: 300000,
            maximumAge: 0,
        }
    );
}