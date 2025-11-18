const mongoose = require("mongoose");

const ReservaSchema = new mongoose.Schema(
  {
    cliente: { type: String, required: [true, "El cliente es obligatorio"] },
    habitacion: { type: String, required: [true, "La habitación es obligatoria"] },
    fechaEntrada: { type: Date, required: [true, "La fecha de entrada es obligatoria"] },
    fechaSalida: { type: Date, required: [true, "La fecha de salida es obligatoria"] },
    total: { type: Number, required: [true, "El total es obligatorio"], min: [0, "El total no puede ser negativo"] },
  },
  {
    timestamps: { createdAt: "creadoEn", updatedAt: "actualizadoEn" },
  }
);

module.exports = mongoose.model("Reserva", ReservaSchema);
