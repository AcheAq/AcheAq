import { Search, ArrowRight } from "lucide-react";
import "./Sobre.css";

const VALUES = [
  "Colaboração",
  "Transparência",
  "Responsabilidade",
  "Segurança",
  "Respeito",
];

const STEPS = [
  { n: "Passo 1", title: "Cadastre", desc: "Publique um objeto perdido ou encontrado com foto e descrição." },
  { n: "Passo 2", title: "Pesquise", desc: "Utilize filtros para localizar objetos por categoria, data ou local." },
  { n: "Passo 3", title: "Entre em contato", desc: "Converse com o responsável pelo anúncio de forma segura." },
  { n: "Passo 4", title: "Recupere o objeto", desc: "Finalize o processo marcando o objeto como devolvido." },
];

const BENEFITS = [
  "Interface Simples",
  "Pesquisa Rápida",
  "Cadastro Intuitivo",
  "Segurança dos Dados",
  "Acompanhamento",
  "Comunicação Facilitada",
];

const TEAM = Array.from({ length: 6 }, (_, i) => i);

export default function Sobre() {
  return (
    <div className="about">
      <header className="about-hero">
        <div className="about-hero-inner">
          <div className="about-hero-text">
            <span className="about-badge">Nossa Plataforma</span>
            <h1>
              Sobre o <span>AcheAq</span>
            </h1>
            <p>
              Conectando pessoas aos seus pertences por meio de uma plataforma
              simples, segura e colaborativa.
            </p>
          </div>
          <div className="about-hero-art" aria-hidden="true">
            <span className="about-hero-circle">
              <Search size={26} />
            </span>
            <span className="about-hero-chip about-hero-chip--a">
              iPhone 14 · Encontrado
            </span>
            <span className="about-hero-chip about-hero-chip--b">
              Caderno de Cálculo · Perdido
            </span>
          </div>
        </div>
      </header>

      <div className="about-body">
        <section className="about-card">
          <h2 className="about-heading about-heading--blue">Nossa História</h2>
          <p className="about-text">
            O AcheAq foi desenvolvido com o objetivo de facilitar o processo de
            localização e devolução de objetos perdidos em instituições de ensino.
            A plataforma conecta alunos, professores e colaboradores em um ambiente
            colaborativo, tornando a recuperação de pertences mais rápida,
            organizada e acessível.
          </p>
        </section>

        <section className="about-section">
          <h2 className="about-heading about-heading--orange">Nossa Missão</h2>
          <div className="about-mission">
            <article className="about-mission-card">
              <h3>Missão</h3>
              <p>
                Facilitar a comunicação entre quem perdeu e quem encontrou um
                objeto, promovendo um ambiente acadêmico mais colaborativo.
              </p>
            </article>
            <article className="about-mission-card">
              <h3>Visão</h3>
              <p>
                Ser uma referência em soluções digitais para achados e perdidos no
                ambiente acadêmico.
              </p>
            </article>
            <article className="about-mission-card">
              <h3>Valores</h3>
              <ul>
                {VALUES.map((v) => (
                  <li key={v}>{v}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="about-section">
          <h2 className="about-heading about-heading--orange">Como Funciona</h2>
          <p className="about-sub">
            Em apenas 4 etapas simples você recupera o que perdeu.
          </p>
          <ol className="about-steps">
            {STEPS.map((step, index) => (
              <li key={step.title} className="about-step-item">
                <div className="about-step">
                  <span className="about-step-n">{step.n}</span>
                  <strong>{step.title}</strong>
                  <p>{step.desc}</p>
                </div>
                {index < STEPS.length - 1 && (
                  <ArrowRight className="about-step-arrow" size={20} aria-hidden="true" />
                )}
              </li>
            ))}
          </ol>
        </section>

        <section className="about-section">
          <h2 className="about-heading about-heading--orange">
            Benefícios da Plataforma
          </h2>
          <div className="about-benefits">
            {BENEFITS.map((b) => (
              <span key={b} className="about-benefit">
                {b}
              </span>
            ))}
          </div>
        </section>

        <section className="about-section">
          <h2 className="about-heading about-heading--orange">
            Equipe Desenvolvedora
          </h2>
          <div className="about-team">
            {TEAM.map((i) => (
              <article key={i} className="about-team-card">
                <span className="about-team-avatar" aria-hidden="true" />
                <strong>Nome</strong>
                <span className="about-team-role">Função</span>
                <p>resumo da função</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
