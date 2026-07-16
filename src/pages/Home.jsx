import { useNavigate } from 'react-router';
import React from 'react'

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-6 flex flex-col gap-6">
            <div>TE AMO MUCHO COSA LINDA ATT EVELYN</div>

            <button className="btn btn-primary" onClick={() => navigate('/testing')}>
                Pagina de pruebas
            </button>

            <button className="btn btn-primary" onClick={() => navigate('/tasks')}>
                Pagina de tareas
            </button>

            <button className="btn btn-primary" onClick={() => navigate('/dates')}>
                Pagina de dates
            </button>

            <button className="btn btn-primary" onClick={() => navigate('/notes')}>
                Pagina de notas
            </button>

            <button className="btn btn-primary" onClick={() => navigate('/diary')}>
                Pagina de diary
            </button>

            <button className="btn btn-primary" onClick={() => navigate('/anniversaries')}>
                Pagina de aniversarios
            </button>
        </div>
    )
}
