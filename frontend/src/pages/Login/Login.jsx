import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import authService from "../../services/authService";
import { Eye, EyeOff } from "lucide-react";
import logoBranca from "../../assets/images/logo-branca-sem-fundo.png";
import logoAzul from "../../assets/images/logo-azul-com-fundo-branco.jpg";
import "./Login.css";

export default function Login() {
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Estados do formulário
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Estados de feedback
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Carregar e-mail salvo se "Lembrar-me" estiver ativo
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }

    // Verificar se há mensagem de sucesso vinda do cadastro
    if (location.state?.successMessage) {
      setSuccess(location.state.successMessage);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!email || !password) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      setLoading(false);
      return;
    }

    try {
      const data = await authService.login({ email, password, rememberMe });

      // Salvar token no contexto global
      authLogin(data.token);

      // Gerenciar a preferência de "Lembrar-me"
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      // Redirecionar para o perfil ou home
      navigate("/perfil");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "Falha ao realizar login. Verifique suas credenciais e tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Lado Esquerdo - Banner Decorativo */}
      <div className="login-banner">
        <div className="banner-logo-wrapper">
          <img src={logoBranca} alt="AcheAq Logo" className="banner-logo" />

          {/* Bolas decorativas acopladas ao círculo central (responsivo) */}
          <div className="decor-circle decor-1"></div>
          <div className="decor-circle decor-2"></div>
          <div className="decor-circle decor-3"></div>
          <div className="decor-circle decor-4"></div>
          <div className="decor-circle decor-5"></div>
          <div className="decor-circle decor-6"></div>
        </div>

        <div className="banner-text">
          <h1 className="banner-title">
            Conectando pessoas
            <span>aos seus pertences.</span>
          </h1>
          <p className="banner-subtitle">
            A plataforma de achados e perdidos para faculdades e escolas.
          </p>
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="login-form-area">
        <div className="login-card">
          <img src={logoAzul} alt="" className="card-logo-mini" />

          <div className="login-header">
            <h2 className="login-title">Entrar</h2>
            <p className="login-desc">
              Acesse sua conta para visualizar e gerenciar seus anúncios
            </p>
          </div>

          {error && (
            <div className="auth-alert auth-alert-error" role="alert">
              {error}
            </div>
          )}
          {success && (
            <div className="auth-alert auth-alert-success" role="status">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group-login">
              <label className="label-login" htmlFor="login-email">
                Email <span aria-hidden="true">*</span>
              </label>
              <input
                id="login-email"
                type="email"
                placeholder="seuemail@exemplo.com"
                className="input-login"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group-login">
              <label className="label-login" htmlFor="login-password">
                Senha <span aria-hidden="true">*</span>
              </label>
              <div className="input-wrapper">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Sua senha"
                  className="input-login"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="login-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                />
                Lembrar-me
              </label>
              <Link to="/recuperar-senha" className="forgot-password-link">
                Esqueci minha senha
              </Link>
            </div>

            <button
              type="submit"
              className="btn-login-submit"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="login-divider">ou</div>

          <div className="no-account-text">Ainda não possui uma conta?</div>

          <Link to="/cadastro" className="btn-login-register">
            Criar Conta
          </Link>
        </div>
      </div>
    </div>
  );
}
