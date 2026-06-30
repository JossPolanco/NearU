import { useImages } from "../../hooks/images/useImages"

const formatBytes = (bytes) => {
    if (!bytes) return '—'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export default function GalleryPanel({ bucket = 'photos', gallery = 'default' }) {
    const { images, total, isLoading, isError, error, refetch } = useImages(bucket, gallery)

    if (isLoading) {
        return (
            <div className="card bg-base-200 shadow-sm">
                <div className="card-body items-center">
                    <span className="loading loading-spinner loading-md" />
                    <p className="text-sm text-base-content/60">Cargando galería...</p>
                </div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="card bg-base-200 shadow-sm">
                <div className="card-body space-y-2">
                    <div className="alert alert-error">
                        <span className="text-sm">{error?.message}</span>
                    </div>
                    <button className="btn btn-ghost btn-sm" onClick={refetch}>
                        Reintentar
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="card bg-base-200 shadow-sm">
            <div className="card-body space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="card-title text-base">
                        Galería
                        <span className="badge badge-ghost font-normal">{total} fotos</span>
                    </h2>
                    <button className="btn btn-ghost btn-xs" onClick={refetch}>
                        Refrescar
                    </button>
                </div>

                {images.length === 0 ? (
                    <p className="text-sm text-base-content/50 text-center py-6">
                        No hay imágenes aún. Sube la primera.
                    </p>
                ) : (
                    <div className="grid grid-cols-2 gap-2">
                        {images.map((photo) => (
                            <div key={photo.id} className="group relative rounded-lg overflow-hidden bg-base-300 aspect-square">
                                {photo.signedUrl ? (
                                    <img
                                        src={photo.signedUrl}
                                        alt={photo.original_name ?? 'Foto'}
                                        // width y height evitan layout shift
                                        width={photo.width ?? 300}
                                        height={photo.height ?? 300}
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full h-full object-cover transition-opacity duration-300"
                                    />
                                ) : (
                                    // Placeholder si la Signed URL falló
                                    <div className="w-full h-full flex items-center justify-center text-base-content/30 text-xs">
                                        Sin URL, Joss checalo
                                    </div>
                                )}

                                {/* Overlay con info al hacer hover */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                                    <p className="text-white text-xs truncate">{photo.original_name ?? '—'}</p>
                                    <p className="text-white/70 text-xs">{formatBytes(photo.file_size)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}