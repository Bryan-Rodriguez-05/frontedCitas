import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [formData, setFormData] = useState({
    correo: '',
    contrasenia: '',
    rol: 'PACIENTE',  // Por defecto, rol paciente
  });

  // Cargar usuarios
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/usuarios');
        setUsuarios(response.data);
      } catch (error) {
        console.error('Error al obtener usuarios', error);
      }
    };
    fetchUsuarios();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/admin/usuarios', formData);
      alert('Usuario creado exitosamente');
      setFormData({ correo: '', contrasenia: '', rol: 'PACIENTE' });
      setUsuarios([...usuarios, response.data]);
    } catch (error) {
      alert('Error al crear usuario');
      console.error('Error al crear usuario', error);
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
        <button type="submit" className="btn btn-primary">
          Crear Usuario
        </button>
      </form>

      <h4 className="mt-5">Usuarios Existentes</h4>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Correo</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.correo}</td>
              <td>{usuario.rol}</td>
              <td>
                <button className="btn btn-warning btn-sm">Editar</button>
                <button className="btn btn-danger btn-sm">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsuarios;
