import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Cadastro from "../pages/Cadastro/Cadastro";
import ProtectedRoute from "./ProtectedRoute";
import Perfil from "../pages/Perfil/Perfil";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/perfil" element={ <ProtectedRoute><Perfil /></ProtectedRoute>}/>
      </Routes>
    </BrowserRouter>
  );
}