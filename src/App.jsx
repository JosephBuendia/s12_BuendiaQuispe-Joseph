import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import InicioPage from "./pages/InicioPage";
import ServiciosPage from "./pages/ServiciosPage";
import ComoFuncionaPage from "./pages/ComoFuncionaPage";
import ReportarPage from "./pages/ReportarPage";
import ContactoPage from "./pages/ContactoPage";
import PendientePage from "./pages/PendientePage";

// Tabla de rutas: cada URL se asocia con una página dentro del Layout común.
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<InicioPage />} />
        <Route path="/servicios" element={<ServiciosPage />} />
        <Route path="/como-funciona" element={<ComoFuncionaPage />} />
        <Route path="/reportar" element={<ReportarPage />} />
        <Route path="/contacto" element={<ContactoPage />} />

        {/* Pendientes de migrar: dependen de los roles y pagos del backend */}
        <Route path="/actualizar" element={<PendientePage titulo="Mis Registros / Pagos" />} />
        <Route path="/caja" element={<PendientePage titulo="Módulo de Caja" />} />
        <Route path="/panel" element={<PendientePage titulo="Panel CRUD Global" />} />
        <Route path="*" element={<PendientePage titulo="Página no encontrada" />} />
      </Route>
    </Routes>
  );
}
