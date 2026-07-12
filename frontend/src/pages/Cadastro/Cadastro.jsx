import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { Eye, EyeOff } from "lucide-react";
import logoImg from "../../assets/images/logo-azul-com-fundo-branco.jpg";
import PasswordStrength, { isPasswordStrong } from "../../components/PasswordStrength/PasswordStrength";
import "./Cadastro.css";

export default function Cadastro() {
  const navigate = useNavigate();

  // Estados dos campos do formulário
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [institution, setInstitution] = useState("");
  const [course, setCourse] = useState("");
  const [registration, setRegistration] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Estados de visibilidade de senha
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Estados de feedback e loading
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Máscara de Telefone (Filtra não-dígitos e formata como (XX) XXXXX-XXXX)
  const handlePhoneChange = (e) => {
    const rawValue = e.target.value;
    const cleanValue = rawValue.replace(/\D/g, "");

    let formattedValue = "";
    if (cleanValue.length > 0) {
      formattedValue = `(${cleanValue.substring(0, 2)}`;
      if (cleanValue.length > 2) {
        formattedValue += `) ${cleanValue.substring(2, 7)}`;
      }
      if (cleanValue.length > 7) {
        formattedValue += `-${cleanValue.substring(7, 11)}`;
      }
    }
    setPhone(formattedValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validações
    if (
      !name ||
      !email ||
      !phone ||
      !institution ||
      !course ||
      !registration ||
      !password ||
      !confirmPassword
    ) {
      setError("Todos os campos obrigatórios precisam ser preenchidos.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas informadas não coincidem.");
      return;
    }

    if (!isPasswordStrong(password)) {
      setError("A senha não atende a todos os requisitos.");
      return;
    }

    if (!termsAccepted) {
      setError("Você deve aceitar os Termos de Uso e Política de Privacidade.");
      return;
    }

    try {
      setLoading(true);

      await authService.register({
        name,
        email,
        phone,
        institution,
        course,
        registration,
        password,
      });

      // Redireciona para o login com mensagem de sucesso
      navigate("/login", {
        state: {
          successMessage: "Cadastro realizado com sucesso! Faça login para continuar.",
        },
      });
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "Falha ao realizar cadastro. Verifique os dados inseridos."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-card">
        <img src={logoImg} alt="" className="card-logo-cadastro" />

        <div className="cadastro-header">
          <h2 className="cadastro-title">Criar Conta</h2>
          <p className="cadastro-desc">
            Cadastre-se e faça parte da comunidade AcheAq.
          </p>
        </div>

        {error && (
          <div className="auth-alert auth-alert-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* SEÇÃO 1: Informações Pessoais */}
          <div className="cadastro-section">
            <h3 className="section-header section-blue">Informações Pessoais</h3>
            <div className="form-grid">
              <div className="form-group-cadastro grid-col-full">
                <label className="label-cadastro" htmlFor="cad-name">
                  Nome Completo <span aria-hidden="true">*</span>
                </label>
                <input
                  id="cad-name"
                  type="text"
                  placeholder="Seu nome completo"
                  className="input-cadastro"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  autoComplete="name"
                  required
                />
              </div>

              <div className="form-group-cadastro">
                <label className="label-cadastro" htmlFor="cad-email">
                  Email <span aria-hidden="true">*</span>
                </label>
                <input
                  id="cad-email"
                  type="email"
                  placeholder="seu@email.com"
                  className="input-cadastro"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="form-group-cadastro">
                <label className="label-cadastro" htmlFor="cad-phone">
                  Telefone <span aria-hidden="true">*</span>
                </label>
                <input
                  id="cad-phone"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  className="input-cadastro"
                  value={phone}
                  onChange={handlePhoneChange}
                  disabled={loading}
                  autoComplete="tel"
                  maxLength={15}
                  required
                />
              </div>
            </div>
          </div>

          {/* SEÇÃO 2: Informações Acadêmicas */}
          <div className="cadastro-section">
            <h3 className="section-header section-orange">Informações Acadêmicas</h3>
            <div className="form-grid">
              <div className="form-group-cadastro">
                <label className="label-cadastro" htmlFor="cad-institution">
                  Instituição de Ensino <span aria-hidden="true">*</span>
                </label>
                <input
                  id="cad-institution"
                  type="text"
                  placeholder="Ex: UFMG, UFAL, IFAL..."
                  className="input-cadastro"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  disabled={loading}
                  autoComplete="organization"
                  required
                />
              </div>

              <div className="form-group-cadastro">
                <label className="label-cadastro" htmlFor="cad-course">
                  Curso <span aria-hidden="true">*</span>
                </label>
                <input
                  id="cad-course"
                  type="text"
                  placeholder="Ex: Engenharia de Software"
                  className="input-cadastro"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="form-group-cadastro grid-col-full">
                <label className="label-cadastro" htmlFor="cad-registration">
                  Matrícula <span aria-hidden="true">*</span>
                </label>
                <input
                  id="cad-registration"
                  type="text"
                  placeholder="Número de Matrícula"
                  className="input-cadastro"
                  value={registration}
                  onChange={(e) => setRegistration(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>
          </div>

          {/* SEÇÃO 3: Segurança */}
          <div className="cadastro-section">
            <h3 className="section-header section-blue">Segurança</h3>
            <div className="form-grid">
              <div className="form-group-cadastro">
                <label className="label-cadastro" htmlFor="cad-password">
                  Senha <span aria-hidden="true">*</span>
                </label>
                <div className="input-wrapper">
                  <input
                    id="cad-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Senha forte"
                    className="input-cadastro"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    autoComplete="new-password"
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

              <div className="form-group-cadastro">
                <label className="label-cadastro" htmlFor="cad-confirm">
                  Confirmar Senha <span aria-hidden="true">*</span>
                </label>
                <div className="input-wrapper">
                  <input
                    id="cad-confirm"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Repita sua senha"
                    className="input-cadastro"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                    aria-label={
                      showConfirmPassword ? "Ocultar senha" : "Mostrar senha"
                    }
                    aria-pressed={showConfirmPassword}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="grid-col-full">
                <PasswordStrength password={password} confirmPassword={confirmPassword} />
              </div>
            </div>
          </div>

          {/* Checkbox de Aceite de Termos */}
          <label className="terms-agreement">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              disabled={loading}
            />
            <span>
              Li e aceito os <Link to="/termos">Termos de Uso</Link> e a{" "}
              <Link to="/privacidade">Política de Privacidade</Link>
            </span>
          </label>

          <button
            type="submit"
            className="btn-cadastro-submit"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? "Cadastrando..." : "Criar Conta"}
          </button>
        </form>

        <div className="cadastro-divider">ou</div>

        <div className="already-have-account">Já possui uma conta?</div>

        <Link to="/login" className="btn-cadastro-login">
          Entrar
        </Link>
      </div>
    </div>
  );
}
