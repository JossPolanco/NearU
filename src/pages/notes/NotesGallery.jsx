import { useNavigate } from 'react-router';
import { useRef } from 'react';
import { Drawer, NoteItem } from '@/components';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { getNotes } from '@/services/notes';
import { useResolveSignedUrls } from '@/hooks';

export default function NotesGallery() {
    const refDrawer = useRef(null)
    const navigate = useNavigate()
    const { data, isLoading } = useResolveSignedUrls(["notes"], getNotes)
    return (
        <>
            {/* Header / Navigation */}
            <div className="relative flex items-center justify-center py-2 border-b border-base-200/90 dark:border-base-800/40 mb-2">
                <button
                    onClick={() => navigate('/app')}
                    className="absolute left-0 btn btn-ghost btn-sm text-base-600 hover:text-primary active:scale-95 transition-all duration-200"
                    aria-label="Back to app"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center">
                    <h1 className="font-pacifico text-2xl md:text-3xl text-primary drop-shadow-md">
                        Momentos <span className="text-base-700 dark:text-base-300">Antiguos</span>
                    </h1>
                </div>
            </div>

            {/* Drawer for Previous Notes */}
            <Drawer ref={refDrawer} position="right">
                <div className="w-96 p-4 space-y-4">
                    <h2 className="font-pacifico text-xl text-primary">Notitas Anteriores</h2>
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {data?.length === 0 ? (
                                <p className="text-sm text-base-600 dark:text-base-400 text-center py-4">
                                    Aún no hay notitas guardadas.
                                </p>
                            ) : (
                                data.map((note) => (
                                    <NoteItem
                                        key={note.id}
                                        note={note}
                                    />
                                ))
                            )}
                        </div>
                    )}
                </div>
            </Drawer>
        </>
    )
}

export function Title() {
    return (
        <h2 className="text-2xl font-bold text-center">
            <span className="text-red-500">❤️</span>
            <span className="text-orange-500">N</span>
            <span className="text-yellow-400">O</span>
            <span className="text-green-500">T</span>
            <span className="text-cyan-400">A</span>
            <span className="text-violet-500">S</span>
            <span className="text-pink-500">❤️</span>
        </h2>
    )
}