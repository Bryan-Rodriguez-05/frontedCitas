import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginRegister from './components/LoginRegister/loginRegister';
import Register from './components/Register/register';
import AgendarCita from './components/AgendarCita/agendarCita';
import MedicoCitas from './components/Medicos/medicoCitas';
import AdminUsuarios from './components/Admin/adminUsuarios';
import AdminCitas from './components/Admin/adminCitas';
import AdminEspecialidades from './components/Admin/adminEspecialidades';

function App() {
  // Aquí puedes validar el rol del usuario con el estado de usuario (ej. userData) o el token JWT
  const userData = JSON.parse(localStorage.getItem('userData'));

  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<LoginRegister />} />
        <Route path="/registro" element={<Register />} />

        {/* Rutas de paciente */}
        <Route path="/agendar-cita" element={userData?.rol === 'PACIENTE' ? <AgendarCita /> : <LoginRegister />} />
        <Route path="/mis-citas" element={userData?.rol === 'PACIENTE' ? <AgendarCita /> : <LoginRegister />} />

        {/* Rutas de médico */}
        <Route path="/medico-citas" element={userData?.rol === 'MEDICO' ? <MedicoCitas /> : <LoginRegister />} />

        {/* Rutas de administrador */}
        <Route path="/admin-usuarios" element={<AdminUsuarios />} />
        <Route path="/admin-citas" element={<AdminCitas />} />
        <Route path="/admin-especialidades" element={<AdminEspecialidades />} />
      </Routes>
    </Router>
  );
}

export default App;
