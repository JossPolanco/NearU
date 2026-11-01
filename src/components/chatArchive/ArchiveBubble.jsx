import { Sparkles, Ban, Lock } from 'lucide-react';
import ArchiveSticker from './ArchiveSticker';
import ArchiveAudio from './ArchiveAudio';
import ArchiveImage from './ArchiveImage';

/**
 * Escapa caracteres especiales de RegExp para evitar errores al buscar
 */
function escapeRegExp(str) {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Resalta las coincidencias de búsqueda en un texto
 */
function HighlightText({ text, query }) {
	if (!text) return null;
	if (!query || query.trim().length < 2) {
		return <span>{text}</span>;
	}

	const q = query.trim();
	const safeRegex = new RegExp(`(${escapeRegExp(q)})`, 'gi');
	const parts = text.split(safeRegex);

	return (
		<span>
			{parts.map((part, i) =>
				part.toLowerCase() === q.toLowerCase() ? (
					<mark
						key={i}
						className="bg-warning text-warning-content font-semibold rounded-md px-1 py-0.5 shadow-2xs"
					>
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
							className="underline font-semibold decoration-current/60 hover:opacity-80 break-all"
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

export default function ArchiveBubble({
	message,
	isOwn,
	query,
	isCurrentMatch,
	isFirstInGroup = true,
	isLastInGroup = true,
}) {
	// Mensajes de sistema (cifrado, etc.)
	if (message.type === 'system') {
		return (
			<div className="flex justify-center my-3 px-4 select-none">
				<div className="bg-base-100/75 backdrop-blur-md text-base-content/65 text-[11px] rounded-2xl px-3.5 py-2 text-center max-w-xs shadow-2xs border border-primary/10 flex items-center gap-2 leading-relaxed">
					<Lock size={13} className="text-primary/70 shrink-0" />
					<span>{message.text}</span>
				</div>
			</div>
		);
	}

	// Stickers sueltos con pastilla de hora flotante
	if (message.type === 'sticker') {
		return (
			<div
				className={`flex ${isOwn ? 'justify-end' : 'justify-start'} px-1 ${isFirstInGroup ? 'mt-2' : 'mt-0.5'
					}`}
			>
				<div className="relative group inline-flex flex-col items-end">
					<ArchiveSticker storagePath={message.storagePath} fileName={message.fileName} />
					<span className="bg-base-100/85 backdrop-blur-xs text-base-content/70 border border-base-content/5 text-[9.5px] font-medium px-2 py-0.5 rounded-full shadow-2xs -mt-2 select-none">
						{message.rawTime}
					</span>
				</div>
			</div>
		);
	}

	// Esquinas dinámicas estilo mensajería moderna según agrupación
	const bubbleRadius = isOwn
		? `rounded-[22px] ${!isFirstInGroup ? 'rounded-tr-md' : ''} ${isLastInGroup ? 'rounded-br-xs' : 'rounded-br-md'
		}`
		: `rounded-[22px] ${!isFirstInGroup ? 'rounded-tl-md' : ''} ${isLastInGroup ? 'rounded-bl-xs' : 'rounded-bl-md'
		}`;

	// Paleta cálida y contrastada (evita que dos bloques neón compitan)
	const bubbleColors = isOwn
		? 'bg-linear-to-br from-primary to-primary/90 text-primary-content shadow-sm shadow-primary/15 border border-primary/20'
		: 'bg-base-100/95 text-base-content shadow-xs border border-primary/15';

	return (
		<div
			className={`flex ${isOwn ? 'justify-end' : 'justify-start'} px-1 ${isFirstInGroup ? 'mt-2' : 'mt-0.75'
				}`}
		>
			<div
				className={`relative max-w-[80%] sm:max-w-[70%] px-3.5 py-2 text-sm transition-shadow duration-200 ${bubbleRadius} ${bubbleColors} ${isCurrentMatch ? 'ring-2 ring-warning ring-offset-2 ring-offset-base-200' : ''
					}`}
				style={{ overflowWrap: 'anywhere' }}
			>
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
					<p className="whitespace-pre-wrap leading-relaxed text-[13.5px]">
						<Linkify text={message.text} query={query} />
					</p>
				)}

				{message.type === 'deleted' && (
					<p className="italic opacity-65 text-xs flex items-center gap-1.5 py-0.5">
						<Ban size={13} className="shrink-0" />
						<span>{message.text}</span>
					</p>
				)}

				{message.type === 'missing' && (
					<div
						className={`flex items-center gap-2 py-1 px-2.5 rounded-xl text-xs ${isOwn ? 'bg-black/10 text-primary-content/90' : 'bg-primary/8 text-base-content/75'
							}`}
					>
						<Sparkles size={13} className="shrink-0 opacity-80" />
						<span className="italic">{message.text}</span>
					</div>
				)}

				{/* Hora y estado editado */}
				<div
					className={`flex items-center justify-end gap-1 text-[9.5px] mt-1 leading-none select-none pointer-events-none ${isOwn ? 'text-primary-content/75' : 'text-base-content/45'
						}`}
				>
					{message.isEdited && <span className="italic">editado ·</span>}
					<span className="tabular-nums">{message.rawTime}</span>
				</div>
			</div>
		</div>
	);
}
