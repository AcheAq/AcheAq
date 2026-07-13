import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import logoAcheAq from '../../assets/images/logo-azul-com-fundo-branco.jpg';
import { Bell, User, ChevronDown, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../Toast/ToastProvider';
import { imageUrl } from '../../utils/imageUrl';
import './Header.css';

function Header() {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const closeMenu = () => { setMenuOpen(false); };

    // Fecha o dropdown se clicar fora dele
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        logout();
        setDropdownOpen(false);
        closeMenu();
        navigate("/login");
    };

    return (
        <>
            <header
                className="main-header"
                aria-label="Cabeçalho principal do sistema"
            >
                <Link to="/" className="header-logo-link">
                    <img
                        src={logoAcheAq}
                        alt="Logo do sistema AcheAq"
                        className="header-logo-img"
                    />
                </Link>

                <nav
                    className="header-nav"
                    aria-label="Navegação principal"
                >
                    <ul>
                        <NavLink
                            to="/"
                            className={({ isActive }) => isActive ? 'active-link' : ''}
                            end
                            onClick={closeMenu}
                        >
                            Início
                        </NavLink>
                        <li>
                            <NavLink
                                to="/objetos-perdidos"
                                className={({ isActive }) => isActive ? 'active-link' : ''}
                                onClick={closeMenu}
                            >
                                Objetos Perdidos
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/objetos-encontrados"
                                className={({ isActive }) => isActive ? 'active-link' : ''}
                                onClick={closeMenu}
                            >
                                Objetos Encontrados
                            </NavLink>
                        </li>
                        {isAuthenticated && (
                            <li>
                                <NavLink
                                    to="/meus-anuncios"
                                    className={({ isActive }) => isActive ? 'active-link' : ''}
                                    onClick={closeMenu}
                                >
                                    Meus Anúncios
                                </NavLink>
                            </li>
                        )}
                        <li>
                            <NavLink
                                to="/sobre"
                                className={({ isActive }) => isActive ? 'active-link' : ''}
                                onClick={closeMenu}
                            >
                                Sobre
                            </NavLink>
                        </li>
                    </ul>
                </nav>

                <section
                    className="header-actions"
                    aria-label="Ações do usuário"
                >
                    {isAuthenticated ? (
                        <>
                            <button
                                type="button"
                                className="notification-btn"
                                aria-label="Ver notificações, 0 não lidas"
                                onClick={() => toast.info("Funcionalidade em desenvolvimento. Estamos trabalhando nisso!")}
                            >
                                <Bell size={20} color="#426ABC" />
                            </button>

                            <div className="user-menu-container" ref={dropdownRef}>
                                <button
                                    type="button"
                                    className="user-profile-btn"
                                    aria-label="Menu do usuário"
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                >
                                    <span className="user-avatar" aria-hidden="true">
                                        {user?.photoUrl ? (
                                            <img src={imageUrl(user.photoUrl)} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                        ) : (
                                            <User size={20} color="#888888" />
                                        )}
                                    </span>

                                    <span className="user-info">
                                        <strong className="user-name">
                                            {user?.name || "Usuário"}
                                        </strong>
                                        <small className="user-role">
                                            {user?.role === "ADMIN" ? "Administrador" : "Estudante"}
                                        </small>
                                    </span>

                                    <ChevronDown
                                        size={20}
                                        color="#3557A1"
                                        aria-hidden="true"
                                    />
                                </button>

                                {dropdownOpen && (
                                    <div className="user-dropdown animate-fade-in">
                                        {user?.role === "ADMIN" && (
                                            <Link to="/admin/dashboard" className="user-dropdown-item" onClick={() => setDropdownOpen(false)}>
                                                Dashboard
                                            </Link>
                                        )}
                                        <Link to="/perfil" className="user-dropdown-item" onClick={() => setDropdownOpen(false)}>
                                            Meu Perfil
                                        </Link>
                                        <button onClick={handleLogout} className="user-dropdown-item logout">
                                            Sair
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn-header-login">
                                Entrar
                            </Link>
                            <Link to="/cadastro" className="btn-header-register">
                                Criar Conta
                            </Link>
                        </>
                    )}
                </section>

                <button
                    type="button"
                    className="menu-toggle"
                    aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <X size={26} /> : <Menu size={26} />}
                </button>
            </header>

            <>
                <div
                    className={`mobile-overlay ${menuOpen ? 'active' : ''}`}
                    onClick={() => setMenuOpen(false)}
                />

                <nav
                    className={`mobile-menu ${menuOpen ? 'active' : ''}`}
                    aria-label="Menu de navegação mobile"
                >
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) => isActive ? 'active-link' : ''}
                        onClick={closeMenu}
                    >
                        Início
                    </NavLink>

                    <NavLink to="/objetos-perdidos" onClick={closeMenu}>
                        Objetos Perdidos
                    </NavLink>

                    <NavLink to="/objetos-encontrados" onClick={closeMenu}>
                        Objetos Encontrados
                    </NavLink>

                    <NavLink to="/sobre" onClick={closeMenu}>
                        Sobre
                    </NavLink>

                    {isAuthenticated ? (
                        <>
                            <NavLink to="/meus-anuncios" onClick={closeMenu}>
                                Meus Anúncios
                            </NavLink>
                            {user?.role === "ADMIN" && (
                                <NavLink to="/admin/dashboard" onClick={closeMenu}>
                                    Dashboard
                                </NavLink>
                            )}
                            <NavLink to="/perfil" onClick={closeMenu}>
                                Perfil
                            </NavLink>
                            <button
                                onClick={handleLogout}
                                className="user-dropdown-item logout"
                                style={{ margin: '16px', width: 'calc(100% - 32px)', textAlign: 'center' }}
                            >
                                Sair
                            </button>
                        </>
                    ) : (
                        <NavLink to="/login" onClick={closeMenu}>
                            Entrar / Criar Conta
                        </NavLink>
                    )}
                </nav>
            </>
        </>
    );
}

export default Header;