import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FileText, AlertCircle, Check, Target, LayoutTemplate, PenLine } from '../components/Icons';

const features = [
  { icon: Target, text: 'Processus SEO en 9 phases' },
  { icon: LayoutTemplate, text: 'Templates et checklists' },
  { icon: PenLine, text: 'Suivi de progression' },
  { icon: Check, text: 'Export Markdown' },
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

    if (!result.success) {
      setError(result.error);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12"
        style={{
          background: 'linear-gradient(135deg, var(--color-accent) 0%, #1e40af 50%, #7c3aed 100%)'
        }}
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <FileText size={28} className="text-white" />
            </div>
            <h1 className="text-[var(--text-2xl)] font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
              Content Process
            </h1>
          </div>
          <p className="text-white/80 text-[var(--text-lg)] mt-4 max-w-md">
            Votre assistant de création de contenu SEO optimisé, étape par étape.
          </p>
        </div>

        <div className="space-y-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <feature.icon size={20} className="text-white" />
              </div>
              <span className="text-white font-medium text-[var(--text-base)]">
                {feature.text}
              </span>
            </div>
          ))}
        </div>

        <p className="text-white/60 text-[var(--text-sm)]">
          Basé sur la méthodologie Thot SEO
        </p>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[var(--color-bg)]">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-dark)] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FileText size={32} className="text-white" />
            </div>
            <h1 className="text-[var(--text-2xl)] font-bold text-[var(--color-text)]" style={{ fontFamily: 'var(--font-heading)' }}>
              Content Process
            </h1>
            <p className="text-[var(--text-base)] text-[var(--color-text-secondary)] mt-2">
              Gestionnaire de contenu SEO
            </p>
          </div>

          {/* Desktop Title */}
          <div className="hidden lg:block mb-8">
            <h2 className="text-[var(--text-2xl)] font-bold text-[var(--color-text)]" style={{ fontFamily: 'var(--font-heading)' }}>
              Connexion
            </h2>
            <p className="text-[var(--text-base)] text-[var(--color-text-secondary)] mt-2">
              Entrez votre mot de passe pour accéder à l'application
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-[var(--text-sm)] font-semibold text-[var(--color-text)] mb-2"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-[var(--text-lg)]"
                placeholder="Entrez votre mot de passe"
                autoFocus
              />
            </div>

            {error && (
              <div className="p-4 bg-[var(--color-error-light)] border border-[var(--color-error)]/20 text-[var(--color-error)] rounded-xl text-[var(--text-sm)] flex items-center gap-3 fade-in">
                <div className="w-8 h-8 bg-[var(--color-error)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertCircle size={18} />
                </div>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full py-3.5 px-6 rounded-xl font-semibold text-[var(--text-base)] transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
              style={{
                background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%)',
                color: 'white',
                fontFamily: 'var(--font-heading)'
              }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Connexion en cours...
                </span>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          {/* Mobile Features */}
          <div className="lg:hidden mt-12 pt-8 border-t border-[var(--color-border)]">
            <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)] text-center mb-4">
              Fonctionnalités
            </p>
            <div className="grid grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 bg-[var(--color-bg-secondary)] rounded-xl"
                >
                  <feature.icon size={16} className="text-[var(--color-accent)]" />
                  <span className="text-[var(--text-xs)] text-[var(--color-text-secondary)]">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
