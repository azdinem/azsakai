import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { CONTENT_TYPES, PHASES, calculateProgress, calculatePhaseProgress } from '../data/processData';
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

  const iconHoverOn = (e) => (e.currentTarget.style.color = 'var(--color-accent)');
  const iconHoverOff = (e) => (e.currentTarget.style.color = 'var(--color-text)');

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Masthead */}
      <header
        className="sticky top-0 z-10"
        style={{
          backgroundColor: 'var(--color-bg)',
          borderBottom: '1px solid var(--color-text)',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-4 flex items-baseline justify-between">
          <div className="flex items-baseline gap-4">
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
                color: 'var(--color-text-secondary)',
              }}
            >
              / Dashboard
            </span>
          </div>
          <div className="flex items-center">
            <button
              onClick={exportData}
              className="flex items-center gap-2 px-3 py-2 transition-colors"
              style={{ color: 'var(--color-text)' }}
              title="Exporter toutes les données"
              onMouseEnter={iconHoverOn}
              onMouseLeave={iconHoverOff}
            >
              <Download size={14} />
              <span className="font-mono uppercase hidden sm:inline" style={{ fontSize: 'var(--text-xs)', letterSpacing: '0.08em' }}>Export</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-3 py-2 transition-colors"
              style={{ color: 'var(--color-text)' }}
              title="Importer des données"
              onMouseEnter={iconHoverOn}
              onMouseLeave={iconHoverOff}
            >
              <Upload size={14} />
              <span className="font-mono uppercase hidden sm:inline" style={{ fontSize: 'var(--text-xs)', letterSpacing: '0.08em' }}>Import</span>
            </button>
            <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
            <span style={{ width: '1px', height: '16px', backgroundColor: 'var(--color-text)', margin: '0 0.5rem' }} />
            <button
              onClick={logout}
              className="p-2 transition-colors"
              style={{ color: 'var(--color-text)' }}
              title="Déconnexion"
              onMouseEnter={iconHoverOn}
              onMouseLeave={iconHoverOff}
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
        {/* Hero masthead */}
        <section className="mb-16 lg:mb-24 editorial-reveal">
          <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8 lg:gap-16 items-end">
            <div
              className="num-display"
              style={{
                fontSize: 'clamp(4rem, 10vw, 10rem)',
                color: 'var(--color-text)',
              }}
            >
              00
              <sup
                style={{
                  fontSize: '0.3em',
                  verticalAlign: 'top',
                  color: 'var(--color-accent)',
                  fontWeight: 500,
                  marginLeft: '0.04em',
                }}
              >
                ●
              </sup>
            </div>
            <div>
              <h1
                className="font-display"
                style={{
                  fontSize: 'clamp(2rem, 5vw, 4rem)',
                  lineHeight: 0.95,
                  maxWidth: '16ch',
                }}
              >
                Vos contenus,<br />
                en <span className="mark-accent">méthode</span>.
              </h1>
              <p className="font-lead mt-6" style={{ maxWidth: '52ch' }}>
                Chaque projet suit les neuf phases. Structurez avant d'écrire, mesurez après avoir publié.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        {totalProjects > 0 && (
          <section
            className="mb-20"
            style={{
              borderTop: '1px solid var(--color-text)',
              borderBottom: '1px solid var(--color-text)',
            }}
          >
            <div
              className="grid grid-cols-3"
              style={{ divide: '1px solid var(--color-text)' }}
            >
              <StatBlock label="Projets" value={totalProjects} index="A.01" />
              <StatBlock
                label="Terminés"
                value={completedProjects}
                accent={completedProjects > 0}
                index="A.02"
                withBorder
              />
              <StatBlock label="Progression moy." value={`${avgProgress}%`} index="A.03" withBorder />
            </div>
          </section>
        )}

        {/* Actions section */}
        <section
          className="mb-0"
          style={{ borderBottom: '1px solid var(--color-text)' }}
        >
          <div className="flex items-baseline justify-between pb-4 mb-0">
            <span
              className="font-mono uppercase"
              style={{
                fontSize: 'var(--text-xs)',
                letterSpacing: '0.08em',
              }}
            >
              Sommaire des projets
            </span>
            <span className="section-index">B.01</span>
          </div>
        </section>

        <section className="flex flex-col lg:flex-row gap-4 lg:items-center py-6">
          <button
            onClick={() => setShowNewModal(true)}
            className="btn-primary flex items-center gap-2 justify-center"
          >
            <Plus size={14} />
            <span>Nouveau</span>
          </button>

          <div className="flex-1 relative">
            <Search size={14} className="absolute left-0 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-tertiary)' }} />
            <input
              type="text"
              placeholder="Rechercher…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              style={{ paddingLeft: '1.5rem' }}
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="cursor-pointer font-mono uppercase"
            style={{ fontSize: 'var(--text-xs)', letterSpacing: '0.08em' }}
          >
            <option value="all">Tous les types</option>
            {CONTENT_TYPES.map(type => (
              <option key={type.id} value={type.id}>{type.label}</option>
            ))}
          </select>
        </section>

        {/* Entries */}
        {filteredProjects.length === 0 ? (
          <section
            className="py-24 text-center"
            style={{ borderTop: '1px solid var(--color-text)' }}
          >
            <p
              className="font-display"
              style={{
                fontSize: 'var(--text-xl)',
                color: 'var(--color-text-secondary)',
                maxWidth: '36ch',
                margin: '0 auto',
                textTransform: 'uppercase',
              }}
            >
              {projects.length === 0
                ? 'Aucun contenu au sommaire.'
                : 'Aucun projet ne correspond.'}
            </p>
          </section>
        ) : (
          <section style={{ borderTop: '1px solid var(--color-text)' }}>
            {filteredProjects.map((project) => {
              const progress = calculateProgress(project);
              const currentPhase = getCurrentPhaseInfo(project);
              const isCompleted = progress === 100;
              return (
                <article
                  key={project.id}
                  onClick={() => navigate(`/project/${project.id}`)}
                  className="group cursor-pointer"
                  style={{
                    borderBottom: '1px solid var(--color-text)',
                    padding: '1.75rem 0',
                    transition: 'background var(--duration-fast) var(--ease)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div className="flex items-start gap-6 lg:gap-10 px-3">
                    {/* Phase number — Archivo 800 XXL */}
                    <div className="flex-shrink-0 w-16 md:w-24">
                      <div
                        className="num-display"
                        style={{
                          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                          color: isCompleted ? 'var(--color-accent)' : 'var(--color-text)',
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
                          title={project.title}
                          style={{
                            fontSize: 'var(--text-xl)',
                            lineHeight: 0.95,
                            color: 'var(--color-text)',
                          }}
                        >
                          {project.title}
                        </h3>
                        {isCompleted && (
                          <span
                            className="badge"
                            style={{
                              backgroundColor: 'var(--color-accent)',
                              color: 'var(--color-bg)',
                              borderColor: 'var(--color-accent)',
                            }}
                          >
                            ★ Terminé
                          </span>
                        )}
                      </div>

                      <div
                        className="font-mono mt-2 flex items-center gap-3 flex-wrap"
                        style={{
                          fontSize: 'var(--text-xs)',
                          color: 'var(--color-text-secondary)',
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                        }}
                      >
                        <span>{getTypeLabel(project.type)}</span>
                        <span style={{ color: 'var(--color-text-tertiary)' }}>/</span>
                        <span>Phase {currentPhase.number} · {currentPhase.title}</span>
                        <span style={{ color: 'var(--color-text-tertiary)' }}>/</span>
                        <span>{new Date(project.updatedAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>

                    {/* Progress + actions */}
                    <div className="flex-shrink-0 flex items-center gap-6 self-center">
                      {/* Mini phase dots */}
                      <div className="hidden md:flex items-center gap-1">
                        {PHASES.map(phase => {
                          const pProgress = calculatePhaseProgress(project, phase);
                          return (
                            <div
                              key={phase.id}
                              style={{
                                width: '8px',
                                height: '8px',
                                backgroundColor: pProgress === 100 ? 'var(--color-text)' : pProgress > 0 ? 'var(--color-text-tertiary)' : 'var(--color-bg)',
                                border: '1px solid var(--color-text)',
                              }}
                              title={`${phase.title}: ${pProgress}%`}
                            />
                          );
                        })}
                      </div>

                      {/* Progress value */}
                      <div
                        className="num-display text-right"
                        style={{
                          fontSize: 'var(--text-2xl)',
                          color: isCompleted ? 'var(--color-accent)' : 'var(--color-text)',
                          minWidth: '90px',
                        }}
                      >
                        {progress}%
                      </div>

                      {/* Hover actions */}
                      <div
                        className="flex items-center gap-1 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => duplicateProject(project.id)}
                          className="p-2 transition-colors"
                          style={{ color: 'var(--color-text)' }}
                          title="Dupliquer"
                          onMouseEnter={iconHoverOn}
                          onMouseLeave={iconHoverOff}
                        >
                          <Copy size={14} />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(project.id)}
                          className="p-2 transition-colors"
                          style={{ color: 'var(--color-text)' }}
                          title="Supprimer"
                          onMouseEnter={iconHoverOn}
                          onMouseLeave={iconHoverOff}
                        >
                          <Trash2 size={14} />
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

      {/* New Project Drawer */}
      {showNewModal && (
        <>
          <div
            className="fixed inset-0 z-40 sidebar-overlay"
            style={{ backgroundColor: 'rgb(0 0 0 / 0.35)' }}
            onClick={() => setShowNewModal(false)}
          />
          <aside
            className="fixed top-0 right-0 h-full w-full max-w-md z-50 overflow-y-auto slide-panel"
            style={{
              backgroundColor: 'var(--color-bg)',
              borderLeft: '1px solid var(--color-text)',
            }}
          >
            <div
              className="flex items-baseline justify-between px-8 py-6"
              style={{ borderBottom: '1px solid var(--color-text)' }}
            >
              <span
                className="font-mono uppercase"
                style={{
                  fontSize: 'var(--text-xs)',
                  letterSpacing: '0.1em',
                }}
              >
                Nouveau
              </span>
              <span className="section-index">C.01</span>
            </div>

            <div className="px-8 py-8">
              <h2 className="font-display mb-8" style={{ fontSize: 'var(--text-2xl)', lineHeight: 0.95 }}>
                Ouvrir un<br />chapitre.
              </h2>

              <div className="space-y-6">
                <div>
                  <label
                    className="font-mono uppercase block mb-2"
                    style={{
                      fontSize: 'var(--text-xs)',
                      letterSpacing: '0.1em',
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
                      letterSpacing: '0.1em',
                    }}
                  >
                    Type de contenu
                  </label>
                  <div
                    className="grid grid-cols-2"
                    style={{ border: '1px solid var(--color-text)' }}
                  >
                    {CONTENT_TYPES.map((type, i) => {
                      const IconComponent = typeIcons[type.id] || FileText;
                      const isSelected = newProjectType === type.id;
                      return (
                        <button
                          key={type.id}
                          onClick={() => setNewProjectType(type.id)}
                          className="p-5 text-left transition-all"
                          style={{
                            borderLeft: i > 0 ? '1px solid var(--color-text)' : 'none',
                            backgroundColor: isSelected ? 'var(--color-text)' : 'var(--color-bg)',
                            color: isSelected ? 'var(--color-bg)' : 'var(--color-text)',
                          }}
                        >
                          <IconComponent size={16} />
                          <div
                            className="mt-3 font-display"
                            style={{ fontSize: 'var(--text-md)', lineHeight: 1, textTransform: 'uppercase' }}
                          >
                            {type.label}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div
                className="flex gap-3 mt-10 pt-6"
                style={{ borderTop: '1px solid var(--color-text)' }}
              >
                <button
                  onClick={() => setShowNewModal(false)}
                  className="btn-secondary flex-1"
                >
                  Annuler
                </button>
                <button
                  onClick={handleCreateProject}
                  disabled={!newProjectTitle.trim()}
                  className="btn-primary flex-1"
                >
                  Créer →
                </button>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sidebar-overlay"
          style={{ backgroundColor: 'rgb(0 0 0 / 0.35)' }}
          onClick={() => setShowDeleteConfirm(null)}
        >
          <div
            className="w-full max-w-sm fade-in"
            style={{
              backgroundColor: 'var(--color-bg)',
              border: '1px solid var(--color-text)',
              padding: '2rem',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex items-baseline justify-between mb-6"
              style={{ borderBottom: '1px solid var(--color-text)', paddingBottom: '0.75rem' }}
            >
              <span
                className="font-mono uppercase"
                style={{
                  fontSize: 'var(--text-xs)',
                  letterSpacing: '0.1em',
                  color: 'var(--color-accent)',
                }}
              >
                Supprimer
              </span>
              <span className="section-index">D.01</span>
            </div>
            <h3 className="font-display mb-3" style={{ fontSize: 'var(--text-xl)', lineHeight: 1 }}>
              Ce chapitre,<br />définitivement ?
            </h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
              Cette action est irréversible. Toutes les données du projet seront perdues.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="btn-secondary flex-1"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="btn-primary flex-1"
                style={{ backgroundColor: 'var(--color-accent)', borderColor: 'var(--color-accent)' }}
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

function StatBlock({ label, value, accent = false, index, withBorder = false }) {
  return (
    <div
      className="p-6 lg:p-8"
      style={{
        borderLeft: withBorder ? '1px solid var(--color-text)' : 'none',
      }}
    >
      <div className="flex items-baseline justify-between mb-4">
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.1em',
            color: 'var(--color-text)',
          }}
        >
          {label}
        </span>
        <span className="section-index">{index}</span>
      </div>
      <div
        className="num-display"
        style={{
          fontSize: 'clamp(3rem, 7vw, 5.5rem)',
          color: accent ? 'var(--color-accent)' : 'var(--color-text)',
        }}
      >
        {value}
      </div>
    </div>
  );
}
