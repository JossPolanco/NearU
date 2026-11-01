import { getArchiveFileUrl } from '@/services/chatArchive/chatArchiveService';
import { tapFeedback, mobileSpring } from '@/utils/motion';
import { motion, AnimatePresence } from 'motion/react';
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
		<div className="flex flex-col gap-1.5 max-w-64 py-0.5">
			{loading ? (
				<div className="w-56 h-48 rounded-2xl bg-black/10 animate-pulse flex items-center justify-center">
					<span className="loading loading-spinner loading-sm opacity-50"></span>
				</div>
			) : url ? (
				<motion.div
					whileTap={tapFeedback.card}
					onClick={() => setIsOpen(true)}
					className="relative cursor-pointer rounded-2xl overflow-hidden group shadow-xs"
				>
					<img
						src={url}
						alt={fileName || 'Recuerdo'}
						loading="lazy"
						className="w-full max-h-72 object-cover rounded-2xl"
					/>
					<div className="absolute inset-0 bg-black/20 opacity-0 md:group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
						<ZoomIn size={22} />
					</div>
				</motion.div>
			) : (
				<div className="text-[11px] italic opacity-60 p-2">[Imagen no disponible]</div>
			)}

			{caption && (
				<p className="text-[13px] leading-relaxed whitespace-pre-wrap px-0.5">{caption}</p>
			)}

			{/* Visor a pantalla completa con AnimatePresence */}
			{typeof document !== 'undefined' &&
				createPortal(
					<AnimatePresence>
						{isOpen && url && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.18 }}
								className="fixed inset-0 z-9999 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4"
								onClick={() => setIsOpen(false)}
							>
								<motion.button
									type="button"
									whileTap={tapFeedback.icon}
									className="absolute top-4 right-4 btn btn-circle btn-sm bg-white/15 text-white border-none hover:bg-white/25"
									onClick={() => setIsOpen(false)}
									aria-label="Cerrar imagen"
								>
									<X size={18} />
								</motion.button>

								<motion.img
									initial={{ scale: 0.9, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									exit={{ scale: 0.92, opacity: 0 }}
									transition={mobileSpring}
									src={url}
									alt={fileName || 'Foto completa'}
									className="max-h-[82vh] max-w-[94vw] object-contain rounded-2xl shadow-2xl"
									onClick={(e) => e.stopPropagation()}
								/>

								{caption && (
									<motion.p
										initial={{ y: 10, opacity: 0 }}
										animate={{ y: 0, opacity: 1 }}
										onClick={(e) => e.stopPropagation()}
										className="mt-3 text-white/95 text-sm max-w-md text-center bg-white/10 border border-white/15 px-4 py-2 rounded-2xl backdrop-blur-md"
									>
										{caption}
									</motion.p>
								)}
							</motion.div>
						)}
					</AnimatePresence>,
					document.body
				)}
		</div>
	);
}
