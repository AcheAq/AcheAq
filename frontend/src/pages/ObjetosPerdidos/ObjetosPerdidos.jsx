import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import HeroBanner from "../../components/HeroBanner/HeroBanner";
import SearchBar from "../../components/SearchBar/SearchBar";
import FilterSidebar from "../../components/FilterSidebar/FilterSidebar";
import CardAnuncio from "../../components/CardAnuncio/CardAnuncio";
import Button from "../../components/Button/Button";
import ActiveFilters from "../../components/ActiveFilters/ActiveFilters";
import Pagination from "../../components/Pagination/Pagination";
import DetalhesAnuncioModal from "../../components/Modals/DetalhesAnuncioModal/DetalhesAnuncioModal";

import { sortOptions } from "../../utils/constants/filterOptions";
import { objetosPerdidosMock } from "../../utils/mocks/objetosPerdidosMock";

import { useAuth } from "../../contexts/AuthContext";
import itemService from "../../services/itemService";
import categoryService from "../../services/categoryService";
import { imageUrl } from "../../utils/imageUrl";
import { formatDate } from "../../utils/format";

import "./ObjetosPerdidos.css";

function ObjetosPerdidos() {
  const navigate = useNavigate();
  const { isAuthenticated, user: currentUser, loading: authLoading } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [filters, setFilters] = useState({
    category: "todas",
    date: "",
    sortBy: "recentes"
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Controle do modal de detalhes
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Buscar categorias da API caso autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      // Mock categories list for UI display under blur
      setCategoriesList([
        { value: "todas", label: "Todas as categorias" },
        { value: "mochilas", label: "Mochilas e Bolsas" },
        { value: "eletronicos", label: "Eletrônicos" },
        { value: "documentos", label: "Documentos e Cartões" }
      ]);
      return;
    }

    categoryService.getAll()
      .then((res) => {
        setCategoriesList([
          { value: "todas", label: "Todas as categorias" },
          ...res.map((c) => ({ value: c.id, label: c.name }))
        ]);
      })
      .catch((err) => console.error("Erro ao carregar categorias:", err));
  }, [isAuthenticated]);

  // Carregar itens da API caso autenticado
  const loadItems = () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError("");

    const params = {
      type: "LOST",
      page: currentPage,
      limit: 6,
    };

    if (filters.category && filters.category !== "todas") {
      params.categoryId = filters.category;
    }

    if (searchQuery.trim()) {
      params.search = searchQuery.trim();
    }

    if (filters.sortBy === "antigos") {
      params.order = "asc";
    } else {
      params.order = "desc";
    }

    itemService.getAll(params)
      .then((res) => {
        setItems(res.data || []);
        setTotalPages(res.pagination?.totalPages || 1);
        setTotalCount(res.pagination?.total || 0);
      })
      .catch((err) => {
        console.error("Erro ao carregar objetos perdidos:", err);
        setError("Não foi possível carregar os objetos perdidos.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadItems();
  }, [isAuthenticated, currentPage, filters.category, filters.sortBy, searchQuery]);

  const categoryLabels = Object.fromEntries(
    categoriesList.map((item) => [item.value, item.label])
  );

  const sortLabels = Object.fromEntries(
    sortOptions.map((item) => [item.value, item.label])
  );

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      category: "todas",
      date: "",
      sortBy: "recentes"
    });
    setSearchTerm("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    loadItems();
  };

  const handleSearch = (term) => {
    setSearchQuery(term);
    setCurrentPage(1);
  };

  // Abrir detalhes
  const handleOpenDetails = (item) => {
    if (!isAuthenticated) return;
    // Map backend item to modal format
    const mapped = {
      ...item,
      status: item.type?.toLowerCase() || "lost",
      imagem: item.photoUrl ? imageUrl(item.photoUrl) : null,
      date: item.occurrenceDate ? formatDate(item.occurrenceDate) : "-",
      category: item.category?.name || "Sem categoria",
      autor: item.user?.name || "Usuário",
      email: item.user?.email || "-",
      telefone: item.user?.phone || "-",
      instituicao: "Comunidade Acadêmica",
      membroDesde: item.user?.createdAt ? new Date(item.user.createdAt).getFullYear() : "2026",
      dataPublicacao: item.createdAt ? formatDate(item.createdAt) : "-"
    };
    setSelectedItem(mapped);
    setIsDetailsOpen(true);
  };

  // Fechar detalhes
  const handleCloseDetails = () => {
    setSelectedItem(null);
    setIsDetailsOpen(false);
  };

  if (authLoading) {
    return (
      <div className="lost-items-loading">
        <p>Verificando autenticação...</p>
      </div>
    );
  }

  // Se não autenticado, renderizar mock data sob blur
  const displayedItems = isAuthenticated ? items : objetosPerdidosMock;
  const countMessage = isAuthenticated
    ? `Foram encontrados <strong>${totalCount}</strong> anúncios de objetos perdidos.`
    : `Foram encontrados <strong>${objetosPerdidosMock.length}</strong> anúncios de objetos perdidos.`;

  return (
    <main className="lost-items-main">
      <HeroBanner
        title="Objetos Perdidos"
        subtitle="Pesquise entre os objetos perdidos cadastrados pela comunidade acadêmica."
      >
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onSearch={handleSearch}
          placeholder="Pesquise por nome do objeto..."
          disabled={!isAuthenticated}
        />
      </HeroBanner>

      <div className="lost-items-content-wrapper">
        <section className="lost-items-content">
          <FilterSidebar
            filters={filters}
            categories={categoriesList}
            sortOptions={sortOptions}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            onApplyFilters={handleApplyFilters}
            disabled={!isAuthenticated}
          />

          <section className="results-column" aria-label="Listagem de objetos perdidos">
            <header className="results-header">
              <section className="results-info">
                <p className="results-count" dangerouslySetInnerHTML={{ __html: countMessage }} />

                {isAuthenticated && (
                  <ActiveFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    categoryLabels={categoryLabels}
                    sortLabels={sortLabels}
                  />
                )}
              </section>

              <Button
                variant="primary"
                onClick={() => navigate(isAuthenticated ? "/novo-anuncio" : "/login")}
              >
                Novo Anúncio
              </Button>
            </header>

            {loading && <p className="lost-items-status">Carregando anúncios...</p>}
            {error && !loading && (
              <p className="lost-items-status error" role="alert">
                {error}
              </p>
            )}

            {!loading && !error && (
              <>
                {displayedItems.length === 0 ? (
                  <div className="lost-items-empty">
                    <p>Nenhum objeto perdido encontrado.</p>
                  </div>
                ) : (
                  <section className="items-grid">
                    {displayedItems.map((item) => {
                      const imageSrc = isAuthenticated
                        ? (item.photoUrl ? imageUrl(item.photoUrl) : null)
                        : item.image;
                      const displayDate = isAuthenticated
                        ? formatDate(item.occurrenceDate)
                        : item.date;

                      return (
                        <CardAnuncio
                          key={item.id}
                          title={item.title}
                          image={imageSrc}
                          status={isAuthenticated ? item.type?.toLowerCase() : item.status}
                          description={item.description}
                          category={isAuthenticated ? (item.category?.name || "Sem categoria") : item.category}
                          location={item.location}
                          date={displayDate}
                          onDetails={() => handleOpenDetails(item)}
                        />
                      );
                    })}
                  </section>
                )}

                {isAuthenticated && totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                  />
                )}
              </>
            )}
          </section>
        </section>

        {!isAuthenticated && (
          <div className="auth-blur-overlay">
            <div className="auth-blur-card">
              <h3 className="auth-blur-title">Acesso Restrito</h3>
              <p className="auth-blur-desc">
                Você precisa estar logado na plataforma para pesquisar e visualizar os detalhes dos objetos perdidos.
              </p>
              <div className="auth-blur-buttons">
                <Button variant="outline" onClick={() => navigate("/login")}>
                  Entrar
                </Button>
                <Button variant="primary" onClick={() => navigate("/cadastro")}>
                  Criar Conta
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <DetalhesAnuncioModal
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        item={selectedItem}
        currentUser={currentUser}
      />
    </main>
  );
}

export default ObjetosPerdidos;