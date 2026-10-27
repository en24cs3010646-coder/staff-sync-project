import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';
import { 
  Users, 
  Clock, 
  CalendarDays, 
  GraduationCap, 
  CheckCircle2, 
  XCircle, 
  ArrowUpRight, 
  Briefcase 
} from 'lucide-react';
import { ActivePage } from '../layout/Sidebar';

interface ManagerDashboardProps {
  onNavigate: (page: ActivePage) => void;
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ onNavigate }) => {
  const { user, employee } = useAuth();
  const managerEmployeeId = employee?.id || 'emp-2';

  // Get only this manager's team
  const allEmployees = StorageService.getEmployees();
  const teamMembers = allEmployees.filter(e => e.managerId === managerEmployeeId || e.departmentId === employee?.departmentId && e.id !== employee?.id);
  
  const todayAttendance = StorageService.getTodayAttendance();
  const teamMemberIds = teamMembers.map(t => t.employeeId);
  const teamPresentToday = todayAttendance.filter(a => teamMemberIds.includes(a.employeeId));

  const allLeaves = StorageService.getLeaveRequests();
  const teamPendingLeaves = allLeaves.filter(l => teamMemberIds.includes(l.employeeId) && l.status === 'pending');

  const upcomingTrainings = StorageService.getTrainings().filter(t => t.status === 'upcoming');

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900 border border-blue-500/20 rounded-3xl p-6 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Department Management Portal
              </span>
              <span className="text-slate-400 text-xs">• {employee?.departmentName || 'Engineering'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.fullName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Track your team attendance, review pending vacation applications, and monitor technical upskilling progress.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onNavigate('leaves')}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md shadow-indigo-600/20"
            >
              Review Team Leaves ({teamPendingLeaves.length})
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Team Size */}
        <div 
          onClick={() => onNavigate('employees')}
          className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl cursor-pointer transition-all hover:shadow-lg group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Direct Reports</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{teamMembers.length}</span>
            <span className="text-xs text-slate-400">engineers</span>
          </div>
          <div className="mt-2 text-[11px] text-indigo-400 font-medium flex items-center justify-between">
            <span>View Team Roster</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Team Present Today */}
        <div 
          onClick={() => onNavigate('attendance')}
          className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl cursor-pointer transition-all hover:shadow-lg group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Active Today</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">{teamPresentToday.length}</span>
            <span className="text-xs text-slate-400">/ {teamMembers.length} checked in</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-400 font-medium">
            Shift coverage active
          </div>
        </div>

        {/* Pending Approvals */}
        <div 
          onClick={() => onNavigate('leaves')}
          className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl cursor-pointer transition-all hover:shadow-lg group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Team Leaves</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">{teamPendingLeaves.length}</span>
            <span className="text-xs text-slate-400">pending</span>
          </div>
          <div className="mt-2 text-[11px] text-amber-400 font-semibold">
            Requires Manager sign-off
          </div>
        </div>

        {/* Upcoming Trainings */}
        <div 
          onClick={() => onNavigate('training')}
          className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl cursor-pointer transition-all hover:shadow-lg group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Skill Programs</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono">{upcomingTrainings.length}</span>
            <span className="text-xs text-slate-400">available sessions</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Open for team enrollment
          </div>
        </div>

      </div>

      {/* Grid: Pending Team Leaves + Team Attendance Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pending Team Leaves */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <CalendarDays className="w-4 h-4 text-amber-400" />
                <span>Pending Team Time-Off ({teamPendingLeaves.length})</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Direct reports awaiting your approval</p>
            </div>
          </div>

          {teamPendingLeaves.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-500 italic">
              No pending leave requests for your team right now.
            </div>
          ) : (
            <div className="space-y-3">
              {teamPendingLeaves.map((req) => (
                <div key={req.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white">{req.employeeName}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono uppercase text-[10px]">
                        {req.leaveType}
                      </span>
                      <span className="text-amber-400 font-medium">({req.days} days)</span>
                    </div>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      {req.startDate} to {req.endDate} • "{req.reason}"
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        StorageService.updateLeaveStatus(req.id, 'approved', user!);
                        window.location.reload();
                      }}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        const reason = window.prompt('Provide rejection reason:') || 'Coverage constraints';
                        StorageService.updateLeaveStatus(req.id, 'rejected', user!, reason);
                        window.location.reload();
                      }}
                      className="px-2.5 py-1 bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 font-bold rounded-lg text-xs transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Team Attendance Roster Today */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Today's Team Check-in Roster</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Live status of assigned team members</p>
            </div>
            <button
              onClick={() => onNavigate('attendance')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Full Log →
            </button>
          </div>

          <div className="space-y-2.5">
            {teamMembers.map((member) => {
              const record = todayAttendance.find(a => a.employeeId === member.employeeId);
              return (
                <div key={member.id} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={member.avatar} 
                      alt={member.fullName} 
                      className="w-8 h-8 rounded-lg object-cover border border-slate-700" 
                    />
                    <div>
                      <div className="font-bold text-white">{member.fullName}</div>
                      <div className="text-[11px] text-slate-400">{member.designation}</div>
                    </div>
                  </div>

                  <div>
                    {record ? (
                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          record.status === 'present' 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                            : record.status === 'late'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}>
                          {record.status}
                        </span>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {record.checkInTime || '--:--'}
                        </div>
                      </div>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-400">
                        Not Clocked In
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
