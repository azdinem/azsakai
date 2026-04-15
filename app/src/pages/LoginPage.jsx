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
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Left — editorial pitch */}
      <aside
        className="hidden lg:flex lg:w-[45%] flex-col justify-between px-14 py-12"
        style={{
          backgroundColor: 'var(--color-text)',
          color: 'var(--color-bg)',
        }}
      >
        <header className="flex items-center gap-2">
          <span
            className="font-mono uppercase"
            style={{
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.08em',
              color: 'var(--color-bg)',
              opacity: 0.6,
            }}
          >
            azsakai
          </span>
          <span className="opacity-40" style={{ color: 'var(--color-bg)' }}>·</span>
          <span
            className="font-mono"
            style={{
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.04em',
              color: 'var(--color-bg)',
              opacity: 0.6,
            }}
          >
            v1
          </span>
        </header>

        <div className="max-w-xl editorial-reveal">
          <h1
            className="font-display"
            style={{
              fontSize: 'var(--text-display)',
              lineHeight: 0.95,
              color: 'var(--color-bg)',
            }}
          >
            L'art éditorial<br />
            <em style={{ color: 'var(--color-accent)' }}>de la rédaction</em><br />
            qui plaît à Google<br />
            <span style={{ opacity: 0.6 }}>&amp; aux LLM.</span>
          </h1>

          <p
            className="font-lead mt-8"
            style={{ color: 'var(--color-bg)', opacity: 0.75, maxWidth: '38ch' }}
          >
            Une méthode en neuf phases pour structurer la création d'un contenu qui performe — du cadrage initial à la publication mesurée.
          </p>
        </div>

        <div className="space-y-1">
          <p
            className="font-mono uppercase mb-4"
            style={{
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.1em',
              color: 'var(--color-bg)',
              opacity: 0.5,
            }}
          >
            Le processus
          </p>
          <ol className="space-y-2">
            {PHASES_LIST.map((label, i) => (
              <li
                key={i}
                className="flex items-baseline gap-4 fade-in"
                style={{ animationDelay: `${0.08 * i}s` }}
              >
                <span
                  className="font-mono"
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-accent)',
                    minWidth: '2ch',
                  }}
                >
                  {String(i).padStart(2, '0')}
                </span>
                <span
                  className="font-display"
                  style={{
                    fontSize: 'var(--text-lg)',
                    color: 'var(--color-bg)',
                    opacity: 0.85,
                    lineHeight: 1.2,
                  }}
                >
                  {label}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </aside>

      {/* Right — login */}
      <main className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile brand mark */}
          <div className="lg:hidden mb-10">
            <p
              className="font-mono uppercase"
              style={{
                fontSize: 'var(--text-xs)',
                letterSpacing: '0.1em',
                color: 'var(--color-text-tertiary)',
              }}
            >
              azsakai
            </p>
            <h1
              className="font-display mt-3"
              style={{
                fontSize: 'clamp(2rem, 10vw, 3.5rem)',
                lineHeight: 0.95,
              }}
            >
              L'art éditorial<br />
              <em style={{ color: 'var(--color-accent)' }}>de la rédaction</em>
            </h1>
          </div>

          <div className="mb-10">
            <p
              className="font-mono uppercase mb-3"
              style={{
                fontSize: 'var(--text-xs)',
                letterSpacing: '0.1em',
                color: 'var(--color-text-tertiary)',
              }}
            >
              Accès
            </p>
            <h2
              className="font-display"
              style={{
                fontSize: 'var(--text-3xl)',
                lineHeight: 1,
              }}
            >
              Connexion à la<br />méthode.
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="password"
                className="font-mono uppercase block mb-2"
                style={{
                  fontSize: 'var(--text-xs)',
                  letterSpacing: '0.08em',
                  color: 'var(--color-text-secondary)',
                }}
              >
                Mot de passe
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
                  padding: '0.75rem 1rem',
                  backgroundColor: 'var(--color-error-light)',
                  border: '1px solid var(--color-error)',
                  borderLeftWidth: '3px',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--color-error)',
                  fontSize: 'var(--text-sm)',
                }}
              >
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !password}
              className="btn-primary w-full"
              style={{ padding: '0.75rem 1.25rem' }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Connexion…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>Entrer</span>
                  <span style={{ opacity: 0.6 }}>→</span>
                </span>
              )}
            </button>
          </form>

          {/* Mobile phase list — condensed */}
          <div className="lg:hidden mt-14 pt-8" style={{ borderTop: '1px solid var(--color-border)' }}>
            <p
              className="font-mono uppercase mb-4"
              style={{
                fontSize: 'var(--text-xs)',
                letterSpacing: '0.1em',
                color: 'var(--color-text-tertiary)',
              }}
            >
              Le processus — 9 phases
            </p>
            <ol className="space-y-1.5">
              {PHASES_LIST.map((label, i) => (
                <li key={i} className="flex items-baseline gap-3">
                  <span
                    className="font-mono"
                    style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--color-accent)',
                      minWidth: '2ch',
                    }}
                  >
                    {String(i).padStart(2, '0')}
                  </span>
                  <span
                    style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    {label}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
}
