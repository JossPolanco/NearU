import { useNavigate } from 'react-router';
import React from 'react'

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6 ">
      <div>TE AMO MUCHO COSA LINDA ATT EVELYN</div>

      <button className="btn btn-primary" onClick={() => navigate('/testing')}>
        Pagina de pruebas
      </button>
    </div>
  )
}
