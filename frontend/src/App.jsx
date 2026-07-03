import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, 
  Plus, 
  MapPin, 
  Calendar, 
  Tag, 
  LogIn, 
  LogOut, 
  User, 
  FileText, 
  CheckCircle2, 
  Image as ImageIcon,
  AlertTriangle
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

// Configurar o Axios para enviar cookies e cabeçalhos CSRF automaticamente
axios.defaults.withCredentials = true;

// Mock inicial para fallback local caso o backend esteja offline
const INITIAL_MOCK_ITEMS = [
  {
    id: 'mock-1',
    title: 'Chaveiro de Carro com Controle',
    description: 'Chaveiro com um controle de alarme preto e uma fita azul escrito "Engenharia".',
    photoUrl: null,
    category: 'Chaves',
    location: 'Estacionamento do Bloco B',
    occurrenceDate: '2026-07-02T14:30:00.000Z',
    status: 'LOST',
    user: { name: 'Jonas Santos', email: 'jonas@instituicao.edu' },
    createdAt: '2026-07-02T15:00:00.000Z'
  },
  {
    id: 'mock-2',
    title: 'Estojo Escolar Verde',
    description: 'Estojo escolar da marca Faber-Castell contendo lápis de cor e canetas diversas.',
    photoUrl: null,
    category: 'Outros',
    location: 'Bancada da Biblioteca Central',
    occurrenceDate: '2026-07-03T09:00:00.000Z',
    status: 'FOUND',
    user: { name: 'Andreza Leal', email: 'andreza@instituicao.edu' },
    createdAt: '2026-07-03T10:15:00.000Z'
  },
  {
    id: 'mock-3',
    title: 'Garrafa Térmica Inox',
    description: 'Garrafa térmica da Stanley, cor azul marinho, com alguns arranhões na base.',
    photoUrl: null,
    category: 'Acessórios',
    location: 'Quadra Poliesportiva',
    occurrenceDate: '2026-07-01T18:00:00.000Z',
    status: 'RESOLVED',
    user: { name: 'Edgar Barros', email: 'edgar@instituicao.edu' },
    createdAt: '2026-07-01T19:00:00.000Z'
  }
];

export default function App() {
  // Estados de dados
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);
  const [csrfToken, setCsrfToken] = useState('');
  
  // Controles de Busca/Filtro
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, LOST, FOUND, RESOLVED
  const [categoryFilter, setCategoryFilter] = useState('');

  // Modais
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Estados dos Formulários
  const [authForm, setAuthForm] = useState({ email: '', password: '', name: '' });
  const [itemForm, setItemForm] = useState({
    title: '',
    description: '',
    category: 'Eletrônicos',
    location: '',
    occurrenceDate: new Date().toISOString().split('T')[0],
    status: 'LOST'
  });
  const [selectedFile, setSelectedFile] = useState(null);

  // Estados de Status da Conexão
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // ----------------------------------------------------
  // Efeitos e Requisições
  // ----------------------------------------------------
  useEffect(() => {
    fetchCsrfToken();
    checkAuthAndFetchItems();
  }, []);

  const fetchCsrfToken = async () => {
    try {
      const response = await axios.get(`${API_BASE}/csrf-token`);
      setCsrfToken(response.data.csrfToken);
      setIsBackendOnline(true);
    } catch (e) {
      console.warn("Backend offline ou não acessível. Rodando no modo simulação (Local Storage).");
      setIsBackendOnline(false);
    }
  };

  const checkAuthAndFetchItems = async () => {
    try {
      const authRes = await axios.get(`${API_BASE}/auth/me`);
      setUser(authRes.data);
    } catch (e) {
      // Ignorar erro se não estiver logado no backend
    }

    try {
      const itemsRes = await axios.get(`${API_BASE}/items`);
      setItems(itemsRes.data);
      setIsBackendOnline(true);
    } catch (e) {
      // Fallback para Local Storage
      const stored = localStorage.getItem('acheaq_items');
      if (stored) {
        setItems(JSON.parse(stored));
      } else {
        localStorage.setItem('acheaq_items', JSON.stringify(INITIAL_MOCK_ITEMS));
        setItems(INITIAL_MOCK_ITEMS);
      }
    }
  };

  // Sincroniza buscas com filtros
  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearch(query);

    if (isBackendOnline) {
      try {
        const params = {};
        if (query) params.search = query;
        if (activeTab !== 'ALL') params.status = activeTab;
        if (categoryFilter) params.category = categoryFilter;

        const res = await axios.get(`${API_BASE}/items`, { params });
        setItems(res.data);
      } catch (err) {
        setErrorMsg('Erro ao pesquisar no servidor.');
      }
    }
  };

  const handleTabChange = async (tab) => {
    setActiveTab(tab);
    if (isBackendOnline) {
      try {
        const params = {};
        if (search) params.search = search;
        if (tab !== 'ALL') params.status = tab;
        if (categoryFilter) params.category = categoryFilter;

        const res = await axios.get(`${API_BASE}/items`, { params });
        setItems(res.data);
      } catch (err) {
        setErrorMsg('Erro ao filtrar status.');
      }
    }
  };

  const handleCategoryChange = async (cat) => {
    setCategoryFilter(cat);
    if (isBackendOnline) {
      try {
        const params = {};
        if (search) params.search = search;
        if (activeTab !== 'ALL') params.status = activeTab;
        if (cat) params.category = cat;

        const res = await axios.get(`${API_BASE}/items`, { params });
        setItems(res.data);
      } catch (err) {
        setErrorMsg('Erro ao filtrar categoria.');
      }
    }
  };

  // ----------------------------------------------------
  // Autenticação e Registro
  // ----------------------------------------------------
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (isBackendOnline) {
      try {
        const headers = { 'X-CSRF-Token': csrfToken };
        if (isRegisterMode) {
          await axios.post(`${API_BASE}/auth/register`, authForm, { headers });
          setSuccessMsg('Cadastro realizado com sucesso! Agora faça login.');
          setIsRegisterMode(false);
        } else {
          const res = await axios.post(`${API_BASE}/auth/login`, authForm, { headers });
          setUser(res.data);
          setSuccessMsg(`Bem-vindo, ${res.data.name}!`);
          setShowAuthModal(false);
          checkAuthAndFetchItems();
        }
      } catch (err) {
        setErrorMsg(err.response?.data?.error || 'Ocorreu um erro.');
      }
    } else {
      // Simulação Offline
      if (isRegisterMode) {
        if (!authForm.name || !authForm.email || !authForm.password) {
          setErrorMsg('Preencha todos os campos.');
          return;
        }
        const mockUsers = JSON.parse(localStorage.getItem('acheaq_users') || '[]');
        mockUsers.push({ ...authForm, id: Math.random().toString() });
        localStorage.setItem('acheaq_users', JSON.stringify(mockUsers));
        setSuccessMsg('Cadastro simulado com sucesso!');
        setIsRegisterMode(false);
      } else {
        const mockUsers = JSON.parse(localStorage.getItem('acheaq_users') || '[]');
        const found = mockUsers.find(u => u.email === authForm.email && u.password === authForm.password);
        if (found || authForm.email === 'admin@acheaq.com') {
          const loggedUser = found || { name: 'Jonas (Admin)', email: authForm.email, role: 'ADMIN', id: 'admin-id' };
          setUser(loggedUser);
          setSuccessMsg(`Logado como ${loggedUser.name} (Simulação)`);
          setShowAuthModal(false);
        } else {
          setErrorMsg('Credenciais incorretas (Dica em modo offline: cadastre-se primeiro ou use qualquer senha).');
        }
      }
    }
  };

  const handleLogout = async () => {
    if (isBackendOnline) {
      try {
        const headers = { 'X-CSRF-Token': csrfToken };
        await axios.post(`${API_BASE}/auth/logout`, {}, { headers });
      } catch (e) {}
    }
    setUser(null);
    setSuccessMsg('Desconectado.');
    window.location.reload(); // Recarrega para limpar cache e estados de segurança
  };

  // ----------------------------------------------------
  // Criar Anúncio de Objeto
  // ----------------------------------------------------
  const handleItemSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!user) {
      setErrorMsg('Você precisa estar logado para cadastrar um objeto.');
      return;
    }

    let photoName = null;

    if (isBackendOnline) {
      try {
        const headers = { 'X-CSRF-Token': csrfToken };

        // Upload de foto se selecionado
        if (selectedFile) {
          const formData = new FormData();
          formData.append('photo', selectedFile);
          const uploadRes = await axios.post(`${API_BASE}/upload`, formData, {
            headers: {
              ...headers,
              'Content-Type': 'multipart/form-data'
            }
          });
          photoName = uploadRes.data.filename;
        }

        const payload = {
          ...itemForm,
          photoUrl: photoName ? `${API_BASE}/uploads/${photoName}` : null
        };

        await axios.post(`${API_BASE}/items`, payload, { headers });
        setSuccessMsg('Objeto cadastrado com sucesso!');
        setShowAddModal(false);
        setItemForm({
          title: '',
          description: '',
          category: 'Eletrônicos',
          location: '',
          occurrenceDate: new Date().toISOString().split('T')[0],
          status: 'LOST'
        });
        setSelectedFile(null);
        checkAuthAndFetchItems();
      } catch (err) {
        setErrorMsg(err.response?.data?.error || 'Erro ao cadastrar objeto.');
      }
    } else {
      // Simulação Offline
      const newItem = {
        id: Math.random().toString(),
        ...itemForm,
        photoUrl: selectedFile ? URL.createObjectURL(selectedFile) : null,
        user: { name: user.name, email: user.email },
        createdAt: new Date().toISOString()
      };

      const updated = [newItem, ...items];
      setItems(updated);
      localStorage.setItem('acheaq_items', JSON.stringify(updated));
      setSuccessMsg('Objeto cadastrado no LocalStorage (Simulação)');
      setShowAddModal(false);
    }
  };

  const handleResolveStatus = async (itemId) => {
    if (isBackendOnline) {
      try {
        const headers = { 'X-CSRF-Token': csrfToken };
        await axios.patch(`${API_BASE}/items/${itemId}`, { status: 'RESOLVED' }, { headers });
        setSuccessMsg('Status atualizado para Resolvido!');
        checkAuthAndFetchItems();
      } catch (err) {
        setErrorMsg(err.response?.data?.error || 'Erro ao atualizar status.');
      }
    } else {
      const updated = items.map(item => {
        if (item.id === itemId) {
          return { ...item, status: 'RESOLVED' };
        }
        return item;
      });
      setItems(updated);
      localStorage.setItem('acheaq_items', JSON.stringify(updated));
      setSuccessMsg('Objeto resolvido com sucesso!');
    }
  };

  // ----------------------------------------------------
  // Renderização Auxiliar
  // ----------------------------------------------------
  const filteredItems = items.filter(item => {
    // Se o backend estiver online, as buscas já são feitas via API
    if (isBackendOnline) return true;
    
    // Filtragem local
    const matchesSearch = 
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase());
    
    const matchesTab = activeTab === 'ALL' || item.status === activeTab;
    const matchesCategory = !categoryFilter || item.category === categoryFilter;

    return matchesSearch && matchesTab && matchesCategory;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* Mensagens de Notificação Temporárias */}
      {(errorMsg || successMsg) && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {errorMsg && (
            <div className="glass-panel" style={{
              padding: '16px 24px',
              borderLeft: '4px solid #ef4444',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <AlertTriangle size={18} />
              <span>{errorMsg}</span>
              <button onClick={() => setErrorMsg('')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', marginLeft: '12px' }}>×</button>
            </div>
          )}
          {successMsg && (
            <div className="glass-panel" style={{
              padding: '16px 24px',
              borderLeft: '4px solid #10b981',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <CheckCircle2 size={18} />
              <span>{successMsg}</span>
              <button onClick={() => setSuccessMsg('')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', marginLeft: '12px' }}>×</button>
            </div>
          )}
        </div>
      )}

      {/* Banner de Status Offline */}
      {!isBackendOnline && (
        <div style={{
          background: 'rgba(245, 158, 11, 0.15)',
          borderBottom: '1px solid rgba(245, 158, 11, 0.3)',
          padding: '10px 0',
          textAlign: 'center',
          color: '#f59e0b',
          fontSize: '13px',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          <AlertTriangle size={16} />
          Servidor local desconectado. Executando em modo de demonstração local (LocalStorage).
        </div>
      )}

      {/* Header */}
      <header className="glass-panel" style={{
        margin: '24px 24px 0 24px',
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: '1px solid var(--border-color)',
        borderRadius: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'var(--accent-gradient)',
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '20px',
            color: '#fff'
          }}>
            A
          </div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 700, margin: 0, tracking: '-0.02em' }}>AcheAq</h1>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Achados & Perdidos</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {user ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.04)', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <User size={16} style={{ color: '#8b5cf6' }} />
                <span style={{ fontSize: '13px', fontWeight: 500 }}>{user.name}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px 14px' }}>
                <LogOut size={16} />
                Sair
              </button>
            </>
          ) : (
            <button onClick={() => { setIsRegisterMode(false); setShowAuthModal(true); }} className="btn btn-primary">
              <LogIn size={16} />
              Entrar / Cadastrar
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container" style={{ flex: 1, padding: '40px 24px' }}>
        
        {/* Hero Section */}
        <section style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '42px', fontWeight: 800, margin: '0 0 12px 0', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Perdeu algo? Encontrou algo?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '18px', margin: 0, maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
            A plataforma oficial de achados e perdidos da nossa instituição. Publique rapidamente e ajude a comunidade!
          </p>
        </section>

        {/* Toolbar (Busca e Filtros) */}
        <section className="glass-panel" style={{ padding: '20px', borderRadius: '16px', marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            
            {/* Campo de Busca */}
            <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
              <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Pesquisar por título, descrição ou local..." 
                className="form-control"
                value={search}
                onChange={handleSearch}
                style={{ paddingLeft: '44px' }}
              />
            </div>

            {/* Filtro de Categoria */}
            <select 
              className="form-control" 
              style={{ width: 'auto', minWidth: '180px' }}
              value={categoryFilter}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              <option value="">Todas as Categorias</option>
              <option value="Eletrônicos">Eletrônicos</option>
              <option value="Documentos">Documentos</option>
              <option value="Chaves">Chaves</option>
              <option value="Acessórios">Acessórios</option>
              <option value="Livros / Cadernos">Livros / Cadernos</option>
              <option value="Outros">Outros</option>
            </select>

            {/* Botão de Adicionar */}
            <button 
              onClick={() => {
                if (!user) {
                  setErrorMsg('Por favor, faça login para publicar um objeto.');
                  setShowAuthModal(true);
                } else {
                  setShowAddModal(true);
                }
              }} 
              className="btn btn-primary"
              style={{ minWidth: '160px' }}
            >
              <Plus size={18} />
              Publicar Objeto
            </button>
          </div>

          {/* Filtro por Abas (Status) */}
          <div style={{ display: 'flex', borderTop: '1px solid var(--border-color)', paddingTop: '16px', gap: '8px', overflowX: 'auto' }}>
            {[
              { id: 'ALL', label: 'Todos os Objetos' },
              { id: 'LOST', label: 'Perdidos' },
              { id: 'FOUND', label: 'Encontrados' },
              { id: 'RESOLVED', label: 'Resolvidos' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                style={{
                  background: activeTab === tab.id ? 'var(--bg-tertiary)' : 'transparent',
                  border: 'none',
                  color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: '14px',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {/* Lista de Objetos */}
        <section>
          {filteredItems.length === 0 ? (
            <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center', borderRadius: '16px' }}>
              <FileText size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 8px 0' }}>Nenhum objeto encontrado</h3>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Tente mudar os filtros de busca ou seja o primeiro a publicar!</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '24px'
            }}>
              {filteredItems.map(item => (
                <article key={item.id} className="glass-panel" style={{
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '16px'
                }}>
                  {/* Container da Foto */}
                  <div style={{
                    height: '180px',
                    background: 'rgba(255,255,255,0.02)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: '1px solid var(--border-color)',
                    position: 'relative'
                  }}>
                    {item.photoUrl ? (
                      <img 
                        src={item.photoUrl} 
                        alt={item.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        onError={(e) => {
                          // Se der erro na imagem (ex: URL local inválido), remove a imagem
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                        <ImageIcon size={36} />
                        <span style={{ fontSize: '12px' }}>Sem foto enviada</span>
                      </div>
                    )}

                    {/* Tag de Status sobreposta */}
                    <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                      <span className={`status-badge ${item.status.toLowerCase()}`}>
                        {item.status === 'LOST' ? 'Perdido' : item.status === 'FOUND' ? 'Encontrado' : 'Resolvido'}
                      </span>
                    </div>
                  </div>

                  {/* Detalhes do Objeto */}
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, marginBottom: '8px' }}>
                      <Tag size={12} style={{ color: '#a78bfa' }} />
                      <span>{item.category}</span>
                    </div>

                    <h3 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 10px 0', color: 'var(--text-primary)' }}>
                      {item.title}
                    </h3>
                    
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '0 0 20px 0', flex: 1, lineHeight: '1.6' }}>
                      {item.description}
                    </p>

                    {/* Local e Data */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid var(--border-color)', marginBottom: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MapPin size={14} style={{ color: '#3b82f6' }} />
                        <span>{item.location}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar size={14} style={{ color: '#10b981' }} />
                        <span>{new Date(item.occurrenceDate).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>

                    {/* Rodapé do Card */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
                      <div>
                        Por <strong>{item.user?.name || 'Comunidade'}</strong>
                      </div>
                      
                      {/* Ação de marcar como resolvido */}
                      {item.status !== 'RESOLVED' && user && (
                        <button 
                          onClick={() => handleResolveStatus(item.id)}
                          className="btn btn-secondary" 
                          style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <CheckCircle2 size={12} style={{ color: '#10b981' }} />
                          Resolvido
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '24px',
        color: 'var(--text-muted)',
        fontSize: '13px',
        borderTop: '1px solid var(--border-color)',
        marginTop: 'auto',
        background: 'rgba(19, 26, 46, 0.4)'
      }}>
        © {new Date().getFullYear()} AcheAq - Sistema Acadêmico de Achados e Perdidos. Desenvolvido para a AV2.
      </footer>

      {/* ----------------------------------------------------
          MODAL: Autenticação (Login / Registro)
      ---------------------------------------------------- */}
      {showAuthModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(11, 15, 25, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justify: 'center', zIndex: 999, padding: '20px', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '32px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>
                {isRegisterMode ? 'Criar Conta' : 'Conectar ao AcheAq'}
              </h3>
              <button 
                onClick={() => setShowAuthModal(false)} 
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '20px', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAuthSubmit}>
              {isRegisterMode && (
                <div className="form-group">
                  <label className="form-label">Nome Completo</label>
                  <input 
                    type="text" 
                    placeholder="Seu nome" 
                    className="form-control"
                    value={authForm.name}
                    onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">E-mail Institucional</label>
                <input 
                  type="email" 
                  placeholder="exemplo@instituicao.edu" 
                  className="form-control"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">Senha</label>
                <input 
                  type="password" 
                  placeholder="Mínimo 8 caracteres" 
                  className="form-control"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                {isRegisterMode ? 'Criar Minha Conta' : 'Entrar na Conta'}
              </button>
            </form>

            <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>
              {isRegisterMode ? (
                <span>
                  Já possui conta?{' '}
                  <button onClick={() => setIsRegisterMode(false)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontWeight: 600, padding: 0 }}>
                    Faça login
                  </button>
                </span>
              ) : (
                <span>
                  Não tem conta?{' '}
                  <button onClick={() => setIsRegisterMode(true)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontWeight: 600, padding: 0 }}>
                    Cadastre-se
                  </button>
                </span>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          MODAL: Criar Novo Objeto (Adicionar)
      ---------------------------------------------------- */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(11, 15, 25, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justify: 'center', zIndex: 999, padding: '20px', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '32px', borderRadius: '16px', maxHeight: '90vh', overflowY: 'auto' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>Publicar Objeto</h3>
              <button 
                onClick={() => setShowAddModal(false)} 
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '20px', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleItemSubmit}>
              <div className="form-group">
                <label className="form-label">Título do Objeto</label>
                <input 
                  type="text" 
                  placeholder="Ex: Chaveiro com alarme de carro" 
                  className="form-control"
                  value={itemForm.title}
                  onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Descrição dos Detalhes</label>
                <textarea 
                  placeholder="Descreva detalhes como cor, marcas de uso, chaveiro acoplado, etc." 
                  className="form-control"
                  value={itemForm.description}
                  onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                  style={{ minHeight: '80px', resize: 'vertical' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Categoria</label>
                  <select 
                    className="form-control"
                    value={itemForm.category}
                    onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                  >
                    <option value="Eletrônicos">Eletrônicos</option>
                    <option value="Documentos">Documentos</option>
                    <option value="Chaves">Chaves</option>
                    <option value="Acessórios">Acessórios</option>
                    <option value="Livros / Cadernos">Livros / Cadernos</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Tipo do Anúncio</label>
                  <select 
                    className="form-control"
                    value={itemForm.status}
                    onChange={(e) => setItemForm({ ...itemForm, status: e.target.value })}
                  >
                    <option value="LOST">Perdido</option>
                    <option value="FOUND">Encontrado</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Local da Ocorrência</label>
                <input 
                  type="text" 
                  placeholder="Ex: Bloco C, sala 202" 
                  className="form-control"
                  value={itemForm.location}
                  onChange={(e) => setItemForm({ ...itemForm, location: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Data da Ocorrência</label>
                <input 
                  type="date" 
                  className="form-control"
                  value={itemForm.occurrenceDate}
                  onChange={(e) => setItemForm({ ...itemForm, occurrenceDate: e.target.value })}
                  required
                />
              </div>

              {/* Upload de Foto */}
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">Foto do Objeto</label>
                <input 
                  type="file" 
                  accept="image/*"
                  className="form-control"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                Salvar e Publicar Anúncio
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
