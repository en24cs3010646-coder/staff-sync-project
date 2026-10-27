import React, { useState } from 'react';
import { 
  Project, 
  Task, 
  Milestone, 
  CodeSnippet, 
  ResourceLink, 
  ProjectStatus, 
  Priority 
} from '../types/project';
import { 
  ArrowLeft, 
  Star, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Github, 
  BookOpen, 
  Code2, 
  FileText, 
  ListTodo, 
  Layout, 
  Layers, 
  Download, 
  Printer, 
  Presentation, 
  Copy, 
  Check, 
  Edit3, 
  TrendingUp,
  Tag,
  Users,
  Sparkles,
  ArrowRight,
  ArrowLeft as ArrowLeftIcon
} from 'lucide-react';
import { exportProjectMarkdown } from '../utils/storage';

interface ProjectDetailViewProps {
  project: Project;
  onBack: () => void;
  onUpdateProject: (updated: Project) => void;
  onEditProject: (project: Project) => void;
  onOpenPresentation: () => void;
  onOpenPrintReport: () => void;
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({
  project,
  onBack,
  onUpdateProject,
  onEditProject,
  onOpenPresentation,
  onOpenPrintReport,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'docs' | 'code' | 'resources'>('overview');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [copiedDoc, setCopiedDoc] = useState(false);
  const [selectedSnippetIndex, setSelectedSnippetIndex] = useState(0);

  // New task form state
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState(new Date().toISOString().slice(0, 10));
  const [newTaskAssignee, setNewTaskAssignee] = useState('');

  // New milestone form state
  const [showAddMilestoneModal, setShowAddMilestoneModal] = useState(false);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneDesc, setNewMilestoneDesc] = useState('');
  const [newMilestoneDate, setNewMilestoneDate] = useState(project.targetDate);

  // New code snippet form state
  const [showAddSnippetModal, setShowAddSnippetModal] = useState(false);
  const [newSnippetFilename, setNewSnippetFilename] = useState('');
  const [newSnippetLang, setNewSnippetLang] = useState('python');
  const [newSnippetDesc, setNewSnippetDesc] = useState('');
  const [newSnippetCode, setNewSnippetCode] = useState('');

  // New resource form state
  const [showAddResourceModal, setShowAddResourceModal] = useState(false);
  const [newResTitle, setNewResTitle] = useState('');
  const [newResUrl, setNewResUrl] = useState('');
  const [newResType, setNewResType] = useState<ResourceLink['type']>('documentation');
  const [newResDesc, setNewResDesc] = useState('');

  // Toggle milestone completion
  const handleToggleMilestone = (milestoneId: string) => {
    const updatedMilestones = project.milestones.map((m) =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );
    const completedCount = updatedMilestones.filter((m) => m.completed).length;
    const newProgress = updatedMilestones.length > 0 
      ? Math.round((completedCount / updatedMilestones.length) * 100) 
      : project.progress;

    onUpdateProject({
      ...project,
      milestones: updatedMilestones,
      progress: newProgress,
      lastUpdated: new Date().toISOString().slice(0, 10),
    });
  };

  // Add milestone
  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim()) return;

    const newMilestone: Milestone = {
      id: 'm-' + Date.now(),
      title: newMilestoneTitle.trim(),
      description: newMilestoneDesc.trim(),
      dueDate: newMilestoneDate,
      completed: false,
    };

    const updatedMilestones = [...(project.milestones || []), newMilestone];
    onUpdateProject({
      ...project,
      milestones: updatedMilestones,
      lastUpdated: new Date().toISOString().slice(0, 10),
    });

    setNewMilestoneTitle('');
    setNewMilestoneDesc('');
    setShowAddMilestoneModal(false);
  };

  // Move task status
  const handleMoveTask = (taskId: string, newStatus: Task['status']) => {
    const updatedTasks = project.tasks.map((t) =>
      t.id === taskId ? { ...t, status: newStatus } : t
    );
    onUpdateProject({
      ...project,
      tasks: updatedTasks,
      lastUpdated: new Date().toISOString().slice(0, 10),
    });
  };

  // Delete task
  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = project.tasks.filter((t) => t.id !== taskId);
    onUpdateProject({
      ...project,
      tasks: updatedTasks,
      lastUpdated: new Date().toISOString().slice(0, 10),
    });
  };

  // Add task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: 'task-' + Date.now(),
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim(),
      priority: newTaskPriority,
      status: 'todo',
      dueDate: newTaskDueDate,
      assignee: newTaskAssignee.trim() || project.author.name,
    };

    onUpdateProject({
      ...project,
      tasks: [...(project.tasks || []), newTask],
      lastUpdated: new Date().toISOString().slice(0, 10),
    });

    setNewTaskTitle('');
    setNewTaskDesc('');
    setShowAddTaskModal(false);
  };

  // Add code snippet
  const handleAddCodeSnippet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSnippetFilename.trim() || !newSnippetCode.trim()) return;

    const newSnippet: CodeSnippet = {
      id: 'cs-' + Date.now(),
      filename: newSnippetFilename.trim(),
      language: newSnippetLang,
      description: newSnippetDesc.trim(),
      code: newSnippetCode,
    };

    onUpdateProject({
      ...project,
      codeSnippets: [...(project.codeSnippets || []), newSnippet],
      lastUpdated: new Date().toISOString().slice(0, 10),
    });

    setNewSnippetFilename('');
    setNewSnippetDesc('');
    setNewSnippetCode('');
    setShowAddSnippetModal(false);
    setSelectedSnippetIndex((project.codeSnippets?.length || 0));
  };

  // Add resource
  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResTitle.trim() || !newResUrl.trim()) return;

    const newResource: ResourceLink = {
      id: 'res-' + Date.now(),
      title: newResTitle.trim(),
      url: newResUrl.trim(),
      type: newResType,
      description: newResDesc.trim(),
    };

    onUpdateProject({
      ...project,
      resources: [...(project.resources || []), newResource],
      lastUpdated: new Date().toISOString().slice(0, 10),
    });

    setNewResTitle('');
    setNewResUrl('');
    setNewResDesc('');
    setShowAddResourceModal(false);
  };

  // Copy code snippet to clipboard
  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  // Copy documentation
  const handleCopyDocs = () => {
    navigator.clipboard.writeText(project.documentation);
    setCopiedDoc(true);
    setTimeout(() => setCopiedDoc(false), 2000);
  };

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'completed':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Completed</span>;
      case 'in-progress':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">In Progress</span>;
      case 'review':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-400 border border-purple-500/30">Under Review</span>;
      case 'planning':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">Planning</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-500/15 text-slate-400">On Hold</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Navigation & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 backdrop-blur-md">
        
        {/* Back button & category */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700/80 rounded-xl transition-all flex items-center space-x-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Projects</span>
          </button>
          
          <div className="h-4 w-px bg-slate-800" />
          
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {project.category}
          </span>
          {getStatusBadge(project.status)}
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Favorite Toggle */}
          <button
            onClick={() => onUpdateProject({ ...project, isFavorite: !project.isFavorite })}
            className={`p-2 rounded-xl border text-xs font-medium transition-colors ${
              project.isFavorite 
                ? 'bg-amber-500/15 text-amber-400 border-amber-500/40' 
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title="Toggle favorite"
          >
            <Star className={`w-4 h-4 ${project.isFavorite ? 'fill-amber-400' : ''}`} />
          </button>

          {/* Defense / Presentation Mode */}
          <button
            onClick={onOpenPresentation}
            className="px-3 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-colors flex items-center space-x-1.5 shadow-sm shadow-purple-600/20"
            title="Launch Project Presentation Mode"
          >
            <Presentation className="w-4 h-4" />
            <span className="hidden sm:inline">Defense / Slide Mode</span>
          </button>

          {/* Print Academic Report */}
          <button
            onClick={onOpenPrintReport}
            className="px-3 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors flex items-center space-x-1.5"
            title="Generate Print-Ready Project Synopsis & Report"
          >
            <Printer className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Print Report</span>
          </button>

          {/* Export Markdown */}
          <button
            onClick={() => exportProjectMarkdown(project)}
            className="p-2 sm:px-3 sm:py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors flex items-center space-x-1.5"
            title="Download formatted project markdown summary"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Markdown</span>
          </button>

          {/* Edit Project Modal */}
          <button
            onClick={() => onEditProject(project)}
            className="px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors flex items-center space-x-1.5 shadow-sm shadow-indigo-600/20"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Project</span>
          </button>
        </div>

      </div>

      {/* Hero Header Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          
          <div className="space-y-2 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {project.title}
            </h1>
            <p className="text-sm sm:text-base text-indigo-400 font-medium">
              {project.subtitle}
            </p>
            <p className="text-sm text-slate-300 leading-relaxed max-w-4xl pt-1">
              {project.description}
            </p>

            {/* Author / Institution / Dates */}
            <div className="pt-3 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center space-x-1.5 text-slate-200">
                <Users className="w-4 h-4 text-indigo-400" />
                <span className="font-semibold">{project.author.name}</span>
                <span className="text-slate-500">({project.author.role})</span>
              </span>
              {project.author.institution && (
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60 font-mono text-[11px]">
                  {project.author.institution}
                </span>
              )}
              <span className="flex items-center space-x-1 font-mono">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Target Due: {project.targetDate}</span>
              </span>
              <span className="text-slate-500">|</span>
              <span>Created: {project.createdDate}</span>
              <span>Updated: {project.lastUpdated}</span>
            </div>

            {/* Tech Stack Chips */}
            <div className="pt-3 flex flex-wrap gap-1.5 items-center">
              <Tag className="w-3.5 h-3.5 text-slate-500 mr-1" />
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="text-xs font-mono px-2.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700/80"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Links & Progress Gauge */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 min-w-[260px] space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-400 font-medium">Overall Completion</span>
                <span className="font-mono font-bold text-lg text-emerald-400">{project.progress}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-400 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            {/* External Links */}
            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
              {project.repositoryUrl && (
                <a
                  href={project.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                >
                  <span className="flex items-center space-x-2">
                    <Github className="w-4 h-4 text-slate-400" />
                    <span>Source Repository</span>
                  </span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-cyan-300 hover:text-cyan-200 transition-colors"
                >
                  <span className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>Live Demonstration</span>
                  </span>
                  <ExternalLink className="w-3 h-3 text-cyan-500" />
                </a>
              )}
              {project.documentationUrl && (
                <a
                  href={project.documentationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-purple-300 hover:text-purple-200 transition-colors"
                >
                  <span className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-purple-400" />
                    <span>API / External Docs</span>
                  </span>
                  <ExternalLink className="w-3 h-3 text-purple-500" />
                </a>
              )}
            </div>
          </div>

        </div>

        {/* Key Metrics Row */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {project.metrics.map((met, idx) => (
              <div key={idx} className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  {met.label}
                </span>
                <span className="text-xl font-bold text-white font-mono mt-0.5 block">
                  {met.value}
                </span>
                {met.change && (
                  <span className="text-[10px] text-emerald-400 font-medium">
                    {met.change}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Workspace Tabs Navigation */}
      <div className="flex border-b border-slate-800 space-x-1 sm:space-x-4">
        {[
          { id: 'overview', label: 'Overview & Milestones', icon: Layers },
          { id: 'tasks', label: `Kanban Tasks (${project.tasks?.length || 0})`, icon: ListTodo },
          { id: 'docs', label: 'Documentation & Specs', icon: FileText },
          { id: 'code', label: `Code Snippets (${project.codeSnippets?.length || 0})`, icon: Code2 },
          { id: 'resources', label: `Resources (${project.resources?.length || 0})`, icon: BookOpen },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold flex items-center space-x-2 border-b-2 transition-all ${
                isActive
                  ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & MILESTONES */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Milestones Checklist (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>Project Milestones Checklist</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Click any checkbox to update completion state. Progress recalculates dynamically.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddMilestoneModal(true)}
                  className="px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-lg transition-colors flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Milestone</span>
                </button>
              </div>

              <div className="space-y-3">
                {project.milestones && project.milestones.length > 0 ? (
                  project.milestones.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => handleToggleMilestone(m.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start space-x-3.5 ${
                        m.completed
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-300'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-200'
                      }`}
                    >
                      <button className="mt-0.5 flex-shrink-0 text-emerald-400">
                        {m.completed ? (
                          <CheckCircle2 className="w-5 h-5 fill-emerald-500/20 text-emerald-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-500 hover:text-indigo-400" />
                        )}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-sm font-semibold ${m.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                            {m.title}
                          </h4>
                          <span className="text-[11px] font-mono text-slate-500 flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{m.dueDate}</span>
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          {m.description}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-xs text-slate-500 italic">
                    No milestones configured. Click "Add Milestone" to set targets.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar: Team & Collaborators */}
          <div className="space-y-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center space-x-2">
                <Users className="w-4 h-4 text-indigo-400" />
                <span>Project Contributors</span>
              </h3>
              <div className="space-y-3">
                {/* Lead Author */}
                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                    Project Author / Lead
                  </span>
                  <div className="font-semibold text-white text-sm">
                    {project.author.name}
                  </div>
                  <div className="text-xs text-slate-400">
                    {project.author.role}
                  </div>
                  {project.author.institution && (
                    <div className="text-[11px] text-indigo-300 font-mono mt-1">
                      {project.author.institution}
                    </div>
                  )}
                </div>

                {/* Collaborators List */}
                {project.collaborators && project.collaborators.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-semibold text-slate-400">Team Members:</span>
                    {project.collaborators.map((collab) => (
                      <div key={collab.id} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
                        <div className="font-medium text-slate-200">{collab.name}</div>
                        <div className="text-slate-400">{collab.role}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{collab.email}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE KANBAN TASK BOARD */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Project Task Board</h3>
              <p className="text-xs text-slate-400">Organize and advance task sprint deliverables</p>
            </div>
            <button
              onClick={() => setShowAddTaskModal(true)}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors flex items-center space-x-1.5 shadow-sm shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Create Task</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
            {[
              { id: 'todo', title: 'To Do', color: 'border-slate-800 bg-slate-900/60', badge: 'text-slate-400 bg-slate-800' },
              { id: 'in-progress', title: 'In Progress', color: 'border-blue-500/30 bg-blue-500/5', badge: 'text-blue-400 bg-blue-500/10' },
              { id: 'review', title: 'Code Review', color: 'border-purple-500/30 bg-purple-500/5', badge: 'text-purple-400 bg-purple-500/10' },
              { id: 'done', title: 'Completed', color: 'border-emerald-500/30 bg-emerald-500/5', badge: 'text-emerald-400 bg-emerald-500/10' },
            ].map((col) => {
              const colTasks = (project.tasks || []).filter((t) => t.status === col.id);
              return (
                <div key={col.id} className={`rounded-2xl border ${col.color} p-3.5 backdrop-blur-sm min-h-[420px] flex flex-col`}>
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                    <span className="font-semibold text-sm text-white">{col.title}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-mono font-bold ${col.badge}`}>
                      {colTasks.length}
                    </span>
                  </div>

                  {/* Tasks List */}
                  <div className="space-y-2.5 flex-1">
                    {colTasks.length === 0 ? (
                      <div className="text-center py-10 text-xs text-slate-500 italic border border-dashed border-slate-800 rounded-xl">
                        No tasks
                      </div>
                    ) : (
                      colTasks.map((task) => (
                        <div
                          key={task.id}
                          className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-xl p-3 text-xs space-y-2 group shadow-sm transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              task.priority === 'urgent'
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                : task.priority === 'high'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-slate-800 text-slate-300'
                            }`}>
                              {task.priority.toUpperCase()}
                            </span>
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                              title="Delete task"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <h5 className="font-bold text-white text-xs leading-snug">
                            {task.title}
                          </h5>

                          {task.description && (
                            <p className="text-slate-400 text-[11px] line-clamp-2 leading-relaxed">
                              {task.description}
                            </p>
                          )}

                          <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                            <span>{task.dueDate}</span>
                            {task.assignee && (
                              <span className="text-indigo-400 truncate max-w-[100px]">
                                {task.assignee}
                              </span>
                            )}
                          </div>

                          {/* Quick stage mover controls */}
                          <div className="flex items-center justify-between pt-1 gap-1">
                            {col.id !== 'todo' && (
                              <button
                                onClick={() => handleMoveTask(task.id, col.id === 'done' ? 'review' : col.id === 'review' ? 'in-progress' : 'todo')}
                                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] transition-colors"
                              >
                                ← Prev
                              </button>
                            )}
                            <div className="flex-1" />
                            {col.id !== 'done' && (
                              <button
                                onClick={() => handleMoveTask(task.id, col.id === 'todo' ? 'in-progress' : col.id === 'in-progress' ? 'review' : 'done')}
                                className="px-2 py-0.5 rounded bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 text-[10px] transition-colors font-medium"
                              >
                                Advance →
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: DOCUMENTATION & README */}
      {activeTab === 'docs' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <span>Project Documentation &amp; Technical Synopsis</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Full academic synopsis, architecture blueprints, and setup manuals saved in this project
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyDocs}
                className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center space-x-1.5"
              >
                {copiedDoc ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedDoc ? 'Copied!' : 'Copy Markdown'}</span>
              </button>
            </div>
          </div>

          {/* Formatted Documentation Viewer */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-6 font-sans text-sm leading-relaxed text-slate-300 space-y-4">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-200">
              {project.documentation}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 4: CODE & ARCHITECTURE */}
      {activeTab === 'code' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Code2 className="w-5 h-5 text-indigo-400" />
                <span>Code Repository &amp; Architecture Snippets</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Core algorithms, model weights configuration, and server endpoints
              </p>
            </div>
            <button
              onClick={() => setShowAddSnippetModal(true)}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Snippet</span>
            </button>
          </div>

          {project.codeSnippets && project.codeSnippets.length > 0 ? (
            <div className="space-y-3">
              {/* File Tabs */}
              <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
                {project.codeSnippets.map((snippet, idx) => (
                  <button
                    key={snippet.id}
                    onClick={() => setSelectedSnippetIndex(idx)}
                    className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all flex items-center space-x-1.5 ${
                      selectedSnippetIndex === idx
                        ? 'bg-indigo-600 text-white font-bold shadow-sm'
                        : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    <span>{snippet.filename}</span>
                    <span className="text-[10px] opacity-70">({snippet.language})</span>
                  </button>
                ))}
              </div>

              {/* Active Code Snippet Display */}
              {project.codeSnippets[selectedSnippetIndex] && (
                <div className="bg-slate-950/90 border border-slate-800 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs text-slate-400">
                    <span className="font-medium text-slate-300">
                      {project.codeSnippets[selectedSnippetIndex].description}
                    </span>
                    <button
                      onClick={() => handleCopyCode(
                        project.codeSnippets[selectedSnippetIndex].id,
                        project.codeSnippets[selectedSnippetIndex].code
                      )}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center space-x-1 transition-colors"
                    >
                      {copiedCodeId === project.codeSnippets[selectedSnippetIndex].id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 font-mono text-xs sm:text-sm text-cyan-300 overflow-x-auto leading-relaxed bg-[#0d1117]">
                    <code>{project.codeSnippets[selectedSnippetIndex].code}</code>
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-xs text-slate-500 italic border border-dashed border-slate-800 rounded-xl">
              No code snippets saved in this project. Click "Add Snippet" to save files.
            </div>
          )}
        </div>
      )}

      {/* TAB 5: RESOURCES & REFERENCES */}
      {activeTab === 'resources' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <span>Research Papers, Datasets &amp; Design References</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Verified external references, IEEE/Nature papers, and public datasets
              </p>
            </div>
            <button
              onClick={() => setShowAddResourceModal(true)}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Resource</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.resources && project.resources.length > 0 ? (
              project.resources.map((res) => (
                <a
                  key={res.id}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {res.type}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                    </div>
                    <h4 className="font-bold text-white text-sm group-hover:text-indigo-300 transition-colors">
                      {res.title}
                    </h4>
                    {res.description && (
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {res.description}
                      </p>
                    )}
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-900 text-[11px] font-mono text-slate-500 truncate">
                    {res.url}
                  </div>
                </a>
              ))
            ) : (
              <div className="col-span-2 text-center py-10 text-xs text-slate-500 italic border border-dashed border-slate-800 rounded-xl">
                No external resources attached yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: ADD MILESTONE */}
      {showAddMilestoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Add Project Milestone</h3>
            <form onSubmit={handleAddMilestone} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Milestone Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Model Validation on Cross-Cohort Dataset"
                  value={newMilestoneTitle}
                  onChange={(e) => setNewMilestoneTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Target Due Date</label>
                <input
                  type="date"
                  required
                  value={newMilestoneDate}
                  onChange={(e) => setNewMilestoneDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Description / Deliverable</label>
                <textarea
                  rows={3}
                  placeholder="Specific requirements or outcome expected for this milestone..."
                  value={newMilestoneDesc}
                  onChange={(e) => setNewMilestoneDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMilestoneModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD TASK */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Create Task</h3>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement WebSocket heartbeat test"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as Priority)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                  </input>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Assignee</label>
                <input
                  type="text"
                  placeholder="Assignee name"
                  value={newTaskAssignee}
                  onChange={(e) => setNewTaskAssignee(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Task context or instructions..."
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD CODE SNIPPET */}
      {showAddSnippetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-xl w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Add Code Snippet</h3>
            <form onSubmit={handleAddCodeSnippet} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Filename</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. inference.py"
                    value={newSnippetFilename}
                    onChange={(e) => setNewSnippetFilename(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Language</label>
                  <select
                    value={newSnippetLang}
                    onChange={(e) => setNewSnippetLang(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
                  >
                    <option value="python">Python</option>
                    <option value="typescript">TypeScript</option>
                    <option value="javascript">JavaScript</option>
                    <option value="go">Go</option>
                    <option value="rust">Rust</option>
                    <option value="cpp">C++</option>
                    <option value="sql">SQL</option>
                    <option value="solidity">Solidity</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Short Description</label>
                <input
                  type="text"
                  placeholder="e.g. Model inference loop and TensorRT execution"
                  value={newSnippetDesc}
                  onChange={(e) => setNewSnippetDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Code Content</label>
                <textarea
                  rows={8}
                  required
                  placeholder="// Paste your code here..."
                  value={newSnippetCode}
                  onChange={(e) => setNewSnippetCode(e.target.value)}
                  className="w-full p-3 font-mono text-xs bg-slate-950 border border-slate-800 rounded-xl text-cyan-300 focus:outline-none"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSnippetModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl"
                >
                  Save Code Snippet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD RESOURCE */}
      {showAddResourceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Add Project Resource</h3>
            <form onSubmit={handleAddResource} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Resource Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. IEEE Paper: Transformer Attention MIL"
                  value={newResTitle}
                  onChange={(e) => setNewResTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Resource Type</label>
                  <select
                    value={newResType}
                    onChange={(e) => setNewResType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
                  >
                    <option value="documentation">Documentation</option>
                    <option value="paper">Research Paper</option>
                    <option value="dataset">Dataset</option>
                    <option value="design">Figma / UI Design</option>
                    <option value="api">API Reference</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">URL</label>
                  <input
                    type="url"
                    required
                    placeholder="https://..."
                    value={newResUrl}
                    onChange={(e) => setNewResUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Context on how this resource was utilized..."
                  value={newResDesc}
                  onChange={(e) => setNewResDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddResourceModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl"
                >
                  Save Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
