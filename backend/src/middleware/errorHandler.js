const mongoose = require("mongoose");

module.exports = (err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  let status = 500;
  let message = "Error interno del servidor.";

  if (err.name === "ValidationError") {
    status = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(" ");
  } else if (err.name === "CastError") {
    status = 400;
    message = "ID inválido.";
  } else if (err.code && err.code === 11000) {
    status = 409;
    message = "Registro duplicado.";
  } else if (err.message) {
    message = err.message;
  }

  res.status(status).json({ message });
};
