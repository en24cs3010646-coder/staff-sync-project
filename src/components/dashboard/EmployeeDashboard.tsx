import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';
import { 
  Clock, 
  CalendarDays, 
  GraduationCap, 
  Megaphone, 
  CheckCircle2, 
  LogOut, 
  LogIn, 
  ArrowUpRight, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { ActivePage } from '../layout/Sidebar';
import confetti from 'canvas-confetti';

interface EmployeeDashboardProps {
  onNavigate: (page: ActivePage) => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ onNavigate }) => {
  const { user, employee } = useAuth();
  const employeeId = employee?.employeeId || 'EMP-004';

  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [todayRecord, setTodayRecord] = useState(() => StorageService.getMyTodayAttendance(employeeId));
  const [leaveBalance, setLeaveBalance] = useState(() => StorageService.getEmployeeLeaveBalance(employeeId));

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync state
  const refreshLocal = () => {
    setTodayRecord(StorageService.getMyTodayAttendance(employeeId));
    setLeaveBalance(StorageService.getEmployeeLeaveBalance(employeeId));
  };

  const handleClockIn = () => {
    if (!employee) return;
    const rec = StorageService.checkIn(employee);
    setTodayRecord(rec);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
  };

  const handleClockOut = () => {
    const rec = StorageService.checkOut(employeeId);
    if (rec) setTodayRecord(rec);
  };

  const myLeaves = StorageService.getLeaveRequests().filter(l => l.employeeId === employeeId);
  const pendingLeaves = myLeaves.filter(l => l.status === 'pending');
  const announcements = StorageService.getAnnouncements().slice(0, 3);
  const trainings = StorageService.getTrainings().filter(t => t.status === 'upcoming');

  return (
    <div className="space-y-6">
      
      {/* Employee Greeting & Clock In / Clock Out Hero */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-indigo-950/30 to-slate-900 border border-emerald-500/20 rounded-3xl p-6 backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Self-Service Workspace
              </span>
              <span className="text-slate-400 text-xs font-mono">• ID: {employeeId}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Hello, {user?.fullName}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              {employee?.designation} • {employee?.departmentName}
            </p>
          </div>

          {/* Interactive Clock-In / Clock-Out Widget */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 min-w-[320px]">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Today's Work Shift
              </span>
              <div className="text-2xl sm:text-3xl font-mono font-black text-white mt-0.5">
                {currentTime}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {todayRecord ? (
                  <span className="flex items-center space-x-1.5 text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>In: {todayRecord.checkInTime}</span>
                    {todayRecord.checkOutTime && <span>• Out: {todayRecord.checkOutTime}</span>}
                  </span>
                ) : (
                  <span className="text-amber-400 font-medium">Shift not clocked in yet</span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {!todayRecord ? (
                <button
                  onClick={handleClockIn}
                  className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/25 transition-all active:scale-95"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Clock In Now</span>
                </button>
              ) : !todayRecord.checkOutTime ? (
                <button
                  onClick={handleClockOut}
                  className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition-all active:scale-95"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Clock Out</span>
                </button>
              ) : (
                <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                  Shift Completed ({todayRecord.workHours} hrs)
                </span>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* 4 Leave Balances Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
            <CalendarDays className="w-4 h-4 text-indigo-400" />
            <span>Leave Balances &amp; Entitlement</span>
          </h3>
          <button
            onClick={() => onNavigate('leaves')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            Apply for Leave →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Casual Leave', total: leaveBalance.casual.total, used: leaveBalance.casual.used, color: 'text-blue-400' },
            { label: 'Sick Leave', total: leaveBalance.sick.total, used: leaveBalance.sick.used, color: 'text-emerald-400' },
            { label: 'Earned Leave', total: leaveBalance.earned.total, used: leaveBalance.earned.used, color: 'text-purple-400' },
            { label: 'Unpaid Leave', total: leaveBalance.unpaid.total, used: leaveBalance.unpaid.used, color: 'text-slate-400' },
          ].map((item, idx) => {
            const remaining = item.total - item.used;
            return (
              <div key={idx} className="bg-slate-900/70 border border-slate-800 p-4 rounded-2xl">
                <span className="text-[11px] font-semibold text-slate-400 block">{item.label}</span>
                <div className="mt-1 flex items-baseline space-x-1.5">
                  <span className={`text-2xl font-black font-mono ${item.color}`}>{remaining}</span>
                  <span className="text-xs text-slate-400">/ {item.total} available</span>
                </div>
                <div className="mt-2 text-[10px] text-slate-500">
                  {item.used} days utilized this year
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: My Pending Leaves + Upcoming Trainings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* My Pending Leave Requests */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <CalendarDays className="w-4 h-4 text-amber-400" />
              <span>My Pending Applications ({pendingLeaves.length})</span>
            </h3>
            <button
              onClick={() => onNavigate('leaves')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              All My Leaves →
            </button>
          </div>

          {pendingLeaves.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500 italic">
              You have no pending leave applications.
            </div>
          ) : (
            <div className="space-y-2.5">
              {pendingLeaves.map((leave) => (
                <div key={leave.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white uppercase text-[11px] px-2 py-0.5 rounded bg-slate-800">
                        {leave.leaveType}
                      </span>
                      <span className="text-amber-400 font-medium">({leave.days} days)</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {leave.startDate} to {leave.endDate} • "{leave.reason}"
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm('Cancel this pending leave request?')) {
                        StorageService.cancelLeave(leave.id, employeeId);
                        refreshLocal();
                      }
                    }}
                    className="px-2 py-1 text-[11px] font-semibold text-rose-400 hover:text-rose-300 bg-rose-950/40 border border-rose-800/40 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Training Programs */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <GraduationCap className="w-4 h-4 text-purple-400" />
              <span>Skill &amp; Training Programs</span>
            </h3>
            <button
              onClick={() => onNavigate('training')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Browse Catalog →
            </button>
          </div>

          <div className="space-y-3">
            {trainings.slice(0, 3).map((trn) => {
              const isRegistered = trn.registeredEmployeeIds.includes(employeeId);
              return (
                <div key={trn.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs flex items-center justify-between">
                  <div className="max-w-[70%]">
                    <span className="text-[10px] font-mono text-purple-400 uppercase font-bold block mb-0.5">
                      {trn.category} • {trn.date}
                    </span>
                    <h5 className="font-bold text-white line-clamp-1">{trn.title}</h5>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">Trainer: {trn.trainer}</p>
                  </div>
                  {isRegistered ? (
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                      Enrolled
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        const res = StorageService.registerForTraining(trn.id, employeeId);
                        alert(res.message);
                        refreshLocal();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] transition-colors"
                    >
                      Register
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Announcements Stream */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Megaphone className="w-4 h-4 text-cyan-400" />
            <span>Company Bulletins &amp; Announcements</span>
          </h3>
          <button
            onClick={() => onNavigate('announcements')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            All Bulletins →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {announcements.map((ann) => (
            <div key={ann.id} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="font-mono text-cyan-400 font-bold uppercase">{ann.category}</span>
                <span className="text-slate-500">{ann.createdAt}</span>
              </div>
              <h5 className="font-bold text-white line-clamp-1">{ann.title}</h5>
              <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                {ann.content}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
