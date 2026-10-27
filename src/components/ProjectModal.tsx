import React, { useState, useEffect } from 'react';
import { 
  Project, 
  ProjectCategory, 
  ProjectStatus, 
  Priority, 
  Milestone 
} from '../types/project';
import { 
  X, 
  Sparkles, 
  Layers, 
  Plus, 
  Trash2, 
  Wand2 
} from 'lucide-react';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
  projectToEdit?: Project | null;
}

const CATEGORIES: ProjectCategory[] = [
  'Web Development',
  'AI & Machine Learning',
  'Mobile Application',
  'IoT & Embedded',
  'Data Science',
  'Cloud & DevOps',
  'Academic Capstone',
  'Cybersecurity',
  'Open Source',
];

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
  projectToEdit,
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('Web Development');
  const [status, setStatus] = useState<ProjectStatus>('in-progress');
  const [priority, setPriority] = useState<Priority>('medium');
  const [progress, setProgress] = useState(50);
  const [targetDate, setTargetDate] = useState('2026-12-01');
  const [techStackInput, setTechStackInput] = useState('React, TypeScript, TailwindCSS');
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [documentationUrl, setDocumentationUrl] = useState('');
  const [authorName, setAuthorName] = useState('Student Engineer');
  const [authorRole, setAuthorRole] = useState('Project Developer');
  const [institution, setInstitution] = useState('Medi-Caps University / Dept of CSE');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (projectToEdit) {
      setTitle(projectToEdit.title);
      setSubtitle(projectToEdit.subtitle);
      setCategory(projectToEdit.category);
      setStatus(projectToEdit.status);
      setPriority(projectToEdit.priority);
      setProgress(projectToEdit.progress);
      setTargetDate(projectToEdit.targetDate);
      setTechStackInput(projectToEdit.techStack.join(', '));
      setRepositoryUrl(projectToEdit.repositoryUrl || '');
      setDemoUrl(projectToEdit.demoUrl || '');
      setDocumentationUrl(projectToEdit.documentationUrl || '');
      setAuthorName(projectToEdit.author.name);
      setAuthorRole(projectToEdit.author.role);
      setInstitution(projectToEdit.author.institution || '');
      setDescription(projectToEdit.description);
    } else {
      // Default new project setup
      setTitle('');
      setSubtitle('');
      setCategory('Web Development');
      setStatus('in-progress');
      setPriority('medium');
      setProgress(25);
      setTargetDate('2026-12-15');
      setTechStackInput('React, TypeScript, Node.js, TailwindCSS');
      setRepositoryUrl('');
      setDemoUrl('');
      setDocumentationUrl('');
      setAuthorName('Aditya & Team');
      setAuthorRole('Project Lead');
      setInstitution('Medi-Caps University / Dept of CSE');
      setDescription('');
    }
  }, [projectToEdit, isOpen]);

  if (!isOpen) return null;

  // Preset Template loader
  const applyTemplate = (templateName: string) => {
    switch (templateName) {
      case 'ai':
        setTitle('NeuroVision - Multimodal Defect Detection');
        setSubtitle('Edge AI visual inspection model using YOLOv11 and TensorRT');
        setCategory('AI & Machine Learning');
        setPriority('high');
        setStatus('in-progress');
        setProgress(65);
        setTechStackInput('Python, PyTorch, YOLOv11, OpenCV, FastAPI, Docker, CUDA');
        setDescription('Automated visual surface inspection system classifying manufacturing micro-defects in real time with high bounding box precision.');
        break;
      case 'web':
        setTitle('DevForge - Collaborative Code Review Hub');
        setSubtitle('Realtime pair programming and pull request audit studio');
        setCategory('Web Development');
        setPriority('medium');
        setStatus('in-progress');
        setProgress(80);
        setTechStackInput('Next.js, TypeScript, PostgreSQL, WebSockets, TailwindCSS, Monaco Editor');
        setDescription('A collaborative web platform where developers review code diffs, run in-browser unit tests, and resolve inline discussion threads.');
        break;
      case 'iot':
        setTitle('SmartGrid - Industrial Substation Power Telemetry');
        setSubtitle('LoRa & Modbus wireless sensor mesh for continuous voltage and thermal monitoring');
        setCategory('IoT & Embedded');
        setPriority('high');
        setStatus('in-progress');
        setProgress(70);
        setTechStackInput('C++, ESP32, FreeRTOS, MQTT, InfluxDB, Grafana, LoRaWAN');
        setDescription('Substation distribution monitoring array with high galvanic isolation, frequency surge detection, and automated alert relays.');
        break;
      case 'capstone':
        setTitle('MediPass - Decentralized Patient Health Records');
        setSubtitle('Inter-hospital cryptographic medical record exchange and consent protocol');
        setCategory('Academic Capstone');
        setPriority('urgent');
        setStatus('in-progress');
        setProgress(75);
        setTechStackInput('React, Node.js, Solidity, IPFS, Web3.js, MongoDB');
        setDescription('A unified healthcare platform enabling patients to grant time-bounded revocable access to clinical histories across hospitals.');
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const techArray = techStackInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const updatedOrNewProject: Project = {
      id: projectToEdit ? projectToEdit.id : `proj-${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim() || `${category} Project`,
      description: description.trim() || 'No detailed description provided yet.',
      category,
      status,
      priority,
      progress,
      techStack: techArray.length > 0 ? techArray : ['TypeScript', 'React'],
      repositoryUrl: repositoryUrl.trim() || undefined,
      demoUrl: demoUrl.trim() || undefined,
      documentationUrl: documentationUrl.trim() || undefined,
      targetDate,
      createdDate: projectToEdit ? projectToEdit.createdDate : new Date().toISOString().slice(0, 10),
      lastUpdated: new Date().toISOString().slice(0, 10),
      isFavorite: projectToEdit ? projectToEdit.isFavorite : false,
      author: {
        name: authorName.trim(),
        role: authorRole.trim(),
        institution: institution.trim() || undefined,
      },
      collaborators: projectToEdit?.collaborators || [
        { id: 'c-lead', name: authorName.trim(), role: authorRole.trim(), email: 'lead@example.edu' },
      ],
      milestones: projectToEdit?.milestones || [
        { id: 'm-init', title: 'Requirement Analysis & System Design', dueDate: targetDate, completed: true, description: 'Architecture specifications and tech evaluation.' },
        { id: 'm-core', title: 'Core MVP Implementation', dueDate: targetDate, completed: false, description: 'Core functional endpoints and UI integration.' },
      ],
      tasks: projectToEdit?.tasks || [
        { id: 't-init', title: 'Set up project environment and repository', status: 'done', priority: 'medium', dueDate: targetDate, assignee: authorName.trim() },
        { id: 't-mvp', title: 'Build core feature prototype', status: 'in-progress', priority: 'high', dueDate: targetDate, assignee: authorName.trim() },
      ],
      documentation: projectToEdit?.documentation || `# ${title.trim()}\n\n## Abstract\n${description.trim()}\n\n## System Architecture\nModular client-server pipeline with integrated database and analytics.\n`,
      codeSnippets: projectToEdit?.codeSnippets || [],
      resources: projectToEdit?.resources || [],
      metrics: projectToEdit?.metrics || [
        { label: 'Completion', value: `${progress}%` },
        { label: 'Tasks Total', value: '2' },
      ],
    };

    onSave(updatedOrNewProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>{projectToEdit ? 'Edit Project Details' : 'Create & Save New Project'}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Save your project configuration into the local repository
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Templates (only when creating new project) */}
        {!projectToEdit && (
          <div className="mt-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center space-x-1.5 mb-2">
              <Wand2 className="w-3.5 h-3.5" />
              <span>Quick Start from Template:</span>
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyTemplate('ai')}
                className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition-colors"
              >
                AI &amp; Vision
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('web')}
                className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition-colors"
              >
                Full-Stack Web App
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('iot')}
                className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition-colors"
              >
                IoT &amp; Hardware
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('capstone')}
                className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition-colors"
              >
                College Capstone
              </button>
            </div>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          {/* Title & Subtitle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Project Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. MediVision AI"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tagline / Subtitle
              </label>
              <input
                type="text"
                placeholder="e.g. Deep learning histopathology assistant"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Category, Status & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="planning">Planning / Ideation</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Under Review</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Progress & Target Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Progress: <span className="text-indigo-400 font-mono font-bold">{progress}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Due Date
              </label>
              <input
                type="date"
                required
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Tech Stack Chips input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Tech Stack (Comma-separated)
            </label>
            <input
              type="text"
              placeholder="React, TypeScript, PyTorch, Docker, FastAPI"
              value={techStackInput}
              onChange={(e) => setTechStackInput(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          {/* Author info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Author / Lead Name
              </label>
              <input
                type="text"
                placeholder="Your Name"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Role / Title
              </label>
              <input
                type="text"
                placeholder="e.g. Lead Researcher"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                University / Institution
              </label>
              <input
                type="text"
                placeholder="e.g. Medi-Caps University"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Links: Repository & Demo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                GitHub Repository URL
              </label>
              <input
                type="url"
                placeholder="https://github.com/..."
                value={repositoryUrl}
                onChange={(e) => setRepositoryUrl(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Live Demo / Deployment URL
              </label>
              <input
                type="url"
                placeholder="https://myproject.app"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Project Description / Synopsis
            </label>
            <textarea
              rows={3}
              placeholder="Detailed description of objectives, architecture, algorithms, and results..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
            />
          </div>

          {/* Submit & Cancel */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 rounded-xl shadow-md shadow-indigo-500/20 transition-all"
            >
              {projectToEdit ? 'Save Changes' : 'Create & Save in Projects'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
