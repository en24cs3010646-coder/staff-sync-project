import React, { useState, useEffect } from 'react';
import { Project } from '../types/project';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Users, 
  Calendar, 
  CheckCircle2, 
  Code2, 
  Layers, 
  TrendingUp,
  Tag
} from 'lucide-react';

interface PresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export const PresentationModal: React.FC<PresentationModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 'title',
      title: 'Project Defense & Synopsis',
      subtitle: project.title,
    },
    {
      id: 'objectives',
      title: 'Problem Statement & Objectives',
      subtitle: 'Core Challenges Addressed',
    },
    {
      id: 'architecture',
      title: 'Technical Stack & System Architecture',
      subtitle: 'Component Ecosystem',
    },
    {
      id: 'milestones',
      title: 'Milestones & Deliverables Roadmap',
      subtitle: 'Execution Velocity',
    },
    {
      id: 'metrics',
      title: 'Validation Metrics & Benchmarks',
      subtitle: 'Empirical Outcomes',
    },
    {
      id: 'code',
      title: 'Key Algorithms & Implementation',
      subtitle: 'Core Source Artifacts',
    },
  ];

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, slides.length, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-8 no-print select-none">
      <div className="relative w-full max-w-5xl h-[85vh] bg-slate-950 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between shadow-2xl overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-900 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <span className="font-mono text-purple-400 uppercase font-bold tracking-wider">
              Project Defense Mode
            </span>
            <span>•</span>
            <span className="text-slate-300 font-medium truncate max-w-xs">{project.title}</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="font-mono text-slate-400">
              Slide {currentSlide + 1} of {slides.length}
            </span>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slide Body */}
        <div className="flex-1 py-8 flex flex-col justify-center overflow-y-auto">
          
          {/* SLIDE 0: TITLE */}
          {currentSlide === 0 && (
            <div className="space-y-6 text-center max-w-3xl mx-auto animate-fadeIn">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/25">
                {project.category}
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                {project.title}
              </h1>
              <p className="text-lg text-indigo-300 font-medium max-w-2xl mx-auto">
                {project.subtitle}
              </p>
              <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Presenter</span>
                  <span className="text-sm font-bold text-white">{project.author.name}</span>
                  <span className="block text-slate-400">{project.author.role}</span>
                </div>
                {project.author.institution && (
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Affiliation</span>
                    <span className="text-sm font-bold text-white">{project.author.institution}</span>
                  </div>
                )}
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Status</span>
                  <span className="text-sm font-bold text-emerald-400 uppercase">{project.status} ({project.progress}%)</span>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 1: PROBLEM STATEMENT */}
          {currentSlide === 1 && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="border-l-4 border-indigo-500 pl-4">
                <span className="text-xs uppercase font-bold tracking-wider text-indigo-400">Section 1</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Problem Formulation &amp; Solution</h2>
              </div>
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-300 text-sm leading-relaxed space-y-4">
                <p className="text-base text-slate-100 font-medium">
                  {project.description}
                </p>
                <div className="pt-2 grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-indigo-400 font-bold block mb-1">Target Due Date</span>
                    <span className="text-white font-mono">{project.targetDate}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-emerald-400 font-bold block mb-1">Execution Priority</span>
                    <span className="text-white uppercase font-mono">{project.priority}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 2: TECH STACK & ARCHITECTURE */}
          {currentSlide === 2 && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="border-l-4 border-cyan-500 pl-4">
                <span className="text-xs uppercase font-bold tracking-wider text-cyan-400">Section 2</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">System Architecture &amp; Technologies</h2>
              </div>
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Core Technology Stack:
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-sm font-mono font-bold px-3 py-1.5 rounded-xl bg-slate-950 border border-cyan-500/30 text-cyan-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans">
                  The architecture implements decoupled pipelines with real-time feedback loops, verified schema contracts, and optimized execution profiles.
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 3: MILESTONES */}
          {currentSlide === 3 && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="border-l-4 border-emerald-500 pl-4">
                <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">Section 3</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Milestones &amp; Verification Progress</h2>
              </div>
              <div className="space-y-3">
                {project.milestones.map((m) => (
                  <div
                    key={m.id}
                    className={`p-3.5 rounded-xl border flex items-start space-x-3 text-xs ${
                      m.completed 
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-200' 
                        : 'bg-slate-900/80 border-slate-800 text-slate-400'
                    }`}
                  >
                    <CheckCircle2 className={`w-4 h-4 mt-0.5 ${m.completed ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white">{m.title}</span>
                        <span className="font-mono text-slate-400">{m.dueDate}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{m.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SLIDE 4: METRICS */}
          {currentSlide === 4 && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="border-l-4 border-purple-500 pl-4">
                <span className="text-xs uppercase font-bold tracking-wider text-purple-400">Section 4</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Performance Benchmarks &amp; KPIs</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {project.metrics && project.metrics.map((met, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      {met.label}
                    </span>
                    <span className="text-3xl font-black text-white font-mono block">
                      {met.value}
                    </span>
                    {met.change && (
                      <span className="text-xs text-emerald-400 font-semibold block mt-1">
                        {met.change}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SLIDE 5: CODE ARTIFACT */}
          {currentSlide === 5 && (
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="border-l-4 border-amber-500 pl-4">
                <span className="text-xs uppercase font-bold tracking-wider text-amber-400">Section 5</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Primary Implementation Snippet</h2>
              </div>
              {project.codeSnippets && project.codeSnippets.length > 0 ? (
                <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
                  <div className="px-4 py-2 bg-slate-950 border-b border-slate-800 text-xs font-mono text-indigo-400 font-semibold">
                    {project.codeSnippets[0].filename} ({project.codeSnippets[0].language})
                  </div>
                  <pre className="p-4 font-mono text-xs text-cyan-300 max-h-72 overflow-y-auto leading-relaxed">
                    <code>{project.codeSnippets[0].code}</code>
                  </pre>
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-500 italic bg-slate-900 rounded-xl">
                  Full implementation details in documentation tab.
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer Navigation Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-900 text-xs text-slate-400">
          <div className="flex items-center space-x-1">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentSlide === idx ? 'w-6 bg-indigo-500' : 'bg-slate-800 hover:bg-slate-700'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setCurrentSlide((prev) => Math.max(prev - 1, 0))}
              disabled={currentSlide === 0}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center space-x-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1))}
              disabled={currentSlide === slides.length - 1}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold disabled:opacity-30 disabled:cursor-not-allowed flex items-center space-x-1 shadow-md shadow-indigo-600/20"
            >
              <span>Next Slide</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
