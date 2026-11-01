import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { useChatArchive } from '@/hooks/chatArchive/useChatArchive';
import { ArrowDown, Sparkles, Heart, Calendar } from 'lucide-react';
import ArchiveHeader from '@/components/chatArchive/ArchiveHeader';
import ArchiveBubble from '@/components/chatArchive/ArchiveBubble';
import { useChatSearch } from '@/hooks/chatArchive/useChatSearch';
import DaySeparator from '@/components/chatArchive/DaySeparator';
import { getUserProfile } from '@/services/user/userService';
import { tapFeedback, mobileSpring } from '@/utils/motion';
import { useVirtualizer } from '@tanstack/react-virtual';
import { motion, AnimatePresence } from 'motion/react';
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
	
	useEffect(() => {
		const handleKeyDown = (e) => {
			if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
				e.preventDefault();
				setSearchOpen(true);
			} else if (e.key === 'Escape' && searchOpen) {
				searchState.clearSearch();
				setSearchOpen(false);
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [searchOpen, searchState]);

	// Determinar quién es el usuario logueado ('josue' o 'evelyn')
	const isCurrentUserJosue = useMemo(() => {
		if (!userProfile) return true;
		const name = (userProfile.display_name || userProfile.nickname || '').toLowerCase();
		return name.includes('josu') || userProfile.gender === 'male';
	}, [userProfile]);

	// Virtualizador de alto rendimiento (60fps+)
	const rowVirtualizer = useVirtualizer({
		count: messages.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 70,
		overscan: 14,
	});

	// Scroll inicial al final del chat una vez que carguen los mensajes
	const hasInitialScrolled = useRef(false);
	useEffect(() => {
		if (messages.length > 0 && !hasInitialScrolled.current) {
			hasInitialScrolled.current = true;
			setTimeout(() => {
				rowVirtualizer.scrollToIndex(messages.length - 1, { align: 'end' });
			}, 120);
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
		const isNearBottom = scrollHeight - scrollTop - clientHeight < 320;
		setShowScrollBottom((prev) => (prev !== !isNearBottom ? !isNearBottom : prev));
	}, []);

	const scrollToFirstMessage = () => {
		rowVirtualizer.scrollToIndex(0, { align: 'start', behavior: 'smooth' });
	};

	const scrollToLastMessage = () => {
		if (messages.length > 0) {
			rowVirtualizer.scrollToIndex(messages.length - 1, { align: 'end', behavior: 'smooth' });
		}
	};

	const virtualItems = rowVirtualizer.getVirtualItems();

	// Fecha flotante del primer mensaje visible en el viewport
	const activeFloatingDate = useMemo(() => {
		if (virtualItems.length === 0 || messages.length === 0) return null;
		const topMsg = messages[virtualItems[0]?.index];
		return topMsg ? formatDateHeader(topMsg.date) : null;
	}, [virtualItems, messages]);

	return (
		<div className="fixed inset-0 flex flex-col bg-base-200 overflow-hidden">
			{/* Atmósfera cálida y romántica de fondo (sin afectar 60fps) */}
			<div
				aria-hidden="true"
				className="pointer-events-none fixed inset-0 overflow-hidden z-0"
			>
				<div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-primary/12 blur-3xl" />
				<div className="absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-secondary/12 blur-3xl" />
				<div className="absolute -bottom-28 left-1/4 w-72 h-72 rounded-full bg-accent/10 blur-3xl" />
			</div>

			<ArchiveHeader
				searchOpen={searchOpen}
				setSearchOpen={setSearchOpen}
				searchState={searchState}
				onScrollToFirst={scrollToFirstMessage}
				totalMessages={messages.length || 2663}
			/>

			{/* Pastilla de fecha fija en el tope para no chocar con las burbujas */}
			{!isLoading && !isError && activeFloatingDate && (
				<div className="pointer-events-none relative z-10 flex justify-center -mb-7 pt-1 select-none">
					<div className="bg-base-100/80 backdrop-blur-md text-base-content/70 border border-primary/15 text-[10.5px] font-semibold px-3 py-0.5 rounded-full shadow-2xs flex items-center gap-1.5">
						<Calendar size={10} className="text-primary/70" />
						<span className="capitalize">{activeFloatingDate}</span>
					</div>
				</div>
			)}

			{/* Área virtualizada del chat */}
			<div
				ref={parentRef}
				onScroll={handleScroll}
				className="flex-1 overflow-y-auto px-2.5 sm:px-4 pt-6 pb-4 scrollbar-thin relative z-1"
			>
				{isLoading ? (
					<div className="flex flex-col items-center justify-center h-full gap-3 select-none">
						<div className="p-4 rounded-3xl bg-base-100/80 border border-primary/15 shadow-sm flex flex-col items-center gap-2.5">
							<span className="loading loading-heart text-primary loading-lg"></span>
							<p className="text-xs text-base-content/70 font-medium">
								Abriendo nuestros mensajes...
							</p>
						</div>
					</div>
				) : isError ? (
					<div className="flex flex-col items-center justify-center h-full p-4 text-center">
						<div className="bg-base-100/90 border border-primary/15 rounded-3xl p-6 max-w-xs shadow-sm">
							<p className="text-sm text-base-content/80 mb-3">
								No se pudieron cargar los recuerdos en este momento.
							</p>
							<button
								type="button"
								onClick={() => window.location.reload()}
								className="btn btn-primary btn-sm rounded-2xl"
							>
								Reintentar
							</button>
						</div>
					</div>
				) : (
					<div
						className="max-w-2xl mx-auto"
						style={{
							height: `${rowVirtualizer.getTotalSize()}px`,
							width: '100%',
							position: 'relative',
						}}
					>
						{virtualItems.map((virtualRow) => {
							const index = virtualRow.index;
							const msg = messages[index];
							const prevMsg = messages[index - 1];
							const nextMsg = messages[index + 1];

							// Separador de fecha dentro del flujo normal (sin sticky para no superponerse)
							const currentDateStr = formatDateHeader(msg.date);
							const prevDateStr = prevMsg ? formatDateHeader(prevMsg.date) : null;
							const nextDateStr = nextMsg ? formatDateHeader(nextMsg.date) : null;
							const showDate = currentDateStr !== prevDateStr;

							// Agrupación visual de mensajes consecutivos del mismo autor en el mismo día
							const isFirstInGroup =
								showDate ||
								!prevMsg ||
								prevMsg.author !== msg.author ||
								prevMsg.type === 'system';
							const isLastInGroup =
								currentDateStr !== nextDateStr ||
								!nextMsg ||
								nextMsg.author !== msg.author ||
								nextMsg.type === 'system';

							const isOwn = isCurrentUserJosue ? msg.author === 'josue' : msg.author === 'evelyn';
							const isCurrentMatch = searchState.currentMatchMessageIndex === index;

							return (
								<div
									key={msg.id}
									data-index={index}
									ref={rowVirtualizer.measureElement}
									style={{
										position: 'absolute',
										top: 0,
										left: 0,
										width: '100%',
										transform: `translateY(${virtualRow.start}px)`,
									}}
								>
									{/* Tarjeta conmemorativa al inicio del chat (2021) */}
									{index === 0 && (
										<div className="my-3 mx-auto max-w-sm bg-base-100/85 backdrop-blur-md border border-primary/20 rounded-3xl p-4 text-center shadow-xs select-none">
											<div className="w-9 h-9 rounded-2xl bg-primary/15 text-primary mx-auto mb-2 flex items-center justify-center">
												<Heart size={18} className="fill-primary/25" />
											</div>
											<h2 className="font-bold text-xs sm:text-sm text-base-content">
												Aquí empezó our story (mas o menos) 
											</h2>
											<p className="text-[11px] text-base-content/65 mt-0.5 leading-relaxed">
												Desgraciadamente no tengo los mensajes del otro celular que te menciono aqui al inicio, sino tendriamos mensajes de mucho mas atras 🥺.
											</p>
										</div>
									)}

									{showDate && <DaySeparator dateString={currentDateStr} />}

									<ArchiveBubble
										message={msg}
										isOwn={isOwn}
										query={searchState.query}
										isCurrentMatch={isCurrentMatch}
										isFirstInGroup={isFirstInGroup}
										isLastInGroup={isLastInGroup}
									/>
								</div>
							);
						})}
					</div>
				)}
			</div>

			{/* Botón flotante animado para bajar al final */}
			<AnimatePresence>
				{showScrollBottom && (
					<motion.button
						type="button"
						initial={{ opacity: 0, scale: 0.8, y: 12 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.8, y: 12 }}
						transition={mobileSpring}
						whileTap={tapFeedback.icon}
						onClick={scrollToLastMessage}
						aria-label="Ir al último mensaje"
						className="btn btn-circle btn-sm bg-base-100/95 text-primary shadow-md border border-primary/20 fixed bottom-14 right-4 z-20"
					>
						<ArrowDown size={16} />
					</motion.button>
				)}
			</AnimatePresence>

			{/* Pie de página estilo cápsula flotante */}
			<div className="relative z-20 px-3 pb-2.5 pt-1 select-none">
				<div className="max-w-md mx-auto bg-base-100/80 backdrop-blur-xl border border-primary/15 rounded-2xl px-4 py-2 flex items-center justify-center gap-2 text-[11px] text-base-content/70 shadow-2xs">					
					<span className="font-medium truncate">
						Ya nos conociamos mi amor 🥺🥺
						Pero no nos amabamos 😢😞😞
					</span>
				</div>
			</div>
		</div>
	);
}
