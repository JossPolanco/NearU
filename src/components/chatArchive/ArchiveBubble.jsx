import ArchiveSticker from './ArchiveSticker';
import { Sparkles, Ban } from 'lucide-react';
import ArchiveAudio from './ArchiveAudio';
import ArchiveImage from './ArchiveImage';

/**
 * Resalta las coincidencias de búsqueda en un texto
 */
function HighlightText({ text, query }) {
	if (!text) return null;
	if (!query || query.trim().length < 2) {
		return <span>{text}</span>;
	}

	const q = query.trim().toLowerCase();
	const parts = text.split(new RegExp(`(${q})`, 'gi'));

	return (
		<span>
			{parts.map((part, i) =>
				part.toLowerCase() === q ? (
					<mark key={i} className="bg-warning/80 text-warning-content rounded-xs px-0.5">
						{part}
					</mark>
				) : (
					part
				)
			)}
		</span>
	);
}

/**
 * Convierte URLs en enlaces clicables
 */
function Linkify({ text, query }) {
	if (!text) return null;
	const urlRegex = /(https?:\/\/[^\s]+)/g;
	const segments = text.split(urlRegex);

	return (
		<>
			{segments.map((seg, i) => {
				if (seg.match(urlRegex)) {
					return (
						<a
							key={i}
							href={seg}
							target="_blank"
							rel="noopener noreferrer"
							className="underline font-semibold hover:opacity-80 break-all"
						>
							{seg}
						</a>
					);
				}
				return <HighlightText key={i} text={seg} query={query} />;
			})}
		</>
	);
}

export default function ArchiveBubble({ message, isOwn, query, isCurrentMatch }) {
	// Render de mensajes de sistema
	if (message.type === 'system') {
		return (
			<div className="flex justify-center my-3 px-4 select-none">
				<div className="bg-base-200/60 backdrop-blur-xs text-base-content/60 text-[11px] rounded-xl px-3 py-1.5 text-center max-w-xs shadow-xs border border-base-content/5 leading-relaxed">
					{message.text}
				</div>
			</div>
		);
	}

	// Si es un sticker solo
	if (message.type === 'sticker') {
		return (
			<div className={`chat ${isOwn ? 'chat-end' : 'chat-start'} my-1`}>
				<div className="flex flex-col items-end">
					<ArchiveSticker storagePath={message.storagePath} fileName={message.fileName} />
					<span className="text-[9px] opacity-40 px-1 select-none">{message.rawTime}</span>
				</div>
			</div>
		);
	}

	return (
		<div
			className={`chat ${isOwn ? 'chat-end' : 'chat-start'} my-1.5 ${isCurrentMatch ? 'ring-2 ring-warning rounded-2xl ring-offset-2 ring-offset-base-300' : ''
				}`}
		>
			<div
				className={`chat-bubble max-w-[78%] rounded-[18px] px-3.5 py-2 text-sm shadow-xs before:hidden ${isOwn
						? 'chat-bubble-primary rounded-br-none text-primary-content'
						: 'chat-bubble-secondary rounded-bl-none text-secondary-content'
					}`}
				style={{ overflowWrap: 'anywhere' }}
			>
				{/* Contenido según tipo */}
				{message.type === 'audio' && (
					<ArchiveAudio
						storagePath={message.storagePath}
						altAudioPath={message.altAudioPath}
						isOwn={isOwn}
					/>
				)}

				{message.type === 'image' && (
					<ArchiveImage
						storagePath={message.storagePath}
						fileName={message.fileName}
						caption={message.caption}
					/>
				)}

				{message.type === 'text' && (
					<p className="whitespace-pre-wrap leading-relaxed pr-6 text-[13.5px]">
						<Linkify text={message.text} query={query} />
					</p>
				)}

				{message.type === 'deleted' && (
					<p className="italic opacity-70 text-xs flex items-center gap-1.5 py-0.5">
						<Ban size={13} />
						<span>{message.text}</span>
					</p>
				)}

				{message.type === 'missing' && (
					<div className="flex items-center gap-2 py-1 text-xs opacity-75">
						<Sparkles size={14} className="opacity-80" />
						<span className="italic">{message.text}</span>
					</div>
				)}

				{/* Metadatos (Hora y si fue editado) */}
				<div
					className={`flex items-center justify-end gap-1 text-[9px] -mr-1 mt-0.5 select-none pointer-events-none ${isOwn ? 'text-primary-content/70' : 'text-secondary-content/70'
						}`}
				>
					{message.isEdited && <span className="italic">editado</span>}
					<span>{message.rawTime}</span>
				</div>
			</div>
		</div>
	);
}

