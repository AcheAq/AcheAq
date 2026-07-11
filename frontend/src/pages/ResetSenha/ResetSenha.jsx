import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Lock, Check } from "lucide-react";
import AuthLayout from "../../components/AuthLayout/AuthLayout";
import FormInput from "../../components/FormInput/FormInput";
import ActionButton from "../../components/ActionButton/ActionButton";
import PasswordStrength, {
  isPasswordStrong,
} from "../../components/PasswordStrength/PasswordStrength";
import authService from "../../services/authService";
import "./ResetSenha.css";

export default function ResetSenha() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setApiError("");

    const next = {};
    if (!isPasswordStrong(password))
      next.password = "A senha não atende a todos os requisitos.";
    if (confirm !== password) next.confirm = "As senhas não coincidem.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    try {
      await authService.resetPassword({ token, password });
      setDone(true);
    } catch (err) {
      setApiError(
        err.response?.data?.message ||
          "Não foi possível redefinir a senha. O link pode ter expirado.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <AuthLayout>
        <section className="rp-card rp-card--center">
          <h1 className="rp-title">Link inválido</h1>
          <p className="rp-subtitle">
            O link de redefinição está incompleto ou expirou. Solicite um novo.
          </p>
          <ActionButton
            variant="primary"
            fullWidth
            type="button"
            onClick={() => navigate("/recuperar-senha")}
          >
            Solicitar novo link
          </ActionButton>
        </section>
      </AuthLayout>
    );
  }

  if (done) {
    return (
      <AuthLayout>
        <section className="rp-card rp-card--center">
          <span className="rp-icon rp-icon--success" aria-hidden="true">
            <Check size={28} />
          </span>
          <h1 className="rp-title">Senha redefinida</h1>
          <p className="rp-subtitle">
            Sua senha foi atualizada com sucesso. Use a nova senha para entrar.
          </p>
          <ActionButton
            variant="primary"
            fullWidth
            type="button"
            onClick={() => navigate("/login")}
          >
            Voltar ao Login
          </ActionButton>
        </section>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <section className="rp-card">
        <span className="rp-icon" aria-hidden="true">
          <Lock size={26} />
        </span>
        <h1 className="rp-title">Redefinir senha</h1>
        <p className="rp-subtitle">Escolha uma nova senha forte para sua conta.</p>

        <form className="rp-form" onSubmit={handleSubmit} noValidate>
          {apiError && (
            <div className="rp-alert" role="alert">
              {apiError}
            </div>
          )}

          <FormInput
            label="Nova Senha"
            name="password"
            type="password"
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />

          <PasswordStrength password={password} />

          <FormInput
            label="Confirmar nova senha"
            name="confirm"
            type="password"
            required
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            error={errors.confirm}
          />

          <ActionButton type="submit" variant="primary" fullWidth loading={loading}>
            Salvar nova senha
          </ActionButton>
        </form>
      </section>
    </AuthLayout>
  );
}
