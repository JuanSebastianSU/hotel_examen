const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Error de ID inválido
  if (err.name === "CastError") {
    return res.status(400).json({ message: "ID inválido" });
  }

  // Error de validación de Mongoose
  if (err.name === "ValidationError") {
    const errors = {};
    Object.keys(err.errors).forEach((key) => {
      errors[key] = err.errors[key].message;
    });

    return res.status(400).json({
      message: "Datos inválidos",
      errors,
    });
  }

  res.status(500).json({
    message: "Error del servidor",
  });
};

module.exports = errorHandler;
