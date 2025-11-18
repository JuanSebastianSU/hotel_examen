import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  listarReservas,
  eliminarReserva,
  obtenerPromedioTotal,
} from "../api/reservasApi";

function ReservasLista() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [habitacionFiltro, setHabitacionFiltro] = useState("");
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [promedio, setPromedio] = useState(null);

  const navigate = useNavigate();

  const cargarReservas = async () => {
    try {
      setLoading(true);
      setError("");
      const params = {};
      if (habitacionFiltro) params.habitacion = habitacionFiltro;
      if (fechaFiltro) params.fechaEntrada = fechaFiltro;

      const res = await listarReservas(params);
      setReservas(res.data);
    } catch (err) {
      console.error(err);
      setError("Error al cargar las reservas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarReservas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const manejarEliminar = async (id) => {
    const confirmar = window.confirm("¿Seguro que deseas eliminar esta reserva?");
    if (!confirmar) return;

    try {
      await eliminarReserva(id);
      cargarReservas();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar la reserva");
    }
  };

  const manejarPromedio = async () => {
    try {
      const res = await obtenerPromedioTotal();
      setPromedio(res.data.promedioTotal);
    } catch (err) {
      console.error(err);
      alert("Error al obtener el promedio del total");
    }
  };

  const manejarBuscar = () => {
    cargarReservas();
  };

  return (
    <div>
      <h2>Listado de reservas</h2>

      <section>
        <h3>Filtros</h3>
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <label>
            Habitación:{" "}
            <input
              type="text"
              value={habitacionFiltro}
              onChange={(e) => setHabitacionFiltro(e.target.value)}
            />
          </label>

          <label>
            Fecha de entrada:{" "}
            <input
              type="date"
              value={fechaFiltro}
              onChange={(e) => setFechaFiltro(e.target.value)}
            />
          </label>

          <button onClick={manejarBuscar}>Buscar</button>
        </div>
      </section>

      <section style={{ marginBottom: "1rem" }}>
        <button onClick={manejarPromedio}>Obtener promedio del total</button>
        {promedio !== null && (
          <p>
            Promedio del total reservado: <strong>${promedio.toFixed(2)}</strong>
          </p>
        )}
      </section>

      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table border="1" cellPadding="4" cellSpacing="0">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Habitación</th>
            <th>Fecha entrada</th>
            <th>Fecha salida</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reservas.map((r) => (
            <tr key={r._id}>
              <td>{r.cliente}</td>
              <td>{r.habitacion}</td>
              <td>{r.fechaEntrada ? r.fechaEntrada.slice(0, 10) : ""}</td>
              <td>{r.fechaSalida ? r.fechaSalida.slice(0, 10) : ""}</td>
              <td>${r.total}</td>
              <td>
                <button onClick={() => navigate(`/reservas/${r._id}`)}>
                  Ver
                </button>{" "}
                <button onClick={() => navigate(`/reservas/${r._id}/editar`)}>
                  Editar
                </button>{" "}
                <button onClick={() => manejarEliminar(r._id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {reservas.length === 0 && !loading && (
            <tr>
              <td colSpan="6">No hay reservas para mostrar</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ReservasLista;
