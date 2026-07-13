import React from "react";
import { useNavigate } from "react-router-dom";
import { HelpCircle, ArrowLeft, Search } from "lucide-react";
import "./NotFound.css";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <div className="notfound-card animate-fade-in">
        <div className="notfound-icon-wrapper">
          <Search size={48} className="notfound-search-icon" />
          <HelpCircle size={40} className="notfound-help-icon" />
        </div>
        
        <h1 className="notfound-title">404 - Ops! Página Perdida</h1>
        
        <p className="notfound-text">
          Nem mesmo o <strong>AcheAq</strong> conseguiu encontrar esta página com a nossa lupa de achados e perdidos... 🔍
        </p>
        
        <p className="notfound-subtext">
          Talvez ela tenha sido guardada na mochila de outro estudante, esquecida na biblioteca ou simplesmente resolveu turistar por aí.
        </p>

        <button 
          onClick={() => navigate("/")} 
          className="notfound-btn-back"
          aria-label="Voltar para a página inicial"
        >
          <ArrowLeft size={18} />
          Voltar para o Início
        </button>
      </div>
    </div>
  );
}

export default NotFound;
