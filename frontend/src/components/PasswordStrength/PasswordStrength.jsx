import { Check, Minus } from "lucide-react";
import "./PasswordStrength.css";

/**
 * Regras de força de senha (modal Alterar Senha / reset). Observação:
 * o backend só exige >= 6 caracteres; estas regras são validação de UX no front.
 */
export const PASSWORD_RULES = [
  { key: "length", label: "Pelo menos 8 caracteres", test: (v) => v.length >= 8 },
  { key: "upper", label: "Uma letra maiúscula", test: (v) => /[A-Z]/.test(v) },
  { key: "number", label: "Um número", test: (v) => /[0-9]/.test(v) },
  {
    key: "special",
    label: "Um caractere especial",
    test: (v) => /[^A-Za-z0-9]/.test(v),
  },
];

export function getPasswordChecks(password = "", confirmPassword = undefined) {
  const checks = PASSWORD_RULES.map((rule) => ({ ...rule, met: rule.test(password) }));
  if (confirmPassword !== undefined) {
    checks.push({
      key: "match",
      label: "As senhas coincidem",
      met: password.length > 0 && password === confirmPassword,
    });
  }
  return checks;
}

export function isPasswordStrong(password = "", confirmPassword = undefined) {
  const baseStrong = PASSWORD_RULES.every((rule) => rule.test(password));
  if (confirmPassword !== undefined) {
    return baseStrong && password.length > 0 && password === confirmPassword;
  }
  return baseStrong;
}

function PasswordStrength({ password = "", confirmPassword = undefined }) {
  const checks = getPasswordChecks(password, confirmPassword);

  return (
    <div className="pw" aria-live="polite">
      <p className="pw-title">Requisitos da senha</p>
      <ul className="pw-list">
        {checks.map((check) => (
          <li key={check.key} className={`pw-item ${check.met ? "pw-item--met" : ""}`}>
            <span className="pw-icon" aria-hidden="true">
              {check.met ? <Check size={12} /> : <Minus size={12} />}
            </span>
            <span>{check.label}</span>
            <span className="pw-sr">{check.met ? " (atendido)" : " (pendente)"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PasswordStrength;
