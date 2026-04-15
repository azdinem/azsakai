export default function SiteFooter() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--color-text)',
        backgroundColor: 'var(--color-bg)',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-8">
        <div
          className="flex items-baseline justify-between pb-4 mb-6"
          style={{ borderBottom: '1px solid var(--color-text)' }}
        >
          <span
            className="font-mono uppercase"
            style={{
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.1em',
              color: 'var(--color-text)',
            }}
          >
            Colophon
          </span>
          <span className="section-index">Z.01</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-6">
          {/* Signature */}
          <div>
            <p
              className="font-display"
              style={{
                fontSize: 'var(--text-md)',
                color: 'var(--color-text)',
                lineHeight: 1.1,
                textTransform: 'uppercase',
                fontWeight: 700,
                letterSpacing: '-0.01em',
              }}
            >
              Conçu par{' '}
              <a
                href="https://azdinemansour.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="link-editorial"
              >
                Azdine Mansour
              </a>
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
            {[
              { href: 'https://www.linkedin.com/in/azdine-mansour/', label: 'LinkedIn' },
              { href: 'https://newsletter.azdinemansour.fr/', label: 'Newsletter' },
              { href: 'https://azdinemansour.fr', label: 'Portfolio' },
              { href: 'https://claude.com/claude-code', label: 'Built with Claude Code ↗' },
            ].map(link => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono uppercase transition-colors"
                style={{
                  fontSize: 'var(--text-xs)',
                  letterSpacing: '0.08em',
                  color: 'var(--color-text)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text)')}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-6 pt-4" style={{ borderTop: '1px solid var(--color-border-light)' }}>
          <p
            className="font-mono"
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-tertiary)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            Azsakai · Issue 01 · {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
