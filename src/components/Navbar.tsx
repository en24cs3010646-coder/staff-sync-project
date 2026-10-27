import React, { useRef } from 'react';
import { 
  FolderGit2, 
  Plus, 
  Download, 
  Upload, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles,
  Layers
} from 'lucide-react';
import { Project } from '../types/project';
import { exportProjectsToJSON } from '../utils/storage';

interface NavbarProps {
  projects: Project[];
  onNewProject: () => void;
  onResetSamples: () => void;
  onImportProjects: (imported: Project[]) => void;
  activeView: 'catalog' | 'detail';
  onNavigateHome: () => void;
  lastSavedTime: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  projects,
  onNewProject,
  onResetSamples,
  onImportProjects,
  activeView,
  onNavigateHome,
  lastSavedTime,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImportProjects(parsed);
          alert(`Successfully imported ${parsed.length} projects!`);
        } else {
          alert('Invalid JSON structure: expected an array of projects.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const completedCount = projects.filter(p => p.status === 'completed').length;
  const inProgressCount = projects.filter(p => p.status === 'in-progress').length;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3 cursor-pointer select-none" onClick={onNavigateHome}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold tracking-tight text-white font-mono">ProjectVault</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-medium border border-indigo-500/20">
                Workspace
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Saved Projects &amp; Capstone Repository
            </p>
          </div>
        </div>

        {/* Center Saved Status Indicator */}
        <div className="hidden md:flex items-center space-x-3 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-300 font-medium">Saved in Project Repository</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">{projects.length} Saved</span>
          <span className="text-emerald-400 font-semibold">({completedCount} Done, {inProgressCount} Active)</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {/* Export JSON */}
          <button
            onClick={() => exportProjectsToJSON(projects)}
            title="Backup & Export All Projects JSON"
            className="p-2 sm:px-3 sm:py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Import JSON */}
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Import Projects JSON file"
            className="p-2 sm:px-3 sm:py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center space-x-1.5"
          >
            <Upload className="w-4 h-4 text-blue-400" />
            <span className="hidden sm:inline">Import</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />

          {/* Reset sample projects */}
          <button
            onClick={() => {
              if (window.confirm('Reset project list to default sample projects? Any newly added unsaved projects will be replaced.')) {
                onResetSamples();
              }
            }}
            title="Reset to pre-loaded sample projects"
            className="p-2 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/60 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* New Project CTA */}
          <button
            onClick={onNewProject}
            className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 rounded-lg shadow-sm shadow-indigo-500/25 flex items-center space-x-1.5 transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>

      </div>
    </header>
  );
};
