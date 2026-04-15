import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { CONTENT_TYPES, PHASES, PHASE_COLORS, calculateProgress, calculatePhaseProgress } from '../data/processData';
import {
  FileText,
  Target,
  Plus,
  Search,
  Upload,
  Download,
  LogOut,
  Trash2,
  Copy,
  Check,
} from '../components/Icons';

const typeIcons = {
  article: FileText,
  landing: Target,
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { projects, createProject, deleteProject, duplicateProject, exportData, importData } = useData();
  const { logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showNewModal, setShowNewModal] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectType, setNewProjectType] = useState('article');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const fileInputRef = useRef(null);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || project.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleCreateProject = () => {
    if (!newProjectTitle.trim()) return;
    const project = createProject({
      title: newProjectTitle.trim(),
      type: newProjectType,
    });
    setShowNewModal(false);
    setNewProjectTitle('');
    setNewProjectType('article');
    navigate(`/project/${project.id}`);
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = importData(event.target?.result);
      if (result.success) {
        alert(`${result.imported} projet(s) importé(s) avec succès`);
      } else {
        alert(`Erreur: ${result.error}`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleDelete = (id) => {
    deleteProject(id);
    setShowDeleteConfirm(null);
  };

  const getTypeLabel = (type) => CONTENT_TYPES.find(t => t.id === type)?.label || type;

  const getCurrentPhaseInfo = (project) => PHASES.find(p => p.id === project.currentPhase) || PHASES[0];

  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => calculateProgress(p) === 100).length;
  const avgProgress = totalProjects > 0
    ? Math.round(projects.reduce((sum, p) => sum + calculateProgress(p), 0) / totalProjects)
    : 0;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Header — editorial masthead */}
      <header
        className="sticky top-0 z-10"
        style={{
          backgroundColor: 'var(--color-bg)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-5 flex items-center justify-between">
          <div className="flex items-baseline gap-3">
            <span
              className="font-mono uppercase"
              style={{
                fontSize: 'var(--text-xs)',
                letterSpacing: '0.1em',
                color: 'var(--color-text-tertiary)',
              }}
            >
              azsakai
            </span>
            <span style={{ color: 'var(--color-border)' }}>/</span>
            <span
              className="font-mono"
              style={{
                fontSize: 'var(--text-xs)',
                letterSpacing: '0.04em',
                color: 'var(--color-text-secondary)',
              }}
            >
              Studio éditorial
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={exportData}
              className="flex items-center gap-2 px-3 py-2 transition-colors rounded-md"
              style={{ color: 'var(--color-text-secondary)' }}
              title="Exporter toutes les données"
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <Download size={16} />
              <span className="font-mono uppercase hidden sm:inline" style={{ fontSize: 'var(--text-xs)', letterSpacing: '0.06em' }}>Export</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-3 py-2 transition-colors rounded-md"
              style={{ color: 'var(--color-text-secondary)' }}
              title="Importer des données"
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <Upload size={16} />
              <span className="font-mono uppercase hidden sm:inline" style={{ fontSize: 'var(--text-xs)', letterSpacing: '0.06em' }}>Import</span>
            </button>
            <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
            <span className="mx-1" style={{ width: '1px', height: '20px', backgroundColor: 'var(--color-border)' }} />
            <button
              onClick={logout}
              className="p-2 rounded-md transition-colors"
              style={{ color: 'var(--color-text-secondary)' }}
              title="Déconnexion"
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main — editorial layout */}
      <main className="max-w-6xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
        {/* Masthead title */}
        <section className="mb-16 lg:mb-24 editorial-reveal">
          <p
            className="font-mono uppercase mb-4"
            style={{
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.1em',
              color: 'var(--color-text-tertiary)',
            }}
          >
            Tableau de bord
          </p>
          <h1
            className="font-display"
            style={{
              fontSize: 'var(--text-display)',
              lineHeight: 0.95,
              maxWidth: '16ch',
            }}
          >
            Vos contenus, <em style={{ color: 'var(--color-accent)' }}>en méthode</em>.
          </h1>
          <p className="font-lead mt-6" style={{ maxWidth: '48ch' }}>
            Chaque projet suit les neuf phases. Structurez avant d'écrire, mesurez après avoir publié.
          </p>
        </section>

        {/* Hero stats — editorial numbers */}
        {totalProjects > 0 && (
          <section
            className="grid grid-cols-3 gap-6 lg:gap-12 mb-20"
            style={{ borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', paddingTop: '2.5rem', paddingBottom: '2.5rem' }}
          >
            <StatBlock label="Projets" value={totalProjects} />
            <StatBlock label="Terminés" value={completedProjects} accent={completedProjects > 0} />
            <StatBlock label="Progression moy." value={`${avgProgress}%`} />
          </section>
        )}

        {/* Actions bar */}
        <section className="flex flex-col lg:flex-row gap-4 lg:items-center mb-12">
          <button
            onClick={() => setShowNewModal(true)}
            className="btn-primary flex items-center gap-2"
            style={{ padding: '0.75rem 1.5rem', fontSize: 'var(--text-base)' }}
          >
            <Plus size={16} />
            <span>Nouveau projet</span>
          </button>

          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-tertiary)' }} />
            <input
              type="text"
              placeholder="Rechercher un projet…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              style={{ paddingLeft: '2.25rem' }}
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="cursor-pointer font-mono uppercase"
            style={{ fontSize: 'var(--text-xs)', letterSpacing: '0.06em', paddingLeft: '0.875rem', paddingRight: '2rem' }}
          >
            <option value="all">Tous les types</option>
            {CONTENT_TYPES.map(type => (
              <option key={type.id} value={type.id}>{type.label}</option>
            ))}
          </select>
        </section>

        {/* Projects list — editorial entries */}
        {filteredProjects.length === 0 ? (
          <section className="py-24 text-center">
            <p
              className="font-display italic"
              style={{
                fontSize: 'var(--text-2xl)',
                color: 'var(--color-text-secondary)',
                maxWidth: '36ch',
                margin: '0 auto',
              }}
            >
              {projects.length === 0
                ? 'Aucun contenu au sommaire. Ouvrez le premier chapitre.'
                : 'Aucun projet ne correspond à votre recherche.'}
            </p>
          </section>
        ) : (
          <section className="space-y-0" style={{ borderTop: '1px solid var(--color-border)' }}>
            {filteredProjects.map(project => {
              const progress = calculateProgress(project);
              const currentPhase = getCurrentPhaseInfo(project);
              const phaseColor = PHASE_COLORS[currentPhase.id];
              const isCompleted = progress === 100;
              return (
                <article
                  key={project.id}
                  onClick={() => navigate(`/project/${project.id}`)}
                  className="group cursor-pointer relative hover:pl-3"
                  style={{
                    borderBottom: '1px solid var(--color-border)',
                    padding: '1.75rem 0',
                    transition: 'padding-left 250ms var(--ease)',
                  }}
                >
                  <div className="flex items-start gap-8">
                    {/* Phase number — display serif */}
                    <div className="flex-shrink-0 w-16 md:w-20">
                      <div
                        className="num-display"
                        style={{
                          fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                          color: isCompleted ? 'var(--color-success)' : phaseColor?.main,
                        }}
                      >
                        {String(currentPhase.number).padStart(2, '0')}
                      </div>
                    </div>

                    {/* Title + meta */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-3 flex-wrap">
                        <h3
                          className="font-display truncate"
                          style={{
                            fontSize: 'var(--text-2xl)',
                            lineHeight: 1.1,
                            color: 'var(--color-text)',
                          }}
                        >
                          {project.title}
                        </h3>
                        {isCompleted && (
                          <span
                            className="badge"
                            style={{
                              backgroundColor: 'var(--color-success-light)',
                              color: 'var(--color-success)',
                            }}
                          >
                            <Check size={10} /> Terminé
                          </span>
                        )}
                      </div>

                      <div
                        className="font-mono mt-2 flex items-center gap-3 flex-wrap"
                        style={{
                          fontSize: 'var(--text-xs)',
                          color: 'var(--color-text-tertiary)',
                          letterSpacing: '0.04em',
                        }}
                      >
                        <span className="uppercase">{getTypeLabel(project.type)}</span>
                        <span style={{ color: 'var(--color-border)' }}>·</span>
                        <span>
                          Phase {currentPhase.number} — {currentPhase.title}
                        </span>
                        <span style={{ color: 'var(--color-border)' }}>·</span>
                        <span>{new Date(project.updatedAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>

                    {/* Progress + actions */}
                    <div className="flex-shrink-0 flex items-center gap-6 self-center">
                      {/* Mini phase progression dots */}
                      <div className="hidden md:flex items-center gap-1">
                        {PHASES.map(phase => {
                          const pProgress = calculatePhaseProgress(project, phase);
                          const pColor = PHASE_COLORS[phase.id];
                          return (
                            <div
                              key={phase.id}
                              style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                backgroundColor: pProgress === 100 ? pColor.main : pProgress > 0 ? pColor.light : 'var(--color-bg-tertiary)',
                                border: pProgress > 0 && pProgress < 100 ? `1px solid ${pColor.main}` : '1px solid transparent',
                              }}
                              title={`${phase.title}: ${pProgress}%`}
                            />
                          );
                        })}
                      </div>

                      {/* Progress number + thin rule */}
                      <div className="text-right" style={{ minWidth: '80px' }}>
                        <div
                          className="num-display"
                          style={{
                            fontSize: 'var(--text-xl)',
                            color: isCompleted ? 'var(--color-success)' : 'var(--color-text)',
                          }}
                        >
                          {progress}%
                        </div>
                        <div
                          className="mt-2"
                          style={{
                            width: '72px',
                            height: '1px',
                            backgroundColor: 'var(--color-border)',
                            marginLeft: 'auto',
                            position: 'relative',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            className="progress-bar"
                            style={{
                              width: `${progress}%`,
                              height: '1px',
                              backgroundColor: isCompleted ? 'var(--color-success)' : 'var(--color-accent)',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                            }}
                          />
                        </div>
                      </div>

                      {/* Hover actions */}
                      <div
                        className="flex items-center gap-1 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => duplicateProject(project.id)}
                          className="p-2 rounded-md transition-colors"
                          style={{ color: 'var(--color-text-tertiary)' }}
                          title="Dupliquer"
                          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text)')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-tertiary)')}
                        >
                          <Copy size={16} />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(project.id)}
                          className="p-2 rounded-md transition-colors"
                          style={{ color: 'var(--color-text-tertiary)' }}
                          title="Supprimer"
                          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-error)')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-tertiary)')}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                </article>
              );
            })}
          </section>
        )}
      </main>

      {/* New Project Drawer — right side */}
      {showNewModal && (
        <>
          <div
            className="fixed inset-0 z-40 sidebar-overlay"
            style={{ backgroundColor: 'rgb(26 23 20 / 0.3)' }}
            onClick={() => setShowNewModal(false)}
          />
          <aside
            className="fixed top-0 right-0 h-full w-full max-w-md z-50 overflow-y-auto slide-panel"
            style={{
              backgroundColor: 'var(--color-bg)',
              borderLeft: '1px solid var(--color-border)',
              padding: '2.5rem 2rem',
            }}
          >
            <p
              className="font-mono uppercase mb-3"
              style={{
                fontSize: 'var(--text-xs)',
                letterSpacing: '0.1em',
                color: 'var(--color-text-tertiary)',
              }}
            >
              Nouveau
            </p>
            <h2 className="font-display mb-8" style={{ fontSize: 'var(--text-3xl)', lineHeight: 1 }}>
              Ouvrir un<br />chapitre.
            </h2>

            <div className="space-y-6">
              <div>
                <label
                  className="font-mono uppercase block mb-2"
                  style={{
                    fontSize: 'var(--text-xs)',
                    letterSpacing: '0.08em',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  Titre du projet
                </label>
                <input
                  type="text"
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  className="w-full"
                  placeholder="Ex: Guide SEO 2026"
                  autoFocus
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateProject()}
                />
              </div>

              <div>
                <label
                  className="font-mono uppercase block mb-3"
                  style={{
                    fontSize: 'var(--text-xs)',
                    letterSpacing: '0.08em',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  Type de contenu
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CONTENT_TYPES.map(type => {
                    const IconComponent = typeIcons[type.id] || FileText;
                    const isSelected = newProjectType === type.id;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setNewProjectType(type.id)}
                        className="p-4 text-left transition-all"
                        style={{
                          border: `1px solid ${isSelected ? 'var(--color-text)' : 'var(--color-border)'}`,
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: isSelected ? 'var(--color-bg-secondary)' : 'transparent',
                        }}
                      >
                        <IconComponent size={20} style={{ color: isSelected ? 'var(--color-accent)' : 'var(--color-text-tertiary)' }} />
                        <div
                          className="mt-3 font-display"
                          style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text)', lineHeight: 1 }}
                        >
                          {type.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-10 pt-6" style={{ borderTop: '1px solid var(--color-border)' }}>
              <button
                onClick={() => setShowNewModal(false)}
                className="flex-1 py-2.5 rounded-md transition-colors font-mono uppercase"
                style={{
                  fontSize: 'var(--text-xs)',
                  letterSpacing: '0.08em',
                  color: 'var(--color-text-secondary)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'transparent',
                }}
              >
                Annuler
              </button>
              <button
                onClick={handleCreateProject}
                disabled={!newProjectTitle.trim()}
                className="btn-primary flex-1"
              >
                Créer
              </button>
            </div>
          </aside>
        </>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sidebar-overlay"
          style={{ backgroundColor: 'rgb(26 23 20 / 0.3)' }}
          onClick={() => setShowDeleteConfirm(null)}
        >
          <div
            className="w-full max-w-sm fade-in"
            style={{
              backgroundColor: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <p
              className="font-mono uppercase mb-2"
              style={{
                fontSize: 'var(--text-xs)',
                letterSpacing: '0.1em',
                color: 'var(--color-error)',
              }}
            >
              Supprimer
            </p>
            <h3 className="font-display mb-3" style={{ fontSize: 'var(--text-2xl)', lineHeight: 1.1 }}>
              Ce chapitre,<br />définitivement ?
            </h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
              Cette action est irréversible. Toutes les données du projet seront perdues.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-md transition-colors font-mono uppercase"
                style={{
                  fontSize: 'var(--text-xs)',
                  letterSpacing: '0.08em',
                  color: 'var(--color-text-secondary)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'transparent',
                }}
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 py-2.5 rounded-md font-mono uppercase transition-colors"
                style={{
                  fontSize: 'var(--text-xs)',
                  letterSpacing: '0.08em',
                  backgroundColor: 'var(--color-error)',
                  color: 'var(--color-bg)',
                  border: 'none',
                }}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatBlock({ label, value, accent = false }) {
  return (
    <div>
      <p
        className="font-mono uppercase mb-3"
        style={{
          fontSize: 'var(--text-xs)',
          letterSpacing: '0.1em',
          color: 'var(--color-text-tertiary)',
        }}
      >
        {label}
      </p>
      <div
        className="num-display"
        style={{
          fontSize: 'clamp(3rem, 6vw, 5rem)',
          color: accent ? 'var(--color-accent)' : 'var(--color-text)',
        }}
      >
        {value}
      </div>
    </div>
  );
}
