import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate, useLocation } from 'react-router-dom';

function AgendarCita() {
  const location = useLocation();
  const patientData = location.state ? location.state.patientData : null;

  // Declaramos todos los hooks incondicionalmente
  const [formData, setFormData] = useState({
    paciente_id: patientData ? patientData.id : '',
    fecha_cita: '',
    motivo: ''
  });
  const [citas, setCitas] = useState([]);
  const [editingCitaId, setEditingCitaId] = useState(null);
  const [editFormData, setEditFormData] = useState({ fecha_cita: '', motivo: '' });

  // Función para obtener las citas del paciente
  const fetchCitas = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/citas?paciente_id=${patientData.id}`);
      setCitas(response.data);
    } catch (error) {
      console.error(error);
      alert('Error al obtener las citas');
    }
  };

  useEffect(() => {
    if (patientData) {
      fetchCitas();
    }
  }, [patientData]);

  if (!patientData) {
    return <Navigate to="/" />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const agendarCita = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/citas', formData);
      alert(response.data.message);
      setFormData({ ...formData, fecha_cita: '', motivo: '' });
      fetchCitas();
    } catch (error) {
      alert('Hubo un error al agendar la cita');
      console.error(error);
    }
  };

  const startEditing = (cita) => {
    setEditingCitaId(cita.id);
    const formattedDate = new Date(cita.fecha_cita).toISOString().substring(0, 16);
    setEditFormData({ fecha_cita: formattedDate, motivo: cita.motivo });
  };

  const cancelEditing = () => {
    setEditingCitaId(null);
    setEditFormData({ fecha_cita: '', motivo: '' });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const saveEdit = async (citaId) => {
    try {
      const formattedFecha = editFormData.fecha_cita.replace('T', ' ');
      await axios.put(`http://localhost:5000/api/citas/${parseInt(citaId)}`, {
        paciente_id: parseInt(patientData.id),
        fecha_cita: formattedFecha,
        motivo: editFormData.motivo
      });
      alert('Cita actualizada exitosamente');
      setEditingCitaId(null);
      fetchCitas();
    } catch (error) {
      alert('Error al actualizar la cita');
      console.error(error);
    }
  };

  const deleteCita = async (citaId) => {
    if (!window.confirm('¿Estás seguro de eliminar esta cita?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/citas/${parseInt(citaId)}`);
      alert('Cita eliminada exitosamente');
      fetchCitas();
    } catch (error) {
      alert('Error al eliminar la cita');
      console.error(error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card mx-auto" style={{ maxWidth: '700px' }}>
        <div className="card-body">
          <h3 className="card-title text-center">Agendar Cita Médica</h3>
          <form onSubmit={agendarCita}>
            <div className="mb-3">
              <label className="form-label">Paciente:</label>
              <input type="text" className="form-control" value={`${patientData.nombre} ${patientData.apellido}`} disabled />
            </div>
            <div className="mb-3">
              <label className="form-label">Fecha de la Cita:</label>
              <input
                type="datetime-local"
                name="fecha_cita"
                value={formData.fecha_cita}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Motivo de la Cita:</label>
              <input
                type="text"
                name="motivo"
                value={formData.motivo}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Agendar Cita</button>
          </form>

          <h3 className="mt-5">Mis Citas</h3>
          {citas.length === 0 ? (
            <p>No tienes citas agendadas.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Motivo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {citas.map((cita) => (
                    <tr key={cita.id}>
                      <td>
                        {editingCitaId === cita.id ? (
                          <input
                            type="datetime-local"
                            name="fecha_cita"
                            value={editFormData.fecha_cita}
                            onChange={handleEditChange}
                            className="form-control"
                            required
                          />
                        ) : (
                          new Date(cita.fecha_cita).toLocaleString()
                        )}
                      </td>
                      <td>
                        {editingCitaId === cita.id ? (
                          <input
                            type="text"
                            name="motivo"
                            value={editFormData.motivo}
                            onChange={handleEditChange}
                            className="form-control"
                            required
                          />
                        ) : (
                          cita.motivo
                        )}
                      </td>
                      <td>
                        {editingCitaId === cita.id ? (
                          <>
                            <button onClick={() => saveEdit(cita.id)} className="btn btn-success btn-sm me-2">Guardar</button>
                            <button onClick={cancelEditing} className="btn btn-secondary btn-sm">Cancelar</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => startEditing(cita)} className="btn btn-warning btn-sm me-2">Editar</button>
                            <button onClick={() => deleteCita(cita.id)} className="btn btn-danger btn-sm">Eliminar</button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AgendarCita;
