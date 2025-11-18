# Sistema de Gestión de Reservas de Hotel

Este proyecto implementa un **Sistema de Gestión de Reservas de Hotel** sencillo, pensado como práctica de examen, que cumple los requerimientos:

- Una sola entidad principal: `Reserva`.
- Backend con API REST completa (CRUD) y una funcionalidad adicional de filtro/cálculo.
- Conexión a base de datos (MongoDB).
- Frontend que consume el backend:
  - Lista en tabla.
  - Formulario de creación/edición.
  - Vista de detalle.
  - Uso del filtro o cálculo adicional.

La idea es que el proyecto sea fácil de entender, ejecutar y explicar en clase.

---

## Estructura del proyecto

```text
ProyectoExamenPW/
├─ backend/                  # API REST con Node.js, Express y MongoDB (Mongoose)
├─ hotel-reservas-frontend/  # Frontend en React + Vite
└─ README.md                 # (este archivo)
1. backend/
Contiene la API REST encargada de gestionar las reservas:

Expone endpoints bajo /api/reservas.

Implementa:

Crear, listar, buscar por ID, actualizar y eliminar reservas.

Filtro por habitación/fecha.

Endpoint adicional para calcular el promedio del total reservado.

Se conecta a MongoDB usando Mongoose.

Incluye un script de inicialización de la base de datos en db/script_inicial_reservas.js.

Más detalles en: backend/README.md.

2. hotel-reservas-frontend/
Aplicación React encargada de la interfaz de usuario:

Vista en tabla de todas las reservas.

Formulario para crear/editar una reserva.

Vista de detalle de una reserva específica.

Filtros por habitación y fecha de entrada.

Botón para consultar el promedio del total reservado usando el endpoint adicional.

Más detalles en: hotel-reservas-frontend/README.md.

Tecnologías utilizadas
Backend

Node.js

Express

Mongoose (MongoDB)

Dotenv

Nodemon (desarrollo)

Frontend

React

Vite

React Router DOM

Axios

Base de datos

MongoDB (Atlas / Railway)

Cómo ejecutar todo el proyecto en local (resumen rápido)
Backend

bash
Copiar código
cd backend
npm install
# crear archivo .env con PORT y MONGO_URL
npm run dev
Frontend

bash
Copiar código
cd hotel-reservas-frontend
npm install
# crear archivo .env con VITE_API_URL apuntando al backend
npm run dev
Abrir en el navegador:

Backend: opcionalmente probar con Postman / navegador: http://localhost:4000/api/reservas

Frontend: http://localhost:5173

Entregables según enunciado y cómo se cumplen
Código fuente del backend
→ Carpeta backend/

Código fuente del frontend
→ Carpeta hotel-reservas-frontend/

Script SQL o migración para la base de datos
→ Archivo backend/db/script_inicial_reservas.js (script de inicialización para MongoDB en lugar de SQL clásico).

Archivo README con instrucciones para ejecutar ambos proyectos
→ backend/README.md y hotel-reservas-frontend/README.md explican paso a paso cómo correr cada parte.

Despliegue opcional del backend y/o frontend
→ El proyecto está preparado para desplegarse fácilmente en servicios como Railway (backend) y Vercel (frontend), simplemente configurando las variables de entorno que se indican en cada README.
