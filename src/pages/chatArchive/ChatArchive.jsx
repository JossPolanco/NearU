import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { useChatArchive } from '@/hooks/chatArchive/useChatArchive';
import ArchiveHeader from '@/components/chatArchive/ArchiveHeader';
import ArchiveBubble from '@/components/chatArchive/ArchiveBubble';
import { useChatSearch } from '@/hooks/chatArchive/useChatSearch';
import DaySeparator from '@/components/chatArchive/DaySeparator';
import { getUserProfile } from '@/services/user/userService';
import { ArrowDown, HeartHandshake } from 'lucide-react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useQuery } from '@tanstack/react-query';

function formatDateHeader(date) {
	if (!date) return '';
	const d = new Date(date);
	return d.toLocaleDateString('es-MX', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	});
}

export default function ChatArchive() {
	const { data: messages = [], isLoading, isError } = useChatArchive();
	const { data: userProfile } = useQuery({
		queryKey: ['userProfile'],
		queryFn: getUserProfile,
	});

	const [searchOpen, setSearchOpen] = useState(false);
	const searchState = useChatSearch(messages);
	const parentRef = useRef(null);
	const [showScrollBottom, setShowScrollBottom] = useState(false);

	// Determinar quién es el usuario logueado ('josue' o 'evelyn')
	// Basado en el nombre o perfil de Supabase
	const isCurrentUserJosue = useMemo(() => {
		if (!userProfile) return true; // fallback
		const name = (userProfile.display_name || userProfile.nickname || '').toLowerCase();
		return name.includes('josu') || userProfile.gender === 'male';
	}, [userProfile]);

	// Virtualizador para los 2663 mensajes
	const rowVirtualizer = useVirtualizer({
		count: messages.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 72,
		overscan: 12,
	});

	// Scroll inicial al final del chat una vez que carguen los mensajes
	const hasInitialScrolled = useRef(false);
	useEffect(() => {
		if (messages.length > 0 && !hasInitialScrolled.current) {
			hasInitialScrolled.current = true;
			setTimeout(() => {
				rowVirtualizer.scrollToIndex(messages.length - 1, { align: 'end' });
			}, 150);
		}
	}, [messages.length, rowVirtualizer]);

	// Cuando la búsqueda encuentra un resultado, saltar al mensaje
	useEffect(() => {
		if (searchState.currentMatchMessageIndex !== null) {
			rowVirtualizer.scrollToIndex(searchState.currentMatchMessageIndex, {
				align: 'center',
				behavior: 'smooth',
			});
		}
	}, [searchState.currentMatchMessageIndex, rowVirtualizer]);

	// Controlar visibilidad del botón para bajar al último mensaje
	const handleScroll = useCallback(() => {
		if (!parentRef.current) return;
		const { scrollTop, scrollHeight, clientHeight } = parentRef.current;
		const isNearBottom = scrollHeight - scrollTop - clientHeight < 300;
		setShowScrollBottom(!isNearBottom);
	}, []);

	const scrollToFirstMessage = () => {
		rowVirtualizer.scrollToIndex(0, { align: 'start', behavior: 'smooth' });
	};

	const scrollToLastMessage = () => {
		if (messages.length > 0) {
			rowVirtualizer.scrollToIndex(messages.length - 1, { align: 'end', behavior: 'smooth' });
		}
	};

	return (
		<div className="fixed inset-0 flex flex-col bg-base-300">
			<ArchiveHeader
				searchOpen={searchOpen}
				setSearchOpen={setSearchOpen}
				searchState={searchState}
				onScrollToFirst={scrollToFirstMessage}
			/>

			{/* Área del chat */}
			<div
				ref={parentRef}
				onScroll={handleScroll}
				className="flex-1 overflow-y-auto px-3 py-2 scrollbar-thin relative"
			>
				{isLoading ? (
					<div className="flex flex-col items-center justify-center h-full gap-3 select-none">
						<span className="loading loading-heart text-primary loading-lg"></span>
						<p className="text-xs text-base-content/60 font-medium">
							Abriendo la cápsula del tiempo...
						</p>
					</div>
				) : isError ? (
					<div className="flex flex-col items-center justify-center h-full p-4 text-center">
						<p className="text-sm opacity-70 mb-2">No se pudieron cargar los mensajes.</p>
						<button
							type="button"
							onClick={() => window.location.reload()}
							className="btn btn-primary btn-sm rounded-xl"
						>
							Reintentar
						</button>
					</div>
				) : (
					<div
						style={{
							height: `${rowVirtualizer.getTotalSize()}px`,
							width: '100%',
							position: 'relative',
						}}
					>
						{rowVirtualizer.getVirtualItems().map((virtualRow) => {
							const msg = messages[virtualRow.index];
							const prevMsg = messages[virtualRow.index - 1];

							// Determinar si corresponde mostrar separador de fecha
							const currentDateStr = formatDateHeader(msg.date);
							const prevDateStr = prevMsg ? formatDateHeader(prevMsg.date) : null;
							const showDate = currentDateStr !== prevDateStr;

							// Determinar si es mensaje propio según usuario logueado
							const isOwn = isCurrentUserJosue ? msg.author === 'josue' : msg.author === 'evelyn';
							const isCurrentMatch = searchState.currentMatchMessageIndex === virtualRow.index;

							return (
								<div
									key={msg.id}
									data-index={virtualRow.index}
									ref={rowVirtualizer.measureElement}
									style={{
										position: 'absolute',
										top: 0,
										left: 0,
										width: '100%',
										transform: `translateY(${virtualRow.start}px)`,
									}}
								>
									{showDate && <DaySeparator dateString={currentDateStr} />}
									<ArchiveBubble
										message={msg}
										isOwn={isOwn}
										query={searchState.query}
										isCurrentMatch={isCurrentMatch}
									/>
								</div>
							);
						})}
					</div>
				)}
			</div>

			{/* Botón flotante para saltar al final */}
			{showScrollBottom && (
				<button
					type="button"
					onClick={scrollToLastMessage}
					aria-label="Ir al final"
					className="btn btn-circle btn-sm bg-base-100/90 text-primary shadow-lg border border-base-content/10 absolute bottom-12 right-4 z-20 active:scale-90 transition-transform"
				>
					<ArrowDown size={16} />
				</button>
			)}

			{/* Barra inferior de solo lectura */}
			<div className="bg-base-100/90 backdrop-blur-md border-t border-base-content/5 px-4 py-2 flex items-center justify-center gap-2 select-none text-[11px] text-base-content/60 shadow-xs">
				<HeartHandshake size={14} className="text-primary/70 shrink-0" />
				<span className="truncate">Un recuerdo de nuestra historia · Modo solo lectura</span>
			</div>
		</div>
	);
}

