import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import HeroBanner from "../../components/HeroBanner/HeroBanner";
import SearchBar from "../../components/SearchBar/SearchBar";
import CategoryGrid from "../../components/CategoryGrid/CategoryGrid";
import CardAnuncio from "../../components/CardAnuncio/CardAnuncio";
import CTASection from "../../components/CTASection/CTASection";

import { useAuth } from "../../contexts/AuthContext";
import itemService from "../../services/itemService";
import { imageUrl } from "../../utils/imageUrl";
import { formatDate } from "../../utils/format";

import styles from "./Inicio.module.css";

function Inicio() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState("");
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) return;

    setLoading(true);
    itemService.getAll({ page: 1, limit: 3 })
      .then((res) => {
        setRecentItems(res.data || []);
      })
      .catch((err) => {
        console.error("Erro ao carregar itens recentes:", err);
        setError("Não foi possível carregar os itens recentes.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isAuthenticated]);

  function handleSearch(value) {
    navigate(`/objetos-encontrados?busca=${encodeURIComponent(value)}`);
  }

  function handleCategory(category) {
    navigate(`/objetos-encontrados?categoria=${encodeURIComponent(category)}`);
  }

  return (
    <div className={styles.pageWrapper}>
      <HeroBanner
        title="Perdeu ou encontrou algum objeto?"
        subtitle="O AcheAq conecta pessoas para facilitar a devolução de objetos perdidos dentro da instituição."
      >
        <span className={styles.badge}>
          Plataforma de Achados e Perdidos
        </span>

        <SearchBar
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onSearch={handleSearch}
          placeholder="Pesquise por um objeto..."
        />

        <div className={styles.heroBtns}>
          <Link to="/novo-anuncio" className={styles.btnHeroOrange}>
            Registrar objeto perdido
          </Link>
          <Link to="/novo-anuncio" className={styles.btnHeroWhite}>
            Registrar objeto encontrado
          </Link>
        </div>
      </HeroBanner>

      <main className={styles.container}>
        {/* CATEGORIAS */}
        <CategoryGrid onSelectCategory={handleCategory} />

        {/* OBJETOS RECENTES */}
        <section className={styles.objectsSection}>
          <div className={styles.sectionTitle}>
            <div>
              <h2>Objetos Recentes</h2>
              <p>Últimos objetos registrados na plataforma</p>
            </div>
            <Link to="/objetos-encontrados" className={styles.verTodas}>
              Ver todos →
            </Link>
          </div>

          <div className={styles.objGrid}>
            {loading && <p>Carregando objetos recentes...</p>}
            {error && <p className="error" role="alert">{error}</p>}
            {!loading && !error && recentItems.length === 0 && (
              <p>Nenhum objeto registrado recentemente.</p>
            )}
            {!loading && !error && recentItems.map((objeto) => (
              <CardAnuncio
                key={objeto.id}
                title={objeto.title}
                image={objeto.photoUrl ? imageUrl(objeto.photoUrl) : null}
                status={objeto.type?.toLowerCase()}
                description={objeto.description}
                category={objeto.category?.name || "Sem categoria"}
                location={objeto.location}
                date={formatDate(objeto.occurrenceDate)}
                onDetails={() => navigate(`/item/${objeto.id}`)}
              />
            ))}
          </div>
        </section>

        <CTASection />
      </main>
    </div>
  );
}

export default Inicio;