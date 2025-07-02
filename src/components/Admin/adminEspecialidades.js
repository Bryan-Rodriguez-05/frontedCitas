// src/components/Admin/AdminEspecialidades.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function AdminEspecialidades() {
  const [especialidades, setEspecialidades] = useState([]);
  const [nombre, setNombre] = useState('');

  const fetchEspecialidades = useCallback(async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/administradores/especialidades');
      setEspecialidades(data);
    } catch (error) {
      console.error('Error al obtener especialidades', error);
    }
  }, []);

  useEffect(() => {
    fetchEspecialidades();
  }, [fetchEspecialidades]);

  const handleAddEspecialidad = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/administradores/especialidades', { nombre });
      setNombre('');
      // recargamos la lista
      fetchEspecialidades();
    } catch (error) {
      console.error('Error al agregar especialidad', error);
    }
  };

  const handleDeleteEspecialidad = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/administradores/especialidades/${id}`);
      fetchEspecialidades();
    } catch (error) {
      console.error('Error al eliminar especialidad', error);
    }
  };

  return (
    <div className="container mt-5">
      <h3>Gestión de Especialidades Médicas</h3>
      <form onSubmit={handleAddEspecialidad}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre de especialidad"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Agregar Especialidad</button>
      </form>

      <h4 className="mt-5">Especialidades Existentes</h4>
      <ul className="list-group">
        {especialidades.map((esp) => (
          <li key={esp.id} className="list-group-item d-flex justify-content-between align-items-center">
            {esp.nombre}
            <button
              className="btn btn-danger btn-sm"
              onClick={() => handleDeleteEspecialidad(esp.id)}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminEspecialidades;
