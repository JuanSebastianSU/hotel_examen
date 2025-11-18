import { Routes, Route, Link } from "react-router-dom";
import ReservasLista from "./pages/ReservasLista";
import ReservaForm from "./pages/ReservaForm";
import ReservaDetalle from "./pages/ReservaDetalle";

function App() {
  return (
    <div className="app-container">
      <header>
        <h1>Sistema de Reservas de Hotel</h1>
        <nav>
          <Link to="/reservas">Reservas</Link>{" "}
          |{" "}
          <Link to="/reservas/nueva">Nueva reserva</Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<ReservasLista />} />
          <Route path="/reservas" element={<ReservasLista />} />
          <Route path="/reservas/nueva" element={<ReservaForm />} />
          <Route path="/reservas/:id/editar" element={<ReservaForm />} />
          <Route path="/reservas/:id" element={<ReservaDetalle />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
