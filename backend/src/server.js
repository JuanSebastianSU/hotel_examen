const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 4000;

const iniciarServidor = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error("No se pudo iniciar el servidor:", error);
    process.exit(1);
  }
};

iniciarServidor();
