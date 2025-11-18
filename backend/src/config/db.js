const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URL;

  if (!uri) {
    throw new Error("MONGO_URL no está definida en el archivo .env");
  }

  try {
    await mongoose.connect(uri);
    console.log("Conectado a MongoDB");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
    throw error;
  }
};

module.exports = connectDB;
