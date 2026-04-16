import {
  PHASES,
  READER_PROFILES,
  FRAMEWORKS,
  SERP_ELEMENTS,
  CONTENT_FORMATS,
  INFO_GAIN_SOURCES,
  calculateProgress,
} from '../data/processData';

/* ---------- utils ---------- */

function resolveOptions(optionsRef) {
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
}

function isFilled(v) {
  if (v === null || v === undefined) return false;
  if (typeof v === 'string') return v.trim().length > 0;
  if (Array.isArray(v)) return v.length > 0;
  return Boolean(v);
}

function displayValue(field, raw) {
  if (!isFilled(raw)) return '';
  const options = resolveOptions(field.options);
  if (field.type === 'select' && options.length > 0) {
    return options.find(o => o.id === raw)?.label || raw;
  }
  if (field.type === 'multicheck' && Array.isArray(raw)) {
    return raw.map(v => options.find(o => o.id === v)?.label || v).join(', ');
  }
  if (field.type === 'date' && typeof raw === 'string') {
    try { return new Date(raw).toLocaleDateString('fr-FR'); } catch { return raw; }
  }
  return typeof raw === 'string' ? raw : JSON.stringify(raw);
}

function findField(fieldId) {
  for (const phase of PHASES) {
    for (const step of phase.steps) {
      for (const field of step.fields || []) {
        if (field.id === fieldId) return field;
      }
    }
  }
  return null;
}

function readField(project, fieldId) {
  const field = findField(fieldId);
  if (!field) return null;
  const raw = project.fields?.[fieldId];
  if (!isFilled(raw)) return null;
  return { field, raw, display: displayValue(field, raw) };
}

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'brief';
}

function download(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ---------- stats ---------- */

function countFieldsStats(project) {
  let filled = 0, total = 0;
  PHASES.forEach(phase => {
    phase.steps.forEach(step => {
      step.fields?.forEach(f => {
        total++;
        if (isFilled(project.fields?.[f.id])) filled++;
      });
    });
  });
  return { filled, total };
}

function countStepsStats(project) {
  let completed = 0, total = 0;
  PHASES.forEach(phase => {
    phase.steps.forEach(step => {
      total++;
      const fields = step.fields || [];
      if (fields.length > 0) {
        const allDone = fields.every(f => isFilled(project.fields?.[f.id]));
        if (allDone) completed++;
      }
    });
  });
  return { completed, total };
}

export function getCompletionStats(project) {
  const { filled, total } = countFieldsStats(project);
  const { completed, total: totalSteps } = countStepsStats(project);
  return {
    filledFields: filled,
    totalFields: total,
    completedSteps: completed,
    totalSteps,
    progress: calculateProgress(project),
  };
}

/* ---------- Brief à la une (featured fields) ---------- */

const BRIEF_FEATURED_FIELDS = [
  'main_keyword',
  'secondary_keywords',
  'search_volume',
  'business_objective',
  'deadline',
  'reader_profile',
  'knowledge_level',
  'main_question',
  'main_cta',
  'selected_framework',
  'content_format',
  'tone_of_voice',
  'salient_terms',
  'target_length',
  'h1_title',
  'meta_title',
  'meta_description',
  'target_url',
  'author',
  'publication_date',
  'main_objective',
  'kpis',
  'smart_objective',
];

/* ---------- Markdown ---------- */

export function buildBriefMarkdown(project) {
  const lines = [];
  const stats = getCompletionStats(project);
  const typeLabel = project.type === 'article' ? 'Article' : 'Landing Page';

  lines.push(`# ${project.title}`);
  lines.push('');
  lines.push(`> Brief éditorial · azsakai`);
  lines.push('');
  lines.push(`**Type** : ${typeLabel}  `);
  lines.push(`**Créé le** : ${new Date(project.createdAt).toLocaleDateString('fr-FR')}  `);
  lines.push(`**Dernière MAJ** : ${new Date(project.updatedAt).toLocaleDateString('fr-FR')}  `);
  lines.push(`**Avancement** : ${stats.progress}% · ${stats.filledFields}/${stats.totalFields} champs · ${stats.completedSteps}/${stats.totalSteps} étapes`);
  lines.push('');
  lines.push('---');
  lines.push('');

  // BRIEF À LA UNE
  lines.push('## Brief à la une');
  lines.push('');
  let anyFeatured = false;
  BRIEF_FEATURED_FIELDS.forEach(fieldId => {
    const entry = readField(project, fieldId);
    if (entry) {
      anyFeatured = true;
      if (entry.display.length > 120) {
        lines.push(`**${entry.field.label}** :`);
        lines.push('');
        lines.push(entry.display);
        lines.push('');
      } else {
        lines.push(`**${entry.field.label}** : ${entry.display}  `);
      }
    }
  });
  if (!anyFeatured) {
    lines.push(`*Aucun champ clé renseigné pour l'instant.*`);
  }
  lines.push('');
  lines.push('---');
  lines.push('');

  // RÉCAPITULATIF EXHAUSTIF
  lines.push('## Récapitulatif exhaustif');
  lines.push('');
  PHASES.forEach(phase => {
    lines.push(`### ${String(phase.number).padStart(2, '0')} — ${phase.title}`);
    lines.push('');
    if (phase.description) {
      lines.push(`*${phase.description}*`);
      lines.push('');
    }
    phase.steps.forEach(step => {
      lines.push(`#### ${step.number} — ${step.title}`);
      lines.push('');
      if (step.objective) {
        lines.push(`_${step.objective}_`);
        lines.push('');
      }
      let anyField = false;
      step.fields?.forEach(field => {
        const raw = project.fields?.[field.id];
        if (isFilled(raw)) {
          anyField = true;
          const display = displayValue(field, raw);
          if (display.length > 120) {
            lines.push(`**${field.label}** :`);
            lines.push('');
            lines.push(display);
            lines.push('');
          } else {
            lines.push(`**${field.label}** : ${display}  `);
          }
        }
      });
      if (!anyField && (step.fields?.length || 0) > 0) {
        lines.push(`*(champs non renseignés)*`);
        lines.push('');
      } else if (!anyField) {
        lines.push('');
      }
      if (step.checklist?.length) {
        lines.push(`**Revue** :`);
        lines.push('');
        step.checklist.forEach(check => {
          const done = project.checklist?.[check.id];
          lines.push(`- [${done ? 'x' : ' '}] ${check.label}`);
        });
        lines.push('');
      }
    });
  });

  lines.push('---');
  lines.push('');
  lines.push(`Généré avec [azsakai](https://azdinem.github.io/azsakai/) · ${new Date().toLocaleDateString('fr-FR')}`);
  lines.push('');
  return lines.join('\n');
}

export function downloadBriefMarkdown(project) {
  const md = buildBriefMarkdown(project);
  const slug = slugify(project.title);
  download(`${slug}-brief.md`, md, 'text/markdown;charset=utf-8');
}

/* ---------- HTML for PDF ---------- */

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br />');
}

export function buildBriefHTML(project) {
  const stats = getCompletionStats(project);
  const typeLabel = project.type === 'article' ? 'Article' : 'Landing Page';
  const createdAt = new Date(project.createdAt).toLocaleDateString('fr-FR');
  const updatedAt = new Date(project.updatedAt).toLocaleDateString('fr-FR');

  const monoLabelStyle = `font-family: 'Archivo Mono', monospace; font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: #555; margin: 0;`;
  const sectionIndexStyle = `font-family: 'Archivo Mono', monospace; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: #999;`;

  const featuredRows = [];
  BRIEF_FEATURED_FIELDS.forEach(fieldId => {
    const entry = readField(project, fieldId);
    if (entry) {
      featuredRows.push(`
        <li style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; display: flex; gap: 16px;">
          <span style="${monoLabelStyle} min-width: 170px; flex-shrink: 0;">${esc(entry.field.label)}</span>
          <span style="flex: 1; color: #000; line-height: 1.5; font-size: 13px;">${esc(entry.display)}</span>
        </li>
      `);
    }
  });
  const featuredHTML = featuredRows.length > 0
    ? `<ul style="list-style: none; padding: 0; margin: 0;">${featuredRows.join('')}</ul>`
    : `<p style="font-style: italic; color: #999; font-size: 13px;">Aucun champ clé renseigné.</p>`;

  const phasesHTML = PHASES.map(phase => {
    const stepsHTML = phase.steps.map(step => {
      const fieldItems = (step.fields || []).map(field => {
        const raw = project.fields?.[field.id];
        if (!isFilled(raw)) return '';
        const display = displayValue(field, raw);
        return `
          <div style="padding: 8px 0; border-bottom: 1px dashed #e5e5e5;">
            <div style="${monoLabelStyle} margin-bottom: 4px;">${esc(field.label)}</div>
            <div style="color: #000; line-height: 1.5; font-size: 12px;">${esc(display)}</div>
          </div>
        `;
      }).filter(Boolean).join('');

      const checkItems = (step.checklist || []).map(check => {
        const done = project.checklist?.[check.id];
        return `
          <li style="padding: 3px 0; display: flex; gap: 10px; font-size: 11px; color: ${done ? '#999' : '#000'}; text-decoration: ${done ? 'line-through' : 'none'};">
            <span style="display: inline-block; width: 10px; height: 10px; border: 1px solid #000; background: ${done ? '#000' : '#fff'}; flex-shrink: 0; margin-top: 3px;"></span>
            <span>${esc(check.label)}</span>
          </li>
        `;
      }).join('');

      return `
        <div style="margin-bottom: 24px;">
          <h4 style="font-family: 'Archivo', sans-serif; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: -0.01em; margin: 0 0 4px 0; color: #000;">
            ${esc(step.number)} — ${esc(step.title)}
          </h4>
          ${step.objective ? `<p style="font-size: 11px; color: #555; margin: 0 0 10px 0; font-style: italic;">${esc(step.objective)}</p>` : ''}
          ${fieldItems || '<p style="font-size: 11px; color: #999; margin: 0;">(champs non renseignés)</p>'}
          ${checkItems ? `
            <div style="margin-top: 10px;">
              <p style="${monoLabelStyle} margin-bottom: 4px;">Revue</p>
              <ul style="list-style: none; padding: 0; margin: 0;">${checkItems}</ul>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');

    return `
      <section style="margin-bottom: 40px; page-break-inside: avoid;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 1px solid #000; padding-bottom: 10px; margin-bottom: 20px;">
          <div style="display: flex; align-items: baseline; gap: 14px;">
            <span style="font-family: 'Archivo', sans-serif; font-weight: 800; font-size: 40px; line-height: 0.85; letter-spacing: -0.04em; color: #000;">
              ${String(phase.number).padStart(2, '0')}
            </span>
            <h3 style="font-family: 'Archivo', sans-serif; font-weight: 800; font-size: 16px; text-transform: uppercase; letter-spacing: -0.02em; margin: 0; color: #000;">
              ${esc(phase.title)}
            </h3>
          </div>
        </div>
        ${stepsHTML}
      </section>
    `;
  }).join('');

  return `
    <div style="
      font-family: 'Archivo', -apple-system, sans-serif;
      color: #000;
      background: #fff;
      padding: 48px;
      box-sizing: border-box;
      line-height: 1.4;
      font-size: 12px;
    ">
      <header style="border-bottom: 1px solid #000; padding-bottom: 20px; margin-bottom: 40px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 24px;">
          <span style="${monoLabelStyle} color: #000;">Brief éditorial · azsakai</span>
          <span style="${sectionIndexStyle}">${esc(updatedAt)}</span>
        </div>
        <h1 style="font-family: 'Archivo', sans-serif; font-weight: 800; font-size: 44px; line-height: 0.95; letter-spacing: -0.03em; margin: 0 0 16px 0; text-transform: uppercase;">
          ${esc(project.title)}
        </h1>
        <p style="${monoLabelStyle}">
          ${esc(typeLabel)} · créé ${esc(createdAt)} · ${stats.progress}% · ${stats.filledFields}/${stats.totalFields} champs · ${stats.completedSteps}/${stats.totalSteps} étapes
        </p>
      </header>

      <section style="margin-bottom: 48px;">
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #000; padding-bottom: 8px; margin-bottom: 16px;">
          <span style="${monoLabelStyle} color: #000;">Brief à la une</span>
          <span style="${sectionIndexStyle}">A.01</span>
        </div>
        ${featuredHTML}
      </section>

      <section>
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #000; padding-bottom: 8px; margin-bottom: 24px;">
          <span style="${monoLabelStyle} color: #000;">Récapitulatif exhaustif</span>
          <span style="${sectionIndexStyle}">A.02</span>
        </div>
        ${phasesHTML}
      </section>

      <footer style="margin-top: 48px; padding-top: 16px; border-top: 1px solid #000;">
        <p style="${monoLabelStyle}">Généré avec azsakai · ${new Date().getFullYear()}</p>
      </footer>
    </div>
  `;
}

export async function downloadBriefPDF(project) {
  const [html2canvasModule, jsPDFModule] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ]);
  const html2canvas = html2canvasModule.default || html2canvasModule;
  const jsPDF = jsPDFModule.jsPDF || jsPDFModule.default;

  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '794px';
  container.style.backgroundColor = '#ffffff';
  container.innerHTML = buildBriefHTML(project);
  document.body.appendChild(container);

  try {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: 794,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const slug = slugify(project.title);
    pdf.save(`${slug}-brief.pdf`);
  } finally {
    if (container.parentNode) container.parentNode.removeChild(container);
  }
}
