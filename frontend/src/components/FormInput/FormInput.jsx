import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import "./FormInput.css";

/**
 * Campo de formulário local (escopo Usuário/Anúncios).
 * Suporta label + obrigatório(*), texto de ajuda, mensagem de erro
 * (borda vermelha + role="alert") e toggle de visibilidade para senha.
 * Não altera o <Input /> compartilhado.
 */
function FormInput({
  label,
  id,
  type = "text",
  placeholder,
  required = false,
  value,
  onChange,
  error,
  helperText,
  disabled = false,
  className = "",
  ...props
}) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);
  const resolvedType = isPassword && showPassword ? "text" : type;

  const helperId = helperText ? `${inputId}-helper` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [helperId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={`fi ${className}`.trim()}>
      {label && (
        <label htmlFor={inputId} className="fi-label">
          {label}
          {required && (
            <span aria-hidden="true" className="fi-req">
              {" "}*
            </span>
          )}
        </label>
      )}

      <div className={`fi-wrap ${error ? "fi-wrap--error" : ""}`.trim()}>
        <input
          id={inputId}
          type={resolvedType}
          placeholder={placeholder}
          required={required}
          aria-required={required}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={describedBy}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="fi-field"
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            className="fi-toggle"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            aria-pressed={showPassword}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff size={18} aria-hidden="true" />
            ) : (
              <Eye size={18} aria-hidden="true" />
            )}
          </button>
        )}
      </div>

      {helperText && !error && (
        <p id={helperId} className="fi-helper">
          {helperText}
        </p>
      )}

      {error && (
        <p id={errorId} className="fi-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default FormInput;
