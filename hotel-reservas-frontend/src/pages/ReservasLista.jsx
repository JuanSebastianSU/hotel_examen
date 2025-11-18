import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  listarReservas,
  eliminarReserva,
  obtenerPromedioTotal,
  obtenerResumenPorHabitacion,
} from "../api/reservasApi";

function ReservasLista() {
  const navigate = useNavigate();

  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtros, setFiltros] = useState({
    habitacion: "",
    fechaEntrada: "",
  });
  const [promedioTotal, setPromedioTotal] = useState(null);
  const [resumenHabitaciones, setResumenHabitaciones] = useState([]);

  const [mostrarPromedio, setMostrarPromedio] = useState(false);
  const [mostrarResumen, setMostrarResumen] = useState(false);

  const cargarReservas = async () => {
    try {
      setLoading(true);
      setError("");
      const params = {};
      if (filtros.habitacion) {
        params.habitacion = filtros.habitacion;
      }
      if (filtros.fechaEntrada) {
        params.fechaEntrada = filtros.fechaEntrada;
      }
      const resp = await listarReservas(params);
      setReservas(resp.data);
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Error al cargar las reservas.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarReservas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const manejarCambioFiltro = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const manejarBuscar = (e) => {
    e.preventDefault();
    cargarReservas();
  };

  const manejarLimpiar = () => {
    setFiltros({ habitacion: "", fechaEntrada: "" });
    setPromedioTotal(null);
    setResumenHabitaciones([]);
    setMostrarPromedio(false);
    setMostrarResumen(false);
    setError("");
    cargarReservas();
  };

  const manejarPromedio = async () => {
    // Toggle: si ya está visible, lo ocultamos
    if (mostrarPromedio) {
      setMostrarPromedio(false);
      return;
    }

    try {
      setError("");
      const resp = await obtenerPromedioTotal();
      setPromedioTotal(resp.data.promedioTotal ?? 0);
      setMostrarPromedio(true);
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Error al obtener el promedio del total.";
      setError(msg);
    }
  };

  const manejarResumen = async () => {
    // Toggle: si ya está visible, lo ocultamos
    if (mostrarResumen) {
      setMostrarResumen(false);
      return;
    }

    try {
      setError("");
      const resp = await obtenerResumenPorHabitacion();
      setResumenHabitaciones(resp.data);
      setMostrarResumen(true);
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Error al obtener el resumen por habitación.";
      setError(msg);
    }
  };

  const manejarCrear = () => {
    navigate("/reservas/nueva");
  };

  const manejarVer = (id) => {
    navigate(`/reservas/${id}`);
  };

  const manejarEditar = (id) => {
    navigate(`/reservas/${id}/editar`);
  };

  const manejarEliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta reserva?")) return;
    try {
      setError("");
      await eliminarReserva(id);
      await cargarReservas();
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Error al eliminar la reserva.";
      setError(msg);
    }
  };

  return (
    <div className="contenedor">
      <h1>Sistema de Reservas de Hotel</h1>

      <section className="filtros card">
        <h2>Filtros</h2>
        <form onSubmit={manejarBuscar} className="form-filtros">
          <div className="campo">
            <label>Habitación (número)</label>
            <input
              type="number"
              name="habitacion"
              value={filtros.habitacion}
              onChange={manejarCambioFiltro}
              min="1"
            />
          </div>
          <div className="campo">
            <label>Fecha de entrada</label>
            <input
              type="date"
              name="fechaEntrada"
              value={filtros.fechaEntrada}
              onChange={manejarCambioFiltro}
            />
          </div>
          <div className="acciones-filtros">
            <button type="submit">Buscar</button>
            <button type="button" className="btn-secundario" onClick={manejarLimpiar}>
              Limpiar
            </button>
          </div>
        </form>
      </section>

      <section className="acciones-extra">
        <button type="button" onClick={manejarCrear}>
          Nueva reserva
        </button>
        <button type="button" onClick={manejarPromedio}>
          {mostrarPromedio ? "Ocultar promedio" : "Obtener promedio del total"}
        </button>
        <button type="button" onClick={manejarResumen}>
          {mostrarResumen ? "Ocultar resumen" : "Ver resumen por habitación"}
        </button>
      </section>

      {error && <p className="error">{error}</p>}

      {mostrarPromedio && promedioTotal !== null && (
        <section className="panel-promedio card">
          <h2>Promedio del total reservado</h2>
          <p className="valor-promedio">{promedioTotal.toFixed(2)}</p>
        </section>
      )}

      {mostrarResumen && resumenHabitaciones.length > 0 && (
        <section className="panel-resumen card">
          <h2>Resumen por habitación</h2>
          <table>
            <thead>
              <tr>
                <th>Habitación</th>
                <th>Total de reservas</th>
                <th>Total facturado</th>
                <th>Promedio por reserva</th>
              </tr>
            </thead>
            <tbody>
              {resumenHabitaciones.map((item) => (
                <tr key={item.habitacion}>
                  <td>{item.habitacion}</td>
                  <td>{item.totalReservas}</td>
                  <td>{item.totalFacturado.toFixed(2)}</td>
                  <td>{item.promedioPorReserva.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <section className="tabla-reservas card">
        <h2>Listado de reservas</h2>
        {loading ? (
          <p>Cargando reservas...</p>
        ) : reservas.length === 0 ? (
          <p>No hay reservas para mostrar.</p>
        ) : (
          <table>
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
                  <td>{new Date(r.fechaEntrada).toLocaleDateString()}</td>
                  <td>{new Date(r.fechaSalida).toLocaleDateString()}</td>
                  <td>{r.total}</td>
                  <td className="acciones-tabla">
                    <button type="button" onClick={() => manejarVer(r._id)}>
                      Ver
                    </button>
                    <button type="button" onClick={() => manejarEditar(r._id)}>
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn-peligro"
                      onClick={() => manejarEliminar(r._id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default ReservasLista;
