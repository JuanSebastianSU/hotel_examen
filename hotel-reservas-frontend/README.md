# Sistema de Reservas de Hotel - Frontend

Este directorio contiene el **frontend** del Sistema de Reservas de Hotel.  
La aplicación está construida con **React** y **Vite** y consume la API REST del backend.

---

## 1. Objetivo del frontend

- Mostrar las reservas almacenadas en el backend en una **tabla**.
- Permitir:
  - Crear nuevas reservas.
  - Editar reservas existentes.
  - Eliminar reservas.
  - Ver el detalle de una reserva específica.
- Usar el **filtro adicional** (habitación/fecha).
- Consumir el **endpoint de promedio del total reservado** y mostrarlo al usuario.

---

## 2. Requerimientos

- Node.js (18+ recomendado).
- npm.
- Backend en ejecución (local o remoto), que exponga la API en una URL (por ejemplo `http://localhost:4000/api`).

---

## 3. Instalación y ejecución local

Desde la carpeta `hotel-reservas-frontend`:

### 3.1. Instalar dependencias

```bash
npm install
3.2. Configurar variables de entorno
Crear un archivo .env en la raíz del frontend:

env
Copiar código
VITE_API_URL=http://localhost:4000/api
En producción, se debe reemplazar esta URL por la del backend desplegado (ejemplo: la URL de Railway).

3.3. Ejecutar en modo desarrollo
bash
Copiar código
npm run dev
Se mostrará en consola una URL similar a:

text
Copiar código
http://localhost:5173
Abrir esa URL en el navegador.

4. Estructura del frontend
text
Copiar código
hotel-reservas-frontend/
├─ src/
│  ├─ api/
│  │  └─ reservasApi.js      # Cliente Axios para comunicarse con el backend
│  ├─ pages/
│  │  ├─ ReservasLista.jsx   # Listado de reservas, filtros y promedio
│  │  ├─ ReservaForm.jsx     # Formulario de crear/editar reserva
│  │  └─ ReservaDetalle.jsx  # Vista de detalle de una reserva
│  ├─ App.jsx                # Definición de rutas con React Router
│  ├─ main.jsx               # Punto de entrada: ReactDOM + BrowserRouter
│  └─ index.css              # Estilos base
├─ package.json
└─ README.md
5. Navegación y rutas
El frontend usa React Router DOM para manejar las rutas:

/
Redirecciona / muestra la misma vista de /reservas.

/reservas
Vista principal con:

Listado de reservas en tabla.

Filtros por habitación y fecha.

Botón para consultar el promedio del total reservado.

/reservas/nueva
Página con formulario para crear una nueva reserva.

/reservas/:id/editar
Página con formulario precargado para editar la reserva con ID específico.

/reservas/:id
Vista de detalle de la reserva seleccionada.

6. Funcionalidades y vistas
6.1. Listado de reservas (ReservasLista.jsx)
Datos mostrados en la tabla:

Cliente

Habitación

Fecha de entrada

Fecha de salida

Total

Acciones:

Ver → Navega a /reservas/:id

Editar → Navega a /reservas/:id/editar

Eliminar → Llama a DELETE /api/reservas/:id y actualiza la tabla.

Filtros:

Campo de texto: Habitación.

Campo de fecha: Fecha de entrada.

Botón "Buscar" que llama a:

GET /api/reservas?habitacion=...&fechaEntrada=... según lo que haya ingresado el usuario.

Promedio del total:

Botón "Obtener promedio del total".

Llama a GET /api/reservas/promedio-total.

Muestra: Promedio del total reservado: $XXX.XX.

6.2. Formulario de reserva (ReservaForm.jsx)
Se utiliza tanto para crear como para editar reservas.

Si la ruta es /reservas/nueva:

El formulario empieza vacío.

Al enviar, llama a POST /api/reservas.

Si la ruta es /reservas/:id/editar:

Primero llama a GET /api/reservas/:id para cargar los datos.

Al enviar, llama a PUT /api/reservas/:id.

Campos del formulario:

Cliente (texto)

Habitación (texto)

Fecha de entrada (date)

Fecha de salida (date)

Total (number)

Validaciones en el frontend:

Todos los campos son obligatorios.

total debe ser mayor a 0.

fechaSalida no puede ser menor que fechaEntrada.

Si alguna validación falla, se muestra un mensaje de error al usuario.

6.3. Vista de detalle (ReservaDetalle.jsx)
Ruta: /reservas/:id.

Muestra toda la información de la reserva seleccionada:

Cliente

Habitación

Fecha de entrada

Fecha de salida

Total

Incluye botones:

"Editar" → va a /reservas/:id/editar.

"Volver al listado" → va a /reservas.

7. Cliente API: reservasApi.js
Este módulo centraliza las llamadas al backend usando Axios.

Ejemplo simplificado:

js
Copiar código
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export const reservasClient = axios.create({
  baseURL: `${API_BASE_URL}/reservas`,
});

export const listarReservas = (params) =>
  reservasClient.get("/", { params });

export const obtenerReserva = (id) =>
  reservasClient.get(`/${id}`);

export const crearReserva = (data) =>
  reservasClient.post("/", data);

export const actualizarReserva = (id, data) =>
  reservasClient.put(`/${id}`, data);

export const eliminarReserva = (id) =>
  reservasClient.delete(`/${id}`);

export const obtenerPromedioTotal = () =>
  reservasClient.get("/promedio-total");
8. Construcción para producción
Para generar una versión optimizada del frontend (por ejemplo para subir a Vercel):

bash
Copiar código
npm run build
Esto crea la carpeta dist/ con los archivos estáticos listos para ser servidos.

9. Despliegue (ejemplo en Vercel)
Pasos típicos para desplegar en Vercel:

Subir el frontend a un repositorio (GitHub, GitLab, etc.).

Crear un nuevo proyecto en Vercel a partir de ese repositorio.

Configurar la variable de entorno en Vercel:

VITE_API_URL=https://TU_BACKEND_EN_RAILWAY/api

Vercel ejecutará:

npm install

npm run build

Servirá el contenido de dist/.

Así, el frontend quedará publicado en una URL del tipo:

text
Copiar código
https://tu-proyecto.vercel.app
Y consumirá la API del backend desplegado.
