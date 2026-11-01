import { getArchiveFileUrl } from '@/services/chatArchive/chatArchiveService';
import { useState, useEffect } from 'react';
import { X, ZoomIn } from 'lucide-react';
import { createPortal } from 'react-dom';

export default function ArchiveImage({ storagePath, fileName, caption }) {
	const [url, setUrl] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		let isMounted = true;
		getArchiveFileUrl(storagePath).then((resolvedUrl) => {
			if (isMounted) {
				setUrl(resolvedUrl);
				setLoading(false);
			}
		});
		return () => {
			isMounted = false;
		};
	}, [storagePath]);

	return (
		<div className="flex flex-col gap-1.5 max-w-64">
			{loading ? (
				<div className="w-56 h-48 rounded-xl bg-black/10 animate-pulse flex items-center justify-center">
					<span className="loading loading-spinner loading-sm opacity-50"></span>
				</div>
			) : url ? (
				<div
					onClick={() => setIsOpen(true)}
					className="relative cursor-pointer rounded-xl overflow-hidden group shadow-xs active:scale-98 transition-transform"
				>
					<img
						src={url}
						alt={fileName || 'Foto'}
						loading="lazy"
						className="w-full max-h-72 object-cover rounded-xl"
					/>
					<div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
						<ZoomIn size={22} />
					</div>
				</div>
			) : (
				<div className="text-[11px] italic opacity-60 p-2">[Imagen no disponible]</div>
			)}

			{caption && (
				<p className="text-xs leading-relaxed whitespace-pre-wrap px-0.5">{caption}</p>
			)}

			{/* Modal visor a pantalla completa */}
			{isOpen &&
				url &&
				createPortal(
					<div
						className="fixed inset-0 z-9999 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-3 animate-fade-in"
						onClick={() => setIsOpen(false)}
					>
						<button
							type="button"
							className="absolute top-4 right-4 btn btn-circle btn-sm bg-white/20 text-white border-none hover:bg-white/30"
							onClick={() => setIsOpen(false)}
						>
							<X size={18} />
						</button>

						<img
							src={url}
							alt={fileName || 'Foto completa'}
							className="max-h-[85vh] max-w-[95vw] object-contain rounded-lg animate-scale-in"
							onClick={(e) => e.stopPropagation()}
						/>

						{caption && (
							<p
								onClick={(e) => e.stopPropagation()}
								className="mt-3 text-white/90 text-sm max-w-md text-center bg-black/40 px-3 py-1.5 rounded-xl backdrop-blur-xs"
							>
								{caption}
							</p>
						)}
					</div>,
					document.body
				)}
		</div>
	);
}

