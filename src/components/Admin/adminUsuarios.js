// src/components/Admin/AdminUsuarios.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function AdminUsuarios() {
  const [medicos, setMedicos] = useState([]);  // Cambié el nombre de 'usuarios' a 'medicos'
  const [especialidades, setEspecialidades] = useState([]);
  const [formData, setFormData] = useState({
    correo: '',
    contrasenia: '',
    nombre: '',
    apellido: '',
    telefono: '',
    especialidad_id: '',  // Especialidad del médico
  });

  // Obtener especialidades disponibles
  const fetchEspecialidades = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/especialidades');
      setEspecialidades(response.data);
    } catch (error) {
      console.error('Error al obtener especialidades', error);
    }
  }, []);

  // Obtener médicos existentes desde la tabla 'medicos'
  const fetchMedicos = useCallback(async () => {
  try {
    const { data } = await axios.get('http://localhost:5000/api/medicos', {
      headers: {
        'Cache-Control': 'no-cache', // Desactiva el cache
      },
    });
    setMedicos(data);
  } catch (error) {
    console.error('Error al obtener médicos', error);
  }
}, []);


  useEffect(() => {
    fetchMedicos();
    fetchEspecialidades();
  }, [fetchMedicos, fetchEspecialidades]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/medicos/registro', formData);
      alert('Médico creado exitosamente');
      setFormData({ correo: '', contrasenia: '', nombre: '', apellido: '', telefono: '', especialidad_id: '' });
      fetchMedicos();  // Recargamos la lista
    } catch (error) {
      console.error('Error al crear médico', error);
      alert('No se pudo crear el médico');
    }
  };

  return (
    <div className="container mt-5">
      <h3>Gestión de Médicos</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Correo electrónico"
            value={formData.correo}
            onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Contraseña"
            value={formData.contrasenia}
            onChange={(e) => setFormData({ ...formData, contrasenia: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Apellido"
            value={formData.apellido}
            onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Teléfono"
            value={formData.telefono}
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <select
            className="form-control"
            value={formData.especialidad_id}
            onChange={(e) => setFormData({ ...formData, especialidad_id: e.target.value })}
            required
          >
            <option value="">Seleccionar especialidad</option>
            {especialidades.map((especialidad) => (
              <option key={especialidad.id} value={especialidad.id}>
                {especialidad.nombre}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Crear Médico</button>
      </form>

      <h4 className="mt-5">Médicos Existentes</h4>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Correo</th>
            <th>Nombre</th>
            <th>Especialidad</th>
          </tr>
        </thead>
        <tbody>
          {medicos.map((medico) => (
            <tr key={medico.usuario_id}>
              <td>{medico.correo}</td>
              <td>{medico.nombre} {medico.apellido}</td>
              <td>{medico.especialidad}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsuarios;
