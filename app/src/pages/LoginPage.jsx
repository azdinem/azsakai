import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle } from '../components/Icons';

const PHASES_LIST = [
  'Cadrage Initial',
  'Définition du Scope',
  'Structuration Sémantique',
  'Préparation à la Rédaction',
  'Rédaction',
  'Mise en Page et Médias',
  'Relecture et Contrôle Qualité',
  'Maillage Interne',
  'Publication et Mesure',
];

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const result = await login(password);
    if (!result.success) setError(result.error);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Masthead */}
      <header
        className="flex items-baseline justify-between px-6 lg:px-10 py-4"
        style={{ borderBottom: '1px solid var(--color-text)' }}
      >
        <span
          className="font-display"
          style={{
            fontSize: 'var(--text-base)',
            fontWeight: 800,
            letterSpacing: '0.02em',
          }}
        >
          AZSAKAI
        </span>
        <span
          className="font-mono"
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text)',
          }}
        >
          Issue 01 / 2026
        </span>
      </header>

      <main className="max-w-6xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20">

          {/* LEFT — hero pitch */}
          <section className="editorial-reveal">
            <h1
              className="font-display"
              style={{
                fontSize: 'clamp(2.25rem, 5.5vw, 4.5rem)',
                lineHeight: 0.95,
                maxWidth: '14ch',
              }}
            >
              Une méthode pour<br />
              écrire du{' '}
              <span className="mark-accent">contenu</span>
              <br />
              qui dure.
            </h1>
            <p className="font-lead mt-8" style={{ maxWidth: '48ch' }}>
              Neuf phases. Une structure. Construit sur la doctrine Thot SEO pour servir à la fois Google et les LLMs. Sans esbroufe.
            </p>
          </section>

          {/* RIGHT — login + process */}
          <aside>
            {/* Login form */}
            <section
              style={{ border: '1px solid var(--color-text)' }}
            >
              <div
                className="flex items-baseline justify-between px-6 py-3"
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
                  Accès
                </span>
                <span className="section-index">A.01</span>
              </div>

              <div className="px-6 py-8">
                <h2
                  className="font-display"
                  style={{
                    fontSize: 'var(--text-2xl)',
                    lineHeight: 0.95,
                    marginBottom: '0.5rem',
                  }}
                >
                  Entrée.
                </h2>
                <p
                  style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-text-secondary)',
                    marginBottom: '2rem',
                  }}
                >
                  Saisir le mot de passe pour accéder à la méthode.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="password"
                      className="font-mono uppercase block mb-2"
                      style={{
                        fontSize: 'var(--text-xs)',
                        letterSpacing: '0.1em',
                        color: 'var(--color-text)',
                      }}
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full"
                      placeholder="••••••••••"
                      autoFocus
                    />
                  </div>

                  {error && (
                    <div
                      className="flex items-start gap-3 fade-in"
                      style={{
                        padding: '0.5rem 0.75rem',
                        border: '1px solid var(--color-accent)',
                        borderLeftWidth: '3px',
                        color: 'var(--color-accent)',
                        fontSize: 'var(--text-sm)',
                      }}
                    >
                      <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading || !password}
                    className="btn-primary w-full"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Connexion…
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <span>Enter</span>
                        <span>→</span>
                      </span>
                    )}
                  </button>
                </form>
              </div>
            </section>

            {/* Process list — under login */}
            <section
              className="mt-8"
              style={{ border: '1px solid var(--color-text)' }}
            >
              <div
                className="flex items-baseline justify-between px-6 py-3"
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
                  Le processus — 9 phases
                </span>
                <span className="section-index">A.02</span>
              </div>

              <ol>
                {PHASES_LIST.map((label, i) => (
                  <li
                    key={i}
                    className="flex items-baseline gap-4 px-6 py-2.5 fade-in"
                    style={{
                      borderBottom: i < PHASES_LIST.length - 1 ? '1px solid var(--color-text)' : 'none',
                      animationDelay: `${0.04 * i}s`,
                    }}
                  >
                    <span
                      className="font-mono"
                      style={{
                        fontSize: 'var(--text-xs)',
                        color: 'var(--color-text-tertiary)',
                        minWidth: '2ch',
                      }}
                    >
                      {String(i).padStart(2, '0')}
                    </span>
                    <span
                      className="font-display"
                      style={{
                        fontSize: 'var(--text-sm)',
                        fontWeight: 700,
                        color: 'var(--color-text)',
                        lineHeight: 1.1,
                      }}
                    >
                      {label}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
