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
  Filter,
  Calendar,
  Check,
  TrendingUp,
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
    return phase || PHASES[0];
  };

  // Calculer les stats globales
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => calculateProgress(p) === 100).length;
  const avgProgress = totalProjects > 0
    ? Math.round(projects.reduce((sum, p) => sum + calculateProgress(p), 0) / totalProjects)
    : 0;

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)]">
      {/* Header */}
      <header className="border-b border-[var(--color-border)] bg-[var(--color-bg)] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-dark)] rounded-xl flex items-center justify-center shadow-md">
              <FileText size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-[var(--text-xl)] font-bold text-[var(--color-text)]" style={{ fontFamily: 'var(--font-heading)' }}>
                Content Process
              </h1>
              <p className="text-[var(--text-xs)] text-[var(--color-text-secondary)]">
                Gestion de contenu SEO
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportData}
              className="p-2.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] rounded-lg transition-colors flex items-center gap-2"
              title="Exporter toutes les données"
            >
              <Download size={18} />
              <span className="text-[var(--text-sm)] hidden sm:inline">Export</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] rounded-lg transition-colors flex items-center gap-2"
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
              className="p-2.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] rounded-lg transition-colors"
              title="Déconnexion"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        {totalProjects > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-[var(--color-bg)] rounded-xl p-5 border border-[var(--color-border)] shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[var(--text-sm)] text-[var(--color-text-secondary)]">Projets</p>
                  <p className="text-[var(--text-2xl)] font-bold text-[var(--color-text)]" style={{ fontFamily: 'var(--font-heading)' }}>
                    {totalProjects}
                  </p>
                </div>
                <div className="w-12 h-12 bg-[var(--color-accent-light)] rounded-xl flex items-center justify-center">
                  <FileText size={24} className="text-[var(--color-accent)]" />
                </div>
              </div>
            </div>
            <div className="bg-[var(--color-bg)] rounded-xl p-5 border border-[var(--color-border)] shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[var(--text-sm)] text-[var(--color-text-secondary)]">Terminés</p>
                  <p className="text-[var(--text-2xl)] font-bold text-[var(--color-success)]" style={{ fontFamily: 'var(--font-heading)' }}>
                    {completedProjects}
                  </p>
                </div>
                <div className="w-12 h-12 bg-[var(--color-success-light)] rounded-xl flex items-center justify-center">
                  <Check size={24} className="text-[var(--color-success)]" />
                </div>
              </div>
            </div>
            <div className="bg-[var(--color-bg)] rounded-xl p-5 border border-[var(--color-border)] shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[var(--text-sm)] text-[var(--color-text-secondary)]">Progression moy.</p>
                  <p className="text-[var(--text-2xl)] font-bold text-[var(--color-text)]" style={{ fontFamily: 'var(--font-heading)' }}>
                    {avgProgress}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-[var(--color-warning-light)] rounded-xl flex items-center justify-center">
                  <TrendingUp size={24} className="text-[var(--color-warning)]" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <button
            onClick={() => setShowNewModal(true)}
            className="px-5 py-3 rounded-xl font-semibold transition-all hover:shadow-lg flex items-center gap-2 text-[var(--text-base)]"
            style={{
              background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%)',
              color: 'white',
              fontFamily: 'var(--font-heading)'
            }}
          >
            <Plus size={20} />
            <span>Nouveau projet</span>
          </button>

          <div className="flex-1 relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Rechercher un projet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:max-w-md pl-11 pr-4 py-2.5"
            />
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
          </div>

          <div className="relative">
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-9 pr-4 py-2.5 appearance-none cursor-pointer"
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
          <div className="text-center py-16 bg-[var(--color-bg)] rounded-2xl border border-[var(--color-border)]">
            <div className="w-20 h-20 bg-[var(--color-bg-tertiary)] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText size={40} className="text-[var(--color-text-tertiary)]" />
            </div>
            <p className="text-[var(--color-text-secondary)] text-[var(--text-lg)] mb-2">
              {projects.length === 0
                ? 'Aucun projet pour le moment'
                : 'Aucun projet ne correspond à votre recherche'}
            </p>
            <p className="text-[var(--color-text-tertiary)] text-[var(--text-base)]">
              {projects.length === 0 && 'Créez votre premier projet de contenu SEO !'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredProjects.map(project => {
              const progress = calculateProgress(project);
              const currentPhase = getCurrentPhaseInfo(project);
              const phaseColor = PHASE_COLORS[currentPhase.id];
              const isCompleted = progress === 100;

              return (
                <div
                  key={project.id}
                  className={`bg-[var(--color-bg)] border rounded-xl p-5 hover:shadow-lg transition-all cursor-pointer group ${
                    isCompleted ? 'border-[var(--color-success)]/30' : 'border-[var(--color-border)]'
                  }`}
                  onClick={() => navigate(`/project/${project.id}`)}
                  style={isCompleted ? { boxShadow: '0 0 20px rgba(16, 185, 129, 0.1)' } : {}}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {/* Type Icon with Phase Color */}
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                        style={{
                          backgroundColor: isCompleted ? 'var(--color-success-light)' : phaseColor?.light,
                          color: isCompleted ? 'var(--color-success)' : phaseColor?.main
                        }}
                      >
                        {isCompleted ? <Check size={24} /> : getTypeIcon(project.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-[var(--color-text)] truncate text-[var(--text-lg)]" style={{ fontFamily: 'var(--font-heading)' }}>
                            {project.title}
                          </h3>
                          {isCompleted && (
                            <span className="px-2 py-0.5 bg-[var(--color-success-light)] text-[var(--color-success)] text-[var(--text-xs)] font-semibold rounded-full">
                              Terminé
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-[var(--text-sm)] text-[var(--color-text-secondary)]">
                          <span className="flex items-center gap-1">
                            {getTypeIcon(project.type)}
                            <span className="hidden sm:inline">{getTypeLabel(project.type)}</span>
                          </span>
                          <span
                            className="px-2 py-0.5 rounded-full text-[var(--text-xs)] font-medium"
                            style={{
                              backgroundColor: phaseColor?.light,
                              color: phaseColor?.main
                            }}
                          >
                            Phase {currentPhase.number}: {currentPhase.title}
                          </span>
                          <span className="flex items-center gap-1 hidden sm:flex">
                            <Calendar size={14} />
                            {new Date(project.updatedAt).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Section */}
                    <div className="flex items-center gap-6">
                      {/* Phase Progress Dots */}
                      <div className="hidden md:flex items-center gap-1">
                        {PHASES.map(phase => {
                          const pProgress = calculatePhaseProgress(project, phase);
                          const pColor = PHASE_COLORS[phase.id];
                          return (
                            <div
                              key={phase.id}
                              className="w-2 h-2 rounded-full transition-all"
                              style={{
                                backgroundColor: pProgress === 100 ? pColor.main : pProgress > 0 ? pColor.light : 'var(--color-bg-tertiary)',
                                border: pProgress > 0 && pProgress < 100 ? `1px solid ${pColor.main}` : 'none'
                              }}
                              title={`${phase.title}: ${pProgress}%`}
                            />
                          );
                        })}
                      </div>

                      {/* Progress Bar */}
                      <div className="text-right">
                        <div
                          className="text-[var(--text-sm)] font-bold mb-1"
                          style={{
                            color: isCompleted ? 'var(--color-success)' : phaseColor?.main,
                            fontFamily: 'var(--font-heading)'
                          }}
                        >
                          {progress}%
                        </div>
                        <div className="w-24 h-2 bg-[var(--color-bg-tertiary)] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all progress-bar"
                            style={{
                              width: `${progress}%`,
                              background: isCompleted
                                ? 'var(--color-success)'
                                : `linear-gradient(90deg, ${phaseColor?.main} 0%, ${phaseColor?.dark} 100%)`
                            }}
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => duplicateProject(project.id)}
                          className="p-2.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] rounded-lg transition-colors"
                          title="Dupliquer"
                        >
                          <Copy size={18} />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(project.id)}
                          className="p-2.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-error-light)] hover:text-[var(--color-error)] rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowNewModal(false)}>
          <div className="bg-[var(--color-bg)] rounded-2xl shadow-2xl w-full max-w-md p-6 fade-in" onClick={e => e.stopPropagation()}>
            <h2 className="text-[var(--text-xl)] font-bold text-[var(--color-text)] mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
              Nouveau projet
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-[var(--text-sm)] font-semibold text-[var(--color-text)] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  Titre du projet
                </label>
                <input
                  type="text"
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  className="w-full"
                  placeholder="Ex: Guide SEO 2024"
                  autoFocus
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateProject()}
                />
              </div>

              <div>
                <label className="block text-[var(--text-sm)] font-semibold text-[var(--color-text)] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                  Type de contenu
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {CONTENT_TYPES.map(type => {
                    const IconComponent = typeIcons[type.id] || FileText;
                    const isSelected = newProjectType === type.id;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setNewProjectType(type.id)}
                        className={`p-4 border-2 rounded-xl text-left transition-all ${
                          isSelected
                            ? 'border-[var(--color-accent)] bg-[var(--color-accent-light)] shadow-md'
                            : 'border-[var(--color-border)] hover:border-[var(--color-text-tertiary)]'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all ${
                          isSelected
                            ? 'bg-[var(--color-accent)] text-white shadow-md'
                            : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]'
                        }`}>
                          <IconComponent size={24} />
                        </div>
                        <div className="text-[var(--text-base)] font-semibold text-[var(--color-text)]" style={{ fontFamily: 'var(--font-heading)' }}>
                          {type.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowNewModal(false)}
                className="px-5 py-2.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] rounded-xl text-[var(--text-base)] font-medium transition-colors"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Annuler
              </button>
              <button
                onClick={handleCreateProject}
                disabled={!newProjectTitle.trim()}
                className="px-5 py-2.5 rounded-xl font-semibold disabled:opacity-50 text-[var(--text-base)] transition-all hover:shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%)',
                  color: 'white',
                  fontFamily: 'var(--font-heading)'
                }}
              >
                Créer le projet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowDeleteConfirm(null)}>
          <div className="bg-[var(--color-bg)] rounded-2xl shadow-2xl w-full max-w-sm p-6 fade-in" onClick={e => e.stopPropagation()}>
            <div className="w-14 h-14 bg-[var(--color-error-light)] rounded-xl flex items-center justify-center mb-4">
              <Trash2 size={28} className="text-[var(--color-error)]" />
            </div>
            <h2 className="text-[var(--text-xl)] font-bold text-[var(--color-text)] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              Supprimer le projet ?
            </h2>
            <p className="text-[var(--color-text-secondary)] text-[var(--text-base)] mb-6">
              Cette action est irréversible. Toutes les données du projet seront perdues.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-5 py-2.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] rounded-xl text-[var(--text-base)] font-medium transition-colors"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="px-5 py-2.5 bg-[var(--color-error)] text-white rounded-xl font-semibold hover:opacity-90 text-[var(--text-base)] transition-opacity"
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
