import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import {
  PHASES,
  FIELD_TO_CHECKLIST_MAP,
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
  ChevronDown,
  Check,
  Download,
  X,
  Menu,
  Edit3,
} from '../components/Icons';
import Confetti from '../components/Confetti';
import Toast from '../components/Toast';
import { SkeletonSidebar, SkeletonStepContent } from '../components/Skeleton';
import KeyboardShortcuts from '../components/KeyboardShortcuts';
import { HelpTooltip } from '../components/Tooltip';
import { downloadBriefMarkdown, downloadBriefPDF, getCompletionStats } from '../lib/exportBrief';

export default function ProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProject, updateProject, updateProjectField, toggleChecklistItem } = useData();

  const [isLoading, setIsLoading] = useState(true);
  const [activePhase, setActivePhase] = useState('phase0');
  const [activeStep, setActiveStep] = useState('step0_1');
  const [showSummary, setShowSummary] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastCompletedPhase, setLastCompletedPhase] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [checklistOpen, setChecklistOpen] = useState(false);
  // Drafts locaux par fieldId — la saisie reste en mémoire locale jusqu'au clic sur "Sauvegarder"
  const [drafts, setDrafts] = useState({});
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Dériver le projet directement du context à chaque render (évite le décalage state local / context qui faisait perdre le focus aux inputs)
  const project = isLoading ? null : getProject(id);

  useEffect(() => {
    // Ne pas mettre getProject dans les deps : sa référence change à chaque keystroke
    // (updateProjectField → context re-render → new getProject function ref)
    // et ça faisait refirer cet effet en boucle, réinstallant le skeleton 300ms à chaque frappe.
    setIsLoading(true);
    setDrafts({}); // reset des drafts au changement de projet
    const timer = setTimeout(() => {
      const p = getProject(id);
      if (p) {
        setActivePhase(p.currentPhase || 'phase0');
        setActiveStep(p.currentStep || 'step0_1');
      }
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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

  useEffect(() => {
    setSidebarOpen(false);
    setChecklistOpen(false);
  }, [activeStep]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
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
          setSidebarOpen(false);
          setShowKeyboardShortcuts(false);
          break;
        case '?':
          setShowKeyboardShortcuts(prev => !prev);
          break;
        case 'r':
        case 'R':
          if (!e.ctrlKey && !e.metaKey) setShowSummary(prev => !prev);
          break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeStep, id, updateProject]);

  const showSaveToast = useCallback(() => {
    setToast({ message: 'Sauvegardé', type: 'success' });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="hide-mobile"><SkeletonSidebar /></div>
        <main className="flex-1 overflow-y-auto"><SkeletonStepContent /></main>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6" style={{ backgroundColor: 'var(--color-bg)' }}>
        <p className="font-mono uppercase" style={{ fontSize: 'var(--text-xs)', letterSpacing: '0.1em', color: 'var(--color-accent)' }}>
          Erreur 404
        </p>
        <p className="font-display" style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-text)', textTransform: 'uppercase', lineHeight: 0.95 }}>
          Ce chapitre n'existe<br />plus.
        </p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Retour au sommaire →
        </button>
      </div>
    );
  }

  const currentPhase = PHASES.find(p => p.id === activePhase);
  const currentStep = currentPhase?.steps.find(s => s.id === activeStep);
  const overallProgress = calculateProgress(project);

  const handlePhaseChange = (phaseId) => {
    setActivePhase(phaseId);
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
    // Ne met à jour que le draft local — la persistance a lieu uniquement au clic sur "Sauvegarder"
    setDrafts(prev => ({ ...prev, [fieldId]: value }));
    setEditingField(fieldId);
  };

  const hasDraft = (fieldId) => drafts[fieldId] !== undefined;

  const handleSaveField = (fieldId) => {
    const draftValue = drafts[fieldId];
    if (draftValue === undefined) {
      // Rien à sauvegarder, juste fermer l'édition
      setEditingField(null);
      return;
    }
    updateProjectField(id, fieldId, draftValue);
    showSaveToast();
    setEditingField(null);
    setDrafts(prev => {
      const next = { ...prev };
      delete next[fieldId];
      return next;
    });
    // Auto-cocher l'item de checklist lié au moment de la sauvegarde (plus d'auto-check sur frappe)
    const checklistId = FIELD_TO_CHECKLIST_MAP[fieldId];
    const hasContent = typeof draftValue === 'string'
      ? draftValue.trim().length > 0
      : Array.isArray(draftValue) ? draftValue.length > 0 : Boolean(draftValue);
    if (checklistId && hasContent && !project.checklist?.[checklistId]) {
      toggleChecklistItem(id, checklistId);
    }
  };

  const handleCancelField = (fieldId) => {
    setDrafts(prev => {
      const next = { ...prev };
      delete next[fieldId];
      return next;
    });
    setEditingField(null);
  };

  const handleExportMarkdown = () => {
    if (!project) return;
    downloadBriefMarkdown(project);
    setToast({ message: 'Brief Markdown téléchargé', type: 'success' });
  };

  const handleExportPDF = async () => {
    if (!project || isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    try {
      await downloadBriefPDF(project);
      setToast({ message: 'Brief PDF téléchargé', type: 'success' });
    } catch (err) {
      console.error('Erreur génération PDF:', err);
      setToast({ message: 'Erreur lors de la génération du PDF', type: 'error' });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleCheckToggle = (checkId) => {
    // Persistance immédiate pour la checklist (pas de draft/save sur les cases à cocher) — pas de toast non plus
    toggleChecklistItem(id, checkId);
  };

  const handleTitleChange = (newTitle) => {
    // Persistance immédiate pour le titre du projet dans la sidebar — pas de toast
    updateProject(id, { title: newTitle });
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

  const isFieldFilled = (fieldId) => {
    const value = project?.fields?.[fieldId];
    if (!value) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return Boolean(value);
  };

  const getDisplayValue = (field) => {
    const value = project?.fields?.[field.id];
    if (!value) return null;
    const options = getFieldOptions(field.options);
    if (field.type === 'select' && options.length > 0) {
      const selected = options.find(opt => opt.id === value);
      return selected?.label || value;
    }
    if (field.type === 'multicheck' && Array.isArray(value)) {
      return value.map(v => {
        const opt = options.find(o => o.id === v);
        return opt?.label || v;
      }).join(', ');
    }
    if (typeof value === 'string' && value.length > 150) {
      return value.substring(0, 150) + '...';
    }
    return typeof value === 'string' ? value : JSON.stringify(value);
  };

  const renderField = (field) => {
    // Priorité au draft local si présent, sinon valeur sauvegardée
    const value = drafts[field.id] !== undefined
      ? drafts[field.id]
      : (project.fields?.[field.id] || '');
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
            <option value="">Sélectionner…</option>
            {options.map(opt => (
              <option key={opt.id} value={opt.id}>{opt.label}</option>
            ))}
          </select>
        );
      case 'multicheck': {
        const selectedValues = value ? (Array.isArray(value) ? value : [value]) : [];
        return (
          <div style={{ border: '1px solid var(--color-text)' }}>
            {options.map((opt, i) => (
              <label
                key={opt.id}
                className="flex items-start gap-3 cursor-pointer p-3 transition-colors"
                style={{
                  fontSize: 'var(--text-sm)',
                  borderTop: i > 0 ? '1px solid var(--color-text)' : 'none',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
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
                <span style={{ color: 'var(--color-text)' }}>
                  {opt.label}
                  {opt.subLabel && <span style={{ color: 'var(--color-text-tertiary)' }}> {opt.subLabel}</span>}
                </span>
              </label>
            ))}
          </div>
        );
      }
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
            className="w-full resize-y font-mono"
            style={{ fontSize: 'var(--text-sm)' }}
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

  const getSummaryData = () => {
    const summary = [];
    PHASES.forEach(phase => {
      const phaseData = {
        phase,
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
      if (phaseData.fields.length > 0 || phaseData.progress > 0) summary.push(phaseData);
    });
    return summary;
  };

  const stepProgress = currentStep ? calculateStepProgress(project, currentStep) : 0;
  const filledFieldsCount = currentStep?.fields?.filter(f => isFieldFilled(f.id)).length || 0;
  const totalFieldsCount = currentStep?.fields?.length || 0;
  const checkedCount = currentStep?.checklist?.filter(c => project.checklist?.[c.id]).length || 0;
  const totalCheckCount = currentStep?.checklist?.length || 0;
  const allSteps = PHASES.flatMap(p => p.steps.map(s => ({ ...s, phaseId: p.id })));
  const currentStepIndex = allSteps.findIndex(s => s.id === activeStep);
  const prevStep = currentStepIndex > 0 ? allSteps[currentStepIndex - 1] : null;
  const nextStep = currentStepIndex < allSteps.length - 1 ? allSteps[currentStepIndex + 1] : null;

  const sidebarContent = (
    <>
      <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--color-text)' }}>
        <button
          onClick={() => navigate('/')}
          className="font-mono uppercase flex items-center gap-2 mb-5 transition-colors"
          style={{
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.08em',
            color: 'var(--color-text)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text)')}
        >
          <span>←</span>
          <span>Sommaire</span>
        </button>

        {/* Close (mobile) */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="hide-desktop absolute top-5 right-4 p-2"
          style={{ color: 'var(--color-text)' }}
        >
          <X size={16} />
        </button>

        <input
          type="text"
          value={project.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="font-display w-full"
          style={{
            fontSize: 'var(--text-xl)',
            lineHeight: 0.95,
            border: 'none',
            borderBottom: '1px solid transparent',
            padding: '0.25rem 0',
            textTransform: 'uppercase',
            fontWeight: 800,
            letterSpacing: '-0.02em',
          }}
          onFocus={(e) => (e.currentTarget.style.borderBottomColor = 'var(--color-accent)')}
          onBlur={(e) => (e.currentTarget.style.borderBottomColor = 'transparent')}
        />

        <div className="mt-6 flex items-baseline justify-between mb-2">
          <span
            className="font-mono uppercase"
            style={{
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.08em',
              color: 'var(--color-text-tertiary)',
            }}
          >
            Progression
          </span>
          <span
            className="num-display"
            style={{ fontSize: 'var(--text-md)' }}
          >
            {overallProgress}%
          </span>
        </div>
        <div style={{ height: '1px', width: '100%', backgroundColor: 'var(--color-text)', position: 'relative', opacity: 0.2 }}>
          <div
            className="progress-bar"
            style={{
              width: `${overallProgress}%`,
              height: '2px',
              backgroundColor: 'var(--color-accent)',
              position: 'absolute',
              top: '-1px',
              left: 0,
            }}
          />
        </div>
      </div>

      {/* Phases list */}
      <div className="flex-1 overflow-y-auto px-5 py-5">
        <div className="flex items-baseline justify-between mb-4">
          <span
            className="font-mono uppercase"
            style={{
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.1em',
              color: 'var(--color-text-tertiary)',
            }}
          >
            Sommaire
          </span>
          <span className="section-index">E.01</span>
        </div>

        <nav style={{ borderTop: '1px solid var(--color-text)' }}>
          {PHASES.map(phase => {
            const pProgress = calculatePhaseProgress(project, phase);
            const isActive = phase.id === activePhase;
            const isPhaseCompleted = pProgress === 100;
            return (
              <div key={phase.id} style={{ borderBottom: '1px solid var(--color-text)' }}>
                <button
                  onClick={() => handlePhaseChange(phase.id)}
                  className="w-full flex items-baseline gap-3 py-2.5 text-left transition-colors"
                  style={{
                    backgroundColor: isActive ? 'var(--color-bg-secondary)' : 'transparent',
                    paddingLeft: isActive ? '0.5rem' : '0',
                  }}
                >
                  <span
                    className="font-mono"
                    style={{
                      fontSize: 'var(--text-xs)',
                      color: isPhaseCompleted ? 'var(--color-accent)' : isActive ? 'var(--color-accent)' : 'var(--color-text-tertiary)',
                      minWidth: '2ch',
                    }}
                  >
                    {isPhaseCompleted ? '✓' : String(phase.number).padStart(2, '0')}
                  </span>
                  <span
                    className="font-display"
                    style={{
                      fontSize: 'var(--text-xs)',
                      fontWeight: isActive ? 800 : 600,
                      color: 'var(--color-text)',
                      textTransform: 'uppercase',
                      letterSpacing: '0',
                      lineHeight: 1.2,
                    }}
                  >
                    {phase.title}
                  </span>
                </button>

                {/* Steps under active phase */}
                {isActive && currentPhase?.steps && (
                  <div className="pb-3 pl-7">
                    {currentPhase.steps.map((step, index) => {
                      const sProgress = calculateStepProgress(project, step);
                      const isStepActive = activeStep === step.id;
                      const isStepCompleted = sProgress === 100;
                      return (
                        <button
                          key={step.id}
                          onClick={() => handleStepChange(step.id)}
                          className="w-full flex items-baseline gap-2 py-1 text-left transition-colors"
                        >
                          <span
                            className="font-mono"
                            style={{
                              fontSize: 'var(--text-xs)',
                              color: isStepCompleted ? 'var(--color-accent)' : isStepActive ? 'var(--color-accent)' : 'var(--color-text-tertiary)',
                              minWidth: '1.5ch',
                            }}
                          >
                            {isStepCompleted ? '·' : index + 1}
                          </span>
                          <span
                            style={{
                              fontSize: 'var(--text-xs)',
                              color: isStepActive ? 'var(--color-text)' : 'var(--color-text-tertiary)',
                              lineHeight: 1.3,
                              fontWeight: isStepActive ? 600 : 400,
                              textDecoration: isStepActive ? 'underline' : 'none',
                              textUnderlineOffset: '2px',
                              textDecorationColor: 'var(--color-accent)',
                            }}
                          >
                            {step.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Actions footer */}
      <div className="px-5 py-4" style={{ borderTop: '1px solid var(--color-text)' }}>
        <button
          onClick={() => setShowSummary(true)}
          className="w-full flex items-center justify-between font-mono uppercase py-2 transition-colors"
          style={{
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.08em',
            color: 'var(--color-text)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text)')}
        >
          <span>Récapitulatif</span>
          <kbd>R</kbd>
        </button>
        <button
          onClick={handleExportMarkdown}
          className="w-full flex items-center justify-between font-mono uppercase py-2 transition-colors"
          style={{
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.08em',
            color: 'var(--color-text)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text)')}
        >
          <span>Export Markdown</span>
          <Download size={12} />
        </button>
        <button
          onClick={handleExportPDF}
          disabled={isGeneratingPdf}
          className="w-full flex items-center justify-between font-mono uppercase py-2 transition-colors"
          style={{
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.08em',
            color: 'var(--color-text)',
            opacity: isGeneratingPdf ? 0.5 : 1,
            cursor: isGeneratingPdf ? 'wait' : 'pointer',
          }}
          onMouseEnter={(e) => { if (!isGeneratingPdf) e.currentTarget.style.color = 'var(--color-accent)'; }}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text)')}
        >
          <span>{isGeneratingPdf ? 'Génération…' : 'Export PDF'}</span>
          <Download size={12} />
        </button>
        <button
          onClick={() => setShowKeyboardShortcuts(true)}
          className="w-full flex items-center justify-between font-mono uppercase py-2 transition-colors"
          style={{
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.08em',
            color: 'var(--color-text)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text)')}
        >
          <span>Raccourcis</span>
          <kbd>?</kbd>
        </button>

        <div
          className="pt-4 mt-3"
          style={{ borderTop: '1px solid var(--color-text)' }}
        >
          <p
            className="font-mono"
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-tertiary)',
              lineHeight: 1.6,
            }}
          >
            Conçu par{' '}
            <a
              href="https://azdinemansour.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="link-editorial"
            >
              Azdine Mansour
            </a>
          </p>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* Mobile header */}
      <div
        className="hide-desktop fixed top-0 left-0 right-0 z-40 px-4 py-3"
        style={{ backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-text)' }}
      >
        <div className="flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="p-2">
            <Menu size={18} style={{ color: 'var(--color-text)' }} />
          </button>
          <span
            className="font-mono uppercase"
            style={{ fontSize: 'var(--text-xs)', letterSpacing: '0.08em' }}
          >
            Ch. {currentPhase?.number} · {overallProgress}%
          </span>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="hide-desktop fixed inset-0 z-50 sidebar-overlay"
          style={{ backgroundColor: 'rgb(0 0 0 / 0.35)' }}
          onClick={() => setSidebarOpen(false)}
        >
          <aside
            className="w-72 h-full flex flex-col sidebar-mobile relative"
            style={{ backgroundColor: 'var(--color-bg)', borderRight: '1px solid var(--color-text)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className="hide-mobile w-64 flex flex-col h-screen sticky top-0"
        style={{ backgroundColor: 'var(--color-bg)', borderRight: '1px solid var(--color-text)' }}
      >
        {sidebarContent}
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto pt-16 md:pt-0">
        {currentStep && (
          <div className="max-w-2xl mx-auto px-6 md:px-10 py-12 md:py-20">
            {/* Top progress rule + chapter marker */}
            <div className="mb-16">
              <div
                style={{
                  height: '1px',
                  width: '100%',
                  backgroundColor: 'var(--color-text)',
                  position: 'relative',
                  marginBottom: '1rem',
                }}
              >
                <div
                  className="progress-bar"
                  style={{
                    width: `${overallProgress}%`,
                    height: '2px',
                    backgroundColor: 'var(--color-accent)',
                    position: 'absolute',
                    top: '-1px',
                    left: 0,
                  }}
                />
              </div>
              <div className="flex items-baseline justify-between">
                <span
                  className="font-mono uppercase"
                  style={{
                    fontSize: 'var(--text-xs)',
                    letterSpacing: '0.1em',
                    color: 'var(--color-text)',
                  }}
                >
                  Chapitre {currentPhase?.number} — 09
                </span>
                <span className="section-index">
                  Étape {String(currentStep.number).padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Chapter title block — Swiss hero */}
            <section className="editorial-reveal mb-16">
              <div className="grid grid-cols-[auto_1fr] gap-6 items-end mb-6">
                <div
                  className="num-display"
                  style={{
                    fontSize: 'clamp(3rem, 7vw, 6rem)',
                    color: 'var(--color-text)',
                  }}
                >
                  {String(currentPhase.number).padStart(2, '0')}
                </div>
                <p
                  className="font-mono uppercase"
                  style={{
                    fontSize: 'var(--text-xs)',
                    letterSpacing: '0.08em',
                    color: 'var(--color-accent)',
                    marginBottom: '0.5rem',
                  }}
                >
                  {currentPhase?.title}
                </p>
              </div>
              <h1
                className="font-display"
                style={{
                  fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                  lineHeight: 0.95,
                  color: 'var(--color-text)',
                }}
              >
                {currentStep.title}
              </h1>
              <p className="font-lead mt-6" style={{ color: 'var(--color-text-secondary)' }}>
                {currentStep.objective}
              </p>

              {stepProgress === 100 && (
                <span
                  className="badge mt-6 inline-flex"
                  style={{
                    backgroundColor: 'var(--color-accent)',
                    color: 'var(--color-bg)',
                    borderColor: 'var(--color-accent)',
                  }}
                >
                  ★ Étape complétée
                </span>
              )}
            </section>

            {/* Fields */}
            {currentStep.fields && currentStep.fields.length > 0 && (
              <section className="mb-14">
                <div
                  className="flex items-baseline justify-between pb-3 mb-6"
                  style={{ borderBottom: '1px solid var(--color-text)' }}
                >
                  <p
                    className="font-mono uppercase"
                    style={{
                      fontSize: 'var(--text-xs)',
                      letterSpacing: '0.1em',
                    }}
                  >
                    Documentation
                  </p>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: 'var(--text-xs)',
                      color: filledFieldsCount === totalFieldsCount ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                    }}
                  >
                    {filledFieldsCount} / {totalFieldsCount}
                  </span>
                </div>

                <div className="space-y-8">
                  {currentStep.fields.map(field => {
                    const isFilled = isFieldFilled(field.id);
                    const isEditing = editingField === field.id;
                    const displayValue = getDisplayValue(field);
                    return (
                      <div key={field.id} className="field-card">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <label
                            className="font-display flex items-baseline gap-2"
                            style={{
                              fontSize: 'var(--text-md)',
                              color: 'var(--color-text)',
                              lineHeight: 1.1,
                              textTransform: 'uppercase',
                              fontWeight: 700,
                            }}
                          >
                            {isFilled && !isEditing && (
                              <span
                                className="inline-flex items-center justify-center success-indicator flex-shrink-0"
                                style={{
                                  width: '12px',
                                  height: '12px',
                                  backgroundColor: 'var(--color-accent)',
                                  color: 'var(--color-bg)',
                                }}
                              >
                                <Check size={8} />
                              </span>
                            )}
                            {field.label}
                            {FIELD_TO_CHECKLIST_MAP[field.id] && (
                              <HelpTooltip content="Ce champ coche automatiquement l'élément correspondant dans la revue une fois rempli." />
                            )}
                          </label>

                          {isFilled && !isEditing && !hasDraft(field.id) && (
                            <button
                              onClick={() => setEditingField(field.id)}
                              className="font-mono uppercase flex items-center gap-1.5 py-1 flex-shrink-0 transition-colors"
                              style={{
                                fontSize: 'var(--text-xs)',
                                letterSpacing: '0.06em',
                                color: 'var(--color-text-tertiary)',
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
                              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-tertiary)')}
                            >
                              <Edit3 size={11} />
                              <span>Modifier</span>
                            </button>
                          )}
                          {(isEditing || hasDraft(field.id)) && (
                            <div className="flex items-center gap-3 flex-shrink-0">
                              <button
                                onClick={() => handleCancelField(field.id)}
                                className="font-mono uppercase flex items-center gap-1.5 py-1 transition-colors"
                                style={{
                                  fontSize: 'var(--text-xs)',
                                  letterSpacing: '0.06em',
                                  color: 'var(--color-text-tertiary)',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text)')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-tertiary)')}
                              >
                                <span>Annuler</span>
                              </button>
                              <button
                                onClick={() => handleSaveField(field.id)}
                                disabled={!hasDraft(field.id)}
                                className="font-mono uppercase flex items-center gap-1.5 py-1 transition-colors"
                                style={{
                                  fontSize: 'var(--text-xs)',
                                  letterSpacing: '0.06em',
                                  color: hasDraft(field.id) ? 'var(--color-accent)' : 'var(--color-text-tertiary)',
                                  cursor: hasDraft(field.id) ? 'pointer' : 'not-allowed',
                                  opacity: hasDraft(field.id) ? 1 : 0.5,
                                }}
                              >
                                <Check size={11} />
                                <span>Sauvegarder</span>
                              </button>
                            </div>
                          )}
                        </div>

                        {isFilled && !isEditing && !hasDraft(field.id) ? (
                          <div
                            onClick={() => setEditingField(field.id)}
                            className="cursor-pointer transition-colors"
                            style={{
                              padding: '0.75rem 1rem',
                              borderLeft: '2px solid var(--color-text)',
                              color: 'var(--color-text-secondary)',
                              fontSize: 'var(--text-sm)',
                              lineHeight: 1.6,
                              whiteSpace: 'pre-wrap',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.borderLeftColor = 'var(--color-accent)')}
                            onMouseLeave={(e) => (e.currentTarget.style.borderLeftColor = 'var(--color-text)')}
                          >
                            {displayValue}
                          </div>
                        ) : (
                          <>
                            {renderField(field)}
                            {hasDraft(field.id) && !isEditing && (
                              <p
                                className="font-mono uppercase mt-2"
                                style={{
                                  fontSize: 'var(--text-xs)',
                                  letterSpacing: '0.08em',
                                  color: 'var(--color-accent)',
                                }}
                              >
                                ✱ Modifications non sauvegardées
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Checklist accordion */}
            {currentStep.checklist && currentStep.checklist.length > 0 && (
              <section className="mb-14">
                <button
                  onClick={() => setChecklistOpen(!checklistOpen)}
                  className="w-full flex items-baseline justify-between py-3 group transition-colors"
                  style={{
                    borderTop: '1px solid var(--color-text)',
                    borderBottom: checklistOpen ? '1px solid var(--color-text)' : '1px solid var(--color-text)',
                  }}
                >
                  <div className="flex items-baseline gap-3">
                    <ChevronDown
                      size={12}
                      style={{
                        transform: checklistOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
                        transition: 'transform var(--duration-fast) var(--ease)',
                        color: 'var(--color-text)',
                      }}
                    />
                    <span
                      className="font-mono uppercase"
                      style={{
                        fontSize: 'var(--text-xs)',
                        letterSpacing: '0.1em',
                      }}
                    >
                      Revue de l'étape
                    </span>
                  </div>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: 'var(--text-xs)',
                      color: checkedCount === totalCheckCount ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                    }}
                  >
                    {checkedCount} / {totalCheckCount}
                  </span>
                </button>

                {checklistOpen && (
                  <div className="py-4 space-y-3 expand-enter">
                    {currentStep.checklist.map((check) => {
                      const isChecked = project.checklist?.[check.id] || false;
                      return (
                        <label
                          key={check.id}
                          className="flex items-start gap-3 cursor-pointer py-1"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleCheckToggle(check.id)}
                            className="mt-0.5"
                          />
                          <span
                            style={{
                              fontSize: 'var(--text-sm)',
                              color: isChecked ? 'var(--color-text-tertiary)' : 'var(--color-text)',
                              textDecoration: isChecked ? 'line-through' : 'none',
                              lineHeight: 1.5,
                            }}
                          >
                            {check.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </section>
            )}

            {/* Deliverable callout */}
            {currentStep.deliverable && (
              <section
                className="mb-14"
                style={{
                  paddingLeft: '1.25rem',
                  borderLeft: `2px solid var(--color-text)`,
                }}
              >
                <p
                  className="font-mono uppercase mb-2"
                  style={{
                    fontSize: 'var(--text-xs)',
                    letterSpacing: '0.1em',
                    color: 'var(--color-accent)',
                  }}
                >
                  Livrable
                </p>
                <p
                  className="font-lead"
                  style={{ color: 'var(--color-text)' }}
                >
                  {currentStep.deliverable}
                </p>
              </section>
            )}

            {/* Navigation */}
            <nav
              className="flex items-center justify-between pt-8"
              style={{ borderTop: '1px solid var(--color-text)' }}
            >
              {prevStep ? (
                <button
                  onClick={() => {
                    setActivePhase(prevStep.phaseId);
                    setActiveStep(prevStep.id);
                    updateProject(id, { currentPhase: prevStep.phaseId, currentStep: prevStep.id });
                  }}
                  className="text-left group"
                >
                  <span
                    className="font-mono uppercase block"
                    style={{
                      fontSize: 'var(--text-xs)',
                      letterSpacing: '0.08em',
                      color: 'var(--color-text-tertiary)',
                      marginBottom: '0.25rem',
                    }}
                  >
                    ← Précédent
                  </span>
                  <span
                    className="font-display"
                    style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 700,
                      color: 'var(--color-text)',
                      lineHeight: 1.1,
                      textTransform: 'uppercase',
                    }}
                  >
                    {prevStep.title}
                  </span>
                </button>
              ) : <div />}

              {nextStep ? (
                <button
                  onClick={() => {
                    setActivePhase(nextStep.phaseId);
                    setActiveStep(nextStep.id);
                    updateProject(id, { currentPhase: nextStep.phaseId, currentStep: nextStep.id });
                  }}
                  className="text-right group"
                >
                  <span
                    className="font-mono uppercase block"
                    style={{
                      fontSize: 'var(--text-xs)',
                      letterSpacing: '0.08em',
                      color: 'var(--color-accent)',
                      marginBottom: '0.25rem',
                    }}
                  >
                    Suivant →
                  </span>
                  <span
                    className="font-display"
                    style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 800,
                      color: 'var(--color-text)',
                      lineHeight: 1.1,
                      textTransform: 'uppercase',
                    }}
                  >
                    {nextStep.title}
                  </span>
                </button>
              ) : (
                <span
                  className="badge"
                  style={{
                    backgroundColor: 'var(--color-accent)',
                    color: 'var(--color-bg)',
                    borderColor: 'var(--color-accent)',
                  }}
                >
                  ★ Fin du parcours
                </span>
              )}
            </nav>

            {!nextStep && (() => {
              const stats = getCompletionStats(project);
              return (
                <section
                  className="mt-16 editorial-reveal"
                  style={{
                    borderTop: '2px solid var(--color-accent)',
                    paddingTop: '2.5rem',
                  }}
                >
                  <div className="flex items-baseline justify-between mb-6">
                    <span
                      className="font-mono uppercase"
                      style={{
                        fontSize: 'var(--text-xs)',
                        letterSpacing: '0.1em',
                        color: 'var(--color-accent)',
                      }}
                    >
                      ★ Parcours terminé
                    </span>
                    <span className="section-index">Z.01</span>
                  </div>

                  <h2
                    className="font-display"
                    style={{
                      fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
                      lineHeight: 0.95,
                      letterSpacing: '-0.03em',
                      marginBottom: '1rem',
                    }}
                  >
                    Méthode<br />terminée.
                  </h2>

                  <p className="font-lead" style={{ maxWidth: '48ch' }}>
                    Votre brief éditorial est prêt. Téléchargez-le au format que vous préférez pour le partager, l'archiver ou le copier ailleurs.
                  </p>

                  {/* Completion indicator */}
                  <div
                    className="grid grid-cols-3 gap-4 mt-10 mb-10"
                    style={{
                      borderTop: '1px solid var(--color-text)',
                      borderBottom: '1px solid var(--color-text)',
                      padding: '1.5rem 0',
                    }}
                  >
                    <div>
                      <p
                        className="font-mono uppercase mb-2"
                        style={{
                          fontSize: 'var(--text-xs)',
                          letterSpacing: '0.1em',
                          color: 'var(--color-text-tertiary)',
                        }}
                      >
                        Champs
                      </p>
                      <p
                        className="num-display"
                        style={{
                          fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                          color: 'var(--color-text)',
                        }}
                      >
                        {stats.filledFields}<span style={{ color: 'var(--color-text-tertiary)', fontSize: '0.6em' }}> / {stats.totalFields}</span>
                      </p>
                    </div>
                    <div>
                      <p
                        className="font-mono uppercase mb-2"
                        style={{
                          fontSize: 'var(--text-xs)',
                          letterSpacing: '0.1em',
                          color: 'var(--color-text-tertiary)',
                        }}
                      >
                        Étapes
                      </p>
                      <p
                        className="num-display"
                        style={{
                          fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                          color: 'var(--color-text)',
                        }}
                      >
                        {stats.completedSteps}<span style={{ color: 'var(--color-text-tertiary)', fontSize: '0.6em' }}> / {stats.totalSteps}</span>
                      </p>
                    </div>
                    <div>
                      <p
                        className="font-mono uppercase mb-2"
                        style={{
                          fontSize: 'var(--text-xs)',
                          letterSpacing: '0.1em',
                          color: 'var(--color-text-tertiary)',
                        }}
                      >
                        Avancement
                      </p>
                      <p
                        className="num-display"
                        style={{
                          fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                          color: stats.progress === 100 ? 'var(--color-accent)' : 'var(--color-text)',
                        }}
                      >
                        {stats.progress}%
                      </p>
                    </div>
                  </div>

                  {/* CTA buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleExportMarkdown}
                      className="btn-primary flex items-center justify-center gap-2"
                      style={{ padding: '1rem 1.75rem' }}
                    >
                      <Download size={14} />
                      <span>Télécharger en Markdown</span>
                    </button>
                    <button
                      onClick={handleExportPDF}
                      disabled={isGeneratingPdf}
                      className="btn-secondary flex items-center justify-center gap-2"
                      style={{
                        padding: '1rem 1.75rem',
                        opacity: isGeneratingPdf ? 0.5 : 1,
                        cursor: isGeneratingPdf ? 'wait' : 'pointer',
                      }}
                    >
                      <Download size={14} />
                      <span>{isGeneratingPdf ? 'Génération…' : 'Télécharger en PDF'}</span>
                    </button>
                  </div>

                  {stats.progress < 100 && (
                    <p
                      className="font-mono uppercase mt-6"
                      style={{
                        fontSize: 'var(--text-xs)',
                        letterSpacing: '0.08em',
                        color: 'var(--color-text-tertiary)',
                      }}
                    >
                      Le brief intègre uniquement les champs renseignés. Vous pouvez revenir compléter et re-exporter à tout moment.
                    </p>
                  )}
                </section>
              );
            })()}
          </div>
        )}
      </main>

      <KeyboardShortcuts isOpen={showKeyboardShortcuts} onClose={() => setShowKeyboardShortcuts(false)} />

      {/* Summary panel */}
      {showSummary && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 sidebar-overlay"
            style={{ backgroundColor: 'rgb(0 0 0 / 0.35)' }}
            onClick={() => setShowSummary(false)}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-full max-w-xl slide-panel overflow-hidden flex flex-col"
            style={{
              backgroundColor: 'var(--color-bg)',
              borderLeft: '1px solid var(--color-text)',
            }}
          >
            <div
              className="px-8 py-6 flex items-baseline justify-between"
              style={{ borderBottom: '1px solid var(--color-text)' }}
            >
              <div>
                <p
                  className="font-mono uppercase mb-2"
                  style={{
                    fontSize: 'var(--text-xs)',
                    letterSpacing: '0.1em',
                    color: 'var(--color-text-tertiary)',
                  }}
                >
                  Récapitulatif · F.01
                </p>
                <h2 className="font-display" style={{ fontSize: 'var(--text-xl)', lineHeight: 0.95 }}>
                  {project.title}
                </h2>
              </div>
              <button
                onClick={() => setShowSummary(false)}
                className="p-2 transition-colors"
                style={{ color: 'var(--color-text)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text)')}
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-8">
              {getSummaryData().length === 0 ? (
                <div className="py-16 text-center">
                  <p
                    className="font-display"
                    style={{
                      fontSize: 'var(--text-lg)',
                      color: 'var(--color-text-tertiary)',
                      textTransform: 'uppercase',
                      lineHeight: 0.95,
                    }}
                  >
                    Rien à récapituler<br />pour l'instant.
                  </p>
                </div>
              ) : (
                <div className="space-y-10">
                  {getSummaryData().map(phaseData => (
                    <div key={phaseData.phase.id}>
                      <div
                        className="flex items-baseline justify-between mb-4 pb-2"
                        style={{ borderBottom: '1px solid var(--color-text)' }}
                      >
                        <div className="flex items-baseline gap-3">
                          <span
                            className="num-display"
                            style={{
                              fontSize: 'var(--text-xl)',
                              color: phaseData.progress === 100 ? 'var(--color-accent)' : 'var(--color-text)',
                            }}
                          >
                            {String(phaseData.phase.number).padStart(2, '0')}
                          </span>
                          <span
                            className="font-display"
                            style={{ fontSize: 'var(--text-md)', color: 'var(--color-text)', textTransform: 'uppercase' }}
                          >
                            {phaseData.phase.title}
                          </span>
                        </div>
                        <span
                          className="font-mono"
                          style={{
                            fontSize: 'var(--text-xs)',
                            color: phaseData.progress === 100 ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                          }}
                        >
                          {phaseData.progress}%
                        </span>
                      </div>
                      {phaseData.fields.length > 0 && (
                        <div className="space-y-5 pl-9">
                          {phaseData.fields.map((field, idx) => (
                            <div key={idx}>
                              <p
                                className="font-mono uppercase mb-1"
                                style={{
                                  fontSize: 'var(--text-xs)',
                                  letterSpacing: '0.06em',
                                  color: 'var(--color-text-tertiary)',
                                }}
                              >
                                {field.label}
                              </p>
                              <p
                                style={{
                                  fontSize: 'var(--text-sm)',
                                  color: 'var(--color-text)',
                                  lineHeight: 1.6,
                                  whiteSpace: 'pre-wrap',
                                }}
                              >
                                {field.value.length > 240 ? field.value.substring(0, 240) + '…' : field.value}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="px-8 py-6 flex flex-col sm:flex-row gap-3" style={{ borderTop: '1px solid var(--color-text)' }}>
              <button
                onClick={() => {
                  handleExportMarkdown();
                  setShowSummary(false);
                }}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <Download size={14} />
                <span>Markdown</span>
              </button>
              <button
                onClick={async () => {
                  await handleExportPDF();
                  setShowSummary(false);
                }}
                disabled={isGeneratingPdf}
                className="btn-secondary flex-1 flex items-center justify-center gap-2"
                style={{
                  opacity: isGeneratingPdf ? 0.5 : 1,
                  cursor: isGeneratingPdf ? 'wait' : 'pointer',
                }}
              >
                <Download size={14} />
                <span>{isGeneratingPdf ? 'Génération…' : 'PDF'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
