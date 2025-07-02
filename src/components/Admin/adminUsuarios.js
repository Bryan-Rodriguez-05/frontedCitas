// src/components/Admin/AdminUsuarios.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [formData, setFormData] = useState({
    correo: '',
    contrasenia: '',
    rol: 'PACIENTE',
  });

  const fetchUsuarios = useCallback(async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/administradores/usuarios');
      setUsuarios(data);
    } catch (error) {
      console.error('Error al obtener usuarios', error);
    }
  }, []);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/administradores/usuarios', formData);
      alert('Usuario creado exitosamente');
      setFormData({ correo: '', contrasenia: '', rol: 'PACIENTE' });
      fetchUsuarios();  // recargamos la lista
    } catch (error) {
      console.error('Error al crear usuario', error);
      alert('No se pudo crear el usuario');
    }
  };

  return (
    <div className="container mt-5">
      <h3>Gestión de Usuarios</h3>
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
          <select
            className="form-control"
            value={formData.rol}
            onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
            required
          >
            <option value="PACIENTE">Paciente</option>
            <option value="MEDICO">Médico</option>
            <option value="ADMIN">Administrador</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Crear Usuario</button>
      </form>

      <h4 className="mt-5">Usuarios Existentes</h4>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Correo</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.correo}</td>
              <td>{u.rol}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsuarios;
