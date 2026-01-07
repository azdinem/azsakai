import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { CONTENT_TYPES, PHASES, calculateProgress } from '../data/processData';
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
  Filter,
  Calendar,
  Icon,
} from '../components/Icons';

// Map des icônes pour les types de contenu
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

  const getTypeIcon = (type) => {
    const IconComponent = typeIcons[type] || FileText;
    return <IconComponent size={20} />;
  };

  const getTypeLabel = (type) => {
    return CONTENT_TYPES.find(t => t.id === type)?.label || type;
  };

  const getCurrentPhaseInfo = (project) => {
    const phase = PHASES.find(p => p.id === project.currentPhase);
    return phase ? `Phase ${phase.number}` : '';
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <header className="border-b border-[var(--color-border)] bg-[var(--color-bg)] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[var(--color-accent-light)] rounded-lg flex items-center justify-center">
              <FileText size={18} className="text-[var(--color-accent)]" />
            </div>
            <h1 className="text-[var(--text-lg)] font-semibold text-[var(--color-text)]" style={{ fontFamily: 'var(--font-heading)' }}>
              Content Process
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportData}
              className="p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] rounded-md transition-colors flex items-center gap-2"
              title="Exporter toutes les données"
            >
              <Download size={18} />
              <span className="text-[var(--text-sm)] hidden sm:inline">Export</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] rounded-md transition-colors flex items-center gap-2"
              title="Importer des données"
            >
              <Upload size={18} />
              <span className="text-[var(--text-sm)] hidden sm:inline">Import</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <div className="w-px h-6 bg-[var(--color-border)] mx-1" />
            <button
              onClick={logout}
              className="p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] rounded-md transition-colors"
              title="Déconnexion"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          <button
            onClick={() => setShowNewModal(true)}
            className="px-4 py-2.5 bg-[var(--color-text)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2 text-[var(--text-base)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            <Plus size={18} />
            <span>Nouveau projet</span>
          </button>

          <div className="flex-1 relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Rechercher un projet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:max-w-md pl-10 pr-4 py-2"
            />
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
          </div>

          <div className="relative">
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-9 pr-4 py-2 appearance-none cursor-pointer"
            >
              <option value="all">Tous les types</option>
              {CONTENT_TYPES.map(type => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-[var(--color-bg-tertiary)] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText size={32} className="text-[var(--color-text-tertiary)]" />
            </div>
            <p className="text-[var(--color-text-secondary)] text-[var(--text-base)]">
              {projects.length === 0
                ? 'Aucun projet pour le moment. Créez votre premier projet !'
                : 'Aucun projet ne correspond à votre recherche.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredProjects.map(project => {
              const progress = calculateProgress(project);
              return (
                <div
                  key={project.id}
                  className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-4 hover:border-[var(--color-text-tertiary)] transition-all cursor-pointer group"
                  onClick={() => navigate(`/project/${project.id}`)}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-[var(--color-bg-secondary)] rounded-lg flex items-center justify-center flex-shrink-0 text-[var(--color-text-secondary)]">
                        {getTypeIcon(project.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-[var(--color-text)] truncate text-[var(--text-base)]" style={{ fontFamily: 'var(--font-heading)' }}>
                          {project.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5 text-[var(--text-sm)] text-[var(--color-text-secondary)]">
                          <span>{getTypeLabel(project.type)}</span>
                          <span className="text-[var(--color-border)]">•</span>
                          <span>{getCurrentPhaseInfo(project)}</span>
                          <span className="text-[var(--color-border)]">•</span>
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(project.updatedAt).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <div className="text-[var(--text-sm)] font-medium text-[var(--color-text)]" style={{ fontFamily: 'var(--font-heading)' }}>
                          {progress}%
                        </div>
                        <div className="w-20 h-1.5 bg-[var(--color-bg-tertiary)] rounded-full overflow-hidden mt-1">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${progress}%`,
                              backgroundColor: progress === 100 ? 'var(--color-success)' : 'var(--color-accent)'
                            }}
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => duplicateProject(project.id)}
                          className="p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] rounded-md transition-colors"
                          title="Dupliquer"
                        >
                          <Copy size={16} />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(project.id)}
                          className="p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-error-light)] hover:text-[var(--color-error)] rounded-md transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowNewModal(false)}>
          <div className="bg-[var(--color-bg)] rounded-xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-[var(--text-lg)] font-semibold text-[var(--color-text)] mb-5" style={{ fontFamily: 'var(--font-heading)' }}>
              Nouveau projet
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-[var(--text-sm)] font-medium text-[var(--color-text)] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  Titre du projet
                </label>
                <input
                  type="text"
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  className="w-full"
                  placeholder="Ex: Guide SEO 2024"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-[var(--text-sm)] font-medium text-[var(--color-text)] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  Type de contenu
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {CONTENT_TYPES.map(type => {
                    const IconComponent = typeIcons[type.id] || FileText;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setNewProjectType(type.id)}
                        className={`p-4 border rounded-lg text-left transition-all ${
                          newProjectType === type.id
                            ? 'border-[var(--color-accent)] bg-[var(--color-accent-light)]'
                            : 'border-[var(--color-border)] hover:border-[var(--color-text-tertiary)]'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${
                          newProjectType === type.id
                            ? 'bg-[var(--color-accent)] text-white'
                            : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]'
                        }`}>
                          <IconComponent size={20} />
                        </div>
                        <div className="text-[var(--text-sm)] font-medium text-[var(--color-text)]" style={{ fontFamily: 'var(--font-heading)' }}>
                          {type.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowNewModal(false)}
                className="px-4 py-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] rounded-lg text-[var(--text-base)] transition-colors"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Annuler
              </button>
              <button
                onClick={handleCreateProject}
                disabled={!newProjectTitle.trim()}
                className="px-4 py-2 bg-[var(--color-text)] text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50 text-[var(--text-base)] transition-opacity"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDeleteConfirm(null)}>
          <div className="bg-[var(--color-bg)] rounded-xl shadow-xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 bg-[var(--color-error-light)] rounded-xl flex items-center justify-center mb-4">
              <Trash2 size={24} className="text-[var(--color-error)]" />
            </div>
            <h2 className="text-[var(--text-lg)] font-semibold text-[var(--color-text)] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              Supprimer le projet ?
            </h2>
            <p className="text-[var(--color-text-secondary)] text-[var(--text-base)] mb-6">
              Cette action est irréversible.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] rounded-lg text-[var(--text-base)] transition-colors"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="px-4 py-2 bg-[var(--color-error)] text-white rounded-lg font-medium hover:opacity-90 text-[var(--text-base)] transition-opacity"
                style={{ fontFamily: 'var(--font-heading)' }}
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
