import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { obtenerReserva } from "../api/reservasApi";

function ReservaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [reserva, setReserva] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargar = async () => {
      try {
        const resp = await obtenerReserva(id);
        setReserva(resp.data);
      } catch (err) {
        console.error(err);
        const msg =
          err.response?.data?.message ||
          "Error al cargar los detalles de la reserva.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, [id]);

  return (
    <div className="contenedor">
      <h1>Detalle de reserva</h1>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p>Cargando...</p>
      ) : reserva ? (
        <section className="card detalle-reserva">
          <p>
            <strong>Cliente:</strong> {reserva.cliente}
          </p>
          <p>
            <strong>Habitación:</strong> {reserva.habitacion}
          </p>
          <p>
            <strong>Fecha de entrada:</strong>{" "}
            {new Date(reserva.fechaEntrada).toLocaleDateString()}
          </p>
          <p>
            <strong>Fecha de salida:</strong>{" "}
            {new Date(reserva.fechaSalida).toLocaleDateString()}
          </p>
          <p>
            <strong>Total:</strong> {reserva.total}
          </p>

          <div className="acciones-formulario">
            <button
              type="button"
              onClick={() => navigate(`/reservas/${id}/editar`)}
            >
              Editar
            </button>
            <button
              type="button"
              className="btn-secundario"
              onClick={() => navigate("/reservas")}
            >
              Volver al listado
            </button>
          </div>
        </section>
      ) : (
        <p>No se encontró la reserva.</p>
      )}
    </div>
  );
}

export default ReservaDetalle;
