// Componente del doble check
export default function ReadIndicator({ readAt }) {
    if (readAt) {        
        return (
            <span className="text-xs text-primary opacity-80" title={`Leído`}>
                ✓✓
            </span>
        );
    }    
    return (
        <span className="text-xs opacity-40">
            ✓
        </span>
    );
}