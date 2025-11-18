const mongoose = require("mongoose");
const Reserva = require("../models/Reserva");

// Función auxiliar: validar y convertir habitación, fechas y total
function parsearDatosReserva(body) {
  const { cliente, habitacion, fechaEntrada, fechaSalida, total } = body;

  if (!cliente || !habitacion || !fechaEntrada || !fechaSalida || total === undefined) {
    return { error: "Todos los campos (cliente, habitacion, fechaEntrada, fechaSalida, total) son obligatorios." };
  }

  const habitacionNum = Number(habitacion);
  if (Number.isNaN(habitacionNum) || habitacionNum <= 0) {
    return { error: "La habitación debe ser un número positivo." };
  }

  const fechaEntradaDate = new Date(fechaEntrada);
  const fechaSalidaDate = new Date(fechaSalida);

  if (Number.isNaN(fechaEntradaDate.getTime()) || Number.isNaN(fechaSalidaDate.getTime())) {
    return { error: "Las fechas deben tener un formato válido (YYYY-MM-DD)." };
  }

  if (fechaSalidaDate < fechaEntradaDate) {
    return { error: "La fecha de salida no puede ser menor que la fecha de entrada." };
  }

  const totalNum = Number(total);
  if (Number.isNaN(totalNum) || totalNum <= 0) {
    return { error: "El total debe ser un número mayor que 0." };
  }

  return {
    valor: {
      cliente: cliente.trim(),
      habitacion: habitacionNum,
      fechaEntrada: fechaEntradaDate,
      fechaSalida: fechaSalidaDate,
      total: totalNum,
    },
  };
}

// Función auxiliar: comprobar solapamiento de reservas
async function existeSolape(habitacion, fechaEntrada, fechaSalida, idExcluir = null) {
  const filtro = {
    habitacion,
    fechaEntrada: { $lte: fechaSalida },
    fechaSalida: { $gte: fechaEntrada },
  };

  if (idExcluir) {
    filtro._id = { $ne: idExcluir };
  }

  const existe = await Reserva.exists(filtro);
  return Boolean(existe);
}

// GET /api/reservas
// Soporta filtros por ?habitacion= y ?fechaEntrada=YYYY-MM-DD
exports.listarReservas = async (req, res, next) => {
  try {
    const filtro = {};

    if (req.query.habitacion) {
      const habitacionNum = Number(req.query.habitacion);
      if (Number.isNaN(habitacionNum) || habitacionNum <= 0) {
        return res.status(400).json({ message: "El filtro de habitación debe ser un número positivo." });
      }
      filtro.habitacion = habitacionNum;
    }

    if (req.query.fechaEntrada) {
      const fecha = new Date(req.query.fechaEntrada);
      if (Number.isNaN(fecha.getTime())) {
        return res.status(400).json({ message: "El filtro de fechaEntrada debe tener formato YYYY-MM-DD." });
      }
      filtro.fechaEntrada = fecha;
    }

    const reservas = await Reserva.find(filtro).sort({ fechaEntrada: 1, habitacion: 1 });
    res.json(reservas);
  } catch (err) {
    next(err);
  }
};

// GET /api/reservas/:id
exports.obtenerReservaPorId = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const reserva = await Reserva.findById(id);
    if (!reserva) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    res.json(reserva);
  } catch (err) {
    next(err);
  }
};

// POST /api/reservas
exports.crearReserva = async (req, res, next) => {
  try {
    const { valor, error } = parsearDatosReserva(req.body);
    if (error) {
      return res.status(400).json({ message: error });
    }

    const { cliente, habitacion, fechaEntrada, fechaSalida, total } = valor;

    // Verificar que no exista solapamiento en la misma habitación
    const solape = await existeSolape(habitacion, fechaEntrada, fechaSalida);
    if (solape) {
      return res.status(409).json({
        message: "Ya existe una reserva para esa habitación en el rango de fechas indicado.",
      });
    }

    const reserva = new Reserva({
      cliente,
      habitacion,
      fechaEntrada,
      fechaSalida,
      total,
    });

    const guardada = await reserva.save();
    res.status(201).json(guardada);
  } catch (err) {
    next(err);
  }
};

// PUT /api/reservas/:id
exports.actualizarReserva = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const { valor, error } = parsearDatosReserva(req.body);
    if (error) {
      return res.status(400).json({ message: error });
    }

    const { cliente, habitacion, fechaEntrada, fechaSalida, total } = valor;

    // Verificar solapamiento excluyendo la propia reserva
    const solape = await existeSolape(habitacion, fechaEntrada, fechaSalida, id);
    if (solape) {
      return res.status(409).json({
        message: "No se puede actualizar la reserva: el rango de fechas se solapa con otra reserva en la misma habitación.",
      });
    }

    const reservaActualizada = await Reserva.findByIdAndUpdate(
      id,
      { cliente, habitacion, fechaEntrada, fechaSalida, total },
      { new: true, runValidators: true }
    );

    if (!reservaActualizada) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    res.json(reservaActualizada);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/reservas/:id
exports.eliminarReserva = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const eliminada = await Reserva.findByIdAndDelete(id);
    if (!eliminada) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    res.json({ message: "Reserva eliminada correctamente" });
  } catch (err) {
    next(err);
  }
};

// GET /api/reservas/promedio-total
exports.obtenerPromedioTotal = async (req, res, next) => {
  try {
    const resultado = await Reserva.aggregate([
      {
        $group: {
          _id: null,
          promedioTotal: { $avg: "$total" },
        },
      },
    ]);

    const promedioTotal = resultado[0]?.promedioTotal || 0;
    res.json({ promedioTotal });
  } catch (err) {
    next(err);
  }
};

// 🚀 NUEVA FUNCIÓN EXTRA
// GET /api/reservas/resumen-por-habitacion
// Devuelve para cada habitación: número de reservas, total facturado y promedio por reserva.
exports.obtenerResumenPorHabitacion = async (req, res, next) => {
  try {
    const resumen = await Reserva.aggregate([
      {
        $group: {
          _id: "$habitacion",
          totalReservas: { $sum: 1 },
          totalFacturado: { $sum: "$total" },
          promedioPorReserva: { $avg: "$total" },
        },
      },
      {
        $project: {
          _id: 0,
          habitacion: "$_id",
          totalReservas: 1,
          totalFacturado: 1,
          promedioPorReserva: 1,
        },
      },
      {
        $sort: { habitacion: 1 },
      },
    ]);

    res.json(resumen);
  } catch (err) {
    next(err);
  }
};
