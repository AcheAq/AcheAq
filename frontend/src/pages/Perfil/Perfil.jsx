import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, ChevronRight, LogOut, Package } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import userService from "../../services/userService";
import itemService from "../../services/itemService";
import { normalizeList } from "../../utils/normalizeList";
import ActionButton from "../../components/ActionButton/ActionButton";
import EditarPerfilModal from "../../components/Modals/EditarPerfilModal/EditarPerfilModal";
import AlterarSenhaModal from "../../components/Modals/AlterarSenhaModal/AlterarSenhaModal";
import "./Perfil.css";

function typeOf(item) {
  return String(item.type || "").toUpperCase();
}
function isResolved(item) {
  return String(item.status || "").toUpperCase() === "RESOLVED";
}

export default function Perfil() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [passOpen, setPassOpen] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);

    Promise.all([
      userService.getMe(),
      itemService.getMine({ limit: 100 }).catch(() => ({ items: [] })),
    ])
      .then(([me, mine]) => {
        if (!active) return;
        setUser(me);
        setItems(normalizeList(mine).items);
      })
      .catch(() => active && setError("Não foi possível carregar seu perfil."))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(() => {
    const lost = items.filter((i) => typeOf(i) === "LOST").length;
    const found = items.filter((i) => typeOf(i) === "FOUND").length;
    const returned = items.filter(isResolved).length;
    return [
      { key: "lost", value: lost, label: "Objetos Perdidos" },
      { key: "found", value: found, label: "Objetos Encontrados" },
      { key: "returned", value: returned, label: "Objetos Devolvidos" },
      { key: "total", value: items.length, label: "Total de Anúncios" },
    ];
  }, [items]);

  const recent = items.slice(0, 3);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  function handleUpdated(updated) {
    setUser(updated);
    setEditOpen(false);
  }

  const settingsItems = [
    { key: "edit", title: "Editar Perfil", desc: "Atualize seus dados pessoais", onClick: () => setEditOpen(true) },
    { key: "pass", title: "Alterar Senha", desc: "Mude sua senha de acesso", onClick: () => setPassOpen(true) },
    { key: "ads", title: "Meus Anúncios", desc: "Gerencie seus anúncios", onClick: () => navigate("/meus-anuncios") },
    { key: "notif", title: "Notificações", desc: "Configure suas preferências de notificação" },
    { key: "privacy", title: "Política de Privacidade", desc: "Entenda como seus dados são usados" },
  ];

  return (
    <div className="profile">
      <div className="profile-hero">
        <div className="profile-hero-inner">
          <h1>Meu Perfil</h1>
          <p>Gerencie suas informações pessoais e seus anúncios</p>
        </div>
      </div>

      <div className="profile-wrap">
        {loading && <p className="profile-status">Carregando perfil...</p>}
        {error && !loading && (
          <p className="profile-status profile-status--error" role="alert">
            {error}
          </p>
        )}

        {user && !loading && (
          <>
            <section className="profile-id card">
              <div className="profile-id-main">
                <div className="profile-avatar">
                  <span aria-hidden="true">
                    {(user.name || "?").charAt(0).toUpperCase()}
                  </span>
                  <button
                    type="button"
                    className="profile-avatar-cam"
                    aria-label="Alterar foto (em breve)"
                    disabled
                  >
                    <Camera size={16} aria-hidden="true" />
                  </button>
                </div>

                <div className="profile-id-info">
                  <h2>{user.name}</h2>
                  <a href={`mailto:${user.email}`} className="profile-id-email">
                    {user.email}
                  </a>
                  <p className="profile-id-inst">{user.institution}</p>
                  <div className="profile-badges">
                    <span className="profile-badge profile-badge--green">
                      Conta Verificada
                    </span>
                    <span className="profile-badge profile-badge--blue">
                      {user.role === "ADMIN" ? "Administrador" : "Estudante"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="profile-id-actions">
                <ActionButton variant="orange" onClick={() => setEditOpen(true)}>
                  Editar Perfil
                </ActionButton>
                <ActionButton variant="outline" onClick={() => setPassOpen(true)}>
                  Alterar Senha
                </ActionButton>
              </div>
            </section>

            <section className="profile-stats" aria-label="Estatísticas">
              {stats.map((stat) => (
                <div key={stat.key} className="profile-stat card">
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </section>

            <div className="profile-cols">
              <section className="profile-info card">
                <header className="profile-info-head">
                  <h3>Informações Pessoais</h3>
                  <ActionButton variant="outline" onClick={() => setEditOpen(true)}>
                    Editar
                  </ActionButton>
                </header>

                <div className="profile-info-grid">
                  <Field label="Nome Completo" value={user.name} />
                  <Field label="Email" value={user.email} />
                  <Field label="Telefone" value={user.phone} />
                  <Field label="Curso" value={user.course} />
                  <Field label="Matrícula" value={user.registration} />
                  <Field label="Instituição" value={user.institution} />
                </div>
              </section>

              <section className="profile-settings card">
                <h3>Configurações da Conta</h3>
                <ul className="profile-settings-list">
                  {settingsItems.map((item) => (
                    <li key={item.key}>
                      <button
                        type="button"
                        className="profile-settings-item"
                        onClick={item.onClick}
                        disabled={!item.onClick}
                      >
                        <span className="profile-settings-text">
                          <strong>{item.title}</strong>
                          <small>{item.desc}</small>
                        </span>
                        <ChevronRight size={18} aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      type="button"
                      className="profile-settings-item profile-settings-item--danger"
                      onClick={handleLogout}
                    >
                      <span className="profile-settings-text">
                        <strong>Sair da Conta</strong>
                        <small>Encerrar sua sessão atual</small>
                      </span>
                      <LogOut size={18} aria-hidden="true" />
                    </button>
                  </li>
                </ul>
              </section>
            </div>

            <section className="profile-activity card">
              <header className="profile-activity-head">
                <h3>Atividade Recente</h3>
                {items.length > 0 && (
                  <button
                    type="button"
                    className="profile-link-btn"
                    onClick={() => navigate("/meus-anuncios")}
                  >
                    Ver tudo
                  </button>
                )}
              </header>

              {recent.length > 0 ? (
                <ul className="profile-activity-list">
                  {recent.map((it) => (
                    <li key={it.id} className="profile-activity-item">
                      <span className="profile-activity-icon" aria-hidden="true">
                        <Package size={18} />
                      </span>
                      <span className="profile-activity-title">{it.title}</span>
                      <span
                        className={`profile-tag ${
                          isResolved(it)
                            ? "profile-tag--resolved"
                            : typeOf(it) === "FOUND"
                              ? "profile-tag--found"
                              : "profile-tag--lost"
                        }`}
                      >
                        {isResolved(it)
                          ? "Devolvido"
                          : typeOf(it) === "FOUND"
                            ? "Encontrado"
                            : "Perdido"}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="profile-empty">
                  <Package size={28} aria-hidden="true" />
                  <p>Você ainda não possui anúncios.</p>
                  <span>Suas atividades aparecerão aqui.</span>
                </div>
              )}
            </section>

            <section className="profile-tip">
              <div>
                <strong>Dica AcheAq</strong>
                <p>
                  Mantenha seu perfil atualizado para facilitar o contato quando
                  alguém encontrar seus itens.
                </p>
              </div>
              <ActionButton variant="outline" onClick={() => setEditOpen(true)}>
                Completar Perfil
                <ChevronRight size={16} aria-hidden="true" />
              </ActionButton>
            </section>
          </>
        )}
      </div>

      {/* Renderização condicional: o modal monta do zero a cada abertura,
          garantindo que todo estado local (form, bio, foto) comece limpo e
          seja descartado no Cancelar/fechar. */}
      {user && editOpen && (
        <EditarPerfilModal
          isOpen
          onClose={() => setEditOpen(false)}
          user={user}
          onUpdated={handleUpdated}
        />
      )}
      {user && passOpen && (
        <AlterarSenhaModal isOpen onClose={() => setPassOpen(false)} />
      )}
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="profile-field">
      <span className="profile-field-label">{label}</span>
      <span className="profile-field-value">{value || "—"}</span>
    </div>
  );
}
