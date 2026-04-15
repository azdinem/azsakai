export default function SiteFooter() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-bg)',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-8">
        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-6">
          {/* Signature */}
          <div>
            <p
              className="font-mono uppercase mb-2"
              style={{
                fontSize: 'var(--text-xs)',
                letterSpacing: '0.1em',
                color: 'var(--color-text-tertiary)',
              }}
            >
              Signature
            </p>
            <p
              className="font-display"
              style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text)', lineHeight: 1.2 }}
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
              .
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
            <a
              href="https://www.linkedin.com/in/azdine-mansour/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono uppercase transition-colors"
              style={{
                fontSize: 'var(--text-xs)',
                letterSpacing: '0.08em',
                color: 'var(--color-text-secondary)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
            >
              LinkedIn
            </a>
            <a
              href="https://newsletter.azdinemansour.fr/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono uppercase transition-colors"
              style={{
                fontSize: 'var(--text-xs)',
                letterSpacing: '0.08em',
                color: 'var(--color-text-secondary)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
            >
              Newsletter
            </a>
            <a
              href="https://azdinemansour.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono uppercase transition-colors"
              style={{
                fontSize: 'var(--text-xs)',
                letterSpacing: '0.08em',
                color: 'var(--color-text-secondary)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
            >
              Portfolio
            </a>
            <a
              href="https://claude.com/claude-code"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono uppercase transition-colors"
              style={{
                fontSize: 'var(--text-xs)',
                letterSpacing: '0.08em',
                color: 'var(--color-text-tertiary)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-tertiary)')}
            >
              Built with Claude Code ↗
            </a>
          </nav>
        </div>

        <p
          className="font-mono mt-6"
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-tertiary)',
            opacity: 0.7,
          }}
        >
          azsakai · v1 · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
