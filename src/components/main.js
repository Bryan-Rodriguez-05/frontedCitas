import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginRegister from './LoginRegister';
import Register from './Register';
import AgendarCita from './AgendarCita';

function Main() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginRegister />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/agendar-cita" element={<AgendarCita />} />
      </Routes>
    </Router>
  );
}

export default Main;
