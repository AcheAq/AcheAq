import { createContext, useCallback, useContext, useRef, useState } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import "./Toast.css";

const ToastContext = createContext(null);

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const DURATION = 3500;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const remove = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (message, type = "info") => {
      const id = ++idRef.current;
      setToasts((list) => [...list, { id, message, type }]);
      // Auto-dismiss (não bloqueia o usuário; ele também pode fechar no X).
      setTimeout(() => remove(id), DURATION);
    },
    [remove],
  );

  const api = useRef({
    success: (m) => push(m, "success"),
    error: (m) => push(m, "error"),
    info: (m) => push(m, "info"),
  }).current;

  return (
    <ToastContext.Provider value={api}>
      {children}

      {/* aria-live="polite" + role="status": anuncia sem roubar foco (WCAG) */}
      <div className="toast-region" role="status" aria-live="polite">
        {toasts.map((t) => {
          const Icon = ICONS[t.type] || Info;
          return (
            <div key={t.id} className={`toast toast--${t.type}`}>
              <Icon size={20} className="toast-icon" aria-hidden="true" />
              <span className="toast-msg">{t.message}</span>
              <button
                type="button"
                className="toast-close"
                aria-label="Fechar notificação"
                onClick={() => remove(t.id)}
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Fallback seguro se usado fora do provider (não quebra a tela).
    return { success: () => {}, error: () => {}, info: () => {} };
  }
  return ctx;
}

export default ToastProvider;
