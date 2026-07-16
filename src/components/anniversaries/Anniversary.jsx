import React from 'react'

export default function Anniversary({ id, title, description, eventDate, anniversaryType, reminderDaysBefore, onEdit, onDelete }) {

    return (
        <div className="card bg-base-100 shadow-sm border border-base-200/40">
            <div className="card-body p-4">
                <h2 className="card-title text-lg font-semibold">{title}</h2>
                <p className="text-sm text-base-content/80">{description}</p>

                <div className="stats stats-vertical md:stats-horizontal shadow-none border border-base-200/50 rounded-xl mt-2">
                    <div className="stat">
                        <div className="stat-title">Evento</div>
                        <div className="stat-value text-lg">{eventDate}</div>
                    </div>

                    <div className="stat">
                        <div className="stat-title">Tipo</div>
                        <div className="stat-value text-lg capitalize">{anniversaryType}</div>
                    </div>

                    <div className="stat">
                        <div className="stat-title">Recordatorio</div>
                        <div className="stat-value text-lg">{reminderDaysBefore} días</div>
                        <div className="stat-desc">antes del evento</div>
                    </div>
                </div>

                <div className="card-actions justify-end mt-3">
                    <button className="btn btn-ghost btn-sm" onClick={() => onEdit(id)}>Editar</button>
                    <button className="btn btn-error btn-sm" onClick={() => onDelete(id)}>Eliminar</button>
                </div>
            </div>
        </div>
    )
}
