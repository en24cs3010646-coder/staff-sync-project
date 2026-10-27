import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';
import { TrainingProgram, TrainingCategory } from '../types';
import { 
  GraduationCap, 
  Plus, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle2, 
  X, 
  AlertCircle,
  Eye,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const TrainingPage: React.FC = () => {
  const { role, user, employee } = useAuth();
  const employeeId = employee?.employeeId || 'EMP-004';

  const [trainings, setTrainings] = useState<TrainingProgram[]>(() => StorageService.getTrainings());
  const [selectedCategory, setSelectedCategory] = useState('all');

  // New Training modal (for HR & Manager)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [trainer, setTrainer] = useState('');
  const [category, setCategory] = useState<TrainingCategory>('Technical');
  const [date, setDate] = useState('2026-11-20');
  const [duration, setDuration] = useState('3 Hours');
  const [capacity, setCapacity] = useState(25);

  // Participant list viewer modal
  const [rosterModalTraining, setRosterModalTraining] = useState<TrainingProgram | null>(null);

  const reloadTrainings = () => {
    setTrainings(StorageService.getTrainings());
  };

  const handleCreateTraining = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !trainer.trim()) return;

    const newTrn: TrainingProgram = {
      id: `trn-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      trainer: trainer.trim(),
      category,
      date,
      duration: duration.trim(),
      capacity: Number(capacity),
      registeredEmployeeIds: [],
      status: 'upcoming',
      createdBy: user?.fullName || 'HR Administration',
    };

    StorageService.saveTraining(newTrn);
    reloadTrainings();
    setIsModalOpen(false);
    setTitle('');
    setDescription('');
    setTrainer('');
  };

  const handleRegister = (trnId: string) => {
    const res = StorageService.registerForTraining(trnId, employeeId);
    alert(res.message);
    if (res.success) {
      confetti({ particleCount: 40, spread: 60 });
    }
    reloadTrainings();
  };

  const handleCancelRegistration = (trnId: string) => {
    if (window.confirm('Cancel your enrollment in this training session?')) {
      const res = StorageService.cancelTrainingRegistration(trnId, employeeId);
      alert(res.message);
      reloadTrainings();
    }
  };

  const filteredTrainings = trainings.filter(t => {
    if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center space-x-2">
            <GraduationCap className="w-6 h-6 text-purple-400" />
            <span>Learning &amp; Talent Development</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse technical workshops, leadership masterclasses, and regulatory compliance courses
          </p>
        </div>

        {(role === 'hr' || role === 'manager') && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md shadow-indigo-600/25 flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Training</span>
          </button>
        )}
      </div>

      {/* Filter Category Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {['all', 'Technical', 'Leadership', 'Compliance', 'Design', 'Productivity'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat === 'all' ? 'All Programs' : cat}
          </button>
        ))}
      </div>

      {/* Training Courses Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTrainings.map((trn) => {
          const isRegistered = trn.registeredEmployeeIds.includes(employeeId);
          const enrolledCount = trn.registeredEmployeeIds.length;
          const seatsLeft = trn.capacity - enrolledCount;
          const pct = Math.min(100, Math.round((enrolledCount / trn.capacity) * 100));

          return (
            <div
              key={trn.id}
              className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 backdrop-blur-md flex flex-col justify-between transition-all hover:shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    {trn.category}
                  </span>
                  <span className={`text-[10px] font-bold uppercase font-mono ${
                    seatsLeft > 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {seatsLeft > 0 ? `${seatsLeft} seats available` : 'Full Capacity'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-1.5 leading-snug">
                  {trn.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                  {trn.description}
                </p>

                {/* Details: Trainer, Date, Duration */}
                <div className="space-y-1.5 py-3 border-t border-slate-800/80 text-xs text-slate-400">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                    <span>Trainer: <strong className="text-slate-200">{trn.trainer}</strong></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span className="font-mono text-slate-300">{trn.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{trn.duration}</span>
                  </div>
                </div>

                {/* Capacity Progress Bar */}
                <div className="my-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span>Enrolled: {enrolledCount} of {trn.capacity}</span>
                    <span className="font-mono font-bold text-white">{pct}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full ${pct >= 100 ? 'bg-rose-500' : 'bg-purple-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                {/* Roster preview for Manager & HR */}
                {(role === 'hr' || role === 'manager') ? (
                  <button
                    onClick={() => setRosterModalTraining(trn)}
                    className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg text-xs flex items-center space-x-1"
                    title="View Participants Roster"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Roster ({enrolledCount})</span>
                  </button>
                ) : <div />}

                {isRegistered ? (
                  <button
                    onClick={() => handleCancelRegistration(trn.id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 hover:text-rose-300 border border-rose-800/30 font-bold text-xs transition-colors"
                  >
                    Drop Enrollment
                  </button>
                ) : (
                  <button
                    onClick={() => handleRegister(trn.id)}
                    disabled={seatsLeft <= 0}
                    className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-purple-600/20 transition-all"
                  >
                    {seatsLeft > 0 ? 'Register Now' : 'Class Full'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* SCHEDULE TRAINING MODAL (FOR HR / MANAGERS) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-purple-400" />
                <span>Schedule Training Program</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTraining} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Session Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Tracing & High-Load Microservices"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TrainingCategory)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                  >
                    <option value="Technical">Technical &amp; Engineering</option>
                    <option value="Leadership">Leadership &amp; Management</option>
                    <option value="Compliance">Regulatory &amp; Compliance</option>
                    <option value="Design">UI/UX &amp; Design</option>
                    <option value="Productivity">Workplace Productivity</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Instructor / Trainer *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Staff Engineer"
                    value={trainer}
                    onChange={(e) => setTrainer(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Duration</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 3 Hours"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Seat Capacity</label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    required
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Description &amp; Syllabus</label>
                <textarea
                  rows={3}
                  placeholder="Key learning outcomes, requirements, and target audience..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
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
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-all shadow-md shadow-purple-600/20"
                >
                  Schedule Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ROSTER MODAL */}
      {rosterModalTraining && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div>
                <h3 className="text-base font-bold text-white">Participants Roster</h3>
                <p className="text-xs text-slate-400 truncate max-w-xs">{rosterModalTraining.title}</p>
              </div>
              <button onClick={() => setRosterModalTraining(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto text-xs">
              {rosterModalTraining.registeredEmployeeIds.length === 0 ? (
                <div className="text-center py-8 text-slate-500 italic">No registrations yet.</div>
              ) : (
                rosterModalTraining.registeredEmployeeIds.map((id) => {
                  const emp = StorageService.getEmployeeById(id);
                  return (
                    <div key={id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white">{emp?.fullName || id}</div>
                        <div className="text-[10px] text-slate-400">{emp?.designation || id}</div>
                      </div>
                      <span className="font-mono text-[10px] text-purple-400">{id}</span>
                    </div>
                  );
                })
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-right">
              <button
                onClick={() => setRosterModalTraining(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
