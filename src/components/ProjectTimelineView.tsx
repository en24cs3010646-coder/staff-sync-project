import React from 'react';
import { Project } from '../types/project';
import { 
  Calendar, 
  Clock, 
  Flag, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';

interface ProjectTimelineViewProps {
  projects: Project[];
  onSelectProject: (p: Project) => void;
}

export const ProjectTimelineView: React.FC<ProjectTimelineViewProps> = ({
  projects,
  onSelectProject,
}) => {
  // Sort projects chronologically by target date
  const sorted = [...projects].sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime());

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <span>Project Roadmap &amp; Deadlines</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Chronological milestones across all saved projects in your workspace
          </p>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
          {projects.length} Active Timelines
        </span>
      </div>

      <div className="relative border-l-2 border-slate-800 ml-4 pl-6 space-y-8">
        {sorted.map((proj, idx) => {
          const isDone = proj.status === 'completed';
          const completedMilestones = proj.milestones?.filter(m => m.completed).length || 0;
          const totalMilestones = proj.milestones?.length || 0;

          return (
            <div 
              key={proj.id}
              onClick={() => onSelectProject(proj)}
              className="relative group cursor-pointer"
            >
              {/* Timeline Pin Node */}
              <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 transition-transform group-hover:scale-125 ${
                isDone 
                  ? 'bg-emerald-500 border-emerald-300' 
                  : proj.progress > 60 
                  ? 'bg-indigo-500 border-indigo-300' 
                  : 'bg-amber-500 border-amber-300'
              }`} />

              {/* Card Container */}
              <div className="bg-slate-950/70 border border-slate-800 group-hover:border-indigo-500/50 rounded-xl p-4 transition-all shadow-md group-hover:shadow-indigo-500/5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-indigo-400 px-2.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                      Target: {proj.targetDate}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {proj.category}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-slate-400">Created: {proj.createdDate}</span>
                    <span className="text-slate-600">•</span>
                    <span className="font-mono font-bold text-white">{proj.progress}% Done</span>
                  </div>
                </div>

                <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors flex items-center justify-between">
                  <span>{proj.title}</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400" />
                </h4>
                <p className="text-xs text-slate-400 mt-1 mb-3 line-clamp-1">
                  {proj.subtitle}
                </p>

                {/* Milestones chips */}
                {totalMilestones > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap gap-2 items-center">
                    <span className="text-[11px] text-slate-500 flex items-center space-x-1">
                      <Flag className="w-3 h-3 text-indigo-400" />
                      <span>Milestones ({completedMilestones}/{totalMilestones}):</span>
                    </span>
                    {proj.milestones.slice(0, 3).map((m) => (
                      <span
                        key={m.id}
                        className={`text-[11px] px-2 py-0.5 rounded flex items-center space-x-1 ${
                          m.completed 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-slate-800/80 text-slate-400 border border-slate-700/60'
                        }`}
                      >
                        {m.completed && <CheckCircle2 className="w-2.5 h-2.5 inline" />}
                        <span>{m.title}</span>
                      </span>
                    ))}
                    {totalMilestones > 3 && (
                      <span className="text-[10px] text-slate-500">+{totalMilestones - 3} more</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
