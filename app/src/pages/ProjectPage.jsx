import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import {
  PHASES,
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

export default function ProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProject, updateProject, updateProjectField, toggleChecklistItem, exportProjectMarkdown } = useData();

  const [project, setProject] = useState(null);
  const [activePhase, setActivePhase] = useState('phase1');
  const [activeStep, setActiveStep] = useState('step1_1');

  useEffect(() => {
    const p = getProject(id);
    if (p) {
      setProject(p);
      setActivePhase(p.currentPhase || 'phase1');
      setActiveStep(p.currentStep || 'step1_1');
    }
  }, [id, getProject]);

  // Mettre à jour le projet quand les données changent dans le contexte
  useEffect(() => {
    const p = getProject(id);
    if (p) {
      setProject(p);
    }
  });

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--notion-text-secondary)]">Projet non trouvé</p>
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
    updateProjectField(id, fieldId, value);
  };

  const handleCheckToggle = (checkId) => {
    toggleChecklistItem(id, checkId);
  };

  const handleTitleChange = (newTitle) => {
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
            className="w-full px-3 py-2 border border-[var(--notion-border)] rounded-md text-[var(--notion-text)] bg-white"
            placeholder={field.placeholder}
            maxLength={field.maxLength}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className="w-full px-3 py-2 border border-[var(--notion-border)] rounded-md text-[var(--notion-text)] bg-white resize-y"
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
            className="w-full px-3 py-2 border border-[var(--notion-border)] rounded-md text-[var(--notion-text)] bg-white"
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
          <div className="space-y-2">
            {options.map(opt => (
              <label key={opt.id} className="flex items-start gap-3 cursor-pointer">
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
                <span className="text-sm text-[var(--notion-text)]">
                  {opt.label}
                  {opt.subLabel && <span className="text-[var(--notion-text-secondary)]"> {opt.subLabel}</span>}
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
            className="w-full px-3 py-2 border border-[var(--notion-border)] rounded-md text-[var(--notion-text)] bg-white"
          />
        );

      case 'paa_table':
      case 'info_gain_table':
      case 'table':
        return (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className="w-full px-3 py-2 border border-[var(--notion-border)] rounded-md text-[var(--notion-text)] bg-white font-mono text-sm resize-y"
            placeholder={field.columns ? field.columns.join(' | ') + '\n---\n...' : field.placeholder}
            rows={6}
          />
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className="w-full px-3 py-2 border border-[var(--notion-border)] rounded-md text-[var(--notion-text)] bg-white"
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[var(--notion-bg)] flex flex-col">
      {/* Header */}
      <header className="border-b border-[var(--notion-border)] bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-[var(--notion-bg-secondary)] rounded-md text-[var(--notion-text-secondary)]"
              >
                ← Retour
              </button>
              <div className="flex items-center gap-2">
                <span className="text-xl">{CONTENT_TYPES.find(t => t.id === project.type)?.icon}</span>
                <input
                  type="text"
                  value={project.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="text-lg font-semibold text-[var(--notion-text)] bg-transparent border-none focus:outline-none focus:ring-0"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-[var(--notion-text-secondary)]">
                Progression: <span className="font-medium text-[var(--notion-text)]">{overallProgress}%</span>
              </div>
              <div className="w-32 h-2 bg-[var(--notion-bg-tertiary)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--notion-success)] rounded-full transition-all"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
              <button
                onClick={() => exportProjectMarkdown(id)}
                className="px-3 py-1.5 text-sm text-[var(--notion-text-secondary)] hover:bg-[var(--notion-bg-secondary)] rounded-md"
              >
                📄 Export MD
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Sidebar - Phases */}
        <aside className="w-64 border-r border-[var(--notion-border)] bg-[var(--notion-bg-secondary)] overflow-y-auto">
          <nav className="p-4">
            {PHASES.map(phase => {
              const phaseProgress = calculatePhaseProgress(project, phase);
              const isActive = activePhase === phase.id;

              return (
                <div key={phase.id} className="mb-2">
                  <button
                    onClick={() => handlePhaseChange(phase.id)}
                    className={`w-full text-left p-3 rounded-md transition-colors ${
                      isActive
                        ? 'bg-white shadow-sm'
                        : 'hover:bg-[var(--notion-bg-tertiary)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>{phase.icon}</span>
                        <span className={`text-sm font-medium ${isActive ? 'text-[var(--notion-text)]' : 'text-[var(--notion-text-secondary)]'}`}>
                          Phase {phase.number}
                        </span>
                      </div>
                      <span className={`text-xs ${phaseProgress === 100 ? 'text-[var(--notion-success)]' : 'text-[var(--notion-text-secondary)]'}`}>
                        {phaseProgress}%
                      </span>
                    </div>
                    <div className="text-xs text-[var(--notion-text-secondary)] mt-1 truncate">
                      {phase.title}
                    </div>
                  </button>

                  {/* Steps */}
                  {isActive && (
                    <div className="ml-4 mt-2 space-y-1">
                      {phase.steps.map(step => {
                        const stepProgress = calculateStepProgress(project, step);
                        const isStepActive = activeStep === step.id;

                        return (
                          <button
                            key={step.id}
                            onClick={() => handleStepChange(step.id)}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                              isStepActive
                                ? 'bg-[var(--notion-accent-light)] text-[var(--notion-accent)]'
                                : 'text-[var(--notion-text-secondary)] hover:bg-white'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="truncate">{step.number}</span>
                              {stepProgress === 100 && <span className="text-[var(--notion-success)]">✓</span>}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {currentStep && (
            <div className="max-w-3xl mx-auto p-8">
              {/* Step Header */}
              <div className="mb-8">
                <div className="flex items-center gap-2 text-sm text-[var(--notion-text-secondary)] mb-2">
                  <span>{currentPhase?.icon}</span>
                  <span>Phase {currentPhase?.number}: {currentPhase?.title}</span>
                  <span>→</span>
                  <span>Étape {currentStep.number}</span>
                </div>
                <h2 className="text-2xl font-semibold text-[var(--notion-text)] mb-2">
                  {currentStep.title}
                </h2>
                <p className="text-[var(--notion-text-secondary)]">
                  {currentStep.objective}
                </p>
              </div>

              {/* Checklist */}
              <div className="mb-8">
                <h3 className="text-sm font-medium text-[var(--notion-text)] uppercase tracking-wide mb-4">
                  Checklist
                </h3>
                <div className="space-y-3">
                  {currentStep.checklist.map(check => (
                    <label
                      key={check.id}
                      className="flex items-start gap-3 p-3 rounded-md hover:bg-[var(--notion-bg-secondary)] cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={project.checklist?.[check.id] || false}
                        onChange={() => handleCheckToggle(check.id)}
                        className="mt-0.5"
                      />
                      <span className={`text-sm ${project.checklist?.[check.id] ? 'text-[var(--notion-text-secondary)] line-through' : 'text-[var(--notion-text)]'}`}>
                        {check.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Fields */}
              {currentStep.fields && currentStep.fields.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-medium text-[var(--notion-text)] uppercase tracking-wide mb-4">
                    Documentation
                  </h3>
                  <div className="space-y-6">
                    {currentStep.fields.map(field => (
                      <div key={field.id}>
                        <label className="block text-sm font-medium text-[var(--notion-text)] mb-2">
                          {field.label}
                        </label>
                        {renderField(field)}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Deliverable */}
              <div className="p-4 bg-[var(--notion-bg-secondary)] rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <span>📦</span>
                  <span className="font-medium text-[var(--notion-text)]">Livrable:</span>
                  <span className="text-[var(--notion-text-secondary)]">{currentStep.deliverable}</span>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-8 border-t border-[var(--notion-border)]">
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
                          className="px-4 py-2 text-[var(--notion-text-secondary)] hover:bg-[var(--notion-bg-secondary)] rounded-md"
                        >
                          ← {prevStep.number} {prevStep.title}
                        </button>
                      ) : <div />}
                      {nextStep ? (
                        <button
                          onClick={() => {
                            setActivePhase(nextStep.phaseId);
                            setActiveStep(nextStep.id);
                            updateProject(id, { currentPhase: nextStep.phaseId, currentStep: nextStep.id });
                          }}
                          className="px-4 py-2 bg-[var(--notion-text)] text-white rounded-md font-medium hover:opacity-90"
                        >
                          {nextStep.number} {nextStep.title} →
                        </button>
                      ) : (
                        <div className="px-4 py-2 bg-[var(--notion-success)] text-white rounded-md font-medium">
                          ✓ Processus terminé
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
