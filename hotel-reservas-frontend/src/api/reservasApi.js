import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const reservasClient = axios.create({
  baseURL: `${API_BASE_URL}/reservas`,
});

// Listar reservas con filtros opcionales (habitacion, fechaEntrada)
export const listarReservas = (params) => reservasClient.get("/", { params });

// Obtener una reserva por ID
export const obtenerReserva = (id) => reservasClient.get(`/${id}`);

// Crear reserva
export const crearReserva = (data) => reservasClient.post("/", data);

// Actualizar reserva
export const actualizarReserva = (id, data) =>
  reservasClient.put(`/${id}`, data);

// Eliminar reserva
export const eliminarReserva = (id) => reservasClient.delete(`/${id}`);

// Función extra 1: promedio del total reservado
export const obtenerPromedioTotal = () =>
  reservasClient.get("/promedio-total");

// Función extra 2: resumen por habitación
export const obtenerResumenPorHabitacion = () =>
  reservasClient.get("/resumen-por-habitacion");
