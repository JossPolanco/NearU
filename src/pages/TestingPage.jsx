import { getCurrentUser } from '../services/user/userService'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router';
import { useImageUpload } from '../hooks/images/useImageUpload'
import { imageKeys, useImages } from '../hooks/images/useImages'
import { useRef } from 'react';

export default function TestingPage() {
  const navigate = useNavigate()

  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
  });

  // Guarda de seguridad: no renderizar nada si no hay sesión
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="alert alert-warning">
          <span>Debes iniciar sesión para usar esta página.</span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">

      <div className="flex items-center gap-3">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/home')}>
          ← Volver
        </button>
        <h1 className="font-semibold text-lg">Testing: Sistema de imágenes</h1>
      </div>

      {/* Info del usuario activo */}
      <div className="bg-base-200 rounded-lg px-4 py-2 text-sm text-base-content/60">
        Sesión activa: <span className="font-mono text-base-content">{user.email}</span>
      </div>

      {/* Panel de subida */}
      <UploadPanel user={user} />

      {/* Galería de fotos del bucket "photos" */}
      <GalleryPanel />

    </div>
  )
}


const formatBytes = (bytes) => {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

// Mapa de etapa → mensaje visible en la UI
const STAGE_LABELS = {
  idle: { text: 'Esperando imagen...', badge: 'badge-ghost' },
  validating: { text: 'Verificando archivo...', badge: 'badge-info' },
  optimizing: { text: 'Optimizando imagen...', badge: 'badge-warning' },
  uploading: { text: 'Subiendo a Storage...', badge: 'badge-warning' },
  saving: { text: 'Guardando metadata...', badge: 'badge-warning' },
  success: { text: '¡Imagen guardada! ✓', badge: 'badge-success' },
  error: { text: 'Ocurrió un error', badge: 'badge-error' },
}

// ─── Subcomponentes ───────────────────────────────────────────────────────────

/**
 * Panel de subida: selector, preview, barra de progreso y estado
 */
function UploadPanel({ user }) {
  const fileInputRef = useRef(null)

  const { upload, state, reset } = useImageUpload({
    bucket: 'photos',
    profile: 'photo',
    // Al tener éxito, react-query refrescará la galería automáticamente
    invalidateQueries: [imageKeys.list('photos')],
  })

  const { stage, progress, previewUrl, result, error } = state
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
    <div className="card bg-base-200 shadow-sm">
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
        {stage === 'success' && result && (
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
        )}

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

/**
 * Galería: lista las imágenes del bucket "photos" con sus Signed URLs
 */
function GalleryPanel() {
  const { images, total, isLoading, isError, error, refetch } = useImages('photos')

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
                    Sin URL
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