import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export const reservasClient = axios.create({
  baseURL: `${API_BASE_URL}/reservas`,
});

export const listarReservas = (params) =>
  reservasClient.get("/", { params });

export const obtenerReserva = (id) =>
  reservasClient.get(`/${id}`);

export const crearReserva = (data) =>
  reservasClient.post("/", data);

export const actualizarReserva = (id, data) =>
  reservasClient.put(`/${id}`, data);

export const eliminarReserva = (id) =>
  reservasClient.delete(`/${id}`);

export const obtenerPromedioTotal = () =>
  reservasClient.get("/promedio-total");
