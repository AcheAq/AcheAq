import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Cadastro from "../pages/Cadastro/Cadastro";
import ProtectedRoute from "./ProtectedRoute";
import Perfil from "../pages/Perfil/Perfil";
import MainLayout from "../layouts/MainLayout";
import ObjetosPerdidos from "../pages/ObjetosPerdidos/ObjetosPerdidos";
import ObjetosEncontrados from "../pages/ObjetosEncontrados/ObjetosEncontrados";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas com o Cabeçalho principal */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />

          <Route path="/objetos-perdidos" element={<ObjetosPerdidos />} />
          <Route path="/objetos-encontrados" element={<ObjetosEncontrados />}
          />
        </Route>

        {/* Rotas sem Cabeçalho (Full screen) */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
      </Routes>
    </BrowserRouter>
  );
}