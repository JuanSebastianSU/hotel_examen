db.createCollection("reservas");

db.reservas.insertMany([
  {
    cliente: "Juan Pérez",
    habitacion: "101",
    fechaEntrada: new Date("2025-11-20"),
    fechaSalida: new Date("2025-11-22"),
    total: 200.0
  },
  {
    cliente: "María López",
    habitacion: "102",
    fechaEntrada: new Date("2025-11-21"),
    fechaSalida: new Date("2025-11-23"),
    total: 300.0
  }
]);
