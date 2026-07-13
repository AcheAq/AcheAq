import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import "./CustomSelect.css";

export default function CustomSelect({
  label,
  options = [], // Array of { value, label }
  value,
  onChange,
  required = false,
  error,
  placeholder = "Selecione uma opção",
  disabled = false
}) {
  const containerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const selectedOption = options.find((opt) => opt.value === value);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else if (activeIndex >= 0 && activeIndex < options.length) {
        handleSelect(options[activeIndex].value);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        setActiveIndex((prev) => (prev < options.length - 1 ? prev + 1 : prev));
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (isOpen) {
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      const idx = options.findIndex((opt) => opt.value === value);
      setActiveIndex(idx >= 0 ? idx : 0);
    }
  }, [isOpen, value, options]);

  return (
    <div className={`cs ${disabled ? "is-disabled" : ""}`} ref={containerRef}>
      {label && (
        <label className="cs-label">
          {label} {required && <span className="cs-req">*</span>}
        </label>
      )}

      <div
        className={`cs-trigger ${isOpen ? "is-open" : ""} ${error ? "is-error" : ""}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className={`cs-value ${!selectedOption ? "is-placeholder" : ""}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className="cs-icon" size={18} />
      </div>

      {isOpen && (
        <ul className="cs-dropdown" role="listbox">
          {options.length === 0 ? (
            <li className="cs-no-options">Nenhuma opção disponível</li>
          ) : (
            options.map((opt, idx) => {
              const selected = opt.value === value;
              const active = idx === activeIndex;
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={selected}
                  className={`cs-item ${selected ? "is-selected" : ""} ${
                    active ? "is-active" : ""
                  }`}
                  onClick={() => handleSelect(opt.value)}
                  onMouseEnter={() => setActiveIndex(idx)}
                >
                  {opt.label}
                </li>
              );
            })
          )}
        </ul>
      )}

      {error && <p className="cs-error-text">{error}</p>}
    </div>
  );
}
