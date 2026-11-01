export default function DaySeparator({ dateString }) {
	if (!dateString) return null;

	return (
		<div className="flex items-center justify-center gap-3 my-4 px-4 select-none pointer-events-none">
			<div className="h-px flex-1 max-w-16 bg-linear-to-r from-transparent via-primary/25 to-primary/40" />
			<div className="bg-base-100/85 backdrop-blur-md text-base-content/80 font-semibold text-[11px] px-3.5 py-1 rounded-full shadow-xs border border-primary/15 flex items-center gap-1.5">
				<span className="capitalize tracking-wide">{dateString}</span>
			</div>
			<div className="h-px flex-1 max-w-16 bg-linear-to-l from-transparent via-primary/25 to-primary/40" />
		</div>
	);
}
