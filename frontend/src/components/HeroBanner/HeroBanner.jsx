import "./HeroBanner.css";

function HeroBanner({
  title,
  subtitle,
  children,
  className = "",
  ...props
}) {
  return (
    <section
      className={`hero-banner-section ${className}`.trim()}
      aria-labelledby="hero-banner-title"
      {...props}
    >
      <div className="hero-banner-content">
        <h1 id="hero-banner-title" className="hero-title">
          {title}
        </h1>

        {subtitle && (
          <p className="hero-subtitle">
            {subtitle}
          </p>
        )}

        {children && (
          <div className="hero-children-wrapper">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}

export default HeroBanner;