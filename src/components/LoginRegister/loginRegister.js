// src/components/LoginRegister/loginRegister.js
import React, { useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

function LoginRegister() {
  const [email, setEmail] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        contrasenia
      });

      const { success, token, profile } = response.data;
      if (!success) {
        return alert('Credenciales incorrectas');
      }

      // 1) Guardar el token en localStorage
      localStorage.setItem('token', token);

      // 2) Configurar Axios globalmente
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // 3) Guardar los datos de usuario y marcar que ya estamos logueados
      setUserData(profile);
      setIsLoggedIn(true);

    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Error al iniciar sesión. Verifica tus credenciales.');
    }
  };

  const handleRegister = () => {
    window.location.href = '/registro';
  };

  // Una vez que isLoggedIn es true, redirigimos según el rol que llegó en userData.rol
  if (isLoggedIn && userData) {
    if (userData.rol === 'MEDICO') {
      // Redirigir a la ruta de médico (por ejemplo /medico-citas)
      return <Navigate to="/medico-citas" state={{ userData }} />;
    } else if (userData.rol === 'ADMIN') {
      // Redirigir a la ruta de administrador (por ejemplo /admin-dashboard)
      return <Navigate to="/admin-dashboard" state={{ userData }} />;
    } else {
      // En cualquier otro caso (p. ej. rol PACIENTE), se va a la ruta de agendar cita
      return <Navigate to="/agendar-cita" state={{ userData }} />;
    }
  }

  return (
    <div className="container mt-5">
      <div className="card mx-auto" style={{ maxWidth: '400px' }}>
        <div className="card-body">
          <h2 className="card-title text-center">Gestión de Citas Médicas</h2>
          <h4 className="card-subtitle mb-3 text-center">Inicia sesión o regístrate</h4>
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
                type="password"
                className="form-control"
                placeholder="Contraseña"
                value={contrasenia}
                onChange={(e) => setContrasenia(e.target.value)}
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
        </div>
      </div>
    </div>
  );
}

export default LoginRegister;
