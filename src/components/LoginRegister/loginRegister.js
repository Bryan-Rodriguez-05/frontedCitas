import React, { useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

function LoginRegister() {
  const [email, setEmail] = useState('');
  const [dni, setDni] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [patientData, setPatientData] = useState(null);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, dni });
      if (response.data.success) {
        setIsLoggedIn(true);
        setPatientData(response.data.patient);
      } else {
        alert(response.data.error);
      }
    } catch (error) {
      alert('Error al iniciar sesión');
    }
  };

  const handleRegister = () => {
    window.location.href = '/registro';
  };

  return (
    <div className="container mt-5">
      <div className="card mx-auto" style={{ maxWidth: '400px' }}>
        <div className="card-body">
          <h2 className="card-title text-center">Gestión de Citas Médicas</h2>
          <h4 className="card-subtitle mb-3 text-center">Inicia sesión o regístrate</h4>
          {!isLoggedIn ? (
            <div>
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="DNI"
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                />
              </div>
              <div className="d-grid gap-2">
                <button onClick={handleLogin} className="btn btn-primary">
                  Iniciar sesión
                </button>
                <button onClick={handleRegister} className="btn btn-secondary">
                  Registrarse
                </button>
              </div>
            </div>
          ) : (
            <Navigate to="/agendar-cita" state={{ patientData }} />
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginRegister;
