import { Tag, MapPin, Calendar } from "lucide-react";
import { imageUrl } from "../../utils/imageUrl";
import { formatDate } from "../../utils/format";

// Card compacto de um item, usado nos modais de excluir/devolver.
export default function ItemMiniCard({ item }) {
  if (!item) return null;

  const src = imageUrl(item.photoUrl);
  const resolved = String(item.status || "").toUpperCase() === "RESOLVED";
  const found = String(item.type || "").toUpperCase() === "FOUND";
  const badgeClass = resolved ? "resolved" : found ? "found" : "lost";
  const badgeText = resolved ? "Devolvido" : found ? "Encontrado" : "Perdido";

  return (
    <div className="mform-item">
      {src ? (
        <img className="mform-item-thumb" src={src} alt="" />
      ) : (
        <span className="mform-item-thumb" aria-hidden="true" />
      )}

      <div className="mform-item-body">
        <p className="mform-item-title">{item.title}</p>
        <p className="mform-item-meta">
          <Tag size={13} aria-hidden="true" />{" "}
          {item.category?.name || item.categoria || "-"} ·{" "}
          <MapPin size={13} aria-hidden="true" /> {item.location || "-"} ·{" "}
          <Calendar size={13} aria-hidden="true" /> {formatDate(item.occurrenceDate)}
        </p>
      </div>

      <span className={`mform-item-badge mform-item-badge--${badgeClass}`}>
        {badgeText}
      </span>
    </div>
  );
}
