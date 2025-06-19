import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminCitas() {
  const [citas, setCitas] = useState([]);

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/citas');
        setCitas(response.data);
      } catch (error) {
        console.error('Error al obtener las citas', error);
      }
    };
    fetchCitas();
  }, []);

  const handleDeleteCita = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/citas/${id}`);
      setCitas(citas.filter((cita) => cita.id !== id));
    } catch (error) {
      console.error('Error al eliminar la cita', error);
    }
  };

  return (
    <div className="container mt-5">
      <h3>Gestión de Citas</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Motivo</th>
            <th>Paciente</th>
            <th>Médico</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {citas.map((cita) => (
            <tr key={cita.id}>
              <td>{new Date(cita.fecha_cita).toLocaleString()}</td>
              <td>{cita.motivo}</td>
              <td>{cita.paciente_nombre} {cita.paciente_apellido}</td>
              <td>{cita.medico_nombre} {cita.medico_apellido}</td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteCita(cita.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminCitas;
