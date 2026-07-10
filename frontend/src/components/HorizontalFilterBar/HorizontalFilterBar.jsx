import React from 'react';
import { Search, Tag, Calendar, CheckCircle } from 'lucide-react';
import './HorizontalFilterBar.css';

function HorizontalFilterBar({
  searchTerm = '',
  onSearchChange,
  filters = {},
  statusOptions = [],
  categoryOptions = [],
  dateOptions = [],
  onFilterChange
}) {
  return (
    <section
      className="horizontal-filter-bar"
      aria-label="Barra de busca e filtros dos seus anúncios"
    >

      <section className="hf-search-wrapper">
        <Search
          size={18}
          color="#94a3b8"
          aria-hidden="true"
        />

        <input
          type="text"
          placeholder="Buscar anúncio..."
          value={searchTerm}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="hf-search-input"
        />
      </section>


      <section className="hf-dropdowns">

        <section className="hf-select-wrapper">
          <CheckCircle
            size={15}
            className="hf-select-icon"
          />

          <select
            name="status"
            value={filters.status || ''}
            onChange={(e) =>
              onFilterChange?.('status', e.target.value)
            }
            className="hf-select"
          >
            {statusOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </section>


        <section className="hf-select-wrapper">
          <Tag
            size={15}
            className="hf-select-icon"
          />

          <select
            name="category"
            value={filters.category || ''}
            onChange={(e) =>
              onFilterChange?.('category', e.target.value)
            }
            className="hf-select"
          >
            {categoryOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </section>


        <section className="hf-select-wrapper">
          <Calendar
            size={15}
            className="hf-select-icon"
          />

          <select
            name="date"
            value={filters.date || ''}
            onChange={(e) =>
              onFilterChange?.('date', e.target.value)
            }
            className="hf-select"
          >
            {dateOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </section>

      </section>

    </section>
  );
}

export default HorizontalFilterBar;