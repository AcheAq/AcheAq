import React from 'react';
import {
  Tag,
  MapPin,
  Calendar,
  CheckCircle2,
  Trash2
} from 'lucide-react';

import defaultImage from '../../assets/default-item.png';
import getCategoryFallback from '../../utils/categoryFallback';

import './MyAdCard.css';


function MyAdCard({
  title,
  category,
  location,
  date,
  image,
  isReturned = false,
  onToggleReturn,
  onEdit,
  onDelete
}) {
  const isDefaultImage = !image || image === defaultImage;
  const fallback = getCategoryFallback(category, title);
  const FallbackIcon = fallback.Icon;

  return (
    <article
      className="my-ad-card"
      aria-label={`Gerenciar anúncio: ${title}`}
    >

      <section className="my-ad-left">

        <section className="my-ad-img-wrapper">
          {isDefaultImage ? (
            <div
              className="my-ad-img-fallback-wrapper"
              style={{ background: fallback.gradient }}
            >
              <FallbackIcon size={36} color={fallback.color} strokeWidth={1.5} />
            </div>
          ) : (
            <img
              src={image}
              alt={`Imagem do anúncio ${title}`}
              className="my-ad-img"
              loading="lazy"
            />
          )}
        </section>


        <section className="my-ad-details">

          <h3 className="my-ad-title">
            {title}
          </h3>


          <ul className="my-ad-meta">

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


          <button
            type="button"
            disabled={isReturned}
            className={`btn-status-toggle ${
              isReturned ? 'returned' : 'pending'
            }`}
            onClick={onToggleReturn}
          >

            <CheckCircle2 size={14} />

            <span>
              {
                isReturned
                  ? 'Devolvido'
                  : 'Marcar como devolvido'
              }
            </span>

          </button>


        </section>

      </section>



      <section className="my-ad-actions">

        <button
          type="button"
          className="btn-edit-ad"
          onClick={onEdit}
        >
          Editar Anúncio
        </button>


        <button
          type="button"
          className="btn-delete-ad"
          onClick={onDelete}
        >

          <Trash2 size={16} />

          <span>
            Excluir
          </span>

        </button>

      </section>


    </article>
  );
}


export default MyAdCard;