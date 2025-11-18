import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  obtenerReserva,
  crearReserva,
  actualizarReserva,
} from "../api/reservasApi";

function ReservaForm() {
  const { id } = useParams();
  const editando = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    cliente: "",
    habitacion: "",
    fechaEntrada: "",
    fechaSalida: "",
    total: "",
  });

  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      if (editando) {
        try {
          setCargando(true);
          const res = await obtenerReserva(id);
          const r = res.data;
          setForm({
            cliente: r.cliente || "",
            habitacion: r.habitacion || "",
            fechaEntrada: r.fechaEntrada ? r.fechaEntrada.slice(0, 10) : "",
            fechaSalida: r.fechaSalida ? r.fechaSalida.slice(0, 10) : "",
            total: r.total ?? "",
          });
        } catch (err) {
          console.error(err);
          setError("No se pudo cargar la reserva");
        } finally {
          setCargando(false);
        }
      }
    };

    cargar();
  }, [editando, id]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validar = () => {
    if (
      !form.cliente.trim() ||
      !form.habitacion.trim() ||
      !form.fechaEntrada ||
      !form.fechaSalida ||
      !form.total
    ) {
      return "Todos los campos son obligatorios.";
    }

    if (Number(form.total) <= 0) {
      return "El total debe ser mayor que 0.";
    }

    if (form.fechaSalida < form.fechaEntrada) {
      return "La fecha de salida debe ser mayor o igual a la fecha de entrada.";
    }

    return "";
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    const mensajeError = validar();
    if (mensajeError) {
      setError(mensajeError);
      return;
    }

    setError("");

    try {
      const payload = {
        ...form,
        total: Number(form.total),
      };

      if (editando) {
        await actualizarReserva(id, payload);
      } else {
        await crearReserva(payload);
      }

      navigate("/reservas");
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al guardar la reserva.");
    }
  };

  return (
    <div>
      <h2>{editando ? "Editar reserva" : "Nueva reserva"}</h2>
      {cargando && <p>Cargando...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={manejarSubmit}>
        <div>
          <label>
            Cliente:
            <input
              type="text"
              name="cliente"
              value={form.cliente}
              onChange={manejarCambio}
            />
          </label>
        </div>

        <div>
          <label>
            Habitación:
            <input
              type="text"
              name="habitacion"
              value={form.habitacion}
              onChange={manejarCambio}
            />
          </label>
        </div>

        <div>
          <label>
            Fecha de entrada:
            <input
              type="date"
              name="fechaEntrada"
              value={form.fechaEntrada}
              onChange={manejarCambio}
            />
          </label>
        </div>

        <div>
          <label>
            Fecha de salida:
            <input
              type="date"
              name="fechaSalida"
              value={form.fechaSalida}
              onChange={manejarCambio}
            />
          </label>
        </div>

        <div>
          <label>
            Total:
            <input
              type="number"
              step="0.01"
              name="total"
              value={form.total}
              onChange={manejarCambio}
            />
          </label>
        </div>

        <div style={{ marginTop: "1rem" }}>
          <button type="submit">
            {editando ? "Guardar cambios" : "Crear reserva"}
          </button>{" "}
          <button type="button" onClick={() => navigate("/reservas")}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReservaForm;
