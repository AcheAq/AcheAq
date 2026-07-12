import { useEffect, useRef } from "react";
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

const ROLE_DESC = {
  Infra: "Infraestrutura",
  Frontend: "Interface e UX",
  Backend: "API e dados",
};

const TEAM = [
  { name: "Jonas Oliveira dos Santos", roles: ["Infra", "Backend"] },
  { name: "Vitor Henrique Vasconcelos", roles: ["Infra", "Backend"] },
  { name: "Andreza Mirely Leal dos Santos", roles: ["Frontend"] },
  { name: "Servio Tullio Marinho Machado", roles: ["Frontend"] },
  { name: "Edgar Vitor Costa Barros de Moura", roles: ["Frontend"] },
  { name: "Gabriel da Silva Bento", roles: ["Backend"] },
];

function initials(name) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export default function Sobre() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const els = root.querySelectorAll(".reveal");
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Sem animação (usuário pediu menos movimento) ou browser sem suporte:
    // mostra tudo imediatamente, sem esconder nada.
    if (prefersReduced || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target); // revela uma vez e para de observar
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="about" ref={rootRef}>
      <header className="about-hero">
        <div className="about-hero-inner">
          <div className="about-hero-text reveal">
            <span className="about-badge">Nossa Plataforma</span>
            <h1>
              Sobre o <span>AcheAq</span>
            </h1>
            <p>
              Conectando pessoas aos seus pertences por meio de uma plataforma
              simples, segura e colaborativa.
            </p>
          </div>
          <div
            className="about-hero-art reveal"
            style={{ "--reveal-delay": "140ms" }}
            aria-hidden="true"
          >
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
        <section className="about-card reveal">
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
          <h2 className="about-heading about-heading--orange reveal">Nossa Missão</h2>
          <div className="about-mission">
            <article className="about-mission-card reveal">
              <h3>Missão</h3>
              <p>
                Facilitar a comunicação entre quem perdeu e quem encontrou um
                objeto, promovendo um ambiente acadêmico mais colaborativo.
              </p>
            </article>
            <article
              className="about-mission-card reveal"
              style={{ "--reveal-delay": "90ms" }}
            >
              <h3>Visão</h3>
              <p>
                Ser uma referência em soluções digitais para achados e perdidos no
                ambiente acadêmico.
              </p>
            </article>
            <article
              className="about-mission-card reveal"
              style={{ "--reveal-delay": "180ms" }}
            >
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
          <h2 className="about-heading about-heading--orange reveal">Como Funciona</h2>
          <p className="about-sub reveal">
            Em apenas 4 etapas simples você recupera o que perdeu.
          </p>
          <ol className="about-steps">
            {STEPS.map((step, index) => (
              <li
                key={step.title}
                className="about-step-item reveal"
                style={{ "--reveal-delay": `${index * 90}ms` }}
              >
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
          <h2 className="about-heading about-heading--orange reveal">
            Benefícios da Plataforma
          </h2>
          <div className="about-benefits">
            {BENEFITS.map((b, index) => (
              <span
                key={b}
                className="about-benefit reveal"
                style={{ "--reveal-delay": `${index * 70}ms` }}
              >
                {b}
              </span>
            ))}
          </div>
        </section>

        <section className="about-section">
          <h2 className="about-heading about-heading--orange reveal">
            Equipe Desenvolvedora
          </h2>
          <div className="about-team">
            {TEAM.map((member, index) => (
              <article
                key={member.name}
                className="about-team-card reveal"
                style={{ "--reveal-delay": `${index * 70}ms` }}
              >
                <span className="about-team-avatar" aria-hidden="true">
                  {initials(member.name)}
                </span>
                <strong>{member.name}</strong>
                <span className="about-team-roles">
                  {member.roles.map((role) => (
                    <span key={role} className="about-team-role">
                      {role}
                    </span>
                  ))}
                </span>
                <p>{member.roles.map((role) => ROLE_DESC[role]).join(" · ")}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
