const express = require("express");
const {
  crearReserva,
  listarReservas,
  obtenerReservaPorId,
  actualizarReserva,
  eliminarReserva,
  obtenerPromedioTotal,
} = require("../controllers/reservaController");

const router = express.Router();

// /api/reservas/
router.get("/", listarReservas);
router.post("/", crearReserva);

// /api/reservas/promedio-total
router.get("/promedio-total", obtenerPromedioTotal);

// /api/reservas/:id
router.get("/:id", obtenerReservaPorId);
router.put("/:id", actualizarReserva);
router.delete("/:id", eliminarReserva);

module.exports = router;
