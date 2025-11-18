const { Schema, model } = require("mongoose");

const reservaSchema = new Schema(
  {
    cliente: {
      type: String,
      required: [true, "El cliente es obligatorio"],
      trim: true,
    },
    habitacion: {
      type: Number,
      required: [true, "La habitación es obligatoria"],
      min: [1, "La habitación debe ser un número positivo"],
    },
    fechaEntrada: {
      type: Date,
      required: [true, "La fecha de entrada es obligatoria"],
    },
    fechaSalida: {
      type: Date,
      required: [true, "La fecha de salida es obligatoria"],
    },
    total: {
      type: Number,
      required: [true, "El total es obligatorio"],
      min: [0, "El total no puede ser negativo"],
    },
  },
  {
    timestamps: {
      createdAt: "creadoEn",
      updatedAt: "actualizadoEn",
    },
  }
);

module.exports = model("Reserva", reservaSchema);
