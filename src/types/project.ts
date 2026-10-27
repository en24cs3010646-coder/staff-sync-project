export type ProjectCategory =
  | 'Web Development'
  | 'AI & Machine Learning'
  | 'Mobile Application'
  | 'IoT & Embedded'
  | 'Data Science'
  | 'Cloud & DevOps'
  | 'Academic Capstone'
  | 'Cybersecurity'
  | 'Open Source';

export type ProjectStatus =
  | 'planning'
  | 'in-progress'
  | 'review'
  | 'completed'
  | 'on-hold';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: Priority;
  dueDate: string;
  assignee?: string;
  tags?: string[];
}

export interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  description: string;
  deliverable?: string;
}

export interface CodeSnippet {
  id: string;
  filename: string;
  language: string;
  description: string;
  code: string;
}

export interface ResourceLink {
  id: string;
  title: string;
  url: string;
  type: 'documentation' | 'paper' | 'design' | 'api' | 'dataset' | 'repo';
  description?: string;
}

export interface Collaborator {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar?: string;
}

export interface ProjectMetric {
  label: string;
  value: string;
  change?: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: ProjectCategory;
  status: ProjectStatus;
  priority: Priority;
  progress: number;
  techStack: string[];
  repositoryUrl?: string;
  demoUrl?: string;
  documentationUrl?: string;
  targetDate: string;
  createdDate: string;
  lastUpdated: string;
  author: {
    name: string;
    role: string;
    institution?: string;
  };
  collaborators: Collaborator[];
  tasks: Task[];
  milestones: Milestone[];
  documentation: string;
  codeSnippets: CodeSnippet[];
  resources: ResourceLink[];
  metrics: ProjectMetric[];
  isFavorite?: boolean;
}
