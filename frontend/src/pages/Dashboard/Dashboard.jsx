import React from 'react';
import styles from './Dashboard.module.css';
import { 
  Search, Bell, ChevronDown, Briefcase, Smartphone, Key, 
  FileText, CupSoda, BookOpen, Headphones, Grid, MapPin, Calendar, Clock,
  Instagram, Linkedin, Twitter 
} from 'lucide-react';

// Dados simulados para as categorias
const categorias = [
  { id: 1, name: 'Mochilas', icon: Briefcase, count: 24, active: true },
  { id: 2, name: 'Celulares', icon: Smartphone, count: 18 },
  { id: 3, name: 'Chaves', icon: Key, count: 31 },
  { id: 4, name: 'Documentos', icon: FileText, count: 31 },
  { id: 5, name: 'Garrafas', icon: CupSoda, count: 9 },
  { id: 6, name: 'Livros', icon: BookOpen, count: 27 },
  { id: 7, name: 'Fones', icon: Headphones, count: 16 },
  { id: 8, name: 'Outros', icon: Grid, count: 43 },
];

// Dados simulados para os objetos recentes
const objetos = [
  { id: 1, title: 'Bolsa Preta', status: 'Perdido', statusClass: styles.perdido, desc: 'Mochila preta com chaveiro branco. Contém canetas e documentos...', cat: 'Acessórios', loc: 'Biblioteca Central', date: '12 Jan 2025' },
  { id: 2, title: 'Bolsa Preta', status: 'Perdido', statusClass: styles.perdido, desc: 'Mochila preta com chaveiro branco. Contém canetas e documentos...', cat: 'Acessórios', loc: 'Biblioteca Central', date: '12 Jan 2025' },
  { id: 3, title: 'Bolsa Preta', status: 'Perdido', statusClass: styles.perdido, desc: 'Mochila preta com chaveiro branco. Contém canetas e documentos...', cat: 'Acessórios', loc: 'Biblioteca Central', date: '12 Jan 2025' },
  { id: 4, title: 'Bolsa Preta', status: 'Encontrado', statusClass: styles.encontrado, desc: 'Mochila preta com chaveiro branco. Contém canetas e documentos...', cat: 'Acessórios', loc: 'Biblioteca Central', date: '12 Jan 2025' },
  { id: 5, title: 'Bolsa Preta', status: 'Perdido', statusClass: styles.perdido, desc: 'Mochila preta com chaveiro branco. Contém canetas e documentos...', cat: 'Acessórios', loc: 'Biblioteca Central', date: '12 Jan 2025' },
  { id: 6, title: 'Bolsa Preta', status: 'Devolvido', statusClass: styles.devolvido, desc: 'Mochila preta com chaveiro branco. Contém canetas e documentos...', cat: 'Acessórios', loc: 'Biblioteca Central', date: '12 Jan 2025' },
];

function Dashboard() {
  return (
    <div className={styles.pageWrapper}>
      
      {/* HEADER LOGADO */}
      <header className={styles.header}>
        <div className={`${styles.container} ${styles.headerContent}`}>
          <div className={styles.logo}>
            <div className={styles.logoArea}>
              <div className={styles.logoBox}>A</div>
              <span className={styles.logoText}>Ache<span>Aq</span></span>
            </div>
          </div>
          <nav className={styles.nav}>
            <a href="#" className={styles.active}>Início</a>
            <a href="#">Objetos Perdidos</a>
            <a href="#">Objetos Encontrados</a>
            <a href="#">Meus Anúncios</a>
          </nav>
          <div className={styles.userActions}>
            <button className={styles.iconBtn}><Bell size={18} /></button>
            <div className={styles.profile}>
              <div className={styles.avatar}></div>
              <div className={styles.userInfo}>
                <span>Nome Usuário</span>
                <small>Estudante</small>
              </div>
              <ChevronDown size={14} />
            </div>
          </div>
        </div>
      </header>

      {/* HERO BANNER */}
      <section className={styles.hero}>
        <div className={`${styles.container} ${styles.heroContent}`}>
          <span className={styles.badge}>Plataforma de Achados e Perdidos</span>
          <h1>Perdeu ou encontrou algum objeto?</h1>
          <p>O AcheAq conecta pessoas para facilitar a devolução de objetos perdidos dentro da instituição.</p>
          
          <div className={styles.searchBox}>
            <Search size={20} color="#94A3B8" style={{marginLeft: 10}} />
            <input type="text" placeholder="Pesquise por um objeto..." />
            <button className={styles.searchBtn}>Buscar</button>
          </div>

          <div className={styles.heroBtns}>
            <button className={styles.btnHeroOrange}>Registrar objeto perdido</button>
            <button className={styles.btnHeroWhite}>Registrar objeto encontrado</button>
          </div>
        </div>
        <div className={styles.heroCircles}></div>
      </section>

      {/* CATEGORIAS */}
      <section className={styles.container}>
        <div className={styles.sectionTitle}>
          <div>
            <h2>Categorias</h2>
            <p>Filtre por tipo de objeto</p>
          </div>
          <a href="#" className={styles.verTodas}>Ver todas →</a>
        </div>

        <div className={styles.catGrid}>
          {categorias.map(cat => (
            <div key={cat.id} className={`${styles.catCard} ${cat.active ? styles.active : ''}`}>
              <cat.icon size={22} color={cat.active ? '#2B59C3' : '#64748B'} />
              <p>{cat.name}</p>
              <span>{cat.count}</span>
            </div>
          ))}
        </div>
      </section>

      {/* OBJETOS RECENTES */}
      <section className={styles.container}>
        <div className={styles.sectionTitle}>
          <div>
            <h2>Objetos Recentes</h2>
            <p>Últimos objetos registrados na plataforma</p>
          </div>
          <div style={{display: 'flex', gap: '15px'}}>
             <button className={styles.iconBtn} style={{fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px'}}>
                <Grid size={14} /> Filtrar
             </button>
             <a href="#" className={styles.verTodas}>Ver todos →</a>
          </div>
        </div>

        <div className={styles.objGrid}>
          {objetos.map(obj => (
            <div key={obj.id} className={styles.objCard}>
              <div className={styles.objImg}>
                 <img src="https://via.placeholder.com/300x200" alt={obj.title} />
              </div>
              <div className={styles.objContent}>
                <div className={styles.objTop}>
                  <h3>{obj.title}</h3>
                  <span className={`${styles.status} ${obj.statusClass}`}>{obj.status}</span>
                </div>
                <p className={styles.objDesc}>{obj.desc}</p>
                <div className={styles.objInfo}>
                  <span><Clock size={12} /> {obj.cat}</span>
                  <span><MapPin size={12} /> {obj.loc}</span>
                  <span><Calendar size={12} /> {obj.date}</span>
                </div>
                <button className={styles.btnDetalhes}>Ver detalhes</button>
              </div>
            </div>
          ))}
        </div>

        <button className={styles.carregarMais}>Carregar mais objetos</button>
      </section>

      {/* CTA FOOTER BANNER */}
      <section className={styles.container}>
        <div className={styles.ctaFooter}>
          <div className={styles.ctaText}>
            <h2>Encontrou algo? Registre agora!</h2>
            <p>Ajude alguém a recuperar seus pertences. Leva menos de 2 minutos.</p>
          </div>
          <div className={styles.ctaBtns}>
             <button className={styles.btnHeroOrange}>Objeto Perdido</button>
             <button className={styles.btnHeroWhite}>Objeto Encontrado</button>
          </div>
        </div>
      </section>

      {/* 💻 FOOTER ADICIONADO AQUI */}
      <footer id="contato" className={styles.footer}>
        <div className={`${styles.container} ${styles.footerGrid}`}>
          <div className={styles.footerBrand}>
            <div className={styles.logoArea}>
              <span className={styles.logoText}>AcheAq</span>
            </div>
            <p className={styles.footerText}>Plataforma gratuita de achados e perdidos para faculdades e escolas.</p>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialIcon}><Instagram size={20} /></a>
              <a href="#" className={styles.socialIcon}><Linkedin size={20} /></a>
              <a href="#" className={styles.socialIcon}><Twitter size={20} /></a>
            </div>
          </div>
          
          <div className={styles.footerColumn}>
            <h5>Plataforma</h5>
            <ul className={styles.footerLinks}>
              <li><a href="#">Início</a></li>
              <li><a href="#">Como funciona</a></li>
              <li><a href="#">Categorias</a></li>
              <li><a href="#">Criar conta</a></li>
            </ul>
          </div>
          
          <div className={styles.footerColumn}>
            <h5>Suporte</h5>
            <ul className={styles.footerLinks}>
              <li><a href="#">Contato</a></li>
              <li><a href="#">Política de Privacidade</a></li>
              <li><a href="#">Termos de Uso</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>
          
          <div className={styles.footerColumn}>
            <h5>Contato institucional</h5>
            <p className={styles.footerText}>Deseja o AcheAq na sua instituição? Entre em contato via suporte@acheaq.com.br</p>
          </div>
        </div>
        
        <div className={`${styles.container} ${styles.footerBottom}`}>
          © 2026 AcheAq. Todos os direitos reservados.
        </div>
      </footer>

    </div>
  );
}

export default Dashboard;