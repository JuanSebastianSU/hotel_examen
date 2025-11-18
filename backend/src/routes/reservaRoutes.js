const express = require("express");
const {
  listarReservas,
  obtenerReservaPorId,
  crearReserva,
  actualizarReserva,
  eliminarReserva,
  obtenerPromedioTotal,
  obtenerResumenPorHabitacion,
} = require("../controllers/reservaController");

const router = express.Router();

// Lista con filtros opcionales
router.get("/", listarReservas);

// Funciones extra
router.get("/promedio-total", obtenerPromedioTotal);
router.get("/resumen-por-habitacion", obtenerResumenPorHabitacion);

// CRUD por ID
router.get("/:id", obtenerReservaPorId);
router.post("/", crearReserva);
router.put("/:id", actualizarReserva);
router.delete("/:id", eliminarReserva);

module.exports = router;
