import React, { useState } from 'react';
import { StorageService } from '../../services/storage';
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  CalendarDays, 
  ArrowUpRight, 
  Building2, 
  AlertCircle, 
  Megaphone, 
  Activity,
  Download,
  Plus
} from 'lucide-react';
import { ActivePage } from '../layout/Sidebar';

interface HRDashboardProps {
  onNavigate: (page: ActivePage) => void;
}

export const HRDashboard: React.FC<HRDashboardProps> = ({ onNavigate }) => {
  const employees = StorageService.getEmployees();
  const departments = StorageService.getDepartments();
  const attendance = StorageService.getTodayAttendance();
  const leaveRequests = StorageService.getLeaveRequests();
  const announcements = StorageService.getAnnouncements();
  const auditLogs = StorageService.getAuditLogs().slice(0, 5);

  const activeEmployees = employees.filter(e => e.status === 'active');
  const presentToday = attendance.filter(a => a.status === 'present' || a.status === 'late' || a.status === 'half-day');
  const absentToday = activeEmployees.length - presentToday.length;
  const pendingLeaves = leaveRequests.filter(l => l.status === 'pending');

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Quick Actions */}
      <div className="bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-slate-900 border border-purple-500/20 rounded-3xl p-6 backdrop-blur-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                HR Executive Control Panel
              </span>
              <span className="text-slate-400 text-xs">• Real-time Enterprise Sync</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Workforce Operations &amp; Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Monitor real-time company attendance, department headcounts, pending leave reviews, and compliance audit logs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigate('employees')}
              className="px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md shadow-indigo-600/25 flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Employee</span>
            </button>
            <button
              onClick={() => StorageService.exportEmployeesCSV()}
              className="px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors flex items-center space-x-1.5"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Key HR Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Active Employees */}
        <div 
          onClick={() => onNavigate('employees')}
          className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl cursor-pointer transition-all hover:shadow-lg group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Active Workforce</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{activeEmployees.length}</span>
            <span className="text-xs text-slate-400">staff members</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>{departments.length} Departments</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400" />
          </div>
        </div>

        {/* Present Today */}
        <div 
          onClick={() => onNavigate('attendance')}
          className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl cursor-pointer transition-all hover:shadow-lg group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Present Today</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">{presentToday.length}</span>
            <span className="text-xs text-slate-400">
              ({activeEmployees.length > 0 ? Math.round((presentToday.length / activeEmployees.length) * 100) : 0}%)
            </span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-400 font-medium">
            Checked in across shifts
          </div>
        </div>

        {/* Absent Today */}
        <div 
          onClick={() => onNavigate('attendance')}
          className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl cursor-pointer transition-all hover:shadow-lg group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Absent / On Leave</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-mono">{Math.max(0, absentToday)}</span>
            <span className="text-xs text-slate-400">unreported/leave</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Includes approved sick leaves
          </div>
        </div>

        {/* Pending Leave Requests */}
        <div 
          onClick={() => onNavigate('leaves')}
          className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl cursor-pointer transition-all hover:shadow-lg group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Pending Approvals</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">{pendingLeaves.length}</span>
            <span className="text-xs text-slate-400">applications</span>
          </div>
          <div className="mt-2 text-[11px] text-amber-400 font-semibold flex items-center justify-between">
            <span>Action Required</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-amber-400" />
          </div>
        </div>

      </div>

      {/* Main Grid: Department Distribution + Pending Leaves Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Department Distribution (1 col) */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-indigo-400" />
              <span>Department Distribution</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">{departments.length} total</span>
          </div>

          <div className="space-y-3">
            {departments.map((dept) => {
              const deptEmps = employees.filter(e => e.departmentId === dept.id && e.status === 'active');
              const pct = activeEmployees.length > 0 ? Math.round((deptEmps.length / activeEmployees.length) * 100) : 0;
              return (
                <div key={dept.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-200">{dept.name}</span>
                    <span className="font-mono text-slate-400 font-bold">{deptEmps.length} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-indigo-500 h-1.5 rounded-full" 
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pending Leave Requests Queue (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <CalendarDays className="w-4 h-4 text-amber-400" />
                <span>Leave Approval Queue ({pendingLeaves.length})</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Review and approve workforce time-off requests
              </p>
            </div>
            <button
              onClick={() => onNavigate('leaves')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              View Full Queue →
            </button>
          </div>

          {pendingLeaves.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500 italic">
              All leave requests have been reviewed and processed!
            </div>
          ) : (
            <div className="space-y-2.5">
              {pendingLeaves.slice(0, 4).map((leave) => (
                <div
                  key={leave.id}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white">{leave.employeeName}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] uppercase font-mono font-bold">
                        {leave.leaveType}
                      </span>
                      <span className="text-amber-400 font-medium">({leave.days} {leave.days === 1 ? 'day' : 'days'})</span>
                    </div>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      {leave.startDate} to {leave.endDate} • "{leave.reason}"
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        const currentUser = StorageService.getCurrentUser()!;
                        StorageService.updateLeaveStatus(leave.id, 'approved', currentUser);
                        window.location.reload();
                      }}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        const reason = window.prompt('Provide rejection reason (optional):') || 'Operational requirements';
                        const currentUser = StorageService.getCurrentUser()!;
                        StorageService.updateLeaveStatus(leave.id, 'rejected', currentUser, reason);
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

      </div>

      {/* Bottom Grid: Recent Announcements + Live Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Announcements */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Megaphone className="w-4 h-4 text-cyan-400" />
              <span>Company Announcements</span>
            </h3>
            <button
              onClick={() => onNavigate('announcements')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Manage →
            </button>
          </div>

          <div className="space-y-3">
            {announcements.slice(0, 3).map((ann) => (
              <div key={ann.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-white line-clamp-1">{ann.title}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{ann.createdAt}</span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {ann.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Log Stream */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>HR Compliance &amp; Audit Trail</span>
            </h3>
            <span className="text-[11px] font-mono text-emerald-400">Immutable Log</span>
          </div>

          <div className="space-y-2.5">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">{log.action}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{log.timestamp}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">{log.details}</p>
                <div className="text-[10px] text-indigo-400 font-medium mt-1">
                  Actor: {log.performedBy}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
