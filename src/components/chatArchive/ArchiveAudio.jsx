import { getArchiveFileUrl } from '@/services/chatArchive/chatArchiveService';
import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

// Mantener referencia global para pausar otros audios si uno empieza a reproducirse
let currentGlobalAudio = null;

export default function ArchiveAudio({ storagePath, altAudioPath, isOwn }) {
	const [audioUrl, setAudioUrl] = useState(null);
	const [altUrl, setAltUrl] = useState(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [progress, setProgress] = useState(0);
	const [duration, setDuration] = useState(0);
	const [currentTime, setCurrentTime] = useState(0);
	const audioRef = useRef(null);

	useEffect(() => {
		let isMounted = true;
		getArchiveFileUrl(storagePath).then((url) => {
			if (isMounted) setAudioUrl(url);
		});
		if (altAudioPath) {
			getArchiveFileUrl(altAudioPath).then((url) => {
				if (isMounted) setAltUrl(url);
			});
		}
		return () => {
			isMounted = false;
		};
	}, [storagePath, altAudioPath]);

	const togglePlay = () => {
		if (!audioRef.current) return;

		if (isPlaying) {
			audioRef.current.pause();
			setIsPlaying(false);
		} else {
			if (currentGlobalAudio && currentGlobalAudio !== audioRef.current) {
				currentGlobalAudio.pause();
			}
			currentGlobalAudio = audioRef.current;
			audioRef.current.play().then(() => {
				setIsPlaying(true);
			}).catch((err) => {
				console.warn('Error reproduciendo audio:', err);
			});
		}
	};

	const handleTimeUpdate = () => {
		if (!audioRef.current) return;
		const curr = audioRef.current.currentTime;
		const dur = audioRef.current.duration || 1;
		setCurrentTime(curr);
		setProgress((curr / dur) * 100);
	};

	const handleLoadedMetadata = () => {
		if (audioRef.current) {
			setDuration(audioRef.current.duration || 0);
		}
	};

	const handleEnded = () => {
		setIsPlaying(false);
		setProgress(0);
		setCurrentTime(0);
	};

	const formatTime = (secs) => {
		if (isNaN(secs) || secs === 0) return '0:00';
		const m = Math.floor(secs / 60);
		const s = Math.floor(secs % 60);
		return `${m}:${s < 10 ? '0' : ''}${s}`;
	};

	return (
		<div className="flex items-center gap-2.5 py-1 min-w-50 max-w-65 select-none">
			<audio
				ref={audioRef}
				onTimeUpdate={handleTimeUpdate}
				onLoadedMetadata={handleLoadedMetadata}
				onEnded={handleEnded}
				preload="metadata"
			>
				{/* Soporte dual: m4a primero para iOS/Safari, opus para Android/Chrome */}
				{altUrl && <source src={altUrl} type="audio/mp4" />}
				{audioUrl && <source src={audioUrl} type="audio/ogg; codecs=opus" />}
			</audio>

			<button
				type="button"
				onClick={togglePlay}
				disabled={!audioUrl && !altUrl}
				aria-label={isPlaying ? 'Pausar audio' : 'Reproducir audio'}
				className={`btn btn-circle btn-sm shadow-xs transition-transform active:scale-90 ${isOwn
						? 'bg-white text-primary hover:bg-white/90'
						: 'bg-primary text-primary-content hover:bg-primary/90'
					}`}
			>
				{isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
			</button>

			<div className="flex-1 flex flex-col justify-center gap-1">
				<div className="relative w-full h-1.5 bg-black/15 rounded-full overflow-hidden">
					<div
						className={`h-full transition-all duration-100 ${isOwn ? 'bg-white' : 'bg-primary'
							}`}
						style={{ width: `${progress}%` }}
					/>
				</div>
				<div className="flex justify-between items-center text-[10px] opacity-75">
					<span>{isPlaying ? formatTime(currentTime) : formatTime(duration)}</span>
					<Volume2 size={11} className="opacity-60" />
				</div>
			</div>
		</div>
	);
}

