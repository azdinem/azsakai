import { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const DataContext = createContext(null);

const STORAGE_KEY = 'contentprocess_projects';

// Structure d'un nouveau projet
const createNewProject = (data = {}) => ({
  id: uuidv4(),
  title: data.title || 'Nouveau projet',
  type: data.type || 'article',
  status: 'draft',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  checklist: {},
  fields: {},
  currentPhase: 'phase1',
  currentStep: 'step1_1',
});

export function DataProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Charger les projets depuis localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProjects(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error);
    }
    setIsLoaded(true);
  }, []);

  // Sauvegarder dans localStorage à chaque modification
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    }
  }, [projects, isLoaded]);

  // Créer un nouveau projet
  const createProject = (data = {}) => {
    const newProject = createNewProject(data);
    setProjects(prev => [newProject, ...prev]);
    return newProject;
  };

  // Obtenir un projet par ID
  const getProject = (id) => {
    return projects.find(p => p.id === id);
  };

  // Mettre à jour un projet
  const updateProject = (id, updates) => {
    setProjects(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
      return p;
    }));
  };

  // Mettre à jour un champ du projet
  const updateProjectField = (projectId, fieldId, value) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          fields: {
            ...p.fields,
            [fieldId]: value,
          },
          updatedAt: new Date().toISOString(),
        };
      }
      return p;
    }));
  };

  // Toggle un item de checklist
  const toggleChecklistItem = (projectId, checkId) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          checklist: {
            ...p.checklist,
            [checkId]: !p.checklist[checkId],
          },
          updatedAt: new Date().toISOString(),
        };
      }
      return p;
    }));
  };

  // Supprimer un projet
  const deleteProject = (id) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  // Dupliquer un projet
  const duplicateProject = (id) => {
    const original = projects.find(p => p.id === id);
    if (!original) return null;

    const duplicate = {
      ...original,
      id: uuidv4(),
      title: `${original.title} (copie)`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProjects(prev => [duplicate, ...prev]);
    return duplicate;
  };

  // Exporter toutes les données en JSON
  const exportData = () => {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      projects: projects,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contentprocess-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Importer des données depuis JSON
  const importData = (jsonData, mode = 'merge') => {
    try {
      const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;

      if (!data.projects || !Array.isArray(data.projects)) {
        return { success: false, error: 'Format de fichier invalide' };
      }

      if (mode === 'replace') {
        setProjects(data.projects);
      } else {
        // Mode merge: ajouter les projets qui n'existent pas
        const existingIds = new Set(projects.map(p => p.id));
        const newProjects = data.projects.filter(p => !existingIds.has(p.id));
        setProjects(prev => [...newProjects, ...prev]);
      }

      return { success: true, imported: data.projects.length };
    } catch (error) {
      return { success: false, error: 'Erreur lors de l\'import: ' + error.message };
    }
  };

  // Exporter un projet unique en Markdown
  const exportProjectMarkdown = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return null;

    let markdown = `# ${project.title}\n\n`;
    markdown += `**Type:** ${project.type === 'article' ? 'Article' : 'Landing Page'}\n`;
    markdown += `**Créé le:** ${new Date(project.createdAt).toLocaleDateString('fr-FR')}\n`;
    markdown += `**Mis à jour le:** ${new Date(project.updatedAt).toLocaleDateString('fr-FR')}\n\n`;
    markdown += `---\n\n`;

    // Ajouter les champs remplis
    if (project.fields) {
      Object.entries(project.fields).forEach(([key, value]) => {
        if (value && typeof value === 'string' && value.trim()) {
          const fieldName = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          markdown += `## ${fieldName}\n\n${value}\n\n`;
        }
      });
    }

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <DataContext.Provider value={{
      projects,
      isLoaded,
      createProject,
      getProject,
      updateProject,
      updateProjectField,
      toggleChecklistItem,
      deleteProject,
      duplicateProject,
      exportData,
      importData,
      exportProjectMarkdown,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
