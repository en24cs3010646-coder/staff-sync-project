import React from 'react';
import { 
  Project, 
  ProjectStatus, 
  Priority 
} from '../types/project';
import { 
  Star, 
  ExternalLink, 
  Github, 
  ArrowRight, 
  Calendar 
} from 'lucide-react';

interface ProjectTableViewProps {
  projects: Project[];
  onSelectProject: (p: Project) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onEditProject: (p: Project, e: React.MouseEvent) => void;
  onDeleteProject: (id: string, e: React.MouseEvent) => void;
}

export const ProjectTableView: React.FC<ProjectTableViewProps> = ({
  projects,
  onSelectProject,
  onToggleFavorite,
  onEditProject,
  onDeleteProject,
}) => {
  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Completed</span>;
      case 'in-progress':
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">In Progress</span>;
      case 'review':
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-400 border border-purple-500/30">Review</span>;
      case 'planning':
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">Planning</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-500/15 text-slate-400">On Hold</span>;
    }
  };

  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case 'urgent':
        return <span className="text-[11px] font-bold text-rose-400">Urgent</span>;
      case 'high':
        return <span className="text-[11px] font-semibold text-amber-400">High</span>;
      case 'medium':
        return <span className="text-[11px] font-medium text-blue-300">Medium</span>;
      case 'low':
        return <span className="text-[11px] text-slate-400">Low</span>;
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-950/80 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4 w-10">Fav</th>
              <th className="py-3.5 px-4">Project Title</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Priority</th>
              <th className="py-3.5 px-4 w-40">Progress</th>
              <th className="py-3.5 px-4">Due Date</th>
              <th className="py-3.5 px-4">Author</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {projects.map((proj) => (
              <tr 
                key={proj.id}
                onClick={() => onSelectProject(proj)}
                className="hover:bg-slate-800/50 cursor-pointer transition-colors group"
              >
                {/* Star */}
                <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={(e) => onToggleFavorite(proj.id, e)}
                    className="text-slate-400 hover:text-amber-400 transition-colors"
                  >
                    <Star className={`w-4 h-4 ${proj.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>
                </td>

                {/* Title & subtitle */}
                <td className="py-3 px-4">
                  <div className="font-semibold text-white group-hover:text-indigo-300 transition-colors">
                    {proj.title}
                  </div>
                  <div className="text-xs text-slate-400 line-clamp-1 max-w-xs">
                    {proj.subtitle}
                  </div>
                </td>

                {/* Category */}
                <td className="py-3 px-4 text-xs text-slate-300">
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700/60 font-mono text-[11px]">
                    {proj.category}
                  </span>
                </td>

                {/* Status */}
                <td className="py-3 px-4">
                  {getStatusBadge(proj.status)}
                </td>

                {/* Priority */}
                <td className="py-3 px-4">
                  {getPriorityBadge(proj.priority)}
                </td>

                {/* Progress */}
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-indigo-500 h-2 rounded-full"
                        style={{ width: `${proj.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-300 w-8 text-right">
                      {proj.progress}%
                    </span>
                  </div>
                </td>

                {/* Due Date */}
                <td className="py-3 px-4 text-xs font-mono text-slate-400 whitespace-nowrap">
                  {proj.targetDate}
                </td>

                {/* Author */}
                <td className="py-3 px-4 text-xs text-slate-300 whitespace-nowrap">
                  {proj.author.name}
                </td>

                {/* Actions */}
                <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={(e) => onEditProject(proj, e)}
                      className="px-2 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onSelectProject(proj)}
                      className="p-1 text-indigo-400 hover:text-indigo-300 transition-colors"
                      title="Open project"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
