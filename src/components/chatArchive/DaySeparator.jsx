export default function DaySeparator({ dateString }) {
	if (!dateString) return null;

	return (
		<div className="flex justify-center my-3 select-none pointer-events-none sticky top-1 z-10">
			<span className="bg-base-200/80 backdrop-blur-md text-base-content/70 font-medium text-[11px] px-3 py-1 rounded-full shadow-xs border border-base-content/5">
				{dateString}
			</span>
		</div>
	);
}

