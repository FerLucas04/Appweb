import { Navigate, Route, Routes } from "react-router";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ROUTES } from "./constants";
import { Home } from "./pages/Home/Home.jsx";
import { Login } from "./pages/Login";
import { Logs } from "./pages/Logs/Logs.jsx";
import { Books } from "./pages/Books/Books.jsx";
import { Management } from "./pages/Management/Management.jsx";

const App = () => (
  <Routes>
    {/* Pública */}
    <Route path={ROUTES.LOGIN} element={<Login />} />

    {/* Privadas: ProtectedRoute valida la sesión y Layout aporta la barra superior */}
    <Route element={<ProtectedRoute />}>
      <Route element={<Layout />}>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.LOGS} element={<Logs />} />
        <Route path={ROUTES.BOOKS} element={<Books />} />
        <Route path={ROUTES.MANAGEMENT} element={<Management />} />
      </Route>
    </Route>

    {/* Cualquier otra URL */}
    <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
  </Routes>
);

export default App;