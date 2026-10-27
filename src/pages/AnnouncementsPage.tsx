import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';
import { Announcement, AnnouncementCategory } from '../types';
import { 
  Megaphone, 
  Plus, 
  Pin, 
  Calendar, 
  Tag, 
  Trash2, 
  X, 
  AlertCircle 
} from 'lucide-react';

export const AnnouncementsPage: React.FC = () => {
  const { role, user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => StorageService.getAnnouncements());
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New announcement form
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<AnnouncementCategory>('General');
  const [pinned, setPinned] = useState(false);

  const reloadAnnouncements = () => {
    setAnnouncements(StorageService.getAnnouncements());
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      category,
      authorName: user?.fullName || 'HR Administration',
      createdAt: new Date().toISOString().slice(0, 10),
      pinned,
    };

    StorageService.saveAnnouncement(newAnn);
    reloadAnnouncements();
    setIsModalOpen(false);
    setTitle('');
    setContent('');
    setPinned(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this announcement?')) {
      StorageService.deleteAnnouncement(id);
      reloadAnnouncements();
    }
  };

  const filteredAnnouncements = announcements.filter(a => {
    if (selectedCategory !== 'all' && a.category !== selectedCategory) return false;
    return true;
  });

  const getCategoryBadge = (cat: AnnouncementCategory) => {
    switch (cat) {
      case 'Urgent':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">Urgent</span>;
      case 'Policy':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">Policy</span>;
      case 'Event':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">Event</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">General</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center space-x-2">
            <Megaphone className="w-6 h-6 text-cyan-400" />
            <span>Company Bulletins &amp; Announcements</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Official communications, regulatory policy revisions, townhalls, and event notices
          </p>
        </div>

        {role === 'hr' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md shadow-indigo-600/25 flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>New Announcement</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {['all', 'General', 'Policy', 'Event', 'Urgent'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat === 'all' ? 'All Bulletins' : cat}
          </button>
        ))}
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.map((ann) => (
          <div
            key={ann.id}
            className={`bg-slate-900/80 border rounded-2xl p-5 backdrop-blur-md transition-all hover:border-slate-700 relative ${
              ann.pinned ? 'border-indigo-500/40 shadow-lg shadow-indigo-500/5' : 'border-slate-800'
            }`}
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex flex-wrap items-center gap-2">
                {getCategoryBadge(ann.category)}
                {ann.pinned && (
                  <span className="flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    <Pin className="w-3 h-3" />
                    <span>PINNED</span>
                  </span>
                )}
                <span className="text-xs text-slate-400 font-mono">
                  {ann.createdAt}
                </span>
              </div>

              {role === 'hr' && (
                <button
                  onClick={() => handleDelete(ann.id)}
                  className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                  title="Delete Announcement"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <h3 className="text-base font-bold text-white mb-2">
              {ann.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
              {ann.content}
            </p>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
              <span>Author: <strong className="text-slate-400">{ann.authorName}</strong></span>
              <span className="text-[11px] font-mono">StaffSync Corporate Comm</span>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: POST ANNOUNCEMENT (HR ONLY) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Megaphone className="w-5 h-5 text-indigo-400" />
                <span>Create Company Announcement</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Notice Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q4 Company All-Hands Townhall"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as AnnouncementCategory)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                  >
                    <option value="General">General Notice</option>
                    <option value="Policy">Company Policy</option>
                    <option value="Event">Townhall / Event</option>
                    <option value="Urgent">Urgent / Alert</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center space-x-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={pinned}
                      onChange={(e) => setPinned(e.target.checked)}
                      className="rounded accent-indigo-500 w-4 h-4"
                    />
                    <span>Pin to top of boards</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Announcement Body *</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Draft your detailed message to all company employees..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-md shadow-indigo-600/20"
                >
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
