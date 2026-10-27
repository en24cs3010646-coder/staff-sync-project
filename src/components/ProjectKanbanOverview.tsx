import React from 'react';
import { Project, ProjectStatus } from '../types/project';
import { 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Calendar,
  Layers
} from 'lucide-react';

interface ProjectKanbanOverviewProps {
  projects: Project[];
  onSelectProject: (p: Project) => void;
  onUpdateProjectStatus: (id: string, newStatus: ProjectStatus) => void;
}

export const ProjectKanbanOverview: React.FC<ProjectKanbanOverviewProps> = ({
  projects,
  onSelectProject,
  onUpdateProjectStatus,
}) => {
  const columns: { id: ProjectStatus; title: string; color: string; badge: string }[] = [
    { id: 'planning', title: 'Planning & Concept', color: 'border-amber-500/30 bg-amber-500/5', badge: 'text-amber-400 bg-amber-500/10' },
    { id: 'in-progress', title: 'Active Development', color: 'border-blue-500/30 bg-blue-500/5', badge: 'text-blue-400 bg-blue-500/10' },
    { id: 'review', title: 'Testing & Review', color: 'border-purple-500/30 bg-purple-500/5', badge: 'text-purple-400 bg-purple-500/10' },
    { id: 'completed', title: 'Finished & Deployed', color: 'border-emerald-500/30 bg-emerald-500/5', badge: 'text-emerald-400 bg-emerald-500/10' },
  ];

  const statusOrder: ProjectStatus[] = ['planning', 'in-progress', 'review', 'completed'];

  const moveProject = (proj: Project, direction: 'prev' | 'next', e: React.MouseEvent) => {
    e.stopPropagation();
    const currentIndex = statusOrder.indexOf(proj.status);
    if (direction === 'prev' && currentIndex > 0) {
      onUpdateProjectStatus(proj.id, statusOrder[currentIndex - 1]);
    } else if (direction === 'next' && currentIndex < statusOrder.length - 1) {
      onUpdateProjectStatus(proj.id, statusOrder[currentIndex + 1]);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
      {columns.map((col) => {
        const colProjects = projects.filter(p => p.status === col.id);
        const colIndex = statusOrder.indexOf(col.id);

        return (
          <div 
            key={col.id} 
            className={`rounded-2xl border ${col.color} p-3.5 backdrop-blur-sm min-h-[400px] flex flex-col`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold text-sm text-white">{col.title}</h4>
                <span className={`text-xs px-2 py-0.5 rounded-full font-mono font-bold ${col.badge}`}>
                  {colProjects.length}
                </span>
              </div>
            </div>

            {/* Project List */}
            <div className="space-y-3 flex-1">
              {colProjects.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-500 italic border border-dashed border-slate-800 rounded-xl">
                  No projects in this stage
                </div>
              ) : (
                colProjects.map((proj) => (
                  <div
                    key={proj.id}
                    onClick={() => onSelectProject(proj)}
                    className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-3.5 cursor-pointer transition-all hover:shadow-lg hover:shadow-indigo-500/5 group"
                  >
                    <div className="flex items-center justify-between text-[11px] mb-2">
                      <span className="text-indigo-400 font-medium px-2 py-0.5 bg-indigo-500/10 rounded">
                        {proj.category}
                      </span>
                      <span className="text-slate-400 font-mono">{proj.progress}%</span>
                    </div>

                    <h5 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1 mb-1">
                      {proj.title}
                    </h5>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                      {proj.subtitle}
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mb-3">
                      <div
                        className="bg-indigo-500 h-1.5 rounded-full"
                        style={{ width: `${proj.progress}%` }}
                      />
                    </div>

                    {/* Footer + Move buttons */}
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
                      <span className="text-[11px] text-slate-500 flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{proj.targetDate}</span>
                      </span>

                      <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                        {colIndex > 0 && (
                          <button
                            onClick={(e) => moveProject(proj, 'prev', e)}
                            title="Move to previous stage"
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                          >
                            <ArrowLeft className="w-3 h-3" />
                          </button>
                        )}
                        {colIndex < statusOrder.length - 1 && (
                          <button
                            onClick={(e) => moveProject(proj, 'next', e)}
                            title="Move to next stage"
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                          >
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
