import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { CONTENT_TYPES, PHASES, calculateProgress } from '../data/processData';

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

  // Filtrer les projets
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

  const getTypeIcon = (type) => {
    return CONTENT_TYPES.find(t => t.id === type)?.icon || '📄';
  };

  const getTypeLabel = (type) => {
    return CONTENT_TYPES.find(t => t.id === type)?.label || type;
  };

  const getCurrentPhaseInfo = (project) => {
    const phase = PHASES.find(p => p.id === project.currentPhase);
    return phase ? `${phase.icon} Phase ${phase.number}` : '';
  };

  return (
    <div className="min-h-screen bg-[var(--notion-bg)]">
      {/* Header */}
      <header className="border-b border-[var(--notion-border)] bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📝</span>
            <h1 className="text-xl font-semibold text-[var(--notion-text)]">Content Process</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={exportData}
              className="px-3 py-1.5 text-sm text-[var(--notion-text-secondary)] hover:bg-[var(--notion-bg-secondary)] rounded-md transition-colors"
              title="Exporter toutes les données"
            >
              📤 Export
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 text-sm text-[var(--notion-text-secondary)] hover:bg-[var(--notion-bg-secondary)] rounded-md transition-colors"
              title="Importer des données"
            >
              📥 Import
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <button
              onClick={logout}
              className="px-3 py-1.5 text-sm text-[var(--notion-text-secondary)] hover:bg-[var(--notion-bg-secondary)] rounded-md transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Actions Bar */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setShowNewModal(true)}
            className="px-4 py-2 bg-[var(--notion-text)] text-white rounded-md font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <span>+</span>
            <span>Nouveau projet</span>
          </button>

          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Rechercher un projet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md px-4 py-2 pl-10 border border-[var(--notion-border)] rounded-md text-[var(--notion-text)] bg-white"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--notion-text-secondary)]">🔍</span>
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-[var(--notion-border)] rounded-md text-[var(--notion-text)] bg-white"
          >
            <option value="all">Tous les types</option>
            {CONTENT_TYPES.map(type => (
              <option key={type.id} value={type.id}>{type.icon} {type.label}</option>
            ))}
          </select>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-[var(--notion-text-secondary)]">
              {projects.length === 0
                ? 'Aucun projet pour le moment. Créez votre premier projet !'
                : 'Aucun projet ne correspond à votre recherche.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredProjects.map(project => {
              const progress = calculateProgress(project);
              return (
                <div
                  key={project.id}
                  className="bg-white border border-[var(--notion-border)] rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer group"
                  onClick={() => navigate(`/project/${project.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-2xl">{getTypeIcon(project.type)}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-[var(--notion-text)] truncate">{project.title}</h3>
                        <div className="flex items-center gap-3 mt-1 text-sm text-[var(--notion-text-secondary)]">
                          <span>{getTypeLabel(project.type)}</span>
                          <span>•</span>
                          <span>{getCurrentPhaseInfo(project)}</span>
                          <span>•</span>
                          <span>Modifié le {new Date(project.updatedAt).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-medium text-[var(--notion-text)]">{progress}%</div>
                        <div className="w-24 h-1.5 bg-[var(--notion-bg-tertiary)] rounded-full overflow-hidden mt-1">
                          <div
                            className="h-full bg-[var(--notion-success)] rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => duplicateProject(project.id)}
                          className="p-2 hover:bg-[var(--notion-bg-secondary)] rounded-md"
                          title="Dupliquer"
                        >
                          📋
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(project.id)}
                          className="p-2 hover:bg-[var(--notion-error-light)] rounded-md"
                          title="Supprimer"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* New Project Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowNewModal(false)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-[var(--notion-text)] mb-4">Nouveau projet</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--notion-text)] mb-2">
                  Titre du projet
                </label>
                <input
                  type="text"
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--notion-border)] rounded-md"
                  placeholder="Ex: Guide SEO 2024"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--notion-text)] mb-2">
                  Type de contenu
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {CONTENT_TYPES.map(type => (
                    <button
                      key={type.id}
                      onClick={() => setNewProjectType(type.id)}
                      className={`p-3 border rounded-md text-left transition-colors ${
                        newProjectType === type.id
                          ? 'border-[var(--notion-accent)] bg-[var(--notion-accent-light)]'
                          : 'border-[var(--notion-border)] hover:bg-[var(--notion-bg-secondary)]'
                      }`}
                    >
                      <span className="text-xl">{type.icon}</span>
                      <div className="text-sm font-medium mt-1">{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowNewModal(false)}
                className="px-4 py-2 text-[var(--notion-text-secondary)] hover:bg-[var(--notion-bg-secondary)] rounded-md"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateProject}
                disabled={!newProjectTitle.trim()}
                className="px-4 py-2 bg-[var(--notion-text)] text-white rounded-md font-medium hover:opacity-90 disabled:opacity-50"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowDeleteConfirm(null)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-[var(--notion-text)] mb-2">Supprimer le projet ?</h2>
            <p className="text-[var(--notion-text-secondary)] mb-6">Cette action est irréversible.</p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-[var(--notion-text-secondary)] hover:bg-[var(--notion-bg-secondary)] rounded-md"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="px-4 py-2 bg-[var(--notion-error)] text-white rounded-md font-medium hover:opacity-90"
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
