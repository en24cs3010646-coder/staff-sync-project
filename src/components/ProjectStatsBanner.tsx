import React from 'react';
import { 
  FolderKanban, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Target, 
  ListTodo,
  TrendingUp
} from 'lucide-react';
import { Project } from '../types/project';

interface ProjectStatsBannerProps {
  projects: Project[];
}

export const ProjectStatsBanner: React.FC<ProjectStatsBannerProps> = ({ projects }) => {
  const total = projects.length;
  const completed = projects.filter(p => p.status === 'completed').length;
  const inProgress = projects.filter(p => p.status === 'in-progress').length;
  const review = projects.filter(p => p.status === 'review').length;
  const planning = projects.filter(p => p.status === 'planning').length;

  const avgProgress = total > 0 
    ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / total) 
    : 0;

  const totalTasks = projects.reduce((acc, p) => acc + (p.tasks?.length || 0), 0);
  const doneTasks = projects.reduce((acc, p) => acc + (p.tasks?.filter(t => t.status === 'done').length || 0), 0);
  const pendingTasks = totalTasks - doneTasks;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
      
      {/* Total Saved Projects */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 relative overflow-hidden backdrop-blur-sm group hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Saved Projects</span>
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <FolderKanban className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline space-x-2">
          <span className="text-2xl sm:text-3xl font-bold text-white font-mono">{total}</span>
          <span className="text-xs text-slate-400 font-medium">in repository</span>
        </div>
        <div className="mt-2 text-xs text-slate-500 flex items-center space-x-2">
          <span className="text-emerald-400 font-medium">{completed} completed</span>
          <span>•</span>
          <span className="text-amber-400 font-medium">{inProgress} active</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-60" />
      </div>

      {/* Average Progress */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 relative overflow-hidden backdrop-blur-sm group hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg Completion</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline space-x-2">
          <span className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono">{avgProgress}%</span>
          <span className="text-xs text-slate-400">across portfolio</span>
        </div>
        {/* Progress Mini Bar */}
        <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${avgProgress}%` }}
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-400 opacity-60" />
      </div>

      {/* Active Tasks */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 relative overflow-hidden backdrop-blur-sm group hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Milestone Tasks</span>
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <ListTodo className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline space-x-2">
          <span className="text-2xl sm:text-3xl font-bold text-white font-mono">{pendingTasks}</span>
          <span className="text-xs text-amber-400 font-medium">pending</span>
        </div>
        <div className="mt-2 text-xs text-slate-500 flex items-center space-x-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline" />
          <span className="text-slate-300">{doneTasks}</span>
          <span>of</span>
          <span className="text-slate-300">{totalTasks}</span>
          <span>completed</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-60" />
      </div>

      {/* Target Focus */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 relative overflow-hidden backdrop-blur-sm group hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Review Pipeline</span>
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <Target className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline space-x-2">
          <span className="text-2xl sm:text-3xl font-bold text-cyan-300 font-mono">{review}</span>
          <span className="text-xs text-slate-400">in review</span>
        </div>
        <div className="mt-2 text-xs text-slate-400 flex items-center space-x-2">
          <span className="text-purple-400 font-medium">{planning} planning</span>
          <span>•</span>
          <span className="text-slate-400">Ready for defense</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-60" />
      </div>

    </div>
  );
};
