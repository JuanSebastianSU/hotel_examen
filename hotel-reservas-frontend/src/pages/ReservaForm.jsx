import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  crearReserva,
  actualizarReserva,
  obtenerReserva,
} from "../api/reservasApi";

function ReservaForm() {
  const { id } = useParams();
  const esEdicion = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    cliente: "",
    habitacion: "",
    fechaEntrada: "",
    fechaSalida: "",
    total: "",
  });
  const [loading, setLoading] = useState(false);
  const [cargandoInicial, setCargandoInicial] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarReserva = async () => {
      if (!esEdicion) {
        setCargandoInicial(false);
        return;
      }

      try {
        const resp = await obtenerReserva(id);
        const r = resp.data;
        setForm({
          cliente: r.cliente ?? "",
          habitacion: r.habitacion?.toString() ?? "",
          fechaEntrada: r.fechaEntrada
            ? new Date(r.fechaEntrada).toISOString().substring(0, 10)
            : "",
          fechaSalida: r.fechaSalida
            ? new Date(r.fechaSalida).toISOString().substring(0, 10)
            : "",
          total: r.total?.toString() ?? "",
        });
      } catch (err) {
        console.error(err);
        const msg =
          err.response?.data?.message ||
          "Error al cargar los datos de la reserva.";
        setError(msg);
      } finally {
        setCargandoInicial(false);
      }
    };

    cargarReserva();
  }, [esEdicion, id]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        cliente: form.cliente,
        habitacion: form.habitacion,
        fechaEntrada: form.fechaEntrada,
        fechaSalida: form.fechaSalida,
        total: form.total,
      };

      if (esEdicion) {
        await actualizarReserva(id, payload);
      } else {
        await crearReserva(payload);
      }

      navigate("/reservas");
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        (esEdicion
          ? "Ocurrió un error al actualizar la reserva."
          : "Ocurrió un error al crear la reserva.");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (cargandoInicial) {
    return (
      <div className="contenedor">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="contenedor">
      <h1>{esEdicion ? "Editar reserva" : "Nueva reserva"}</h1>

      {error && <p className="error">{error}</p>}

      <section className="card">
        <form className="form-reserva" onSubmit={manejarSubmit}>
          <div className="campo">
            <label>Cliente</label>
            <input
              type="text"
              name="cliente"
              value={form.cliente}
              onChange={manejarCambio}
              required
            />
          </div>

          <div className="campo">
            <label>Habitación (número)</label>
            <input
              type="number"
              name="habitacion"
              value={form.habitacion}
              onChange={manejarCambio}
              required
              min="1"
            />
          </div>

          <div className="campo">
            <label>Fecha de entrada</label>
            <input
              type="date"
              name="fechaEntrada"
              value={form.fechaEntrada}
              onChange={manejarCambio}
              required
            />
          </div>

          <div className="campo">
            <label>Fecha de salida</label>
            <input
              type="date"
              name="fechaSalida"
              value={form.fechaSalida}
              onChange={manejarCambio}
              required
            />
          </div>

          <div className="campo">
            <label>Total</label>
            <input
              type="number"
              step="0.01"
              min="0"
              name="total"
              value={form.total}
              onChange={manejarCambio}
              required
            />
          </div>

          <div className="acciones-formulario">
            <button type="submit" disabled={loading}>
              {loading
                ? esEdicion
                  ? "Guardando..."
                  : "Creando..."
                : esEdicion
                ? "Guardar cambios"
                : "Crear reserva"}
            </button>
            <button
              type="button"
              className="btn-secundario"
              onClick={() => navigate("/reservas")}
            >
              Cancelar
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default ReservaForm;
