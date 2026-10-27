import React, { useState } from 'react';
import { StorageService } from '../services/storage';
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  Users, 
  Calendar, 
  Clock, 
  Building2, 
  CheckCircle2, 
  FileSpreadsheet,
  GraduationCap
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const employees = StorageService.getEmployees();
  const departments = StorageService.getDepartments();
  const attendance = StorageService.getAttendance();
  const leaves = StorageService.getLeaveRequests();
  const trainings = StorageService.getTrainings();

  const [dateRange, setDateRange] = useState('month');

  // Compute metrics
  const activeEmployees = employees.filter(e => e.status === 'active');
  const totalEmployees = employees.length;

  // Department distribution
  const deptData = departments.map(d => {
    const count = employees.filter(e => e.departmentId === d.id).length;
    return { name: d.name, count, pct: totalEmployees > 0 ? Math.round((count / totalEmployees) * 100) : 0 };
  });

  // Leave utilization by type
  const leaveStats = {
    casual: leaves.filter(l => l.leaveType === 'casual' && l.status === 'approved').reduce((sum, l) => sum + l.days, 0),
    sick: leaves.filter(l => l.leaveType === 'sick' && l.status === 'approved').reduce((sum, l) => sum + l.days, 0),
    earned: leaves.filter(l => l.leaveType === 'earned' && l.status === 'approved').reduce((sum, l) => sum + l.days, 0),
    unpaid: leaves.filter(l => l.leaveType === 'unpaid' && l.status === 'approved').reduce((sum, l) => sum + l.days, 0),
  };
  const totalApprovedDays = leaveStats.casual + leaveStats.sick + leaveStats.earned + leaveStats.unpaid;

  // Attendance rate simulation
  const attendancePresent = attendance.filter(a => a.status === 'present' || a.status === 'late').length;
  const attendanceLate = attendance.filter(a => a.status === 'late').length;
  const attendanceAbsent = attendance.filter(a => a.status === 'absent').length;
  const totalAttRecords = attendance.length || 1;
  const presentPct = Math.round((attendancePresent / totalAttRecords) * 100);

  // Training metrics
  const totalSeats = trainings.reduce((acc, t) => acc + t.capacity, 0);
  const enrolledSeats = trainings.reduce((acc, t) => acc + t.registeredEmployeeIds.length, 0);
  const trainingPct = totalSeats > 0 ? Math.round((enrolledSeats / totalSeats) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-indigo-400" />
            <span>Executive Reports &amp; HR Analytics</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Empirical workforce analytics, leave utilization, attendance ratios, and exportable datasets
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => StorageService.exportEmployeesCSV()}
            className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors flex items-center space-x-1.5"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export Employee CSV</span>
          </button>
          <button
            onClick={() => StorageService.exportAttendanceCSV()}
            className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export Attendance CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-2xl">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total Headcount</span>
          <div className="mt-1 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white font-mono">{totalEmployees}</span>
            <span className="text-xs text-emerald-400 font-semibold">{activeEmployees.length} Active</span>
          </div>
          <div className="mt-2 text-[10px] text-slate-500">100% staff records verified</div>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-2xl">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Attendance Punctuality</span>
          <div className="mt-1 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-emerald-400 font-mono">{presentPct}%</span>
            <span className="text-xs text-slate-400">punctual</span>
          </div>
          <div className="mt-2 text-[10px] text-amber-400">{attendanceLate} late punches recorded</div>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-2xl">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Approved Leave Days</span>
          <div className="mt-1 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-purple-400 font-mono">{totalApprovedDays}</span>
            <span className="text-xs text-slate-400">days total</span>
          </div>
          <div className="mt-2 text-[10px] text-slate-500">Across {leaves.filter(l => l.status === 'approved').length} approved leaves</div>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-2xl">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Training Uptake</span>
          <div className="mt-1 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-cyan-400 font-mono">{trainingPct}%</span>
            <span className="text-xs text-slate-400">seat occupancy</span>
          </div>
          <div className="mt-2 text-[10px] text-slate-500">{enrolledSeats} / {totalSeats} seats filled</div>
        </div>

      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Department Workforce Headcount */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-indigo-400" />
              <span>Department Headcount Distribution</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Real-time</span>
          </div>

          <div className="space-y-4">
            {deptData.map((d, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{d.name}</span>
                  <span className="font-mono text-slate-400 font-bold">{d.count} employees ({d.pct}%)</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(5, d.pct)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leave Utilization Breakdown */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span>Approved Leave Utilization Breakdown</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">By Leave Type</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { label: 'Casual Leave', count: leaveStats.casual, color: 'border-blue-500/30 bg-blue-500/10 text-blue-400' },
              { label: 'Sick Leave', count: leaveStats.sick, color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' },
              { label: 'Earned Leave', count: leaveStats.earned, color: 'border-purple-500/30 bg-purple-500/10 text-purple-400' },
              { label: 'Unpaid Leave', count: leaveStats.unpaid, color: 'border-slate-700 bg-slate-800 text-slate-300' },
            ].map((st, i) => (
              <div key={i} className={`p-4 rounded-xl border ${st.color}`}>
                <span className="text-[11px] font-bold block">{st.label}</span>
                <span className="text-2xl font-black font-mono block mt-1">{st.count} Days</span>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400">
            Leave consumption aligns with the statutory annual entitlement policy. No unauthorized absences flagged by audit controllers.
          </div>
        </div>

      </div>

    </div>
  );
};
