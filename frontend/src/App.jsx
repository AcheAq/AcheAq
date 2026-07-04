import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export default function App() {
  const [apiStatus, setApiStatus] = useState('Verificando conexão...');

  useEffect(() => {
    axios.get(API_BASE)
      .then((res) => {
        setApiStatus(`Online - ${res.data.message}`);
      })
      .catch(() => {
        setApiStatus('Desconectado do servidor.');
      });
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#0b0f19',
      color: '#f8fafc',
      fontFamily: "'Outfit', sans-serif",
      margin: 0,
      padding: '24px'
    }}>
      <div style={{
        backgroundColor: '#131a2e',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '40px',
        maxWidth: '480px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          width: '50px',
          height: '50px',
          borderRadius: '12px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '24px',
          color: '#fff',
          marginBottom: '20px'
        }}>
          A
        </div>

        <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 8px 0' }}>AcheAq</h1>
        <p style={{ color: '#94a3b8', fontSize: '15px', margin: '0 0 24px 0' }}>
          Sistema de Achados e Perdidos para Instituições de Ensino
        </p>

        <div style={{
          backgroundColor: '#1e294b',
          borderRadius: '8px',
          padding: '12px 16px',
          fontSize: '14px',
          color: '#e2e8f0',
          marginBottom: '24px',
          border: '1px solid rgba(255, 255, 255, 0.04)'
        }}>
          Status da API: <strong style={{ color: '#3b82f6' }}>{apiStatus}</strong>
        </div>

        <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
          Edite o arquivo <code>src/App.jsx</code> para iniciar o desenvolvimento da aplicação.
        </p>
      </div>
    </div>
  );
}
