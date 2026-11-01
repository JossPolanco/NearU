import { getArchiveFileUrl } from '@/services/chatArchive/chatArchiveService';
import { useState, useRef, useEffect, useMemo } from 'react';
import { Play, Pause, Mic } from 'lucide-react';
import { tapFeedback } from '@/utils/motion';
import { motion } from 'motion/react';

// Referencia global para que solo suene un audio a la vez
let currentGlobalAudio = null;

// Genera una forma de onda pseudo-aleatoria pero determinista a partir del nombre de archivo
function generateWaveform(seedStr = 'audio', count = 24) {
	let hash = 0;
	for (let i = 0; i < seedStr.length; i++) {
		hash = (hash << 5) - hash + seedStr.charCodeAt(i);
		hash |= 0;
	}
	const bars = [];
	for (let i = 0; i < count; i++) {
		const val = Math.abs(Math.sin(hash + i * 1.7)) * 0.75 + 0.25;
		bars.push(Math.round(val * 100));
	}
	return bars;
}

export default function ArchiveAudio({ storagePath, altAudioPath, isOwn }) {
	const [audioUrl, setAudioUrl] = useState(null);
	const [altUrl, setAltUrl] = useState(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [progress, setProgress] = useState(0);
	const [duration, setDuration] = useState(0);
	const [currentTime, setCurrentTime] = useState(0);
	const audioRef = useRef(null);
	const waveformRef = useRef(null);

	const bars = useMemo(() => generateWaveform(storagePath || 'default', 26), [storagePath]);

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
			audioRef.current
				.play()
				.then(() => {
					setIsPlaying(true);
				})
				.catch((err) => {
					console.warn('Error reproduciendo audio:', err);
				});
		}
	};

	const handleSeek = (e) => {
		if (!audioRef.current || !waveformRef.current || !duration) return;
		const rect = waveformRef.current.getBoundingClientRect();
		const clickX = e.clientX - rect.left;
		const ratio = Math.max(0, Math.min(1, clickX / rect.width));
		audioRef.current.currentTime = ratio * duration;
		setProgress(ratio * 100);
		setCurrentTime(ratio * duration);
	};

	const handleTimeUpdate = () => {
		if (!audioRef.current) return;
		const curr = audioRef.current.currentTime;
		const dur = audioRef.current.duration || 1;
		setCurrentTime(curr);
		setProgress((curr / dur) * 100);
	};

	const handleLoadedMetadata = () => {
		if (audioRef.current && isFinite(audioRef.current.duration)) {
			setDuration(audioRef.current.duration || 0);
		}
	};

	const handlePause = () => {
		setIsPlaying(false);
	};

	const handleEnded = () => {
		setIsPlaying(false);
		setProgress(0);
		setCurrentTime(0);
	};

	const formatTime = (secs) => {
		if (!secs || isNaN(secs) || !isFinite(secs)) return '0:00';
		const m = Math.floor(secs / 60);
		const s = Math.floor(secs % 60);
		return `${m}:${s < 10 ? '0' : ''}${s}`;
	};

	return (
		<div className="flex items-center gap-3 py-1 px-0.5 min-w-54 max-w-68 select-none">
			<audio
				ref={audioRef}
				onTimeUpdate={handleTimeUpdate}
				onLoadedMetadata={handleLoadedMetadata}
				onPause={handlePause}
				onEnded={handleEnded}
				preload="metadata"
			>
				{altUrl && <source src={altUrl} type="audio/mp4" />}
				{audioUrl && <source src={audioUrl} type="audio/ogg; codecs=opus" />}
			</audio>

			<motion.button
				type="button"
				whileTap={tapFeedback.icon}
				onClick={togglePlay}
				disabled={!audioUrl && !altUrl}
				aria-label={isPlaying ? 'Pausar nota de voz' : 'Escuchar nota de voz'}
				className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-xs transition-colors cursor-pointer ${isOwn
					? 'bg-primary-content text-primary'
					: 'bg-primary text-primary-content'
					}`}
			>
				{isPlaying ? <Pause size={17} className="fill-current" /> : <Play size={17} className="fill-current ml-0.5" />}
			</motion.button>

			<div className="flex-1 flex flex-col justify-center gap-1.5 min-w-0">
				{/* Onda de voz interactiva */}
				<div
					ref={waveformRef}
					onClick={handleSeek}
					className="flex items-center gap-0.75 h-6 cursor-pointer"
				>
					{bars.map((heightPct, idx) => {
						const barProgress = (idx / bars.length) * 100;
						const isPlayed = barProgress <= progress;
						return (
							<span
								key={idx}
								style={{ height: `${Math.max(22, heightPct)}%` }}
								className={`flex-1 rounded-full transition-colors duration-150 ${isOwn
									? isPlayed
										? 'bg-primary-content'
										: 'bg-primary-content/35'
									: isPlayed
										? 'bg-primary'
										: 'bg-base-content/20'
									}`}
							/>
						);
					})}
				</div>

				<div
					className={`flex justify-between items-center text-[10px] font-medium leading-none ${isOwn ? 'text-primary-content/80' : 'text-base-content/60'
						}`}
				>
					<span className="tabular-nums">
						{isPlaying || currentTime > 0 ? formatTime(currentTime) : formatTime(duration)}
					</span>
					<span className="flex items-center gap-1 opacity-75">
						<Mic size={10} />
						<span>Nota de voz</span>
					</span>
				</div>
			</div>
		</div>
	);
}
