import { useEffect, useRef, useState } from "react";
import { Clock } from "lucide-react";
import "./CustomTimePicker.css";

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

export default function CustomTimePicker({
  label,
  value, // Expects "HH:MM" or ""
  onChange, // Returns "HH:MM"
  required = false,
  error,
  placeholder = "--:--",
  disabled = false,
  helperText
}) {
  const containerRef = useRef(null);
  const hourListRef = useRef(null);
  const minuteListRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);

  // Parse hour and minute from the incoming value
  const getParsedTime = () => {
    if (!value) return { hour: "", minute: "" };
    const parts = value.split(":");
    return {
      hour: parts[0] || "",
      minute: parts[1] || ""
    };
  };

  const { hour: selectedHour, minute: selectedMinute } = getParsedTime();

  // Click outside listener to close the dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll active elements into view when dropdown is opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (selectedHour && hourListRef.current) {
          const activeHourEl = hourListRef.current.querySelector(".is-selected");
          if (activeHourEl) {
            hourListRef.current.scrollTop =
              activeHourEl.offsetTop - hourListRef.current.clientHeight / 2 + activeHourEl.clientHeight / 2;
          }
        }
        if (selectedMinute && minuteListRef.current) {
          const activeMinEl = minuteListRef.current.querySelector(".is-selected");
          if (activeMinEl) {
            minuteListRef.current.scrollTop =
              activeMinEl.offsetTop - minuteListRef.current.clientHeight / 2 + activeMinEl.clientHeight / 2;
          }
        }
      }, 50);
    }
  }, [isOpen, selectedHour, selectedMinute]);

  const handleSelectHour = (hr, e) => {
    e.stopPropagation();
    const currentMin = selectedMinute || "00";
    onChange(`${hr}:${currentMin}`);
  };

  const handleSelectMinute = (min, e) => {
    e.stopPropagation();
    const currentHr = selectedHour || "12";
    onChange(`${currentHr}:${min}`);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange("");
    setIsOpen(false);
  };

  return (
    <div className={`ctp ${disabled ? "is-disabled" : ""}`} ref={containerRef}>
      {label && (
        <label className="ctp-label">
          {label} {required && <span className="ctp-req">*</span>}
        </label>
      )}

      <div
        className={`ctp-trigger ${isOpen ? "is-open" : ""} ${error ? "is-error" : ""}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
      >
        <span className={`ctp-value ${!value ? "is-placeholder" : ""}`}>
          {value || placeholder}
        </span>
        <Clock className="ctp-icon" size={18} />
      </div>

      {isOpen && (
        <div className="ctp-dropdown">
          <div className="ctp-columns">
            {/* Hours Column */}
            <div className="ctp-col">
              <header className="ctp-col-header">Hora</header>
              <div className="ctp-list" ref={hourListRef}>
                {HOURS.map((h) => {
                  const selected = h === selectedHour;
                  return (
                    <button
                      key={h}
                      type="button"
                      className={`ctp-item ${selected ? "is-selected" : ""}`}
                      onClick={(e) => handleSelectHour(h, e)}
                    >
                      {h}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Minutes Column */}
            <div className="ctp-col">
              <header className="ctp-col-header">Minuto</header>
              <div className="ctp-list" ref={minuteListRef}>
                {MINUTES.map((m) => {
                  const selected = m === selectedMinute;
                  return (
                    <button
                      key={m}
                      type="button"
                      className={`ctp-item ${selected ? "is-selected" : ""}`}
                      onClick={(e) => handleSelectMinute(m, e)}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <footer className="ctp-footer">
            {value && (
              <button type="button" className="ctp-clear-btn" onClick={handleClear}>
                Limpar
              </button>
            )}
            <button
              type="button"
              className="ctp-ok-btn"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
            >
              Ok
            </button>
          </footer>
        </div>
      )}

      {helperText && !error && <p className="ctp-helper-text">{helperText}</p>}
      {error && <p className="ctp-error-text">{error}</p>}
    </div>
  );
}
