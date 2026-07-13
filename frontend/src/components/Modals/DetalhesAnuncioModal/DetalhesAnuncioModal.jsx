import Modal from "../../Modal/Modal";
import { Tag, MapPin, Calendar, Clock, User } from "lucide-react";
import ActionButton from "../../ActionButton/ActionButton";
import defaultImage from "../../../assets/default-item.png";
import getCategoryFallback from "../../../utils/categoryFallback";

import "./DetalhesAnuncioModal.css";

function DetalhesAnuncioModal({
  isOpen,
  onClose,
  item,
  onContact,
  isOwner = false,
  isResolved = false,
  onEdit,
  onResolve,
  onDelete,
}) {
  if (!item && isOpen) return null;

  const anunciante = {
    autor: item?.autor || "Usuário",
    instituicao: item?.instituicao || "Instituição / Curso",
    membroDesde: item?.membroDesde || "-",
    email: item?.email || "-",
    telefone: item?.telefone || "-",
    dataPublicacao: item?.dataPublicacao || "-"
  };

  const image = item?.imagem || item?.image;
  const isDefaultImage = !image || image === defaultImage;
  const fallback = getCategoryFallback(item?.categoria || item?.category, item?.titulo || item?.title);
  const FallbackIcon = fallback.Icon;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalhes do Anúncio"
      subtitle="Visualize todas as informações cadastradas para este objeto."
    >
      <section className="detalhes-grid">
        <section className="detalhes-coluna-esq">
          <section className="detalhes-img-wrapper">
            {isDefaultImage ? (
              <div
                className="detalhes-img-fallback-wrapper"
                style={{ background: fallback.gradient }}
              >
                <FallbackIcon size={80} color={fallback.color} strokeWidth={1.5} />
              </div>
            ) : (
              <img
                src={image}
                alt={`Foto de ${item?.titulo || item?.title}`}
                className="detalhes-img"
              />
            )}
          </section>

          <aside
            className="anunciante-card"
            aria-label="Informações de quem anunciou"
          >
            <p className="anunciante-label">Anunciado por</p>

            <section className="anunciante-perfil">
              <span className="anunciante-avatar" aria-hidden="true">
                <User size={24} />
              </span>

              <section className="anunciante-dados">
                <h3 className="anunciante-nome">
                  {anunciante.autor}
                </h3>

                <p className="anunciante-curso">
                  {anunciante.instituicao}
                </p>
              </section>
            </section>

            <p className="anunciante-membro">
              Membro desde {anunciante.membroDesde}
            </p>
          </aside>

          <section
            className="detalhes-contato-sec"
            aria-label="Canais de contato"
          >
            <h3 className="contato-titulo">
              Contato
            </h3>

            {item?.allowContact !== false ? (
              <>
                <section
                  className="contato-input-fake"
                  aria-label="E-mail de contato"
                >
                  {anunciante.email}
                </section>

                <section
                  className="contato-input-fake"
                  aria-label="Telefone de contato"
                >
                  {anunciante.telefone}
                </section>

                <button
                  type="button"
                  className="btn-entrar-contato"
                  onClick={() => onContact?.(item)}
                >
                  Entrar em Contato
                </button>
              </>
            ) : (
              <button
                type="button"
                className="btn-entrar-contato"
                disabled
                style={{
                  backgroundColor: "#cbd5e1",
                  color: "#64748b",
                  cursor: "not-allowed",
                  boxShadow: "none"
                }}
              >
                Usuário não permitiu mostrar contato
              </button>
            )}
          </section>
        </section>

        <span className="coluna-divisor" aria-hidden="true" />

        <section className="detalhes-coluna-dir">
          <header className="detalhes-dir-header">
            <span
              className={`badge-status ${
                item?.status === "Perdido" || item?.status === "lost"
                  ? "lost"
                  : "found"
              }`}
            >
              •{" "}
              {item?.status === "Perdido" || item?.status === "lost"
                ? "Perdido"
                : "Encontrado"}
            </span>

            <h1 className="detalhes-obj-titulo">
              {item?.titulo || item?.title || "Objeto Sem Título"}
            </h1>
          </header>

          <section
            className="metadados-grid"
            aria-label="Informações de local e data"
          >
            <article className="meta-item">
              <p className="meta-label">
                <Tag size={15} color="#64748b" />
                <span>Categoria</span>
              </p>

              <p className="meta-valor">
                {item?.categoria || item?.category || "Acessórios"}
              </p>
            </article>

            <article className="meta-item">
              <p className="meta-label">
                <MapPin size={15} color="#64748b" />
                <span>Local</span>
              </p>

              <p className="meta-valor">
                {item?.localizacao || item?.location || "-"}
              </p>
            </article>

            <article className="meta-item">
              <p className="meta-label">
                <Calendar size={15} color="#64748b" />
                <span>Data da ocorrência</span>
              </p>

              <p className="meta-valor">
                {item?.data || item?.date || "-"}
              </p>
            </article>

            <article className="meta-item">
              <p className="meta-label">
                <Clock size={15} color="#64748b" />
                <span>Publicado em</span>
              </p>

              <p className="meta-valor">
                {anunciante.dataPublicacao}
              </p>
            </article>
          </section>

          <hr className="linha-horizontal" />

          <section className="detalhes-desc-sec">
            <h3 className="desc-titulo">
              Descrição do Objeto
            </h3>

            <p className="desc-box">
              {item?.descricao ||
                item?.description ||
                "Sem descrição cadastrada."}
            </p>
          </section>

          {isOwner && (
            <div
              style={{
                marginTop: 20,
                borderTop: "1px solid #e2e8f0",
                paddingTop: 16,
              }}
            >
              <p
                style={{
                  margin: "0 0 10px",
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: "#94a3b8",
                }}
              >
                Ações do Anunciante
              </p>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <ActionButton
                  variant="outline"
                  type="button"
                  onClick={onEdit}
                >
                  Editar Anúncio
                </ActionButton>

                {!isResolved && (
                  <ActionButton
                    variant="primary"
                    type="button"
                    onClick={onResolve}
                  >
                    Marcar como Devolvido
                  </ActionButton>
                )}

                <ActionButton
                  variant="danger"
                  type="button"
                  onClick={onDelete}
                >
                  Excluir
                </ActionButton>
              </div>
            </div>
          )}
        </section>
      </section>
    </Modal>
  );
}

export default DetalhesAnuncioModal;