import React from "react";
import { Tag, MapPin, Calendar } from "lucide-react";

import defaultImage from "../../assets/default-item.png";

import "./CardAnuncio.css";

function CardAnuncio({
  title,
  image,
  status = "lost",
  description,
  category,
  location,
  date,
  onDetails
}) {
  return (
    <article className="item-card" aria-label={`Anúncio de ${title}`}>
      <section className="item-card-image-wrapper">
        <img
          src={image || defaultImage}
          alt={`Imagem do anúncio ${title}`}
          className="item-card-img"
          loading="lazy"
        />
      </section>

      <section className="item-card-body">
        <header className="item-card-header">
          <h3 className="item-card-title">{title}</h3>
          <span className={`status-badge ${status}`}>
            • {status === "lost" ? "Perdido" : "Encontrado"}
          </span>
        </header>

        <p className="item-card-desc">{description}</p>

        <ul className="item-meta-list" aria-label="Detalhes do anúncio">
          <li>
            <Tag size={14} aria-hidden="true" />
            <span>{category}</span>
          </li>
          <li>
            <MapPin size={14} aria-hidden="true" />
            <span>{location}</span>
          </li>
          <li>
            <Calendar size={14} aria-hidden="true" />
            <span>{date}</span>
          </li>
        </ul>

        <footer className="item-card-footer">
          <button
            type="button"
            className="btn-details"
            onClick={onDetails}
          >
            Ver detalhes
          </button>
        </footer>
      </section>
    </article>
  );
}

export default CardAnuncio;