//app.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginRegister from './components/LoginRegister/loginRegister';
import Register from './components/Register/register';
import AgendarCita from './components/AgendarCita/agendarCita';
import MedicoCitas from './components/Medicos/medicoCitas';
import AdminDashboard from './components/Admin/adminDashboard';

function App() {
  // Aquí puedes validar el rol del usuario con el estado de usuario (ej. userData) o el token JWT
  const userData = JSON.parse(localStorage.getItem('userData'));
  console.log(userData);
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<LoginRegister />} />
        <Route path="/registro" element={<Register />} />

        {/* Rutas de paciente */}
        <Route path="/agendar-cita" element={userData?.rol === 'PACIENTE' ? <AgendarCita /> : <LoginRegister />} />
        

        {/* Rutas de médico */}
        <Route path="/medico-citas" element={userData?.rol === 'MEDICO' ? <MedicoCitas /> : <LoginRegister />} />

        {/* Ruta principal de administrador */}
        <Route
          path="/admin"
          element={userData?.rol === 'ADMIN' ? <AdminDashboard /> : <LoginRegister />}
        />
      </Routes>
    </Router>
  );
}

export default App;
