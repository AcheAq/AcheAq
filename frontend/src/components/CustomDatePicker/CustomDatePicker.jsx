import { useEffect, useRef, useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import "./CustomDatePicker.css";

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const WEEKDAY_NAMES = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function CustomDatePicker({
  label,
  value, // Expects "YYYY-MM-DD"
  onChange, // Returns "YYYY-MM-DD"
  required = false,
  error,
  placeholder = "Selecione uma data",
  disabled = false
}) {
  const containerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  // Separate states for calendar view (which month/year is shown in grid)
  const [viewDate, setViewDate] = useState(() => {
    if (value) {
      const parts = value.split("-");
      if (parts.length === 3) {
        return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, 1);
      }
    }
    return new Date();
  });

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  // Synchronize calendar view if selected value changes
  useEffect(() => {
    if (value) {
      const parts = value.split("-");
      if (parts.length === 3) {
        setViewDate(new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, 1));
      }
    }
  }, [value]);

  // Click outside listener to close the calendar
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Format displaying text (DD/MM/YYYY)
  const getDisplayText = () => {
    if (!value) return "";
    const parts = value.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return value;
  };

  // Helper calendar calculations
  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

  const generateDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth); // 0 (Sun) to 6 (Sat)
    
    // Previous month padding
    const prevMonthIdx = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const prevMonthDays = getDaysInMonth(prevYear, prevMonthIdx);
    
    const days = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        month: prevMonthIdx,
        year: prevYear,
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        month: currentMonth,
        year: currentYear,
        isCurrentMonth: true,
      });
    }

    // Next month padding to fill 42 cells (6 rows)
    const nextMonthIdx = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        day: i,
        month: nextMonthIdx,
        year: nextYear,
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleSelectDay = (dayObj, e) => {
    e.stopPropagation();
    const pad = (n) => String(n).padStart(2, "0");
    const formatted = `${dayObj.year}-${pad(dayObj.month + 1)}-${pad(dayObj.day)}`;
    onChange(formatted);
    setIsOpen(false);
  };

  const isSelected = (dayObj) => {
    if (!value) return false;
    const parts = value.split("-");
    if (parts.length === 3) {
      return (
        dayObj.day === parseInt(parts[2], 10) &&
        dayObj.month === parseInt(parts[1], 10) - 1 &&
        dayObj.year === parseInt(parts[0], 10)
      );
    }
    return false;
  };

  const isToday = (dayObj) => {
    const today = new Date();
    return (
      dayObj.day === today.getDate() &&
      dayObj.month === today.getMonth() &&
      dayObj.year === today.getFullYear()
    );
  };

  return (
    <div className={`cdp ${disabled ? "is-disabled" : ""}`} ref={containerRef}>
      {label && (
        <label className="cdp-label">
          {label} {required && <span className="cdp-req">*</span>}
        </label>
      )}

      <div
        className={`cdp-trigger ${isOpen ? "is-open" : ""} ${error ? "is-error" : ""}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
      >
        <span className={`cdp-value ${!value ? "is-placeholder" : ""}`}>
          {getDisplayText() || placeholder}
        </span>
        <CalendarIcon className="cdp-icon" size={18} />
      </div>

      {isOpen && (
        <div className="cdp-dropdown">
          <header className="cdp-header">
            <button type="button" className="cdp-nav-btn" onClick={handlePrevMonth}>
              <ChevronLeft size={16} />
            </button>
            <span className="cdp-month-year">
              {MONTH_NAMES[currentMonth]} de {currentYear}
            </span>
            <button type="button" className="cdp-nav-btn" onClick={handleNextMonth}>
              <ChevronRight size={16} />
            </button>
          </header>

          <div className="cdp-weekdays">
            {WEEKDAY_NAMES.map((name) => (
              <span key={name} className="cdp-weekday">
                {name}
              </span>
            ))}
          </div>

          <div className="cdp-days">
            {generateDays().map((d, index) => {
              const selected = isSelected(d);
              const today = isToday(d);
              return (
                <button
                  key={index}
                  type="button"
                  className={`cdp-day ${
                    !d.isCurrentMonth ? "is-outside" : ""
                  } ${selected ? "is-selected" : ""} ${today ? "is-today" : ""}`}
                  onClick={(e) => handleSelectDay(d, e)}
                >
                  {d.day}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {error && <p className="cdp-error-text">{error}</p>}
    </div>
  );
}
