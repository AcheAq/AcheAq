import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, XCircle, CheckCircle2, Package, Megaphone } from "lucide-react";
import StatCard from "../../components/StatCard/StatCard";
import MyAdCard from "../../components/MyAdCard/MyAdCard";
import ActionButton from "../../components/ActionButton/ActionButton";
import EditarAnuncioModal from "../../components/Modals/EditarAnuncioModal/EditarAnuncioModal";
import ExcluirAnuncioModal from "../../components/Modals/ExcluirAnuncioModal/ExcluirAnuncioModal";
import ConfirmarDevolucaoModal from "../../components/Modals/ConfirmarDevolucaoModal/ConfirmarDevolucaoModal";
import itemService from "../../services/itemService";
import userService from "../../services/userService";
import categoryService from "../../services/categoryService";
import { normalizeList } from "../../utils/normalizeList";
import { imageUrl } from "../../utils/imageUrl";
import { formatDate } from "../../utils/format";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import "./MeusAnuncios.css";

const PAGE_SIZE = 5;
const typeOf = (i) => String(i.type || "").toUpperCase();
const isResolved = (i) => String(i.status || "").toUpperCase() === "RESOLVED";

export default function MeusAnuncios() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [resolveItem, setResolveItem] = useState(null);

  function load() {
    setLoading(true);
    return itemService
      .getMine({ limit: 100 })
      .then((res) => setItems(normalizeList(res).items))
      .catch(() => setError("Não foi possível carregar seus anúncios."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    let active = true;
    Promise.all([
      itemService.getMine({ limit: 100 }).then((r) => normalizeList(r).items).catch(() => []),
      categoryService.getAll().catch(() => []),
      userService.getMe().catch(() => null),
    ]).then(([mine, cats, me]) => {
      if (!active) return;
      setItems(mine);
      setCategories(cats);
      setUser(me);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(
    () => [
      { key: "lost", value: items.filter((i) => typeOf(i) === "LOST").length, label: "Objetos Perdidos", icon: XCircle, variant: "danger" },
      { key: "found", value: items.filter((i) => typeOf(i) === "FOUND").length, label: "Objetos Encontrados", icon: CheckCircle2, variant: "primary" },
      { key: "returned", value: items.filter(isResolved).length, label: "Objetos Devolvidos", icon: Package, variant: "success" },
      { key: "total", value: items.length, label: "Total de Anúncios", icon: Megaphone, variant: "orange" },
    ],
    [items],
  );

  const filtered = useMemo(() => {
    return items.filter((i) => {
      const matchesSearch = i.title?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        status === "all" ||
        (status === "lost" && typeOf(i) === "LOST" && !isResolved(i)) ||
        (status === "found" && typeOf(i) === "FOUND" && !isResolved(i)) ||
        (status === "resolved" && isResolved(i));
      return matchesSearch && matchesStatus;
    });
  }, [items, search, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  async function afterAction() {
    setEditItem(null);
    setDeleteItem(null);
    setResolveItem(null);
    await load();
  }

  return (
    <div className="meus">
      <div className="meus-hero">
        <div className="meus-hero-inner">
          <div>
            <h1>Meus Anúncios</h1>
            <p>Gerencie seus anúncios publicados</p>
          </div>
          <ActionButton variant="orange" onClick={() => navigate("/novo-anuncio")}>
            <Plus size={18} aria-hidden="true" /> Novo Anúncio
          </ActionButton>
        </div>
      </div>

      <div className="meus-body">
        <section className="meus-stats" aria-label="Resumo">
          {stats.map((s) => (
            <StatCard key={s.key} icon={s.icon} value={s.value} label={s.label} variant={s.variant} />
          ))}
        </section>

        <section className="meus-toolbar">
          <div className="meus-search">
            <Search size={18} aria-hidden="true" />
            <input
              type="search"
              placeholder="Buscar anúncio..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              aria-label="Buscar anúncio"
            />
          </div>
          <div className="meus-filter">
            <CustomSelect
              options={[
                { value: "all", label: "Todos os status" },
                { value: "lost", label: "Perdidos" },
                { value: "found", label: "Encontrados" },
                { value: "resolved", label: "Devolvidos" },
              ]}
              value={status}
              onChange={(val) => {
                setStatus(val);
                setPage(1);
              }}
            />
          </div>
        </section>

        {loading && <p className="meus-status">Carregando anúncios...</p>}
        {error && !loading && (
          <p className="meus-status meus-status--error" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && (
          <>
            <p className="meus-count">
              Exibindo <strong>{pageItems.length}</strong> de{" "}
              <strong>{filtered.length}</strong> anúncios
            </p>

            {pageItems.length === 0 ? (
              <div className="meus-empty">
                <Package size={30} aria-hidden="true" />
                <p>Nenhum anúncio encontrado.</p>
                <ActionButton variant="primary" onClick={() => navigate("/novo-anuncio")}>
                  Publicar meu primeiro anúncio
                </ActionButton>
              </div>
            ) : (
              <ul className="meus-list">
                {pageItems.map((it) => (
                  <li key={it.id}>
                    <MyAdCard
                      title={it.title}
                      category={it.category?.name || "-"}
                      location={it.location}
                      date={formatDate(it.occurrenceDate)}
                      image={imageUrl(it.photoUrl)}
                      isReturned={isResolved(it)}
                      onToggleReturn={() => setResolveItem(it)}
                      onEdit={() => setEditItem(it)}
                      onDelete={() => setDeleteItem(it)}
                    />
                  </li>
                ))}
              </ul>
            )}

            {totalPages > 1 && (
              <nav className="meus-pagination" aria-label="Paginação">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  aria-label="Página anterior"
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    type="button"
                    key={p}
                    className={p === currentPage ? "is-active" : ""}
                    aria-current={p === currentPage ? "page" : undefined}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  aria-label="Próxima página"
                >
                  ›
                </button>
              </nav>
            )}
          </>
        )}
      </div>

      {/* Modais montados só quando há item selecionado -> estado sempre limpo. */}
      {editItem && (
        <EditarAnuncioModal
          isOpen
          item={editItem}
          categories={categories}
          currentUser={user}
          onClose={() => setEditItem(null)}
          onUpdated={afterAction}
        />
      )}
      {deleteItem && (
        <ExcluirAnuncioModal
          isOpen
          item={deleteItem}
          onClose={() => setDeleteItem(null)}
          onDeleted={afterAction}
        />
      )}
      {resolveItem && (
        <ConfirmarDevolucaoModal
          isOpen
          item={resolveItem}
          onClose={() => setResolveItem(null)}
          onResolved={afterAction}
        />
      )}
    </div>
  );
}
