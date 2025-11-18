# Sistema de Gestión de Reservas de Hotel - Backend

Este directorio contiene el **backend** del sistema de reservas de hotel.  
Es una API REST construida con **Node.js**, **Express** y **MongoDB (Mongoose)**.

La API gestiona una única entidad: `Reserva`.

---

## 1. Características principales

- CRUD completo para la entidad `Reserva`:
  - Crear
  - Listar
  - Buscar por ID
  - Actualizar
  - Eliminar
- Endpoint adicional:
  - Cálculo del **promedio del total reservado**.
- Filtro por:
  - Habitación.
  - Fecha de entrada (mediante query params).
- Conexión funcional a MongoDB (Atlas / Railway).
- Respuestas en formato JSON.
- Manejo básico de errores:
  - Validaciones Mongoose.
  - ID inválido.
  - Recurso no encontrado.
  - Error interno del servidor.

---

## 2. Requerimientos de ejecución

- Node.js (versión 18+ recomendada).
- npm.
- Una instancia de MongoDB accesible (por ejemplo MongoDB Atlas o MongoDB en Railway).
- Archivo `.env` configurado con:
  - `PORT`
  - `MONGO_URL`

---

## 3. Instalación y configuración

### 3.1. Instalar dependencias

Desde la carpeta `backend`:

```bash
npm install
3.2. Archivo .env
En la raíz del backend se usa un archivo .env para la configuración.

Ejemplo:

env
Copiar código
PORT=4000
MONGO_URL=mongodb+srv://USUARIO:CONTRASENIA@TU_HOST/reservas_hotel
PORT: puerto donde escuchará el servidor Express.

MONGO_URL: cadena de conexión completa a MongoDB (con usuario, contraseña, host y nombre de base de datos).

También se incluye un archivo de ejemplo .env.example con la misma estructura.

4. Ejecución en modo desarrollo
Estando en la carpeta backend:

bash
Copiar código
npm run dev
Esto ejecuta nodemon src/server.js, que:

Conecta a MongoDB usando MONGO_URL.

Levanta el servidor en el puerto especificado (PORT, por defecto 4000).

Si todo está correcto, en consola deberías ver mensajes similares a:

Conectado a MongoDB

Servidor escuchando en el puerto 4000

5. Estructura de archivos del backend
text
Copiar código
backend/
├─ src/
│  ├─ app.js                # Configuración de Express y middlewares
│  ├─ server.js             # Punto de inicio (conexión a DB y arranque del server)
│  ├─ config/
│  │  └─ db.js              # Conexión a MongoDB usando Mongoose
│  ├─ models/
│  │  └─ Reserva.js         # Modelo Mongoose de la entidad Reserva
│  ├─ controllers/
│  │  └─ reservaController.js # Lógica de negocio de los endpoints
│  ├─ routes/
│  │  └─ reservaRoutes.js   # Definición de rutas /api/reservas
│  └─ middleware/
│     └─ errorHandler.js    # Manejo centralizado de errores
├─ db/
│  └─ script_inicial_reservas.js # Script para inicializar la base de datos en MongoDB
├─ package.json
├─ .env.example
└─ README.md
6. Modelo de datos: Entidad Reserva
La única entidad del sistema es Reserva.

6.1. Esquema Mongoose
js
Copiar código
{
  _id: ObjectId,
  cliente: String,       // Nombre del cliente
  habitacion: String,    // Número o identificador de habitación
  fechaEntrada: Date,    // Fecha de entrada
  fechaSalida: Date,     // Fecha de salida
  total: Number,         // Total de la reserva
  creadoEn: Date,        // Timestamp de creación (automático)
  actualizadoEn: Date    // Timestamp de última actualización (automático)
}
Reglas básicas:

cliente: obligatorio.

habitacion: obligatoria.

fechaEntrada: obligatoria.

fechaSalida: obligatoria.

total:

Obligatorio.

No puede ser negativo (min: 0).

7. Endpoints de la API
La base de la API es:

text
Copiar código
http://localhost:4000/api/reservas
(Asumiendo PORT=4000)

7.1. Crear una reserva
Método: POST

Ruta: /api/reservas

Body (JSON):

json
Copiar código
{
  "cliente": "Juan Pérez",
  "habitacion": "101",
  "fechaEntrada": "2025-11-20",
  "fechaSalida": "2025-11-22",
  "total": 200.0
}
Respuesta (201): Reserva creada con su _id y timestamps.

7.2. Listar reservas (con filtros opcionales)
Método: GET

Ruta: /api/reservas

Query params opcionales:

habitacion: filtra por número de habitación.

fechaEntrada: filtra por fecha de entrada (YYYY-MM-DD).

Ejemplos:

Todas las reservas:

GET /api/reservas

Solo habitación 101:

GET /api/reservas?habitacion=101

Solo reservas con fecha de entrada 2025-11-20:

GET /api/reservas?fechaEntrada=2025-11-20

Combinado:

GET /api/reservas?habitacion=101&fechaEntrada=2025-11-20

7.3. Obtener una reserva por ID
Método: GET

Ruta: /api/reservas/:id

Ejemplo:

text
Copiar código
GET /api/reservas/64fbb23c1aec2629c4fe77fe
Respuestas:

200: objeto reserva.

404: { "message": "Reserva no encontrada" }

400: { "message": "ID inválido" } (si el formato de ID no es válido para MongoDB).

7.4. Actualizar una reserva
Método: PUT

Ruta: /api/reservas/:id

Body (JSON): mismo formato que al crear.

Ejemplo:

json
Copiar código
{
  "cliente": "Juan Pérez",
  "habitacion": "101",
  "fechaEntrada": "2025-11-20",
  "fechaSalida": "2025-11-23",
  "total": 250.0
}
Respuestas:

200: objeto reserva actualizado.

404: reserva no encontrada.

400: ID inválido o errores de validación.

7.5. Eliminar una reserva
Método: DELETE

Ruta: /api/reservas/:id

Respuestas:

200: { "message": "Reserva eliminada correctamente" }

404: { "message": "Reserva no encontrada" }

400: ID inválido.

7.6. Endpoint adicional: Promedio del total reservado
Método: GET

Ruta: /api/reservas/promedio-total

Respuesta (JSON):

json
Copiar código
{
  "promedioTotal": 180.75
}
Si no hay reservas, el promedio será 0.

8. Script de base de datos (migración inicial)
Archivo: db/script_inicial_reservas.js

js
Copiar código
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
Cómo ejecutar este script con mongosh
bash
Copiar código
mongosh "MONGO_URL_COMPLETA" --file db/script_inicial_reservas.js
Donde MONGO_URL_COMPLETA es la misma cadena que usas en MONGO_URL del .env.

9. Manejo de errores
Se utiliza un middleware centralizado (middleware/errorHandler.js) que:

Detecta errores de:

ID inválidos (CastError).

Validaciones de Mongoose (ValidationError).

Otros errores generales.

Envía respuestas consistentes en formato JSON:

400 para datos inválidos o ID incorrectos.

404 cuando no se encuentra la reserva.

500 para errores inesperados de servidor.

10. Despliegue (resumen)
Para desplegar en servicios como Railway:

Subir el código del backend a un repositorio (GitHub, por ejemplo).

Crear un proyecto en Railway usando ese repo.

Configurar variables de entorno:

PORT (Railway puede usar su propio puerto).

MONGO_URL con tu cadena de conexión de MongoDB (Atlas o la propia de Railway).

Railway se encargará de ejecutar npm install y npm start.

El frontend se conectará a la URL pública del backend, que se configurará en su propio .env (VITE_API_URL).
