export default function UnreadSeparator({ count }) {
    return (
        <div className="flex items-center gap-3 my-3 px-2">
            <div className="flex-1 h-px bg-base-content/20" />
            <span className="text-xs text-base-content/50 whitespace-nowrap">
                {count === 1 ? "1 mensaje nuevo" : `${count} mensajes nuevos`}
            </span>
            <div className="flex-1 h-px bg-base-content/20" />
        </div>
    );
}