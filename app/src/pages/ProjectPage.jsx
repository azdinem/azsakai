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
  ChevronUp,
  Check,
  Package,
  Download,
} from '../components/Icons';

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
  const [activePhase, setActivePhase] = useState('phase0');
  const [activeStep, setActiveStep] = useState('step0_1');
  const [expandedSections, setExpandedSections] = useState({ checklist: true, documentation: true });

  useEffect(() => {
    const p = getProject(id);
    if (p) {
      setProject(p);
      setActivePhase(p.currentPhase || 'phase0');
      setActiveStep(p.currentStep || 'step0_1');
    }
  }, [id, getProject]);

  useEffect(() => {
    const p = getProject(id);
    if (p) {
      setProject(p);
    }
  });

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <p className="text-[var(--color-text-secondary)]">Projet non trouvé</p>
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

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
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

  const getPhaseIcon = (iconName) => {
    const IconComponent = phaseIcons[iconName];
    return IconComponent ? <IconComponent size={16} /> : null;
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
          <div className="space-y-2 p-3 bg-[var(--color-bg-secondary)] rounded-lg">
            {options.map(opt => (
              <label key={opt.id} className="flex items-start gap-3 cursor-pointer p-2 hover:bg-[var(--color-bg)] rounded-md transition-colors">
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

  const TypeIcon = typeIcons[project.type] || FileText;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      {/* Header */}
      <header className="border-b border-[var(--color-border)] bg-[var(--color-bg)] sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-[var(--color-bg-secondary)] rounded-lg text-[var(--color-text-secondary)] transition-colors flex-shrink-0"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="w-8 h-8 bg-[var(--color-bg-secondary)] rounded-lg flex items-center justify-center flex-shrink-0 text-[var(--color-text-secondary)]">
                <TypeIcon size={18} />
              </div>
              <input
                type="text"
                value={project.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="text-[var(--text-lg)] font-semibold text-[var(--color-text)] bg-transparent border-none focus:outline-none focus:ring-0 min-w-0 flex-1"
                style={{ fontFamily: 'var(--font-heading)' }}
              />
            </div>

            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="hidden sm:flex items-center gap-3">
                <span className="text-[var(--text-sm)] text-[var(--color-text-secondary)]">
                  {overallProgress}%
                </span>
                <div className="w-24 h-2 bg-[var(--color-bg-tertiary)] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${overallProgress}%`,
                      backgroundColor: overallProgress === 100 ? 'var(--color-success)' : 'var(--color-accent)'
                    }}
                  />
                </div>
              </div>
              <button
                onClick={() => exportProjectMarkdown(id)}
                className="p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] rounded-lg transition-colors"
                title="Exporter en Markdown"
              >
                <Download size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Phase Tabs */}
        <div className="border-t border-[var(--color-border)] overflow-x-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex">
              {PHASES.map(phase => {
                const phaseProgress = calculatePhaseProgress(project, phase);
                const isActive = activePhase === phase.id;

                return (
                  <button
                    key={phase.id}
                    onClick={() => handlePhaseChange(phase.id)}
                    className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap text-[var(--text-sm)] ${
                      isActive
                        ? 'border-[var(--color-accent)] text-[var(--color-accent)]'
                        : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
                    }`}
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {getPhaseIcon(phase.icon)}
                    <span className="hidden sm:inline">{phase.number}.</span>
                    <span className="hidden md:inline">{phase.title}</span>
                    <span className="md:hidden">P{phase.number}</span>
                    {phaseProgress === 100 && (
                      <Check size={14} className="text-[var(--color-success)]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Steps Sidebar */}
        <aside className="lg:w-64 border-b lg:border-b-0 lg:border-r border-[var(--color-border)] bg-[var(--color-bg-secondary)] overflow-x-auto lg:overflow-y-auto">
          <div className="flex lg:flex-col p-2 lg:p-4 gap-1">
            {currentPhase?.steps.map(step => {
              const stepProgress = calculateStepProgress(project, step);
              const isStepActive = activeStep === step.id;

              return (
                <button
                  key={step.id}
                  onClick={() => handleStepChange(step.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-[var(--text-sm)] transition-colors whitespace-nowrap lg:whitespace-normal lg:text-left ${
                    isStepActive
                      ? 'bg-[var(--color-accent-light)] text-[var(--color-accent)]'
                      : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text)]'
                  }`}
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  <span className="font-medium">{step.number}</span>
                  <span className="hidden lg:inline flex-1 truncate">{step.title}</span>
                  {stepProgress === 100 && (
                    <Check size={14} className="text-[var(--color-success)] flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {currentStep && (
            <div className="max-w-3xl mx-auto p-6 lg:p-8">
              {/* Step Header */}
              <div className="mb-6">
                <h2 className="text-[var(--text-xl)] font-semibold text-[var(--color-text)] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  {currentStep.title}
                </h2>
                <p className="text-[var(--text-base)] text-[var(--color-text-secondary)]">
                  {currentStep.objective}
                </p>
              </div>

              {/* Checklist Section */}
              <div className="mb-6">
                <button
                  onClick={() => toggleSection('checklist')}
                  className="w-full flex items-center justify-between p-3 bg-[var(--color-bg-secondary)] rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors"
                >
                  <span className="text-[var(--text-sm)] font-medium text-[var(--color-text)] uppercase tracking-wide" style={{ fontFamily: 'var(--font-heading)' }}>
                    Checklist ({currentStep.checklist.filter(c => project.checklist?.[c.id]).length}/{currentStep.checklist.length})
                  </span>
                  {expandedSections.checklist ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>

                {expandedSections.checklist && (
                  <div className="mt-3 space-y-2">
                    {currentStep.checklist.map(check => (
                      <label
                        key={check.id}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-[var(--color-bg-secondary)] cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={project.checklist?.[check.id] || false}
                          onChange={() => handleCheckToggle(check.id)}
                          className="mt-0.5"
                        />
                        <span className={`text-[var(--text-base)] ${project.checklist?.[check.id] ? 'text-[var(--color-text-secondary)] line-through' : 'text-[var(--color-text)]'}`}>
                          {check.label}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Documentation Section */}
              {currentStep.fields && currentStep.fields.length > 0 && (
                <div className="mb-6">
                  <button
                    onClick={() => toggleSection('documentation')}
                    className="w-full flex items-center justify-between p-3 bg-[var(--color-bg-secondary)] rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors"
                  >
                    <span className="text-[var(--text-sm)] font-medium text-[var(--color-text)] uppercase tracking-wide" style={{ fontFamily: 'var(--font-heading)' }}>
                      Documentation
                    </span>
                    {expandedSections.documentation ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>

                  {expandedSections.documentation && (
                    <div className="mt-4 space-y-5">
                      {currentStep.fields.map(field => (
                        <div key={field.id}>
                          <label className="block text-[var(--text-sm)] font-medium text-[var(--color-text)] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                            {field.label}
                          </label>
                          {renderField(field)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Deliverable */}
              <div className="p-4 bg-[var(--color-bg-secondary)] rounded-lg flex items-start gap-3">
                <Package size={18} className="text-[var(--color-text-secondary)] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[var(--text-sm)] font-medium text-[var(--color-text)]" style={{ fontFamily: 'var(--font-heading)' }}>Livrable</span>
                  <p className="text-[var(--text-base)] text-[var(--color-text-secondary)]">{currentStep.deliverable}</p>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t border-[var(--color-border)]">
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
                          className="flex items-center gap-2 px-4 py-2.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] rounded-lg transition-colors text-[var(--text-base)]"
                        >
                          <ChevronLeft size={18} />
                          <span className="hidden sm:inline">{prevStep.number}</span>
                        </button>
                      ) : <div />}
                      {nextStep ? (
                        <button
                          onClick={() => {
                            setActivePhase(nextStep.phaseId);
                            setActiveStep(nextStep.id);
                            updateProject(id, { currentPhase: nextStep.phaseId, currentStep: nextStep.id });
                          }}
                          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-text)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity text-[var(--text-base)]"
                          style={{ fontFamily: 'var(--font-heading)' }}
                        >
                          <span>Suivant</span>
                          <ChevronRight size={18} />
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-success)] text-white rounded-lg font-medium text-[var(--text-base)]" style={{ fontFamily: 'var(--font-heading)' }}>
                          <Check size={18} />
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
      </div>
    </div>
  );
}
