import React from 'react';
import { Search } from 'lucide-react';
import CustomSelect from '../CustomSelect/CustomSelect';
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
        <CustomSelect
          options={statusOptions}
          value={filters.status || ''}
          onChange={(val) => onFilterChange?.('status', val)}
          placeholder="Status"
        />

        <CustomSelect
          options={categoryOptions}
          value={filters.category || ''}
          onChange={(val) => onFilterChange?.('category', val)}
          placeholder="Categoria"
        />

        <CustomSelect
          options={dateOptions}
          value={filters.date || ''}
          onChange={(val) => onFilterChange?.('date', val)}
          placeholder="Data"
        />
      </section>

    </section>
  );
}

export default HorizontalFilterBar;