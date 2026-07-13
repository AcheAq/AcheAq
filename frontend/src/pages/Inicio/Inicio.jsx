import { useState } from "react";
import { Link } from "react-router-dom";

import Header from "../../components/Header/Header";
import HeroBanner from "../../components/HeroBanner/HeroBanner";
import SearchBar from "../../components/SearchBar/SearchBar";
import CategoryGrid from "../../components/CategoryGrid/CategoryGrid";
import CardAnuncio from "../../components/CardAnuncio/CardAnuncio";
import CTASection from "../../components/CTASection/CTASection";

import { objetosRecentes } from "../../utils/mocks/objetosRecentesMock";

import styles from "./Inicio.module.css";

function Inicio() {
  const [search, setSearch] = useState("");

  function handleSearch(value) {
    console.log("Pesquisar:", value);
  }

  function handleCategory(category) {
    console.log("Categoria selecionada:", category);
  }

  return (
    <div className={styles.pageWrapper}>
      <Header />

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
            {objetosRecentes.map((objeto) => (
              <CardAnuncio
                key={objeto.id}
                title={objeto.title}
                image={objeto.image}
                status={objeto.status}
                description={objeto.description}
                category={objeto.category}
                location={objeto.location}
                date={objeto.date}
                onDetails={() => console.log("Detalhes:", objeto)}
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