import React from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  LayoutGrid, 
  List, 
  Kanban, 
  CalendarRange, 
  Star,
  X
} from 'lucide-react';
import { ProjectCategory, ProjectStatus } from '../types/project';

export type ViewMode = 'grid' | 'table' | 'kanban' | 'timeline';
export type SortOption = 'updated' | 'progress-desc' | 'progress-asc' | 'priority' | 'title' | 'date';

interface ProjectFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sortBy: SortOption;
  onSortByChange: (sort: SortOption) => void;
  showFavoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
  categories: ProjectCategory[];
}

export const ProjectFilterBar: React.FC<ProjectFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortByChange,
  showFavoritesOnly,
  onToggleFavoritesOnly,
  categories,
}) => {
  const statuses: { label: string; value: string }[] = [
    { label: 'All Projects', value: 'all' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Review', value: 'review' },
    { label: 'Completed', value: 'completed' },
    { label: 'Planning', value: 'planning' },
  ];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 sm:p-4 mb-6 backdrop-blur-md space-y-3">
      {/* Top Row: Search + View Mode + Favorites */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Search bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search saved projects, tech stack (Python, React...), tags, or authors..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-9 py-2 bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* View Mode & Favorites */}
        <div className="flex items-center space-x-2 self-end sm:self-auto">
          {/* Favorites filter toggle */}
          <button
            onClick={onToggleFavoritesOnly}
            className={`px-3 py-2 text-xs font-medium rounded-xl border flex items-center space-x-1.5 transition-all ${
              showFavoritesOnly
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/10'
                : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span className="hidden sm:inline">Favorites</span>
          </button>

          {/* View Mode Switcher */}
          <div className="flex items-center bg-slate-950/80 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => onViewModeChange('grid')}
              title="Grid View"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('table')}
              title="Table View"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('kanban')}
              title="Kanban Board View"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'kanban' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Kanban className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('timeline')}
              title="Roadmap & Timeline View"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'timeline' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CalendarRange className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Row: Status Tabs + Category Filter + Sort Dropdown */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
        
        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {statuses.map((st) => (
            <button
              key={st.value}
              onClick={() => onStatusChange(st.value)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                selectedStatus === st.value
                  ? 'bg-slate-700 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Category & Sorting Controls */}
        <div className="flex items-center space-x-2">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Sort By Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as SortOption)}
            className="px-2.5 py-1.5 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="updated">Recently Updated</option>
            <option value="progress-desc">Progress (Highest)</option>
            <option value="progress-asc">Progress (Lowest)</option>
            <option value="priority">Priority</option>
            <option value="title">Project Name (A-Z)</option>
            <option value="date">Target Due Date</option>
          </select>
        </div>

      </div>
    </div>
  );
};
