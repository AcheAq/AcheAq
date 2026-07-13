import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

import { useAuth } from "../contexts/AuthContext";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Cadastro from "../pages/Cadastro/Cadastro";
import EsqueciSenha from "../pages/EsqueciSenha/EsqueciSenha";
import ResetSenha from "../pages/ResetSenha/ResetSenha";
import Perfil from "../pages/Perfil/Perfil";
import Sobre from "../pages/Sobre/Sobre";
import ObjetosPerdidos from "../pages/ObjetosPerdidos/ObjetosPerdidos";
import ObjetosEncontrados from "../pages/ObjetosEncontrados/ObjetosEncontrados";
import NovoAnuncio from "../pages/NovoAnuncio/NovoAnuncio";
import MeusAnuncios from "../pages/MeusAnuncios/MeusAnuncios";
import DetalheItem from "../pages/DetalheItem/DetalheItem";
import Dashboard from "../pages/Dashboard/Dashboard";
import Inicio from "../pages/Inicio/Inicio";

function HomeOrInicio() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p>Carregando...</p>
      </div>
    );
  }

  return isAuthenticated ? <Inicio /> : <Home />;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas com o Cabeçalho principal (MainLayout) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomeOrInicio />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/objetos-perdidos" element={<ObjetosPerdidos />} />
          <Route path="/objetos-encontrados" element={<ObjetosEncontrados />} />
          <Route path="/teste/inicio" element={<Inicio />} />

          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <Perfil />
              </ProtectedRoute>
            }
          />
          <Route
            path="/novo-anuncio"
            element={
              <ProtectedRoute>
                <NovoAnuncio />
              </ProtectedRoute>
            }
          />
          <Route
            path="/meus-anuncios"
            element={
              <ProtectedRoute>
                <MeusAnuncios />
              </ProtectedRoute>
            }
          />
          <Route
            path="/item/:id"
            element={
              <ProtectedRoute>
                <DetalheItem />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            }
          />
        </Route>

        {/* Rotas sem Cabeçalho (tela cheia) */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/recuperar-senha" element={<EsqueciSenha />} />
        <Route path="/redefinir-senha" element={<ResetSenha />} />
      </Routes>
    </BrowserRouter>
  );
}
