export default function UnreadSeparator({ count }) {
    return (
        <div className="flex items-center gap-3 my-4 px-4 animate-fade-in">
            <div className="flex-1 h-px bg-primary/15" />
            <span className="px-3 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-primary/10 text-primary whitespace-nowrap shadow-sm">
                {count === 1 ? "1 nuevo mensaje" : `${count} nuevos mensajes`}
            </span>
            <div className="flex-1 h-px bg-primary/15" />
        </div>
    );
}