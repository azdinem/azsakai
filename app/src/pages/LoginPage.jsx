import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FileText, AlertCircle } from '../components/Icons';

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

    if (!result.success) {
      setError(result.error);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-secondary)]">
      <div className="bg-[var(--color-bg)] rounded-lg shadow-sm border border-[var(--color-border)] p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[var(--color-accent-light)] rounded-xl flex items-center justify-center mx-auto mb-4">
            <FileText size={24} className="text-[var(--color-accent)]" />
          </div>
          <h1 className="text-[var(--text-xl)] font-semibold text-[var(--color-text)]" style={{ fontFamily: 'var(--font-heading)' }}>
            Content Process
          </h1>
          <p className="text-[var(--text-base)] text-[var(--color-text-secondary)] mt-2">
            Gestionnaire de contenu SEO
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label
              htmlFor="password"
              className="block text-[var(--text-sm)] font-medium text-[var(--color-text)] mb-2"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
              placeholder="Entrez votre mot de passe"
              autoFocus
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-[var(--color-error-light)] text-[var(--color-error)] rounded-md text-[var(--text-sm)] flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !password}
            className="w-full py-2.5 px-4 bg-[var(--color-text)] text-white rounded-md font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-[var(--text-base)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}
