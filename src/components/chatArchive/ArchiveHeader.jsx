import { ArrowLeft, Search, ArrowUpToLine, X, ChevronUp, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function ArchiveHeader({
	searchOpen,
	setSearchOpen,
	searchState,
	onScrollToFirst,
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

	if (searchOpen) {
		return (
			<div className="bg-base-100/90 backdrop-blur-md border-b border-base-content/5 px-3 py-2 flex items-center gap-2 z-20 shadow-xs animate-fade-in">
				<button
					type="button"
					onClick={() => {
						clearSearch();
						setSearchOpen(false);
					}}
					className="btn btn-ghost btn-circle btn-sm text-base-content/70"
					aria-label="Cerrar búsqueda"
				>
					<ArrowLeft size={18} />
				</button>

				<div className="flex-1 relative flex items-center">
					<input
						type="text"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder="Buscar en el chat..."
						autoFocus
						className="input input-sm w-full bg-base-200/60 rounded-xl pr-8 text-sm focus:outline-hidden"
					/>
					{query && (
						<button
							type="button"
							onClick={clearSearch}
							className="absolute right-2 text-base-content/40 hover:text-base-content"
						>
							<X size={15} />
						</button>
					)}
				</div>

				{totalMatches > 0 && (
					<div className="flex items-center gap-1 text-xs opacity-75 shrink-0">
						<span>
							{currentMatchDisplayIndex}/{totalMatches}
						</span>
						<div className="flex flex-col -space-y-1">
							<button
								type="button"
								onClick={goToPrev}
								className="btn btn-ghost btn-xs btn-square h-5 min-h-5"
								title="Anterior"
							>
								<ChevronUp size={14} />
							</button>
							<button
								type="button"
								onClick={goToNext}
								className="btn btn-ghost btn-xs btn-square h-5 min-h-5"
								title="Siguiente"
							>
								<ChevronDown size={14} />
							</button>
						</div>
					</div>
				)}
			</div>
		);
	}

	return (
		<div className="bg-base-100/85 backdrop-blur-md border-b border-base-content/5 px-3 py-2.5 flex items-center justify-between z-20 shadow-xs select-none">
			<div className="flex items-center gap-2 min-w-0">
				<button
					type="button"
					className="btn btn-circle btn-primary btn-sm text-white transition-transform active:scale-95"
					onClick={() => navigate(-1)}
					aria-label="Volver"
				>
					<ArrowLeft size={18} />
				</button>

				<div className="min-w-0">
					<h1 className="font-bold text-sm text-base-content truncate leading-tight">
						Desde Secundaria 🎒
					</h1>
					<p className="text-[10px] text-primary/80 font-medium truncate">
						Nuestros mensajes guardados · Solo lectura
					</p>
				</div>
			</div>

			<div className="flex items-center gap-1 shrink-0">
				<button
					type="button"
					onClick={onScrollToFirst}
					className="btn btn-ghost btn-circle btn-sm text-base-content/75 active:scale-90"
					title="Ir al primer mensaje (2021)"
					aria-label="Primer mensaje"
				>
					<ArrowUpToLine size={18} />
				</button>

				<button
					type="button"
					onClick={() => setSearchOpen(true)}
					className="btn btn-ghost btn-circle btn-sm text-base-content/75 active:scale-90"
					title="Buscar mensajes"
					aria-label="Buscar"
				>
					<Search size={18} />
				</button>
			</div>
		</div>
	);
}

