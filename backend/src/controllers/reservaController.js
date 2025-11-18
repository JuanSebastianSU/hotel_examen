const Reserva = require("../models/Reserva");

// Crear reserva
const crearReserva = async (req, res, next) => {
  try {
    const { cliente, habitacion, fechaEntrada, fechaSalida, total } = req.body;

    const nuevaReserva = await Reserva.create({
      cliente,
      habitacion,
      fechaEntrada,
      fechaSalida,
      total,
    });

    res.status(201).json(nuevaReserva);
  } catch (error) {
    next(error);
  }
};

// Listar reservas (con filtros opcionales: habitacion, fechaEntrada)
const listarReservas = async (req, res, next) => {
  try {
    const { habitacion, fechaEntrada } = req.query;
    const filtro = {};

    if (habitacion) {
      filtro.habitacion = habitacion;
    }

    if (fechaEntrada) {
      // Filtrar por fecha exacta de entrada (rango de ese día)
      const inicio = new Date(fechaEntrada);
      const fin = new Date(fechaEntrada);
      fin.setDate(fin.getDate() + 1);

      filtro.fechaEntrada = { $gte: inicio, $lt: fin };
    }

    const reservas = await Reserva.find(filtro).sort({ fechaEntrada: 1 });
    res.json(reservas);
  } catch (error) {
    next(error);
  }
};

// Obtener reserva por ID
const obtenerReservaPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reserva = await Reserva.findById(id);

    if (!reserva) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    res.json(reserva);
  } catch (error) {
    next(error);
  }
};

// Actualizar reserva
const actualizarReserva = async (req, res, next) => {
  try {
    const { id } = req.params;

    const reservaActualizada = await Reserva.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!reservaActualizada) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    res.json(reservaActualizada);
  } catch (error) {
    next(error);
  }
};

// Eliminar reserva
const eliminarReserva = async (req, res, next) => {
  try {
    const { id } = req.params;

    const reservaEliminada = await Reserva.findByIdAndDelete(id);

    if (!reservaEliminada) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    res.json({ message: "Reserva eliminada correctamente" });
  } catch (error) {
    next(error);
  }
};

// Promedio del total reservado
const obtenerPromedioTotal = async (req, res, next) => {
  try {
    const resultado = await Reserva.aggregate([
      {
        $group: {
          _id: null,
          promedioTotal: { $avg: "$total" },
        },
      },
    ]);

    const promedio = resultado.length > 0 ? resultado[0].promedioTotal : 0;

    res.json({ promedioTotal: promedio });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  crearReserva,
  listarReservas,
  obtenerReservaPorId,
  actualizarReserva,
  eliminarReserva,
  obtenerPromedioTotal,
};
