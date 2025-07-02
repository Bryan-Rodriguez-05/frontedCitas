// src/components/Admin/AdminDashboard.js
import React, { useState } from 'react';
import AdminUsuarios from './adminUsuarios';
import AdminEspecialidades from './adminEspecialidades';
import AdminCitas from './adminCitas';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('usuarios');

  return (
    <div className="container mt-5">
      <h2>Panel de Administración</h2>

      {/* Nav tabs */}
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'usuarios' ? 'active' : ''}`}
            onClick={() => setActiveTab('usuarios')}
          >
            Usuarios
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'especialidades' ? 'active' : ''}`}
            onClick={() => setActiveTab('especialidades')}
          >
            Especialidades
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'citas' ? 'active' : ''}`}
            onClick={() => setActiveTab('citas')}
          >
            Citas
          </button>
        </li>
      </ul>

      {/* Contenido de cada tab */}
      <div className="tab-content mt-4">
        {activeTab === 'usuarios' && <AdminUsuarios />}
        {activeTab === 'especialidades' && <AdminEspecialidades />}
        {activeTab === 'citas' && <AdminCitas />}
      </div>
    </div>
  );
}

export default AdminDashboard;
