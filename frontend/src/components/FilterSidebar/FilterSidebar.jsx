import React from 'react';
import { Lightbulb } from 'lucide-react';
import CustomSelect from '../CustomSelect/CustomSelect';
import CustomDatePicker from '../CustomDatePicker/CustomDatePicker';
import './FilterSidebar.css';

function FilterSidebar({
    filters = {},
    categories = [],
    locations = [],
    sortOptions = [],
    onFilterChange,
    onClearFilters,
    onApplyFilters,
    tipVariant = 'lost',
    tipText
}) {

    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        onFilterChange?.(name, value);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        onApplyFilters?.();
    };

    return (
        <aside
            className="filter-sidebar-container"
            aria-label="Painel de filtros laterais"
        >

            <form onSubmit={handleFormSubmit} className="filter-card">

                <header className="filter-card-header">
                    <h2 className="filter-card-title">Filtros</h2>

                    <button
                        type="button"
                        className="btn-clear-filters"
                        onClick={onClearFilters}
                    >
                        × Limpar
                    </button>
                </header>

                <section className="filter-field-group">
                    <label htmlFor="filter-category" className="filter-label">
                        Categoria
                    </label>
                    <CustomSelect
                        options={categories}
                        value={filters.category || ''}
                        onChange={(val) => onFilterChange?.('category', val)}
                        placeholder="Selecione uma categoria"
                    />
                </section>

                <section className="filter-field-group">
                    <label htmlFor="filter-location" className="filter-label">
                        Local
                    </label>
                    <CustomSelect
                        options={locations}
                        value={filters.location || ''}
                        onChange={(val) => onFilterChange?.('location', val)}
                        placeholder="Selecione um local"
                    />
                </section>

                <section className="filter-field-group">
                    <label htmlFor="filter-date" className="filter-label">
                        Data
                    </label>
                    <CustomDatePicker
                        value={filters.date || ''}
                        onChange={(val) => onFilterChange?.('date', val)}
                        placeholder="Selecione uma data"
                    />
                </section>

                <fieldset className="filter-sort-fieldset">
                    <legend className="filter-sort-legend">
                        Ordenar por
                    </legend>

                    {sortOptions.map((option) => (
                        <label
                            key={option.value}
                            className={`sort-option-label ${filters.sortBy === option.value ? 'active' : ''
                                }`}
                        >
                            <input
                                type="radio"
                                name="sortBy"
                                value={option.value}
                                checked={filters.sortBy === option.value}
                                onChange={(e) =>
                                    onFilterChange?.('sortBy', e.target.value)
                                }
                                className="sort-option-input"
                            />

                            {option.label}
                        </label>
                    ))}
                </fieldset>

                <button
                    type="submit"
                    className="btn-apply-filters"
                >
                    Aplicar Filtros
                </button>

            </form>

            <section
                className={`filter-tip-card ${tipVariant}`}
                aria-labelledby="tip-title"
            >
                <header className="filter-tip-header">
                    <Lightbulb
                        size={16}
                        aria-hidden="true"
                    />

                    <h3
                        id="tip-title"
                        style={{
                            margin: 0,
                            fontSize: '14px'
                        }}
                    >
                        Dica
                    </h3>
                </header>

                <p className="filter-tip-text">
                    {tipText ||
                        'Se você encontrou o objeto listado, clique em "Ver Detalhes" e entre em contato com o responsável.'}
                </p>
            </section>

        </aside>
    );
}

export default FilterSidebar;