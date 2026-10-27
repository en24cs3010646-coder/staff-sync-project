import { Project } from '../types/project';
import { INITIAL_PROJECTS } from '../data/initialProjects';

const STORAGE_KEY = 'projectvault_saved_projects_v1';

export function loadSavedProjects(): Project[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      saveProjectsToStorage(INITIAL_PROJECTS);
      return INITIAL_PROJECTS;
    }
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_PROJECTS;
  } catch (err) {
    console.error('Failed to load projects from storage:', err);
    return INITIAL_PROJECTS;
  }
}

export function saveProjectsToStorage(projects: Project[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    return true;
  } catch (err) {
    console.error('Failed to save projects to storage:', err);
    return false;
  }
}

export function exportProjectsToJSON(projects: Project[]): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(projects, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `projects_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function exportProjectMarkdown(project: Project): void {
  const mdContent = `# ${project.title}
*${project.subtitle}*

- **Category:** ${project.category}
- **Status:** ${project.status.toUpperCase()}
- **Priority:** ${project.priority.toUpperCase()}
- **Progress:** ${project.progress}%
- **Target Date:** ${project.targetDate}
- **Created:** ${project.createdDate} | **Last Updated:** ${project.lastUpdated}
- **Lead / Author:** ${project.author.name} (${project.author.role})
${project.repositoryUrl ? `- **Repository:** ${project.repositoryUrl}` : ''}
${project.demoUrl ? `- **Live Demo:** ${project.demoUrl}` : ''}

---

## Executive Summary
${project.description}

## Tech Stack
${project.techStack.map(t => `- ${t}`).join('\n')}

## Milestones
${project.milestones.map(m => `- [${m.completed ? 'x' : ' '}] **${m.title}** (Due: ${m.dueDate})\n  ${m.description}`).join('\n')}

## Key Metrics
${project.metrics.map(met => `- **${met.label}:** ${met.value} ${met.change ? `(${met.change})` : ''}`).join('\n')}

## Tasks Breakdown
${project.tasks.map(t => `- [${t.status === 'done' ? 'x' : ' '}] **[${t.status.toUpperCase()}]** ${t.title} (Priority: ${t.priority}, Due: ${t.dueDate})${t.assignee ? ` — Assignee: ${t.assignee}` : ''}`).join('\n')}

---

## Detailed Documentation & Research
${project.documentation}
`;

  const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${project.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_summary.md`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
