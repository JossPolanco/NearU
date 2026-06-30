import { useImageUpload } from "../../hooks/images/useImageUpload";
import { imageKeys } from "../../hooks/images/useImages";
import { useRef } from "react";

const formatBytes = (bytes) => {
    if (!bytes) return '—'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

// MAPA DE ETAPA → MENSAJE VISIBLE EN LA UI
const STAGE_LABELS = {
    idle: { text: 'Esperando imagen...', badge: 'badge-ghost', progress: 0, progressColor: 'progress-primary' },
    validating: { text: 'Verificando archivo...', badge: 'badge-info', progress: 20, progressColor: 'progress-info' },
    optimizing: { text: 'Optimizando imagen...', badge: 'badge-warning', progress: 40, progressColor: 'progress-warning' },
    uploading: { text: 'Subiendo a Storage...', badge: 'badge-warning', progress: 60, progressColor: 'progress-warning' },
    saving: { text: 'Guardando metadata...', badge: 'badge-warning', progress: 80, progressColor: 'progress-warning' },
    success: { text: '¡Imagen guardada! ✓', badge: 'badge-success', progress: 100, progressColor: 'progress-success' },
    error: { text: 'Ocurrió un error', badge: 'badge-error', progress: 0, progressColor: 'progress-error' },
}

export default function UploadPanel({ user, className, background, bucket, profile, gallery = 'default' }) {
    const fileInputRef = useRef(null)

    const { upload, state, reset } = useImageUpload({
        bucket: bucket,
        profile: profile,
        gallery: gallery,
        invalidateQueries: [imageKeys.list(bucket, gallery)],
    })

    const { stage, progress, previewUrl, error } = state
    const stageInfo = STAGE_LABELS[stage]
    const isProcessing = ['validating', 'optimizing', 'uploading', 'saving'].includes(stage)

    const handleFileChange = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        // Limpia el input para permitir seleccionar el mismo archivo de nuevo
        e.target.value = ''
        upload(file, user.id)
    }

    return (
        <div className={`${className} ${background} `}>
            <div className="card-body space-y-4">
                <h2 className="card-title text-base">Subir imagen</h2>

                {/* Zona de selección */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={isProcessing}
                />

                <button
                    className="btn btn-primary w-full"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                >
                    {isProcessing ? (
                        <span className="loading loading-spinner loading-sm" />
                    ) : (
                        <span>Seleccionar foto</span>
                    )}
                </button>

                {/* Badge de etapa */}
                <div className="flex items-center gap-2">
                    <span className={`badge ${stageInfo.badge}`}>
                        {stageInfo.text}
                    </span>
                </div>

                {/* Barra de progreso (solo durante optimización) */}
                {stage === 'optimizing' && (
                    <div className="space-y-1">
                        <p className="text-xs text-base-content/60">
                            Comprimiendo: {progress}%
                        </p>
                        <progress
                            className="progress progress-warning w-full"
                            value={progress}
                            max={100}
                        />
                    </div>
                )}

                {/* barra de progreso general */}
                {
                    stage !== "idle" && (
                        <div className="flex w-full">
                            <progress className={`progress w-full ${stageInfo.progressColor}`} value={progress} max="100"></progress>
                        </div>
                    )
                }

                {/* Preview de la imagen optimizada */}
                {previewUrl && (
                    <div className="space-y-1">
                        <p className="text-xs text-base-content/60">Vista previa (WebP optimizado)</p>
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="rounded-lg w-full max-h-48 object-cover border border-base-300"
                        />
                    </div>
                )}

                {/* Resultado exitoso: metadata guardada */}
                {/* {stage === 'success' && result && (
                    <div className="bg-success/10 border border-success/30 rounded-lg p-3 space-y-1 text-sm">
                        <p className="font-medium text-success">Guardado correctamente</p>
                        <p className="text-base-content/70">
                            Tamaño: <span className="font-mono">{formatBytes(result.file_size)}</span>
                        </p>
                        <p className="text-base-content/70">
                            Dimensiones: <span className="font-mono">{result.width} × {result.height}px</span>
                        </p>
                        <p className="text-base-content/70 break-all">
                            Path: <span className="font-mono text-xs">{result.storage_path}</span>
                        </p>
                    </div>
                )} */}

                {/* Error */}
                {stage === 'error' && (
                    <div className="alert alert-error">
                        <span className="text-sm">{error}</span>
                    </div>
                )}

                {/* Botón para reiniciar después de éxito o error */}
                {(stage === 'success' || stage === 'error') && (
                    <button className="btn btn-ghost btn-sm" onClick={reset}>
                        Subir otra imagen
                    </button>
                )}
            </div>
        </div>
    )
}