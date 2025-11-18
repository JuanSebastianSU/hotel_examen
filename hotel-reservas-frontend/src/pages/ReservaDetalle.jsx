import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { obtenerReserva } from "../api/reservasApi";

function ReservaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reserva, setReserva] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await obtenerReserva(id);
        setReserva(res.data);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar la reserva.");
      }
    };

    cargar();
  }, [id]);

  if (error) {
    return (
      <div>
        <p style={{ color: "red" }}>{error}</p>
        <button onClick={() => navigate("/reservas")}>Volver</button>
      </div>
    );
  }

  if (!reserva) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <h2>Detalle de reserva</h2>
      <p>
        <strong>Cliente:</strong> {reserva.cliente}
      </p>
      <p>
        <strong>Habitación:</strong> {reserva.habitacion}
      </p>
      <p>
        <strong>Fecha de entrada:</strong>{" "}
        {reserva.fechaEntrada ? reserva.fechaEntrada.slice(0, 10) : ""}
      </p>
      <p>
        <strong>Fecha de salida:</strong>{" "}
        {reserva.fechaSalida ? reserva.fechaSalida.slice(0, 10) : ""}
      </p>
      <p>
        <strong>Total:</strong> ${reserva.total}
      </p>

      <button onClick={() => navigate(`/reservas/${reserva._id}/editar`)}>
        Editar
      </button>{" "}
      <button onClick={() => navigate("/reservas")}>
        Volver al listado
      </button>
    </div>
  );
}

export default ReservaDetalle;
