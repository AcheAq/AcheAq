import "./CTASection.css";

function CTASection() {
  return (
    <section className="cta-section">
      <div className="cta-content">
        <div>
          <h2>Encontrou algo?</h2>
          <p>
            Ajude alguém a recuperar seus pertences.
            Cadastre o objeto em poucos minutos.
          </p>
        </div>
        
        <div className="cta-buttons">
          <button>Registrar objeto encontrado</button>
        </div>
      </div>
    </section>
  );
}

export default CTASection;