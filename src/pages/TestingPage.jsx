import React from 'react'
import { useNavigate } from 'react-router';

export default function TestingPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6 ">
      <button className="btn btn-primary" onClick={() => navigate('/home')}>
        Volver
      </button>
      <div>Pagina de pruebas jaja</div>
    </div>
  )
}