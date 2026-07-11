import { Search } from "lucide-react";
import "./SearchBar.css";

function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Pesquise por nome do objeto...",
  className = "",
  ...props
}) {
  const handleSubmit = (event) => {
    event.preventDefault();

    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <form
      className={`search-bar-form ${className}`.trim()}
      onSubmit={handleSubmit}
      role="search"
      {...props}
    >
      <Search
        size={20}
        color="#94a3b8"
        aria-hidden="true"
      />

      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="search-bar-input"
        aria-label="Campo de pesquisa de objetos"
      />

      <button
        type="submit"
        className="search-bar-btn"
      >
        Buscar
      </button>
    </form>
  );
}

export default SearchBar;