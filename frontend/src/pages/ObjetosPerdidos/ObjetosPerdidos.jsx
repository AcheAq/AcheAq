import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import HeroBanner from "../../components/HeroBanner/HeroBanner";
import SearchBar from "../../components/SearchBar/SearchBar";
import FilterSidebar from "../../components/FilterSidebar/FilterSidebar";
import CardAnuncio from "../../components/CardAnuncio/CardAnuncio";
import Button from "../../components/Button/Button";
import ActiveFilters from "../../components/ActiveFilters/ActiveFilters";
import Pagination from "../../components/Pagination/Pagination";
import DetalhesAnuncioModal from "../../components/Modals/DetalhesAnuncioModal/DetalhesAnuncioModal";

import { categories, sortOptions } from "../../utils/constants/filterOptions";
import { objetosPerdidosMock } from "../../utils/mocks/objetosPerdidosMock";

import "./ObjetosPerdidos.css";

function ObjetosPerdidos() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");

  const [filters, setFilters] = useState({
    category: "todas",
    date: "",
    sortBy: "recentes"
  });

  const [currentPage, setCurrentPage] = useState(1);

  // Controle do modal de detalhes
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const categoryLabels = Object.fromEntries(
    categories.map((item) => [item.value, item.label])
  );

  const sortLabels = Object.fromEntries(
    sortOptions.map((item) => [item.value, item.label])
  );

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      category: "todas",
      date: "",
      sortBy: "recentes"
    });
    setSearchTerm("");
  };

  const handleApplyFilters = () => {
    alert("Filtros aplicados. Futuramente será feita busca na API.");
  };

  const handleSearch = (term) => {
    alert(`Buscando por: "${term}"`);
  };

  // Abrir detalhes
  const handleOpenDetails = (item) => {
    setSelectedItem(item);
    setIsDetailsOpen(true);
  };

  // Fechar detalhes
  const handleCloseDetails = () => {
    setSelectedItem(null);
    setIsDetailsOpen(false);
  };

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
        />
      </HeroBanner>

      <section className="lost-items-content">
        <FilterSidebar
          filters={filters}
          categories={categories}
          sortOptions={sortOptions}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          onApplyFilters={handleApplyFilters}
        />

        <section className="results-column" aria-label="Listagem de objetos perdidos">
          <header className="results-header">
            <section className="results-info">
              <p className="results-count">
                Foram encontrados <strong>48</strong> anúncios de objetos perdidos.
              </p>

              <ActiveFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                categoryLabels={categoryLabels}
                sortLabels={sortLabels}
              />
            </section>

            <Button variant="primary" onClick={() => navigate("/novo-anuncio")}>
              Novo Anúncio
            </Button>
          </header>

          <section className="items-grid">
            {objetosPerdidosMock.map((item) => (
              <CardAnuncio
                key={item.id}
                title={item.title}
                image={item.image}
                status={item.status}
                description={item.description}
                category={item.category}
                location={item.location}
                date={item.date}
                onDetails={() => handleOpenDetails(item)}
              />
            ))}
          </section>

          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </section>
      </section>

      <DetalhesAnuncioModal
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        item={selectedItem}
      />
    </main>
  );
}

export default ObjetosPerdidos;