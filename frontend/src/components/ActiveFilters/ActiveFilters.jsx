import "./ActiveFilters.css";

function ActiveFilters({
  filters,
  onFilterChange,
  categoryLabels,
  sortLabels
}) {
  const hasActiveFilters =
    filters.category !== "todas" ||
    filters.date !== "" ||
    filters.sortBy !== "recentes";

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <section className="active-filters-bar" aria-label="Filtros ativos">
      <span className="active-filters-label">Filtros ativos:</span>

      {filters.sortBy !== "recentes" && (
        <span className="filter-pill">
          {sortLabels[filters.sortBy]}
          <button
            type="button"
            className="filter-pill-close"
            onClick={() => onFilterChange("sortBy", "recentes")}
          >
            ×
          </button>
        </span>
      )}

      {filters.category !== "todas" && (
        <span className="filter-pill">
          {categoryLabels[filters.category] || filters.category}
          <button
            type="button"
            className="filter-pill-close"
            onClick={() => onFilterChange("category", "todas")}
          >
            ×
          </button>
        </span>
      )}

      {filters.date !== "" && (
        <span className="filter-pill">
          {filters.date.split("-").reverse().join("/")}
          <button
            type="button"
            className="filter-pill-close"
            onClick={() => onFilterChange("date", "")}
          >
            ×
          </button>
        </span>
      )}
    </section>
  );
}

export default ActiveFilters;