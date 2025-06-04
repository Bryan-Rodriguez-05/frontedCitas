// src/components/AgendarCita/agendarCita.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Navigate, useLocation } from 'react-router-dom';

function AgendarCita() {
  const location = useLocation();
  const userData = location.state ? location.state.userData : null;

  const [formData, setFormData] = useState({
    medico_usuario_id: '',
    especialidad_id: '',
    fecha_cita: '',
    motivo: '',
    tipo: ''
  });
  const [especialidades, setEspecialidades] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [citas, setCitas] = useState([]);
  const [editingCitaId, setEditingCitaId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    fecha_cita: '',
    motivo: '',
    tipo: ''
  });

  // 1) Traer las citas del paciente
  const fetchCitas = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/citas/mis-citas');
      setCitas(response.data);
    } catch (error) {
      console.error('Error al obtener las citas:', error);
      if (error.response && error.response.status === 401) {
        // Token expirado o inválido → redirigir a login
        window.location.href = '/';
      }
    }
  }, []);

  // 2) Traer especialidades
  const fetchEspecialidades = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/especialidades');
      setEspecialidades(response.data);
    } catch (error) {
      console.error('Error al obtener especialidades:', error);
      alert('Error al obtener las especialidades');
    }
  };

  // 3) Traer médicos según especialidad
  const fetchMedicosByEspecialidad = async (especialidadId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/medicos?especialidad_id=${especialidadId}`
      );
      setMedicos(response.data);
    } catch (error) {
      console.error('Error al obtener médicos:', error);
      alert('Error al obtener los médicos');
    }
  };

  // Al montar el componente: traer especialidades y citas
  useEffect(() => {
    if (!userData) return;
    fetchEspecialidades();
    fetchCitas();
  }, [userData, fetchCitas]);

  // Cuando cambie la especialidad, traer médicos
  useEffect(() => {
    if (formData.especialidad_id) {
      fetchMedicosByEspecialidad(formData.especialidad_id);
    } else {
      setMedicos([]);
    }
  }, [formData.especialidad_id]);

  // Si no hay usuario autenticado, redirigir a login
  if (!userData) {
    return <Navigate to="/" />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const agendarCita = async (e) => {
    e.preventDefault();
    try {
      const body = {
        medico_usuario_id: formData.medico_usuario_id,
        fecha_cita: formData.fecha_cita,
        motivo: formData.motivo,
        tipo: formData.tipo
      };
      const response = await axios.post('http://localhost:5000/api/citas', body);
      alert(response.data.message);

      // Limpiar campos (salvo paciente)
      setFormData({
        ...formData,
        medico_usuario_id: '',
        especialidad_id: '',
        fecha_cita: '',
        motivo: '',
        tipo: ''
      });
      setMedicos([]);
      fetchCitas();
    } catch (error) {
      console.error('Error al agendar la cita:', error);
      if (error.response && error.response.status === 401) {
        window.location.href = '/';
      } else {
        alert('Hubo un error al agendar la cita');
      }
    }
  };

  const startEditing = (cita) => {
    setEditingCitaId(cita.id);
    setEditFormData({
      fecha_cita: new Date(cita.fecha_cita).toISOString().slice(0, 16),
      motivo: cita.motivo,
      tipo: cita.tipo
    });
  };

  const cancelEditing = () => {
    setEditingCitaId(null);
    setEditFormData({
      fecha_cita: '',
      motivo: '',
      tipo: ''
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const saveEdit = async (citaId) => {
    try {
      const body = {
        fecha_cita: editFormData.fecha_cita,
        motivo: editFormData.motivo,
        tipo: editFormData.tipo
      };
      await axios.put(`http://localhost:5000/api/citas/${citaId}`, body);
      alert('Cita actualizada exitosamente');
      setEditingCitaId(null);
      fetchCitas();
    } catch (error) {
      console.error('Error al actualizar la cita:', error);
      if (error.response && error.response.status === 401) {
        window.location.href = '/';
      } else {
        alert('Error al actualizar la cita');
      }
    }
  };

  const deleteCita = async (citaId) => {
    if (!window.confirm('¿Estás seguro de eliminar esta cita?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/citas/${citaId}`);
      alert('Cita eliminada exitosamente');
      fetchCitas();
    } catch (error) {
      console.error('Error al eliminar la cita:', error);
      if (error.response && error.response.status === 401) {
        window.location.href = '/';
      } else {
        alert('Error al eliminar la cita');
      }
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
              <input
                type="text"
                className="form-control"
                value={`${userData.nombre} ${userData.apellido}`}
                disabled
              />
            </div>

            {/* Dropdown para Especialidad */}
            <div className="mb-3">
              <label className="form-label">Especialidad:</label>
              <select
                className="form-control"
                name="especialidad_id"
                value={formData.especialidad_id}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione una especialidad</option>
                {especialidades.map((esp) => (
                  <option key={esp.id} value={esp.id}>
                    {esp.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Dropdown para Médico según la especialidad seleccionada */}
            <div className="mb-3">
              <label className="form-label">Médico:</label>
              <select
                className="form-control"
                name="medico_usuario_id"
                value={formData.medico_usuario_id}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un médico</option>
                {medicos.map((med) => (
                  <option key={med.usuario_id} value={med.usuario_id}>
                    {med.nombre} {med.apellido}
                  </option>
                ))}
              </select>
            </div>

            {/* Tipo de cita */}
            <div className="mb-3">
              <label className="form-label">Tipo de Cita:</label>
              <select
                className="form-control"
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un tipo</option>
                <option value="General">General</option>
                <option value="Urgente">Urgente</option>
              </select>
            </div>

            {/* Fecha y hora */}
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

            {/* Motivo */}
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

            <button type="submit" className="btn btn-primary w-100">
              Agendar Cita
            </button>
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
                    <th>Tipo</th>
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
                          <select
                            name="tipo"
                            value={editFormData.tipo}
                            onChange={handleEditChange}
                            className="form-control"
                            required
                          >
                            <option value="General">General</option>
                            <option value="Urgente">Urgente</option>
                          </select>
                        ) : (
                          cita.tipo
                        )}
                      </td>
                      <td>
                        {editingCitaId === cita.id ? (
                          <>
                            <button
                              onClick={() => saveEdit(cita.id)}
                              className="btn btn-success btn-sm me-2"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="btn btn-secondary btn-sm"
                            >
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEditing(cita)}
                              className="btn btn-warning btn-sm me-2"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => deleteCita(cita.id)}
                              className="btn btn-danger btn-sm"
                            >
                              Eliminar
                            </button>
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
