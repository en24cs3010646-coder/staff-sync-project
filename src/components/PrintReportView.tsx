import React from 'react';
import { Project } from '../types/project';
import { Printer, X, Download } from 'lucide-react';

interface PrintReportViewProps {
  project: Project;
  onClose: () => void;
}

export const PrintReportView: React.FC<PrintReportViewProps> = ({ project, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-4 sm:p-8 overflow-y-auto">
      {/* Control bar (hidden during print) */}
      <div className="max-w-4xl mx-auto mb-4 flex items-center justify-between no-print bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center space-x-2 text-xs text-slate-300">
          <span className="font-semibold text-white">Project Report Preview</span>
          <span>•</span>
          <span>Click "Print / Save PDF" to generate printable document</span>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-indigo-600/20"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Printable Document Sheet (white paper style) */}
      <div className="max-w-4xl mx-auto bg-white text-slate-900 p-8 sm:p-12 rounded-2xl shadow-2xl print:p-0 print:shadow-none print:rounded-none">
        
        {/* Academic / Institutional Header */}
        <div className="text-center pb-6 border-b-2 border-slate-900 mb-8">
          <div className="text-xs uppercase tracking-widest font-bold text-slate-500">
            {project.author.institution || 'ACADEMIC PROJECT REPOSITORY & CAPSTONE REPORT'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2 uppercase">
            {project.title}
          </h1>
          <p className="text-sm font-semibold text-slate-600 italic mt-1">
            {project.subtitle}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-6 text-xs text-slate-700">
            <div><strong>Category:</strong> {project.category}</div>
            <div><strong>Status:</strong> {project.status.toUpperCase()}</div>
            <div><strong>Target Date:</strong> {project.targetDate}</div>
            <div><strong>Overall Progress:</strong> {project.progress}%</div>
          </div>
        </div>

        {/* Project Authors & Guide */}
        <div className="grid grid-cols-2 gap-6 p-4 rounded-xl bg-slate-50 border border-slate-200 mb-8 text-xs">
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-1">Project Investigator / Team</h4>
            <div className="font-semibold text-slate-800">{project.author.name}</div>
            <div className="text-slate-600">{project.author.role}</div>
            {project.collaborators && project.collaborators.length > 0 && (
              <div className="mt-2 text-slate-600">
                <strong>Collaborators:</strong> {project.collaborators.map(c => c.name).join(', ')}
              </div>
            )}
          </div>
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-1">Repository Details</h4>
            <div><strong>Created:</strong> {project.createdDate}</div>
            <div><strong>Last Updated:</strong> {project.lastUpdated}</div>
            {project.repositoryUrl && <div className="truncate"><strong>Repository:</strong> {project.repositoryUrl}</div>}
            {project.demoUrl && <div className="truncate"><strong>Deployment:</strong> {project.demoUrl}</div>}
          </div>
        </div>

        {/* Executive Summary */}
        <div className="mb-8">
          <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-3">
            1. Project Abstract &amp; Problem Statement
          </h3>
          <p className="text-xs leading-relaxed text-slate-700">
            {project.description}
          </p>
        </div>

        {/* Tech Stack */}
        <div className="mb-8">
          <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-3">
            2. Technology Stack &amp; Tools
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span key={tech} className="px-2.5 py-1 text-xs font-mono font-bold bg-slate-100 text-slate-800 border border-slate-300 rounded">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="mb-8">
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-3">
              3. Empirical Results &amp; Validation Benchmarks
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {project.metrics.map((met, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-500">{met.label}</div>
                  <div className="text-lg font-black font-mono text-slate-900 mt-0.5">{met.value}</div>
                  {met.change && <div className="text-[10px] text-emerald-700 font-medium">{met.change}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Milestones Roadmap */}
        <div className="mb-8">
          <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-3">
            4. Project Milestones &amp; Audit Log
          </h3>
          <div className="space-y-2">
            {project.milestones.map((m) => (
              <div key={m.id} className="p-2.5 border border-slate-200 rounded text-xs flex items-start justify-between">
                <div>
                  <span className="font-bold text-slate-900">{m.title}</span>
                  <p className="text-slate-600 text-[11px] mt-0.5">{m.description}</p>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <span className={`px-2 py-0.5 font-bold rounded text-[10px] ${m.completed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {m.completed ? 'COMPLETED' : 'PENDING'}
                  </span>
                  <div className="text-[10px] text-slate-500 mt-1 font-mono">{m.dueDate}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Documentation Extract */}
        <div className="mb-8">
          <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-3">
            5. Technical Specifications &amp; Methodology
          </h3>
          <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-slate-700 bg-slate-50 p-4 rounded border border-slate-200">
            {project.documentation}
          </pre>
        </div>

        {/* Academic Sign-off Section */}
        <div className="mt-12 pt-8 border-t-2 border-slate-300 grid grid-cols-3 gap-6 text-center text-xs">
          <div>
            <div className="h-10 border-b border-slate-400 mb-2"></div>
            <div className="font-bold text-slate-800">{project.author.name}</div>
            <div className="text-slate-500">Student / Project Lead</div>
          </div>
          <div>
            <div className="h-10 border-b border-slate-400 mb-2"></div>
            <div className="font-bold text-slate-800">Faculty Guide</div>
            <div className="text-slate-500">Academic Supervisor</div>
          </div>
          <div>
            <div className="h-10 border-b border-slate-400 mb-2"></div>
            <div className="font-bold text-slate-800">Head of Department</div>
            <div className="text-slate-500">Evaluation Committee</div>
          </div>
        </div>

      </div>
    </div>
  );
};
