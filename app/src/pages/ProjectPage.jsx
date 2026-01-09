import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import {
  PHASES,
  PHASE_COLORS,
  FIELD_TO_CHECKLIST_MAP,
  CONTENT_TYPES,
  READER_PROFILES,
  FRAMEWORKS,
  SERP_ELEMENTS,
  CONTENT_FORMATS,
  INFO_GAIN_SOURCES,
  calculateProgress,
  calculatePhaseProgress,
  calculateStepProgress,
} from '../data/processData';
import {
  FileText,
  Target,
  Crosshair,
  LayoutTemplate,
  ClipboardList,
  PenLine,
  Image,
  CheckCircle,
  Link,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  Package,
  Download,
  Home,
  X,
  ListChecks,
  Sparkles,
  Award,
  CheckCircle2,
  Menu,
  Keyboard,
  HelpCircle,
} from '../components/Icons';
import Confetti from '../components/Confetti';
import Toast from '../components/Toast';
import { SkeletonSidebar, SkeletonStepContent } from '../components/Skeleton';
import KeyboardShortcuts from '../components/KeyboardShortcuts';
import { HelpTooltip } from '../components/Tooltip';

// Map des icônes pour les phases
const phaseIcons = {
  Crosshair,
  Target,
  LayoutTemplate,
  ClipboardList,
  PenLine,
  Image,
  CheckCircle,
  Link,
  BarChart3,
};

// Map des icônes pour les types de contenu
const typeIcons = {
  article: FileText,
  landing: Target,
};

export default function ProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProject, updateProject, updateProjectField, toggleChecklistItem, exportProjectMarkdown } = useData();

  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activePhase, setActivePhase] = useState('phase0');
  const [activeStep, setActiveStep] = useState('step0_1');
  const [phaseDropdownOpen, setPhaseDropdownOpen] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastCompletedPhase, setLastCompletedPhase] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);

  // Charger le projet
  useEffect(() => {
    setIsLoading(true);
    // Simuler un petit délai pour montrer le skeleton (optionnel en prod)
    const timer = setTimeout(() => {
      const p = getProject(id);
      if (p) {
        setProject(p);
        setActivePhase(p.currentPhase || 'phase0');
        setActiveStep(p.currentStep || 'step0_1');
      }
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [id, getProject]);

  // Mettre à jour le projet quand il change
  useEffect(() => {
    if (!isLoading) {
      const p = getProject(id);
      if (p) {
        setProject(p);
      }
    }
  });

  // Vérifier si une phase vient d'être complétée pour lancer les confettis
  useEffect(() => {
    if (project) {
      PHASES.forEach(phase => {
        const progress = calculatePhaseProgress(project, phase);
        if (progress === 100 && lastCompletedPhase !== phase.id) {
          if (phase.id === activePhase) {
            setShowConfetti(true);
            setLastCompletedPhase(phase.id);
          }
        }
      });
    }
  }, [project, activePhase, lastCompletedPhase]);

  // Fermer la sidebar sur changement de step (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [activeStep]);

  // Navigation clavier
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignorer si on est dans un champ de saisie
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        return;
      }

      const allSteps = PHASES.flatMap(p => p.steps.map(s => ({ ...s, phaseId: p.id })));
      const currentIndex = allSteps.findIndex(s => s.id === activeStep);

      switch (e.key) {
        case 'ArrowLeft':
          if (currentIndex > 0) {
            const prevStep = allSteps[currentIndex - 1];
            setActivePhase(prevStep.phaseId);
            setActiveStep(prevStep.id);
            updateProject(id, { currentPhase: prevStep.phaseId, currentStep: prevStep.id });
          }
          break;
        case 'ArrowRight':
          if (currentIndex < allSteps.length - 1) {
            const nextStep = allSteps[currentIndex + 1];
            setActivePhase(nextStep.phaseId);
            setActiveStep(nextStep.id);
            updateProject(id, { currentPhase: nextStep.phaseId, currentStep: nextStep.id });
          }
          break;
        case 'Escape':
          setShowSummary(false);
          setPhaseDropdownOpen(false);
          setSidebarOpen(false);
          setShowKeyboardShortcuts(false);
          break;
        case '?':
          setShowKeyboardShortcuts(prev => !prev);
          break;
        case 'r':
        case 'R':
          if (!e.ctrlKey && !e.metaKey) {
            setShowSummary(prev => !prev);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeStep, id, updateProject]);

  // Afficher le toast de sauvegarde
  const showSaveToast = useCallback(() => {
    setToast({ message: 'Sauvegardé', type: 'success' });
  }, []);

  // État de chargement
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-secondary)] flex">
        <div className="hide-mobile">
          <SkeletonSidebar />
        </div>
        <main className="flex-1 overflow-y-auto">
          <SkeletonStepContent />
        </main>
      </div>
    );
  }

  // Projet non trouvé
  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg)] gap-4">
        <div className="w-16 h-16 bg-[var(--color-error-light)] rounded-2xl flex items-center justify-center">
          <X size={32} className="text-[var(--color-error)]" />
        </div>
        <p className="text-[var(--color-text-secondary)] text-[var(--text-lg)]">Projet non trouvé</p>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          <Home size={18} />
          <span>Retour au Dashboard</span>
        </button>
      </div>
    );
  }

  const currentPhase = PHASES.find(p => p.id === activePhase);
  const currentStep = currentPhase?.steps.find(s => s.id === activeStep);
  const overallProgress = calculateProgress(project);
  const phaseColor = PHASE_COLORS[activePhase];

  const handlePhaseChange = (phaseId) => {
    setActivePhase(phaseId);
    setPhaseDropdownOpen(false);
    const phase = PHASES.find(p => p.id === phaseId);
    if (phase?.steps[0]) {
      setActiveStep(phase.steps[0].id);
      updateProject(id, { currentPhase: phaseId, currentStep: phase.steps[0].id });
    }
  };

  const handleStepChange = (stepId) => {
    setActiveStep(stepId);
    updateProject(id, { currentStep: stepId });
  };

  const handleFieldChange = (fieldId, value) => {
    updateProjectField(id, fieldId, value);
    showSaveToast();

    // Auto-complétion de la checklist
    const checklistId = FIELD_TO_CHECKLIST_MAP[fieldId];
    if (checklistId && value && value.length > 0) {
      if (!project.checklist?.[checklistId]) {
        toggleChecklistItem(id, checklistId);
      }
    }
  };

  const handleCheckToggle = (checkId) => {
    toggleChecklistItem(id, checkId);
    showSaveToast();
  };

  const handleTitleChange = (newTitle) => {
    updateProject(id, { title: newTitle });
    showSaveToast();
  };

  const getFieldOptions = (optionsRef) => {
    if (typeof optionsRef === 'string') {
      switch (optionsRef) {
        case 'READER_PROFILES': return READER_PROFILES;
        case 'FRAMEWORKS': return FRAMEWORKS;
        case 'SERP_ELEMENTS': return SERP_ELEMENTS;
        case 'CONTENT_FORMATS': return CONTENT_FORMATS;
        case 'INFO_GAIN_SOURCES': return INFO_GAIN_SOURCES;
        default: return [];
      }
    }
    return optionsRef || [];
  };

  const getPhaseIcon = (iconName, size = 20) => {
    const IconComponent = phaseIcons[iconName];
    return IconComponent ? <IconComponent size={size} /> : null;
  };

  const renderField = (field) => {
    const value = project.fields?.[field.id] || '';
    const options = getFieldOptions(field.options);

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className="w-full"
            placeholder={field.placeholder}
            maxLength={field.maxLength}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className="w-full resize-y"
            placeholder={field.placeholder}
            rows={field.rows || 4}
            maxLength={field.maxLength}
          />
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className="w-full"
          >
            <option value="">Sélectionner...</option>
            {options.map(opt => (
              <option key={opt.id} value={opt.id}>{opt.label}</option>
            ))}
          </select>
        );

      case 'multicheck':
        const selectedValues = value ? (Array.isArray(value) ? value : [value]) : [];
        return (
          <div className="space-y-2 p-4 bg-[var(--color-bg-secondary)] rounded-xl border border-[var(--color-border)]">
            {options.map(opt => (
              <label key={opt.id} className="flex items-start gap-3 cursor-pointer p-3 hover:bg-[var(--color-bg)] rounded-lg transition-all">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(opt.id)}
                  onChange={(e) => {
                    const newValues = e.target.checked
                      ? [...selectedValues, opt.id]
                      : selectedValues.filter(v => v !== opt.id);
                    handleFieldChange(field.id, newValues);
                  }}
                  className="mt-0.5"
                />
                <span className="text-[var(--text-base)] text-[var(--color-text)]">
                  {opt.label}
                  {opt.subLabel && <span className="text-[var(--color-text-secondary)]"> {opt.subLabel}</span>}
                </span>
              </label>
            ))}
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className="w-full"
          />
        );

      case 'paa_table':
      case 'info_gain_table':
      case 'table':
        return (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className="w-full font-mono text-[var(--text-sm)] resize-y"
            placeholder={field.columns ? field.columns.join(' | ') + '\n---\n...' : field.placeholder}
            rows={field.rows || 6}
          />
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className="w-full"
          />
        );
    }
  };

  // Calculer le récapitulatif des champs remplis
  const getSummaryData = () => {
    const summary = [];
    PHASES.forEach(phase => {
      const phaseData = {
        phase: phase,
        color: PHASE_COLORS[phase.id],
        progress: calculatePhaseProgress(project, phase),
        fields: [],
      };

      phase.steps.forEach(step => {
        step.fields?.forEach(field => {
          const value = project.fields?.[field.id];
          if (value && (typeof value === 'string' ? value.trim() : value.length > 0)) {
            phaseData.fields.push({
              label: field.label,
              value: typeof value === 'object' ? value.join(', ') : value,
            });
          }
        });
      });

      if (phaseData.fields.length > 0 || phaseData.progress > 0) {
        summary.push(phaseData);
      }
    });
    return summary;
  };

  const TypeIcon = typeIcons[project.type] || FileText;
  const stepProgress = currentStep ? calculateStepProgress(project, currentStep) : 0;

  // Contenu de la sidebar (réutilisé pour mobile et desktop)
  const SidebarContent = () => (
    <>
      {/* Header Sidebar */}
      <div className="p-5 border-b border-[var(--color-border)]">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
          >
            <Home size={18} />
            <span className="text-[var(--text-sm)]">Retour</span>
          </button>
          {/* Bouton fermer (mobile uniquement) */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="hide-desktop p-2 hover:bg-[var(--color-bg-secondary)] rounded-lg transition-colors"
          >
            <X size={20} className="text-[var(--color-text-secondary)]" />
          </button>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: phaseColor?.light, color: phaseColor?.main }}
          >
            <TypeIcon size={20} />
          </div>
          <input
            type="text"
            value={project.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="text-[var(--text-lg)] font-semibold text-[var(--color-text)] bg-transparent border-none focus:outline-none focus:ring-0 flex-1 min-w-0 p-0"
            style={{ fontFamily: 'var(--font-heading)' }}
          />
        </div>

        {/* Progression globale */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[var(--text-sm)] text-[var(--color-text-secondary)]">Progression</span>
            <span className="text-[var(--text-sm)] font-semibold" style={{ color: phaseColor?.main }}>
              {overallProgress}%
            </span>
          </div>
          <div className="h-2.5 bg-[var(--color-bg-tertiary)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full progress-bar"
              style={{
                width: `${overallProgress}%`,
                background: `linear-gradient(90deg, ${phaseColor?.main} 0%, ${phaseColor?.dark} 100%)`
              }}
            />
          </div>
        </div>
      </div>

      {/* Phase Dropdown */}
      <div className="p-4 border-b border-[var(--color-border)]">
        <div className="relative">
          <button
            onClick={() => setPhaseDropdownOpen(!phaseDropdownOpen)}
            className="w-full flex items-center justify-between p-3 rounded-xl transition-all"
            style={{
              backgroundColor: phaseColor?.light,
              border: `2px solid ${phaseColor?.main}20`
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: phaseColor?.main, color: 'white' }}
              >
                {getPhaseIcon(currentPhase?.icon, 16)}
              </div>
              <div className="text-left">
                <div className="text-[var(--text-xs)] font-medium" style={{ color: phaseColor?.main }}>
                  Phase {currentPhase?.number}
                </div>
                <div className="text-[var(--text-sm)] font-semibold text-[var(--color-text)]" style={{ fontFamily: 'var(--font-heading)' }}>
                  {currentPhase?.title}
                </div>
              </div>
            </div>
            <ChevronDown
              size={18}
              className={`transition-transform ${phaseDropdownOpen ? 'rotate-180' : ''}`}
              style={{ color: phaseColor?.main }}
            />
          </button>

          {/* Dropdown Menu */}
          {phaseDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl shadow-lg z-50 overflow-hidden max-h-80 overflow-y-auto">
              {PHASES.map(phase => {
                const pColor = PHASE_COLORS[phase.id];
                const pProgress = calculatePhaseProgress(project, phase);
                const isActive = phase.id === activePhase;

                return (
                  <button
                    key={phase.id}
                    onClick={() => handlePhaseChange(phase.id)}
                    className={`w-full flex items-center gap-3 p-3 hover:bg-[var(--color-bg-secondary)] transition-colors ${
                      isActive ? 'bg-[var(--color-bg-secondary)]' : ''
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: pProgress === 100 ? pColor.main : pColor.light,
                        color: pProgress === 100 ? 'white' : pColor.main
                      }}
                    >
                      {pProgress === 100 ? <Check size={16} /> : <span className="text-[var(--text-sm)] font-bold">{phase.number}</span>}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-[var(--text-sm)] font-medium text-[var(--color-text)]">
                        {phase.title}
                      </div>
                      <div className="text-[var(--text-xs)] text-[var(--color-text-secondary)]">
                        {pProgress}% complété
                      </div>
                    </div>
                    {pProgress === 100 && (
                      <Award size={16} style={{ color: pColor.main }} />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Steps List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {currentPhase?.steps.map((step, index) => {
            const sProgress = calculateStepProgress(project, step);
            const isStepActive = activeStep === step.id;
            const isCompleted = sProgress === 100;

            return (
              <button
                key={step.id}
                onClick={() => handleStepChange(step.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                  isStepActive
                    ? 'shadow-md'
                    : 'hover:bg-[var(--color-bg-secondary)]'
                }`}
                style={isStepActive ? {
                  backgroundColor: phaseColor?.light,
                  border: `2px solid ${phaseColor?.main}40`
                } : {}}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                    isCompleted ? 'scale-110' : ''
                  }`}
                  style={{
                    backgroundColor: isCompleted ? phaseColor?.main : isStepActive ? phaseColor?.light : 'var(--color-bg-tertiary)',
                    color: isCompleted ? 'white' : isStepActive ? phaseColor?.main : 'var(--color-text-secondary)',
                    border: isStepActive && !isCompleted ? `2px solid ${phaseColor?.main}` : 'none'
                  }}
                >
                  {isCompleted ? <Check size={14} /> : <span className="text-[var(--text-xs)] font-bold">{index + 1}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-[var(--text-sm)] font-medium truncate ${
                    isStepActive ? 'text-[var(--color-text)]' : 'text-[var(--color-text-secondary)]'
                  }`} style={{ fontFamily: 'var(--font-heading)' }}>
                    {step.title}
                  </div>
                  {!isCompleted && sProgress > 0 && (
                    <div className="mt-1 h-1 bg-[var(--color-bg-tertiary)] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full progress-bar"
                        style={{ width: `${sProgress}%`, backgroundColor: phaseColor?.main }}
                      />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mini Progress Map */}
      <div className="p-4 border-t border-[var(--color-border)]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[var(--text-xs)] font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
            Phases
          </span>
        </div>
        <div className="flex gap-1">
          {PHASES.map(phase => {
            const pColor = PHASE_COLORS[phase.id];
            const pProgress = calculatePhaseProgress(project, phase);
            const isActive = phase.id === activePhase;

            return (
              <button
                key={phase.id}
                onClick={() => handlePhaseChange(phase.id)}
                className={`flex-1 h-2 rounded-full transition-all ${isActive ? 'ring-2 ring-offset-1' : ''}`}
                style={{
                  backgroundColor: pProgress === 100 ? pColor.main : pProgress > 0 ? pColor.light : 'var(--color-bg-tertiary)',
                  ringColor: pColor.main
                }}
                title={`${phase.title} - ${pProgress}%`}
              />
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-[var(--color-border)] space-y-2">
        <button
          onClick={() => setShowSummary(true)}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-xl font-medium transition-all"
          style={{
            backgroundColor: phaseColor?.light,
            color: phaseColor?.main,
            fontFamily: 'var(--font-heading)'
          }}
        >
          <ListChecks size={18} />
          <span>Récapitulatif</span>
        </button>
        <button
          onClick={() => exportProjectMarkdown(id)}
          className="w-full flex items-center justify-center gap-2 p-3 bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] rounded-xl font-medium hover:bg-[var(--color-bg-tertiary)] transition-all"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          <Download size={18} />
          <span>Exporter</span>
        </button>
        <button
          onClick={() => setShowKeyboardShortcuts(true)}
          className="w-full flex items-center justify-center gap-2 p-3 bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] rounded-xl font-medium hover:bg-[var(--color-bg-tertiary)] transition-all"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          <Keyboard size={18} />
          <span>Raccourcis</span>
          <kbd className="ml-auto px-1.5 py-0.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded text-[var(--text-xs)] font-mono">?</kbd>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)] flex">
      {/* Confetti */}
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Toast de sauvegarde */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Mobile Header */}
      <div className="hide-desktop fixed top-0 left-0 right-0 z-40 bg-[var(--color-bg)] border-b border-[var(--color-border)] px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-[var(--color-bg-secondary)] rounded-lg transition-colors"
          >
            <Menu size={24} className="text-[var(--color-text)]" />
          </button>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: phaseColor?.main, color: 'white' }}
            >
              {getPhaseIcon(currentPhase?.icon, 16)}
            </div>
            <span className="text-[var(--text-sm)] font-semibold text-[var(--color-text)]" style={{ fontFamily: 'var(--font-heading)' }}>
              {currentPhase?.title}
            </span>
          </div>
          <div
            className="text-[var(--text-sm)] font-bold px-2 py-1 rounded-full"
            style={{ backgroundColor: phaseColor?.light, color: phaseColor?.main }}
          >
            {overallProgress}%
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="hide-desktop fixed inset-0 z-50 bg-black/50 sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        >
          <aside
            className="w-72 bg-[var(--color-bg)] h-full flex flex-col sidebar-mobile"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hide-mobile w-72 bg-[var(--color-bg)] border-r border-[var(--color-border)] flex flex-col h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-16 md:pt-0">
        {currentStep && (
          <div className="max-w-4xl mx-auto p-4 md:p-8">
            {/* Step Header */}
            <div
              className="rounded-2xl p-4 md:p-6 mb-6 md:mb-8 fade-in"
              style={{
                background: `linear-gradient(135deg, ${phaseColor?.light} 0%, ${phaseColor?.main}10 100%)`,
                border: `2px solid ${phaseColor?.main}20`
              }}
            >
              <div className="flex items-start gap-3 md:gap-4">
                <div
                  className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: phaseColor?.main, color: 'white' }}
                >
                  {getPhaseIcon(currentPhase?.icon, 24)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span
                      className="text-[var(--text-xs)] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: phaseColor?.main, color: 'white' }}
                    >
                      Étape {currentStep.number}
                    </span>
                    {stepProgress === 100 && (
                      <span className="flex items-center gap-1 text-[var(--text-xs)] font-semibold text-[var(--color-success)] bg-[var(--color-success-light)] px-2 py-0.5 rounded-full">
                        <Sparkles size={12} />
                        Complété
                      </span>
                    )}
                  </div>
                  <h1
                    className="text-[var(--text-xl)] md:text-[var(--text-2xl)] font-bold text-[var(--color-text)] mb-2"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {currentStep.title}
                  </h1>
                  <p className="text-[var(--text-sm)] md:text-[var(--text-base)] text-[var(--color-text-secondary)]">
                    {currentStep.objective}
                  </p>
                </div>
              </div>

              {/* Step Progress */}
              <div className="mt-4 pt-4 border-t" style={{ borderColor: `${phaseColor?.main}20` }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[var(--text-sm)] text-[var(--color-text-secondary)]">
                    Progression de l'étape
                  </span>
                  <span className="text-[var(--text-sm)] font-bold" style={{ color: phaseColor?.main }}>
                    {stepProgress}%
                  </span>
                </div>
                <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full progress-bar"
                    style={{
                      width: `${stepProgress}%`,
                      backgroundColor: phaseColor?.main
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Documentation Section (Fields) */}
            {currentStep.fields && currentStep.fields.length > 0 && (
              <div className="mb-6 md:mb-8 fade-in">
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: phaseColor?.light, color: phaseColor?.main }}
                  >
                    <Package size={18} />
                  </div>
                  <h2
                    className="text-[var(--text-lg)] font-semibold text-[var(--color-text)]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Documentation
                  </h2>
                </div>

                <div className="space-y-4 md:space-y-5">
                  {currentStep.fields.map(field => (
                    <div
                      key={field.id}
                      className="bg-[var(--color-bg)] rounded-xl p-4 md:p-5 border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow"
                    >
                      <label
                        className="flex items-center gap-2 text-[var(--text-sm)] font-semibold text-[var(--color-text)] mb-3"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        {field.label}
                        {FIELD_TO_CHECKLIST_MAP[field.id] && (
                          <HelpTooltip content="Ce champ coche automatiquement l'élément correspondant dans la checklist une fois rempli." />
                        )}
                      </label>
                      {renderField(field)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Checklist Section */}
            <div className="mb-6 md:mb-8 fade-in">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: phaseColor?.light, color: phaseColor?.main }}
                  >
                    <CheckCircle2 size={18} />
                  </div>
                  <h2
                    className="text-[var(--text-lg)] font-semibold text-[var(--color-text)]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Checklist
                  </h2>
                </div>
                <span
                  className="text-[var(--text-sm)] font-semibold px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: stepProgress === 100 ? 'var(--color-success-light)' : phaseColor?.light,
                    color: stepProgress === 100 ? 'var(--color-success)' : phaseColor?.main
                  }}
                >
                  {currentStep.checklist.filter(c => project.checklist?.[c.id]).length}/{currentStep.checklist.length}
                </span>
              </div>

              <div className="bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] overflow-hidden">
                {currentStep.checklist.map((check, index) => {
                  const isChecked = project.checklist?.[check.id] || false;

                  return (
                    <label
                      key={check.id}
                      className={`flex items-center gap-3 md:gap-4 p-3 md:p-4 cursor-pointer transition-all hover:bg-[var(--color-bg-secondary)] ${
                        index !== currentStep.checklist.length - 1 ? 'border-b border-[var(--color-border)]' : ''
                      } ${isChecked ? 'bg-[var(--color-success-light)]/30' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleCheckToggle(check.id)}
                      />
                      <span className={`text-[var(--text-sm)] md:text-[var(--text-base)] flex-1 ${
                        isChecked
                          ? 'text-[var(--color-text-secondary)] line-through'
                          : 'text-[var(--color-text)]'
                      }`}>
                        {check.label}
                      </span>
                      {isChecked && (
                        <Sparkles size={16} className="text-[var(--color-success)] flex-shrink-0" />
                      )}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Deliverable */}
            <div
              className="p-4 md:p-5 rounded-xl mb-6 md:mb-8 fade-in"
              style={{
                backgroundColor: phaseColor?.light,
                border: `2px dashed ${phaseColor?.main}40`
              }}
            >
              <div className="flex items-start gap-3">
                <Award size={22} style={{ color: phaseColor?.main }} className="flex-shrink-0 mt-0.5" />
                <div>
                  <span
                    className="text-[var(--text-sm)] font-bold uppercase tracking-wide"
                    style={{ color: phaseColor?.main, fontFamily: 'var(--font-heading)' }}
                  >
                    Livrable attendu
                  </span>
                  <p className="text-[var(--text-sm)] md:text-[var(--text-base)] text-[var(--color-text)] mt-1">
                    {currentStep.deliverable}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4 md:pt-6 border-t border-[var(--color-border)]">
              {(() => {
                const allSteps = PHASES.flatMap(p => p.steps.map(s => ({ ...s, phaseId: p.id })));
                const currentIndex = allSteps.findIndex(s => s.id === activeStep);
                const prevStep = currentIndex > 0 ? allSteps[currentIndex - 1] : null;
                const nextStep = currentIndex < allSteps.length - 1 ? allSteps[currentIndex + 1] : null;

                return (
                  <>
                    {prevStep ? (
                      <button
                        onClick={() => {
                          setActivePhase(prevStep.phaseId);
                          setActiveStep(prevStep.id);
                          updateProject(id, { currentPhase: prevStep.phaseId, currentStep: prevStep.id });
                        }}
                        className="flex items-center gap-2 px-4 md:px-5 py-2.5 md:py-3 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] rounded-xl transition-all text-[var(--text-sm)] md:text-[var(--text-base)] font-medium"
                      >
                        <ChevronLeft size={20} />
                        <span className="hidden sm:inline">Précédent</span>
                      </button>
                    ) : <div />}
                    {nextStep ? (
                      <button
                        onClick={() => {
                          setActivePhase(nextStep.phaseId);
                          setActiveStep(nextStep.id);
                          updateProject(id, { currentPhase: nextStep.phaseId, currentStep: nextStep.id });
                        }}
                        className="flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 rounded-xl font-semibold transition-all hover:shadow-lg text-[var(--text-sm)] md:text-[var(--text-base)]"
                        style={{
                          background: `linear-gradient(135deg, ${phaseColor?.main} 0%, ${phaseColor?.dark} 100%)`,
                          color: 'white',
                          fontFamily: 'var(--font-heading)'
                        }}
                      >
                        <span>Suivant</span>
                        <ChevronRight size={20} />
                      </button>
                    ) : (
                      <div
                        className="flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 rounded-xl font-semibold text-[var(--text-sm)] md:text-[var(--text-base)]"
                        style={{
                          backgroundColor: 'var(--color-success)',
                          color: 'white',
                          fontFamily: 'var(--font-heading)'
                        }}
                      >
                        <Check size={20} />
                        <span>Terminé</span>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </main>

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcuts
        isOpen={showKeyboardShortcuts}
        onClose={() => setShowKeyboardShortcuts(false)}
      />

      {/* Summary Panel */}
      {showSummary && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowSummary(false)}
          />

          {/* Panel */}
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-[var(--color-bg)] shadow-2xl slide-panel overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 md:p-6 border-b border-[var(--color-border)] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)' }}
                >
                  <ListChecks size={22} />
                </div>
                <div>
                  <h2
                    className="text-[var(--text-lg)] md:text-[var(--text-xl)] font-bold text-[var(--color-text)]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Récapitulatif
                  </h2>
                  <p className="text-[var(--text-sm)] text-[var(--color-text-secondary)]">
                    {project.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSummary(false)}
                className="p-2 hover:bg-[var(--color-bg-secondary)] rounded-lg transition-colors"
              >
                <X size={20} className="text-[var(--color-text-secondary)]" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              {getSummaryData().length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center">
                    <Package size={32} className="text-[var(--color-text-tertiary)]" />
                  </div>
                  <p className="text-[var(--color-text-secondary)]">
                    Aucune donnée renseignée pour le moment
                  </p>
                </div>
              ) : (
                <div className="space-y-4 md:space-y-6">
                  {getSummaryData().map(phaseData => (
                    <div
                      key={phaseData.phase.id}
                      className="rounded-xl overflow-hidden border border-[var(--color-border)]"
                    >
                      <div
                        className="p-3 md:p-4 flex items-center justify-between"
                        style={{ backgroundColor: phaseData.color.light }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: phaseData.color.main, color: 'white' }}
                          >
                            <span className="text-[var(--text-sm)] font-bold">{phaseData.phase.number}</span>
                          </div>
                          <span
                            className="font-semibold text-[var(--color-text)] text-[var(--text-sm)] md:text-[var(--text-base)]"
                            style={{ fontFamily: 'var(--font-heading)' }}
                          >
                            {phaseData.phase.title}
                          </span>
                        </div>
                        <span
                          className="text-[var(--text-xs)] md:text-[var(--text-sm)] font-bold px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: phaseData.progress === 100 ? 'var(--color-success)' : phaseData.color.main,
                            color: 'white'
                          }}
                        >
                          {phaseData.progress}%
                        </span>
                      </div>

                      {phaseData.fields.length > 0 && (
                        <div className="p-3 md:p-4 space-y-3 bg-[var(--color-bg)]">
                          {phaseData.fields.map((field, idx) => (
                            <div key={idx}>
                              <div className="text-[var(--text-xs)] font-medium text-[var(--color-text-secondary)] uppercase tracking-wide mb-1">
                                {field.label}
                              </div>
                              <div className="text-[var(--text-sm)] text-[var(--color-text)] whitespace-pre-wrap">
                                {field.value.length > 200 ? field.value.substring(0, 200) + '...' : field.value}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 md:p-6 border-t border-[var(--color-border)]">
              <button
                onClick={() => {
                  exportProjectMarkdown(id);
                  setShowSummary(false);
                }}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl font-semibold transition-all"
                style={{
                  background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%)',
                  color: 'white',
                  fontFamily: 'var(--font-heading)'
                }}
              >
                <Download size={18} />
                <span>Exporter en Markdown</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
