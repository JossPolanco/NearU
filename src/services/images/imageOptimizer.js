import imageCompression from "browser-image-compression";

export const OPTIMIZATION_PROFILES = {
    // FOTOS PERSONALES DEL ALBUM, PRIORIDAD CALIDAD SOBRE TAMAÑO, FOTO DE IPHONE 12MB → ~600KB–1.2MB EN WEBP
    photo: {
        maxSizeMB: 1.2,
        maxWidthOrHeight: 1920,
        initialQuality: 0.8,
        useWebWorker: true,
        fileType: "image/webp",
    },
    // AVATARES DE PERFIL, PRIORIDAD TAMAÑO SOBRE CALIDAD, FOTO DE IPHONE 12MB → ~50–100KB EN WEBP
    avatar: {
        maxSizeMB: 0.15,
        maxWidthOrHeight: 400,
        initialQuality: 0.85,
        useWebWorker: true,
        fileType: "image/webp",
    },

    // DIBUJOS DEL MINIJUEGO, PRIORIDAD CALIDAD SOBRE TAMAÑO, DIBUJO DE 5MB → ~400–800KB EN WEBP
    drawing: {
        maxSizeMB: 0.8,
        maxWidthOrHeight: 1440,
        initialQuality: 0.82,
        useWebWorker: true,
        fileType: "image/webp",
    },

    // MINIATURAS DE GALERÍA, PRIORIDAD TAMAÑO SOBRE CALIDAD, FOTO DE IPHONE 12MB → ~50KB EN WEBP
    thumbnail: {
        maxSizeMB: 0.05,
        maxWidthOrHeight: 300,
        initialQuality: 0.7,
        useWebWorker: true,
        fileType: "image/webp",
    },
};

// FUNCION PARA REMPLAZAR LA EXTENSION DEL NOMBRE DE ARCHIVO CON LA NUEVA EXTENSION .webP
const buildWebpFileName = (originalName) => {
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "");
    return `${nameWithoutExt}.webp`;
};

// FUNCION PARA CONVERTIR UN FILE A BLOB
const blobToDataUrl = (blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => reject(new Error("No se pudo generar el preview."));
        reader.readAsDataURL(blob);
    });
};

// OBTIENE LAS DIMENSIONES DE UNA IMAGEN A PARTIR DE UN BLOB
const getImageDimensions = (blob) => {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(blob);
        const img = new Image();

        img.onload = () => {
            resolve({ width: img.naturalWidth, height: img.naturalHeight });
            URL.revokeObjectURL(url); // libera memoria inmediatamente
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("No se pudieron obtener las dimensiones de la imagen."));
        };

        img.src = url;
    });
};


export const optimizeImage = async (
    file,
    profile = "photo",
    customOptions = {},
    onProgress = null
) => {
    try {
        const profileOptions = OPTIMIZATION_PROFILES[profile];

        if (!profileOptions) {
            return {
                success: false,
                error: `Perfil de optimización desconocido: "${profile}". Usa: ${Object.keys(OPTIMIZATION_PROFILES).join(", ")}.`,
            };
        }

        const options = {
            ...profileOptions,
            ...customOptions,
            // El callback de progreso se integra si se proporciona
            ...(onProgress && { onProgress }),
        };

        const originalSizeBytes = file.size;

        // Compresión + conversión a WebP en Web Worker
        const compressedBlob = await imageCompression(file, options);

        // Construye un File real desde el Blob para que tenga nombre y tipo correctos
        const optimizedFile = new File(
            [compressedBlob],
            buildWebpFileName(file.name),
            { type: "image/webp" }
        );

        // Obtiene dimensiones y preview en paralelo (ambos son rápidos)
        const [dimensions, previewUrl] = await Promise.all([
            getImageDimensions(compressedBlob),
            blobToDataUrl(compressedBlob),
        ]);

        const optimizedSizeBytes = optimizedFile.size;
        const savedBytes = originalSizeBytes - optimizedSizeBytes;
        const compressionRatio = ((savedBytes / originalSizeBytes) * 100).toFixed(1) + "%";

        return {
            success: true,
            data: {
                file: optimizedFile,
                previewUrl,
                width: dimensions.width,
                height: dimensions.height,
                originalSizeBytes,
                optimizedSizeBytes,
                compressionRatio,
            },
        };
    } catch (error) {
        // browser-image-compression lanza errores con mensajes en inglés
        // Los traducimos a mensajes amigables en español
        const message = error?.message?.toLowerCase() ?? "";

        if (message.includes("exceeded") || message.includes("size")) {
            return {
                success: false,
                error: "No se pudo comprimir la imagen al tamaño requerido. Intenta con una imagen más pequeña.",
            };
        }

        if (message.includes("worker") || message.includes("web worker")) {
            return {
                success: false,
                error: "Error en el procesamiento en segundo plano. Recarga la página e intenta nuevamente.",
            };
        }

        return {
            success: false,
            error: "No se pudo optimizar la imagen. Verifica que el archivo no esté dañado.",
        };
    }
};