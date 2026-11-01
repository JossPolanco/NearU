import { getArchiveFileUrl } from '@/services/chatArchive/chatArchiveService';
import { useState, useEffect } from 'react';

export default function ArchiveSticker({ storagePath, fileName }) {
	const [url, setUrl] = useState(null);
	const [loading, setLoading] = useState(true);

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

	if (loading) {
		return (
			<div className="w-28 h-28 rounded-2xl bg-base-200/40 animate-pulse flex items-center justify-center">
				<span className="loading loading-spinner loading-xs text-primary/50"></span>
			</div>
		);
	}

	if (!url) {
		return (
			<div className="text-[11px] italic opacity-60 px-2 py-1 bg-base-200/30 rounded-lg">
				[Sticker no disponible]
			</div>
		);
	}

	return (
		<div className="select-none py-1">
			<img
				src={url}
				alt={fileName || 'Sticker'}
				loading="lazy"
				className="w-32 h-32 object-contain hover:scale-105 transition-transform duration-200"
			/>
		</div>
	);
}

