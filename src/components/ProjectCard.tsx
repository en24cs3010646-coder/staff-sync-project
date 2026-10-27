import React from 'react';
import { 
  ExternalLink, 
  Github, 
  Calendar, 
  CheckCircle, 
  MoreVertical, 
  Star, 
  Clock, 
  Sparkles, 
  FolderOpen,
  ArrowUpRight,
  Layers,
  Code2
} from 'lucide-react';
import { Project, ProjectCategory, ProjectStatus, Priority } from '../types/project';

interface ProjectCardProps {
  project: Project;
  onSelectProject: (p: Project) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onEditProject: (p: Project, e: React.MouseEvent) => void;
  onDeleteProject: (id: string, e: React.MouseEvent) => void;
  onDuplicateProject: (p: Project, e: React.MouseEvent) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onSelectProject,
  onToggleFavorite,
  onEditProject,
  onDeleteProject,
  onDuplicateProject,
}) => {
  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'completed':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Completed</span>;
      case 'in-progress':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">In Progress</span>;
      case 'review':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-400 border border-purple-500/30">Under Review</span>;
      case 'planning':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">Planning</span>;
      case 'on-hold':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">On Hold</span>;
    }
  };

  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case 'urgent':
        return <span className="text-[11px] font-medium text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-800/50">Urgent</span>;
      case 'high':
        return <span className="text-[11px] font-medium text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/50">High</span>;
      case 'medium':
        return <span className="text-[11px] font-medium text-blue-300 bg-blue-950/40 px-2 py-0.5 rounded border border-blue-800/50">Med</span>;
      case 'low':
        return <span className="text-[11px] font-medium text-slate-400 bg-slate-800/40 px-2 py-0.5 rounded border border-slate-700/50">Low</span>;
    }
  };

  const getCategoryColor = (category: ProjectCategory) => {
    switch (category) {
      case 'AI & Machine Learning':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/25';
      case 'Web Development':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/25';
      case 'IoT & Embedded':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25';
      case 'Cloud & DevOps':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/25';
      case 'Cybersecurity':
        return 'text-red-400 bg-red-500/10 border-red-500/25';
      case 'Academic Capstone':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/25';
      default:
        return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/25';
    }
  };

  const completedMilestones = project.milestones?.filter(m => m.completed).length || 0;
  const totalMilestones = project.milestones?.length || 0;

  return (
    <div 
      onClick={() => onSelectProject(project)}
      className="group bg-slate-900/70 hover:bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/5 cursor-pointer relative overflow-hidden backdrop-blur-sm"
    >
      {/* Top Header: Category & Priority & Favorite */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2">
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getCategoryColor(project.category)}`}>
              {project.category}
            </span>
            {getPriorityBadge(project.priority)}
          </div>

          <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={(e) => onToggleFavorite(project.id, e)}
              title={project.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              className="p-1.5 text-slate-400 hover:text-amber-400 transition-colors rounded-lg hover:bg-slate-800"
            >
              <Star className={`w-4 h-4 ${project.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>
            <button
              onClick={(e) => onEditProject(project, e)}
              title="Edit project details"
              className="p-1.5 text-slate-400 hover:text-indigo-300 transition-colors rounded-lg hover:bg-slate-800 text-xs font-medium"
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                if (window.confirm(`Delete "${project.title}"?`)) {
                  onDeleteProject(project.id, e);
                }
              }}
              title="Delete project"
              className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors rounded-lg hover:bg-slate-800 text-xs font-medium"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Project Title & Subtitle */}
        <div className="mb-2">
          <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1 flex items-center justify-between">
            <span>{project.title}</span>
            <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400 flex-shrink-0 ml-1" />
          </h3>
          <p className="text-xs text-indigo-400 font-medium line-clamp-1 mt-0.5">
            {project.subtitle}
          </p>
        </div>

        {/* Description Excerpt */}
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {project.description}
        </p>

        {/* Tech Stack Chips */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.techStack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800/90 text-slate-300 border border-slate-700/60"
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > 4 && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800/50 text-slate-400">
              +{project.techStack.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Middle: Progress Bar */}
      <div className="my-3 pt-3 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-400 flex items-center space-x-1">
            <span>Progress</span>
            {totalMilestones > 0 && (
              <span className="text-slate-500">({completedMilestones}/{totalMilestones} milestones)</span>
            )}
          </span>
          <span className="font-bold font-mono text-slate-200">{project.progress}%</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              project.progress === 100 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
                : project.progress > 60 
                ? 'bg-gradient-to-r from-indigo-500 to-blue-500' 
                : 'bg-gradient-to-r from-amber-500 to-indigo-500'
            }`}
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* Bottom Footer: Status, Author & Date */}
      <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          {getStatusBadge(project.status)}
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Updated {project.lastUpdated}
          </span>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          {project.repositoryUrl && (
            <span 
              onClick={(e) => {
                e.stopPropagation();
                window.open(project.repositoryUrl, '_blank');
              }}
              className="text-slate-400 hover:text-white transition-colors"
              title="Open GitHub Repo"
            >
              <Github className="w-4 h-4" />
            </span>
          )}
          {project.demoUrl && (
            <span 
              onClick={(e) => {
                e.stopPropagation();
                window.open(project.demoUrl, '_blank');
              }}
              className="text-slate-400 hover:text-cyan-400 transition-colors"
              title="Open Live Demo"
            >
              <ExternalLink className="w-4 h-4" />
            </span>
          )}
          <span className="flex items-center space-x-1 text-slate-400 font-mono text-[11px]">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{project.targetDate}</span>
          </span>
        </div>
      </div>

      {/* Accent corner border */}
      <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-indigo-500/10 to-transparent pointer-events-none rounded-tr-2xl" />
    </div>
  );
};
