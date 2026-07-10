import React from 'react';
import './StatCard.css';

function StatCard({
  icon: Icon,
  value,
  label,
  variant = 'primary',
  iconSize = 24
}) {
  return (
    <article
      className="stat-card"
      aria-label={`Estatística: ${label}`}
    >

      <span
        className={`stat-icon-wrapper ${variant}`}
        aria-hidden="true"
      >
        {Icon && <Icon size={iconSize} />}
      </span>


      <section className="stat-info">

        <h3 className="stat-value">
          {value}
        </h3>

        <p className="stat-label">
          {label}
        </p>

      </section>

    </article>
  );
}

export default StatCard;