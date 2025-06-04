import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode as jwt_decode } from 'jwt-decode';




function MedicoCitas() {
    const [citas, setCitas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCitasMedico = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error("Token no encontrado");
                    return;
                }
                const decodedToken = jwt_decode(token); // Decodificamos el token para obtener el usuario_id
                const usuarioId = decodedToken.id; // Obtenemos el ID del usuario del token

                // Obtener las citas del médico (usando el id del médico desde el token)
                const response = await axios.get(`http://localhost:5000/api/medicos/${usuarioId}/citas`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const citas = response.data.map((cita) => {
                    const fecha = new Date(cita.fecha_cita);
                    return {
                        ...cita,
                        fecha_cita: fecha instanceof Date && !isNaN(fecha) ? fecha.toLocaleString() : 'Fecha inválida',
                    };
                });

                setCitas(citas);
            } catch (error) {
                console.error("Error al obtener las citas del médico:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCitasMedico();
    }, []); // Se ejecuta una vez al cargar el componente

    if (loading) {
        return <p>Cargando citas...</p>;
    }

    return (
        <div className="container mt-5">
            <h3>Mis Citas como Médicos</h3>
            {citas.length === 0 ? (
                <p>No tienes citas asignadas.</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Motivo</th>
                                <th>Paciente</th>
                                <th>Especialidad</th>
                            </tr>
                        </thead>
                        <tbody>
                            {citas.map((cita, index) => (
                                <tr key={index}>
                                    <td>{cita.fecha_cita}</td>
                                    <td>{cita.motivo}</td>
                                    <td>{cita.paciente_nombre} {cita.paciente_apellido}</td>
                                    <td>{cita.especialidad}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default MedicoCitas;
