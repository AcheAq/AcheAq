import "./AuthLayout.css";

/**
 * Casca visual das telas de autenticação secundárias (Esqueci/Redefinir Senha):
 * fundo em gradiente lavanda/pêssego + grids de pontos decorativos, no mesmo
 * estilo das telas Login/Cadastro do colega. O conteúdo fica a cargo da página.
 */
function AuthLayout({ children, className = "" }) {
  return (
    <div className={`authl ${className}`.trim()}>
      <span className="authl-dots authl-dots--top" aria-hidden="true" />
      <span className="authl-dots authl-dots--bottom" aria-hidden="true" />
      {children}
    </div>
  );
}

export default AuthLayout;
