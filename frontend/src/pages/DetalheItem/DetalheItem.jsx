import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DetalhesAnuncioModal from "../../components/Modals/DetalhesAnuncioModal/DetalhesAnuncioModal";
import EditarAnuncioModal from "../../components/Modals/EditarAnuncioModal/EditarAnuncioModal";
import ExcluirAnuncioModal from "../../components/Modals/ExcluirAnuncioModal/ExcluirAnuncioModal";
import ConfirmarDevolucaoModal from "../../components/Modals/ConfirmarDevolucaoModal/ConfirmarDevolucaoModal";
import itemService from "../../services/itemService";
import userService from "../../services/userService";
import categoryService from "../../services/categoryService";
import { imageUrl } from "../../utils/imageUrl";
import { formatDate, formatDateTime, formatMonthYear } from "../../utils/format";

const isResolved = (i) => String(i?.status || "").toUpperCase() === "RESOLVED";
const isFound = (i) => String(i?.type || "").toUpperCase() === "FOUND";

// Mapeia o item da API para o formato que o DetalhesAnuncioModal espera.
function toModalItem(item) {
  if (!item) return null;
  return {
    title: item.title,
    image: imageUrl(item.photoUrl),
    status: isFound(item) ? "found" : "lost",
    category: item.category?.name || "-",
    location: item.location,
    date: formatDate(item.occurrenceDate),
    description: item.description,
    autor: item.user?.name || "Usuário",
    instituicao:
      [item.user?.institution, item.user?.course].filter(Boolean).join(" / ") ||
      "Instituição / Curso",
    membroDesde: formatMonthYear(item.user?.createdAt),
    email: item.user?.email || "-",
    telefone: item.user?.phone || "-",
    dataPublicacao: formatDateTime(item.createdAt),
  };
}

export default function DetalheItem() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [me, setMe] = useState(null);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [resolveOpen, setResolveOpen] = useState(false);

  function loadItem() {
    return itemService
      .getById(id)
      .then(setItem)
      .catch(() => setError("Não foi possível carregar o anúncio."));
  }

  useEffect(() => {
    let active = true;
    Promise.all([
      itemService.getById(id).catch(() => null),
      userService.getMe().catch(() => null),
      categoryService.getAll().catch(() => []),
    ]).then(([it, user, cats]) => {
      if (!active) return;
      if (!it) setError("Não foi possível carregar o anúncio.");
      setItem(it);
      setMe(user);
      setCategories(cats);
    });
    return () => {
      active = false;
    };
  }, [id]);

  const ownerId = item?.user?.id || item?.userId;
  const isOwner = !!me && !!ownerId && me.id === ownerId;
  const modalItem = toModalItem(item);

  function handleContact(it) {
    if (it?.user?.email) window.location.href = `mailto:${it.user.email}`;
  }

  return (
    <>
      <DetalhesAnuncioModal
        isOpen={!!modalItem}
        onClose={() => navigate(-1)}
        item={modalItem}
        onContact={() => handleContact(item)}
        isOwner={isOwner}
        isResolved={isResolved(item)}
        onEdit={() => setEditOpen(true)}
        onResolve={() => setResolveOpen(true)}
        onDelete={() => setDeleteOpen(true)}
      />

      {error && !item && (
        <p style={{ padding: 40, textAlign: "center", color: "#dc2626" }} role="alert">
          {error}
        </p>
      )}

      {editOpen && (
        <EditarAnuncioModal
          isOpen
          item={item}
          categories={categories}
          currentUser={me}
          onClose={() => setEditOpen(false)}
          onUpdated={async () => {
            setEditOpen(false);
            await loadItem();
          }}
        />
      )}
      {resolveOpen && (
        <ConfirmarDevolucaoModal
          isOpen
          item={item}
          onClose={() => setResolveOpen(false)}
          onResolved={async () => {
            setResolveOpen(false);
            await loadItem();
          }}
        />
      )}
      {deleteOpen && (
        <ExcluirAnuncioModal
          isOpen
          item={item}
          onClose={() => setDeleteOpen(false)}
          onDeleted={() => navigate("/meus-anuncios")}
        />
      )}
    </>
  );
}
