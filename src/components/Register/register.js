// src/components/Register/register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    correo: '',
    fecha_nacimiento: '',
    direccion: '',
    telefono: '',
    contrasenia: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/pacientes/registro', formData);
      alert('Paciente registrado exitosamente');
      navigate('/');
    } catch (error) {
      console.error('Error al registrar el paciente:', error);
      alert('Error al registrar el paciente');
    }
  };

  return (
    <div className="container mt-5">
      <div className="card mx-auto" style={{ maxWidth: '500px' }}>
        <div className="card-body">
          <h3 className="card-title text-center">Formulario de Registro</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Nombre"
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                placeholder="Apellido"
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                placeholder="DNI"
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                placeholder="Correo"
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                name="contrasenia"
                value={formData.contrasenia}
                onChange={handleChange}
                placeholder="Contraseña"
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="date"
                name="fecha_nacimiento"
                value={formData.fecha_nacimiento}
                onChange={handleChange}
                placeholder="Fecha de Nacimiento"
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                placeholder="Dirección"
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="Teléfono"
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Registrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
