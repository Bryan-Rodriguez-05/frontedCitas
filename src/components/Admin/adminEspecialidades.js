import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminEspecialidades() {
  const [especialidades, setEspecialidades] = useState([]);
  const [nombre, setNombre] = useState('');

  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/especialidades');
        setEspecialidades(response.data);
      } catch (error) {
        console.error('Error al obtener especialidades', error);
      }
    };
    fetchEspecialidades();
  }, []);

  const handleAddEspecialidad = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/admin/especialidades', { nombre });
      setEspecialidades([...especialidades, response.data]);
      setNombre('');
    } catch (error) {
      console.error('Error al agregar especialidad', error);
    }
  };

  const handleDeleteEspecialidad = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/especialidades/${id}`);
      setEspecialidades(especialidades.filter((esp) => esp.id !== id));
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
      <ul>
        {especialidades.map((especialidad) => (
          <li key={especialidad.id}>
            {especialidad.nombre} 
            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteEspecialidad(especialidad.id)}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminEspecialidades;
