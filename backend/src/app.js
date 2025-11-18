const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const reservasRouter = require("./routes/reservaRoutes");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API de Reservas de Hotel" });
});

app.use("/api/reservas", reservasRouter);

app.use(errorHandler);

module.exports = app;
