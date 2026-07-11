import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Check, Info } from "lucide-react";
import AuthLayout from "../../components/AuthLayout/AuthLayout";
import FormInput from "../../components/FormInput/FormInput";
import ActionButton from "../../components/ActionButton/ActionButton";
import authService from "../../services/authService";
import "./EsqueciSenha.css";

export default function EsqueciSenha() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function requestReset() {
    setError("");
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Não foi possível enviar o e-mail. Tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    requestReset();
  }

  if (sent) {
    return (
      <AuthLayout>
        <section className="fp-card fp-card--center">
          <span className="fp-icon fp-icon--success" aria-hidden="true">
            <Check size={28} />
          </span>
          <h1 className="fp-title">Email enviado</h1>
          <p className="fp-subtitle">
            Se existir uma conta vinculada ao e-mail informado, você receberá as
            instruções para redefinir sua senha.
          </p>
          <div className="fp-readonly">{email || "seu@email.com"}</div>
          <p className="fp-help">Use o e-mail que você utilizou no cadastro.</p>

          <div className="fp-info" role="status">
            <Info size={18} aria-hidden="true" />
            <span>
              Não recebeu o e-mail? Verifique sua pasta de spam ou aguarde alguns
              minutos antes de tentar novamente.
            </span>
          </div>

          <ActionButton
            variant="primary"
            fullWidth
            type="button"
            onClick={() => navigate("/login")}
          >
            Voltar ao Login
          </ActionButton>

          <button
            type="button"
            className="fp-resend"
            onClick={requestReset}
            disabled={loading}
          >
            Reenviar e-mail
          </button>
        </section>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <section className="fp-card">
        <span className="fp-icon" aria-hidden="true">
          <Lock size={26} />
        </span>
        <h1 className="fp-title">Esqueceu sua senha ?</h1>
        <p className="fp-subtitle">
          Informe seu e-mail cadastrado e enviaremos as instruções para redefinir
          sua senha.
        </p>

        <form className="fp-form" onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="fp-alert" role="alert">
              {error}
            </div>
          )}

          <FormInput
            label="Email"
            name="email"
            type="email"
            required
            placeholder="seu@email.com"
            autoComplete="email"
            helperText="Use o e-mail que você utilizou no cadastro."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <ActionButton
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
            disabled={!accepted}
          >
            Enviar Link de Recuperação
          </ActionButton>

          <label className="fp-terms">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
            />
            <span>
              Li e aceito os <a href="#termos">Termos de Uso</a> e a{" "}
              <a href="#privacidade">Política de Privacidade</a>
            </span>
          </label>
        </form>
      </section>
    </AuthLayout>
  );
}
