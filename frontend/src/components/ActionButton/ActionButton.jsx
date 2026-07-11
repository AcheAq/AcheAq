import { Loader2 } from "lucide-react";
import "./ActionButton.css";

/**
 * Botão local (escopo Usuário/Anúncios) com as variantes do Figma:
 * primary (azul), orange (laranja), outline (contorno azul), danger (vermelho).
 * Suporta estado de carregamento (desabilita + spinner). Não altera o
 * <Button /> compartilhado.
 */
function ActionButton({
  children,
  variant = "primary",
  type = "button",
  disabled = false,
  loading = false,
  fullWidth = false,
  className = "",
  ...props
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={["ab", `ab--${variant}`, fullWidth ? "ab--full" : "", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {loading && <Loader2 size={18} className="ab-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}

export default ActionButton;
