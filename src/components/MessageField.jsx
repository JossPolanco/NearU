import { Send } from 'lucide-react';

export default function MessageField() {
    return (
        <div className="sticky bottom-0 bg-base-300 px-4 py-2 flex gap-2">
            <input
                type="text"
                placeholder="Mensaje..."
                className="input input-bordered flex-1"
            />

            <button className="btn btn-circle btn-primary">
                <Send size={20} />
            </button>
        </div>
    );
}