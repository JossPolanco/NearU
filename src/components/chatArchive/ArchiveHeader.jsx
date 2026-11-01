import { ArrowLeft, Search, ArrowUpToLine, X, ChevronUp, ChevronDown } from 'lucide-react';
import { tapFeedback, touchHover, mobileSpring } from '@/utils/motion';
import profilePhoto from '@/assets/img/our_chat_old.webp';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';


export default function ArchiveHeader({
	searchOpen,
	setSearchOpen,
	searchState,
	onScrollToFirst,
	totalMessages = 2663,
}) {
	const navigate = useNavigate();
	const {
		query,
		setQuery,
		totalMatches,
		currentMatchDisplayIndex,
		goToNext,
		goToPrev,
		clearSearch,
	} = searchState;

	return (
		<div className="relative z-20 px-2.5 pt-2.5 pb-1 select-none">
			<div className="bg-base-100/80 backdrop-blur-xl border border-primary/15 rounded-3xl px-3 py-2 shadow-sm">
				<AnimatePresence mode="wait" initial={false}>
					{searchOpen ? (
						<motion.div
							key="search-bar"
							initial={{ opacity: 0, y: -6, scale: 0.98 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: -6, scale: 0.98 }}
							transition={mobileSpring}
							className="flex items-center gap-2"
						>
							<motion.button
								type="button"
								whileTap={tapFeedback.icon}
								onClick={() => {
									clearSearch();
									setSearchOpen(false);
								}}
								className="btn btn-ghost btn-circle btn-sm text-base-content/70"
								aria-label="Cerrar búsqueda"
							>
								<ArrowLeft size={18} />
							</motion.button>

							<div className="flex-1 relative flex items-center">
								<Search size={14} className="absolute left-3 text-primary/60 pointer-events-none" />
								<input
									type="text"
									value={query}
									onChange={(e) => setQuery(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === 'Enter') {
											e.shiftKey ? goToPrev() : goToNext();
										}
									}}
									placeholder="Buscar mensaje..."
									autoFocus
									className="input input-sm w-full bg-base-200/70 border-primary/15 focus:border-primary/40 rounded-2xl pl-8 pr-8 text-sm focus:outline-hidden"
								/>
								{query && (
									<button
										type="button"
										onClick={clearSearch}
										className="absolute right-2.5 text-base-content/40 hover:text-base-content transition-colors"
									>
										<X size={15} />
									</button>
								)}
							</div>

							{query.trim().length >= 2 && (
								<div className="flex items-center gap-1 text-xs shrink-0">
									<span className="badge badge-soft badge-primary badge-sm font-semibold tabular-nums">
										{totalMatches > 0 ? `${currentMatchDisplayIndex}/${totalMatches}` : '0'}
									</span>
									<div className="flex items-center">
										<motion.button
											type="button"
											whileTap={tapFeedback.icon}
											onClick={goToPrev}
											disabled={totalMatches === 0}
											className="btn btn-ghost btn-xs btn-circle"
											title="Anterior"
										>
											<ChevronUp size={15} />
										</motion.button>
										<motion.button
											type="button"
											whileTap={tapFeedback.icon}
											onClick={goToNext}
											disabled={totalMatches === 0}
											className="btn btn-ghost btn-xs btn-circle"
											title="Siguiente"
										>
											<ChevronDown size={15} />
										</motion.button>
									</div>
								</div>
							)}
						</motion.div>
					) : (
						<motion.div
							key="normal-header"
							initial={{ opacity: 0, y: 6 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 6 }}
							transition={mobileSpring}
							className="flex items-center justify-between gap-2"
						>
							<div className="flex items-center gap-2.5 min-w-0">
								<motion.button
									type="button"
									whileHover={touchHover({ scale: 1.05 })}
									whileTap={tapFeedback.icon}
									className="btn btn-circle btn-primary btn-sm text-primary-content shadow-xs shrink-0"
									onClick={() => navigate(-1)}
									aria-label="Volver"
								>
									<ArrowLeft size={17} />
								</motion.button>

								{/* Avatar cápsula romántica */}
								<div className="relative shrink-0">
									<div className="w-9 h-9 rounded-2xl bg-linear-to-br from-primary/25 via-secondary/20 to-accent/25 border border-primary/20 flex items-center justify-center shadow-2xs">
										<img className="w-full h-full object-cover rounded-full" src={profilePhoto} alt="" />
									</div>									
								</div>

								<div className="min-w-0">
									<div className="flex items-center gap-1.5">
										<h1 className="font-bold text-sm text-base-content truncate leading-tight">
											Our old chat bby
										</h1>
										<span className="badge badge-soft badge-primary badge-xs font-semibold">
											2021–2026
										</span>
									</div>
									<p className="text-[10.5px] text-base-content/60 font-medium truncate">
										{totalMessages.toLocaleString()} mensajitos bb
									</p>
								</div>
							</div>

							<div className="flex items-center gap-1 shrink-0">
								<motion.button
									type="button"
									whileHover={touchHover({ scale: 1.05 })}
									whileTap={tapFeedback.button}
									onClick={onScrollToFirst}
									className="btn btn-soft btn-primary btn-xs sm:btn-sm rounded-2xl gap-1 px-2.5 font-semibold"
									title="Viajar al primer mensaje (2021)"
								>
									<ArrowUpToLine size={14} />
									<span className="text-[11px]">Inicio</span>
								</motion.button>

								<motion.button
									type="button"
									whileHover={touchHover({ scale: 1.06 })}
									whileTap={tapFeedback.icon}
									onClick={() => setSearchOpen(true)}
									className="btn btn-ghost btn-circle btn-sm text-base-content/75 hover:bg-primary/10 hover:text-primary"
									title="Buscar en el chat"
									aria-label="Buscar"
								>
									<Search size={17} />
								</motion.button>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}
