// db/script_inicial_reservas.js
// Script de migración inicial para la base de datos de reservas de hotel.
// Puede ejecutarse con mongosh apuntando a la base de datos "reservas_hotel"
// o a la base configurada en MONGO_URL.

// Opcional: limpiar la colección si ya existe (descomentar si se desea)
// db.reservas.drop();

// Crear la colección "reservas" si no existe
db.createCollection("reservas");

// Insertar datos de ejemplo en la colección "reservas"
db.reservas.insertMany([
  {
    cliente: "JuanSantacruz",
    habitacion: "202",
    fechaEntrada: new Date("2025-11-18"),
    fechaSalida: new Date("2025-11-23"),
    total: 35
  },
  {
    cliente: "Mateo",
    habitacion: "202",
    fechaEntrada: new Date("2025-11-18"),
    fechaSalida: new Date("2025-11-26"),
    total: 35
  },
  {
    cliente: "Pedro",
    habitacion: "303",
    fechaEntrada: new Date("2025-11-18"),
    fechaSalida: new Date("2025-11-27"),
    total: 70
  },
  {
    cliente: "Cliente Prueba",
    habitacion: "101",
    fechaEntrada: new Date("2025-11-20"),
    fechaSalida: new Date("2025-11-22"),
    total: 150.5
  }
]);

// Al finalizar, puedes consultar:
// db.reservas.find().pretty();
