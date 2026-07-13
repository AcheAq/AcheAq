import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';
import { 
  Search, Briefcase, Smartphone, Key, FileText, 
  BookOpen, CupSoda, Headphones, Grid, Instagram, 
  Linkedin, Twitter 
} from 'lucide-react';

function Home() {
  const navigate = useNavigate();

  return (
    <div className={styles.pageWrapper}>

      {/* HERO SECTION */}
      <section id="inicio" className={`${styles.container} ${styles.hero}`}>
        <div className={styles.heroLeft}>
          <span className={styles.badge}>
            🔹 Plataforma gratuita para instituições de ensino
          </span>
          <h1 className={styles.heroTitle}>
            Perdeu ou achou algum objeto? 
            <span> O AcheAq ajuda você a reencontrá-lo.</span>
          </h1>
          <p className={styles.heroDesc}>
            Uma plataforma desenvolvida para conectar pessoas e facilitar a 
            devolução de objetos perdidos dentro de instituições de ensino.
          </p>
          <div className={styles.heroButtons}>
            <button 
              className={styles.btnPrimary}
              onClick={() => navigate('/cadastro')}
            >
              Criar Conta
            </button>
            <button 
              className={styles.btnOutline}
              onClick={() => navigate('/login')}
            >
              Entrar
            </button>
          </div>
        </div>

        <div className={styles.heroRight}>
          <div className={styles.visualCircle}>
            <div className={`${styles.mockTag} ${styles.tag1}`}>🔑 Chave de casa</div>
            <div className={`${styles.mockTag} ${styles.tag2}`}>📱 iPhone 14</div>
            <div className={`${styles.mockTag} ${styles.tag3}`}>🎒 Mochila Preta</div>
            <div className={`${styles.mockTag} ${styles.tag4}`}>📘 Caderno de Cálculo</div>
            <div className={styles.mockSearch}>
              <Search size={16} />
              Encontrar objeto...
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className={styles.sectionGray}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Simples e Rápido</span>
            <h2 className={styles.sectionTitle}>Como funciona?</h2>
            <p className={styles.sectionSubtitle}>
              Em apenas 3 passos você já consegue ajudar ou ser ajudado.
            </p>
          </div>

          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>1</div>
              <h3 className={styles.cardTitle}>Pesquise</h3>
              <p className={styles.cardDesc}>
                Procure objetos perdidos utilizando filtros de categoria,
                localização e data.
              </p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>2</div>
              <h3 className={styles.cardTitle}>Publique</h3>
              <p className={styles.cardDesc}>
                Perdeu ou encontrou algo? Crie um anúncio rapidamente.
              </p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>3</div>
              <h3 className={styles.cardTitle}>Encontre</h3>
              <p className={styles.cardDesc}>
                Entre em contato e facilite a devolução do objeto.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section id="sobre" className={styles.sectionWhite}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Explore por tipo</span>
            <h2 className={styles.sectionTitle}>Categorias de objetos</h2>
            <p className={styles.sectionSubtitle}>
              Encontre rapidamente o que você está buscando.
            </p>
          </div>

          <div className={styles.categoriesGrid}>
            {[
              { name:'Mochilas', query:'Mochilas', icon:Briefcase },
              { name:'Celulares', query:'Celulares', icon:Smartphone },
              { name:'Chaves', query:'Chaves', icon:Key },
              { name:'Documentos', query:'Documentos', icon:FileText },
              { name:'Livros', query:'Livros', icon:BookOpen },
              { name:'Garrafas', query:'Garrafas', icon:CupSoda },
              { name:'Fones', query:'Fones', icon:Headphones },
              { name:'Outros', query:'Outros', icon:Grid }
            ].map((cat, index) => {
              const IconComponent = cat.icon;
              return (
                <div
                  key={index}
                  className={styles.categoryItem}
                  onClick={() => navigate(`/objetos-encontrados?categoria=${cat.query}`)}
                >
                  <div className={styles.categoryIconBox}>
                    <IconComponent size={20}/>
                  </div>
                  <span className={styles.categoryName}>{cat.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className={styles.sectionGray}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Por que usar o AcheAq?</span>
            <h2 className={styles.sectionTitle}>Tudo o que você precisa em um só lugar</h2>
          </div>

          <div className={styles.featuresGrid}>
            {[
              {
                title:"Interface simples e intuitiva",
                desc:"Navegação clara e objetiva para qualquer usuário."
              },
              {
                title:"Busca rápida por objetos",
                desc:"Filtros por categoria, data e localização."
              },
              {
                title:"Ambiente seguro",
                desc:"Maior confiança para devoluções dentro da instituição."
              },
              {
                title:"Organização completa",
                desc:"Gerencie anúncios perdidos e encontrados."
              }
            ].map((item, idx) => (
              <div key={idx} className={styles.featureCard}>
                <h4 
                  className={styles.cardTitle}
                  style={{ fontSize:'1rem', marginBottom:'0.25rem' }}
                >
                  {item.title}
                </h4>
                <p className={styles.cardDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`${styles.container} ${styles.ctaSection}`}>
        <div className={styles.ctaBanner}>
          <div className={styles.ctaInfo}>
            <h3>Ajude a conectar pessoas aos seus pertences.</h3>
            <p>Cadastre-se gratuitamente e utilize o AcheAq.</p>
          </div>
          <div className={styles.ctaAction}>
            <button 
              className={styles.btnPrimary}
              onClick={() => navigate('/cadastro')}
            >
              Criar Conta
            </button>
            <p className={styles.ctaSubtext}>Grátis, sem necessidade de cartão.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contato" className={styles.footer}>
        <div className={`${styles.container} ${styles.footerGrid}`}>
          <div className={styles.footerBrand}>
            <div className={styles.logoArea}>
              <span className={styles.logoText}>AcheAq</span>
            </div>
            <p className={styles.footerText}>
              Plataforma gratuita de achados e perdidos para faculdades e escolas.
            </p>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialIcon}><Instagram size={20}/></a>
              <a href="#" className={styles.socialIcon}><Linkedin size={20}/></a>
              <a href="#" className={styles.socialIcon}><Twitter size={20}/></a>
            </div>
          </div>

          <div className={styles.footerColumn}>
            <h5>Plataforma</h5>
            <ul className={styles.footerLinks}>
              <li>Início</li>
              <li>Como funciona</li>
              <li>Categorias</li>
              <li onClick={() => navigate('/cadastro')}>Criar conta</li>
            </ul>
          </div>

          <div className={styles.footerColumn}>
            <h5>Suporte</h5>
            <ul className={styles.footerLinks}>
              <li>Contato</li>
              <li>Política de Privacidade</li>
              <li>Termos de Uso</li>
              <li>FAQ</li>
            </ul>
          </div>

          <div className={styles.footerColumn}>
            <h5>Contato institucional</h5>
            <p className={styles.footerText}>
              Deseja o AcheAq na sua instituição? Entre em contato via suporte@acheaq.com.br
            </p>
          </div>
        </div>

        <div className={`${styles.container} ${styles.footerBottom}`}>
          © 2026 AcheAq. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}

export default Home;