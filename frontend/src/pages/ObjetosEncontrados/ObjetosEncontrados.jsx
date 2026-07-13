import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import HeroBanner from "../../components/HeroBanner/HeroBanner";
import SearchBar from "../../components/SearchBar/SearchBar";
import FilterSidebar from "../../components/FilterSidebar/FilterSidebar";
import CardAnuncio from "../../components/CardAnuncio/CardAnuncio";
import Button from "../../components/Button/Button";
import ActiveFilters from "../../components/ActiveFilters/ActiveFilters";
import Pagination from "../../components/Pagination/Pagination";
import DetalhesAnuncioModal from "../../components/Modals/DetalhesAnuncioModal/DetalhesAnuncioModal";

import { sortOptions } from "../../utils/constants/filterOptions";
import { objetosEncontradosMock } from "../../utils/mocks/objetosEncontradosMock";

import { useAuth } from "../../contexts/AuthContext";
import itemService from "../../services/itemService";
import categoryService from "../../services/categoryService";
import { imageUrl } from "../../utils/imageUrl";
import { formatDate } from "../../utils/format";

import "./ObjetosEncontrados.css";

function ObjetosEncontrados() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchParam = searchParams.get("busca") || "";
  const categoryParam = searchParams.get("categoria") || "";

  const { isAuthenticated, user: currentUser, loading: authLoading } = useAuth();

  const [searchTerm, setSearchTerm] = useState(searchParam);
  const [searchQuery, setSearchQuery] = useState(searchParam);

  const [filters, setFilters] = useState({
    category: "todas",
    date: "",
    sortBy: "recentes"
  });

  // Sync search parameters from URL
  useEffect(() => {
    const searchVal = searchParams.get("busca") || "";
    setSearchTerm(searchVal);
    setSearchQuery(searchVal);
  }, [searchParams]);

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

        if (categoryParam) {
          const matched = res.find(c => c.name.toLowerCase() === categoryParam.toLowerCase());
          if (matched) {
            setFilters(prev => ({ ...prev, category: matched.id }));
          }
        }
      })
      .catch((err) => console.error("Erro ao carregar categorias:", err));
  }, [isAuthenticated, categoryParam]);

  // Carregar itens da API caso autenticado
  const loadItems = () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError("");

    const params = {
      type: "FOUND",
      page: currentPage,
      limit: 6,
    };

    if (filters.category && filters.category !== "todas") {
      params.categoryId = filters.category;
    }

    if (filters.date) {
      params.date = filters.date;
    }

    if (searchQuery.trim()) {
      params.search = searchQuery.trim();
    }

    if (filters.sortBy === "alfabetica") {
      params.sort = "title";
      params.order = "asc";
    } else if (filters.sortBy === "antigos") {
      params.sort = "occurrenceDate";
      params.order = "asc";
    } else {
      params.sort = "occurrenceDate";
      params.order = "desc";
    }

    itemService.getAll(params)
      .then((res) => {
        setItems(res.data || []);
        setTotalPages(res.pagination?.totalPages || 1);
        setTotalCount(res.pagination?.total || 0);
      })
      .catch((err) => {
        console.error("Erro ao carregar objetos encontrados:", err);
        setError("Não foi possível carregar os objetos encontrados.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadItems();
  }, [isAuthenticated, currentPage, filters.category, filters.date, filters.sortBy, searchQuery]);

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

  // Abrir detalhes do anúncio
  const handleOpenDetails = (item) => {
    if (!isAuthenticated) return;
    const mapped = {
      ...item,
      status: item.type?.toLowerCase() || "found",
      imagem: item.photoUrl ? imageUrl(item.photoUrl) : null,
      date: item.occurrenceDate ? formatDate(item.occurrenceDate) : "-",
      category: item.category?.name || "Sem categoria",
      autor: item.user?.name || "Usuário",
      email: item.user?.email || "-",
      telefone: item.user?.phone || "-",
      instituicao: [item.user?.institution, item.user?.course].filter(Boolean).join(" / ") || "Instituição / Curso",
      membroDesde: item.user?.createdAt ? new Date(item.user.createdAt).toLocaleDateString("pt-BR", { month: "short", year: "numeric" }) : "-",
      dataPublicacao: item.createdAt ? formatDate(item.createdAt) : "-",
      allowContact: item.allowContact !== undefined ? item.allowContact : true
    };
    setSelectedItem(mapped);
    setIsDetailsOpen(true);
  };

  // Fechar detalhes do anúncio
  const handleCloseDetails = () => {
    setSelectedItem(null);
    setIsDetailsOpen(false);
  };

  if (authLoading) {
    return (
      <div className="found-items-loading">
        <p>Verificando autenticação...</p>
      </div>
    );
  }

  const displayedItems = isAuthenticated ? items : objetosEncontradosMock;
  const countMessage = isAuthenticated
    ? `Foram encontrados <strong>${totalCount}</strong> anúncios de objetos encontrados.`
    : `Foram encontrados <strong>${objetosEncontradosMock.length}</strong> anúncios de objetos encontrados.`;

  return (
    <main className="found-items-main">
      <HeroBanner
        title="Objetos Encontrados"
        subtitle="Pesquise entre os objetos encontrados cadastrados pela comunidade acadêmica."
      >
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onSearch={handleSearch}
          placeholder="Pesquise por nome do objeto..."
          disabled={!isAuthenticated}
        />
      </HeroBanner>

      <div className="found-items-content-wrapper">
        <section className="found-items-content">
          <FilterSidebar
            filters={filters}
            categories={categoriesList}
            sortOptions={sortOptions}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            onApplyFilters={handleApplyFilters}
            disabled={!isAuthenticated}
          />

          <section className="results-column" aria-label="Listagem de objetos encontrados">
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

            {loading && <p className="found-items-status">Carregando anúncios...</p>}
            {error && !loading && (
              <p className="found-items-status error" role="alert">
                {error}
              </p>
            )}

            {!loading && !error && (
              <>
                {displayedItems.length === 0 ? (
                  <div className="found-items-empty">
                    <p>Nenhum objeto encontrado cadastrado.</p>
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
      </div>

      {!isAuthenticated && (
        <div className="auth-blur-overlay">
          <div className="auth-blur-card">
            <h3 className="auth-blur-title">Acesso Restrito</h3>
            <p className="auth-blur-desc">
              Você precisa estar logado na plataforma para pesquisar e visualizar os detalhes dos objetos encontrados.
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

      <DetalhesAnuncioModal
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        item={selectedItem}
        currentUser={currentUser}
      />
    </main>
  );
}

export default ObjetosEncontrados;