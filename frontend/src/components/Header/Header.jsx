import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logoAcheAq from '../../assets/images/logo.png';
import { Bell, User, ChevronDown, Menu, X } from 'lucide-react';
import './Header.css';

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const closeMenu = () => { setMenuOpen(false); };

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

                        <li>
                            <NavLink
                                to="/"
                                onClick={closeMenu}
                            >
                                Início
                            </NavLink>
                        </li>


                        <li>
                            <NavLink
                                to="/objetos-perdidos"
                                onClick={closeMenu}
                            >
                                Objetos Perdidos
                            </NavLink>
                        </li>


                        <li>
                            <NavLink
                                to="/objetos-encontrados"
                                className={({ isActive }) =>
                                    isActive ? 'active-link' : ''
                                }
                            >
                                Objetos Encontrados
                            </NavLink>
                        </li>


                        <li>
                            <NavLink
                                to="/meus-anuncios"
                                className={({ isActive }) =>
                                    isActive ? 'active-link' : ''
                                }
                            >
                                Meus Anúncios
                            </NavLink>
                        </li>
                    </ul>
                </nav>


                <section
                    className="header-actions"
                    aria-label="Ações do usuário"
                >

                    <button
                        type="button"
                        className="notification-btn"
                        aria-label="Ver notificações, 0 não lidas"
                    >
                        <Bell size={20} />
                    </button>


                    <button
                        type="button"
                        className="user-profile-btn"
                        aria-label="Menu do usuário"
                    >

                        <span
                            className="user-avatar"
                            aria-hidden="true"
                        >
                            <User size={20} />
                        </span>


                        <span className="user-info">

                            <strong className="user-name">
                                Nome Usuário
                            </strong>

                            <small className="user-role">
                                Estudante
                            </small>

                        </span>


                        <ChevronDown
                            size={16}
                            color="#64748b"
                            aria-hidden="true"
                        />

                    </button>

                </section>


                <button
                    type="button"
                    className="menu-toggle"
                    aria-label={
                        menuOpen
                            ? "Fechar menu"
                            : "Abrir menu"
                    }
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen(!menuOpen)}
                >

                    {menuOpen
                        ? <X size={26} />
                        : <Menu size={26} />
                    }

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

                    <NavLink to="/">
                        Início
                    </NavLink>


                    <NavLink to="/objetos-perdidos">
                        Objetos Perdidos
                    </NavLink>


                    <NavLink to="/objetos-encontrados">
                        Objetos Encontrados
                    </NavLink>


                    <NavLink to="/meus-anuncios">
                        Meus Anúncios
                    </NavLink>


                    <NavLink to="/perfil">
                        Perfil
                    </NavLink>

                </nav>
            </>

        </>
    );
}

export default Header;