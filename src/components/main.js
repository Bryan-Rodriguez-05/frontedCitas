import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginRegister from './LoginRegister';
import Register from './Register';
import AgendarCita from './AgendarCita';
import MedicoCitas from './MedicoCitas';  // Importar componente de Médico

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginRegister />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/agendar-cita" element={<AgendarCita />} />
        <Route path="/medico-citas" element={<MedicoCitas />} />  {/* Agregar ruta del Médico */}
      </Routes>
    </Router>
  );
}

export default App;
