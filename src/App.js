import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginRegister from './components/LoginRegister/loginRegister';
import Register from './components/Register/register';
import AgendarCita from './components/AgendarCita/agendarCita';
import MedicoCitas from './components/Medicos/medicoCitas';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginRegister />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/agendar-cita" element={<AgendarCita />} />
        <Route path="/medico-citas" element={<MedicoCitas />} /> 
      </Routes>
    </Router>
  );
}

export default App;
