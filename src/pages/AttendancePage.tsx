import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';
import { AttendanceRecord, AttendanceStatus, Department } from '../types';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Edit3, 
  Download, 
  LogIn, 
  LogOut, 
  Calendar, 
  Filter, 
  ShieldCheck, 
  X,
  History
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AttendancePage: React.FC = () => {
  const { role, user, employee } = useAuth();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => StorageService.getAttendance());
  const [departments] = useState<Department[]>(() => StorageService.getDepartments());

  const employeeId = employee?.employeeId || 'EMP-004';
  const todayStr = new Date().toISOString().slice(0, 10);
  const myTodayRecord = attendance.find(a => a.employeeId === employeeId && a.date === todayStr);

  // Filters
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [filterDate, setFilterDate] = useState(todayStr);

  // Correction Modal for HR
  const [isCorrectModalOpen, setIsCorrectModalOpen] = useState(false);
  const [recordToCorrect, setRecordToCorrect] = useState<AttendanceRecord | null>(null);
  const [correctedStatus, setCorrectedStatus] = useState<AttendanceStatus>('present');
  const [correctionReason, setCorrectionReason] = useState('');

  const reloadRecords = () => {
    setAttendance(StorageService.getAttendance());
  };

  const handleClockIn = () => {
    if (!employee) return;
    StorageService.checkIn(employee);
    reloadRecords();
    confetti({ particleCount: 40, spread: 50 });
  };

  const handleClockOut = () => {
    StorageService.checkOut(employeeId);
    reloadRecords();
  };

  const handleOpenCorrection = (record: AttendanceRecord) => {
    setRecordToCorrect(record);
    setCorrectedStatus(record.status);
    setCorrectionReason('');
    setIsCorrectModalOpen(true);
  };

  const handleSaveCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordToCorrect || !correctionReason.trim()) return;

    StorageService.correctAttendance(
      recordToCorrect.id,
      correctedStatus,
      correctionReason.trim(),
      user?.fullName || 'HR Administrator'
    );
    reloadRecords();
    setIsCorrectModalOpen(false);
  };

  // Filter attendance records
  const filteredRecords = attendance.filter((rec) => {
    // If regular employee, only show their own records
    if (role === 'employee') {
      return rec.employeeId === employeeId;
    }

    // If manager, show team or department
    if (role === 'manager' && user) {
      if (rec.departmentName !== user.designation && rec.departmentName !== 'Engineering') {
        // filter appropriately
      }
    }

    if (selectedDept !== 'all' && rec.departmentName !== selectedDept) return false;
    if (selectedStatus !== 'all' && rec.status !== selectedStatus) return false;
    if (filterDate && rec.date !== filterDate) return false;

    return true;
  });

  const getStatusBadge = (st: AttendanceStatus) => {
    switch (st) {
      case 'present':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Present</span>;
      case 'late':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">Late Check-in</span>;
      case 'half-day':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">Half-Day</span>;
      case 'absent':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">Absent</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center space-x-2">
            <Clock className="w-6 h-6 text-indigo-400" />
            <span>{role === 'employee' ? 'My Attendance Record & Clock In' : 'Enterprise Attendance Monitoring'}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {role === 'hr' ? 'Track real-time check-ins, calculate work hours, and audit corrections' : 'Daily punch clock and personal attendance log'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Export CSV for HR/Manager */}
          {(role === 'hr' || role === 'manager') && (
            <button
              onClick={() => StorageService.exportAttendanceCSV()}
              className="px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors flex items-center space-x-1.5"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Export Attendance CSV</span>
            </button>
          )}

          {/* Quick Clock in / Clock out button */}
          {!myTodayRecord ? (
            <button
              onClick={handleClockIn}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center space-x-1.5"
            >
              <LogIn className="w-4 h-4" />
              <span>Clock In Today</span>
            </button>
          ) : !myTodayRecord.checkOutTime ? (
            <button
              onClick={handleClockOut}
              className="px-4 py-2 text-xs font-bold text-amber-300 bg-slate-800 hover:bg-slate-700 border border-amber-500/30 rounded-xl transition-all flex items-center space-x-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Clock Out</span>
            </button>
          ) : (
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
              Shift Logged ({myTodayRecord.workHours} hrs)
            </span>
          )}
        </div>
      </div>

      {/* Filter Bar (for HR & Manager) */}
      {role !== 'employee' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label className="text-slate-400 mr-2 font-medium">Filter Date:</label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 mr-2 font-medium">Department:</label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
              >
                <option value="all">All Departments</option>
                {departments.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-400 mr-2 font-medium">Status:</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="present">Present</option>
                <option value="late">Late</option>
                <option value="half-day">Half-Day</option>
                <option value="absent">Absent</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => {
              setFilterDate(todayStr);
              setSelectedDept('all');
              setSelectedStatus('all');
            }}
            className="text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Attendance Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Check In</th>
                <th className="py-3 px-4">Check Out</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Audit Note</th>
                {role === 'hr' && <th className="py-3 px-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500 italic">
                    No attendance records found for the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Employee */}
                    <td className="py-3 px-4 font-bold text-white">
                      <div>{rec.employeeName}</div>
                      <div className="text-[10px] font-mono text-slate-500">{rec.employeeId}</div>
                    </td>

                    {/* Department */}
                    <td className="py-3 px-4 text-slate-300">
                      {rec.departmentName}
                    </td>

                    {/* Date */}
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {rec.date}
                    </td>

                    {/* Check In */}
                    <td className="py-3 px-4 font-mono text-emerald-400 font-bold">
                      {rec.checkInTime || '--:--:--'}
                    </td>

                    {/* Check Out */}
                    <td className="py-3 px-4 font-mono text-amber-300">
                      {rec.checkOutTime || '--:--:--'}
                    </td>

                    {/* Duration */}
                    <td className="py-3 px-4 font-mono font-semibold text-slate-300">
                      {rec.workHours ? `${rec.workHours} hrs` : '--'}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      {getStatusBadge(rec.status)}
                    </td>

                    {/* Notes & Audit */}
                    <td className="py-3 px-4 text-slate-400 max-w-xs">
                      <div>{rec.notes || '--'}</div>
                      {rec.correctedBy && (
                        <div className="text-[10px] text-amber-400 mt-0.5">
                          Audit: Corrected by {rec.correctedBy} ("{rec.correctionReason}")
                        </div>
                      )}
                    </td>

                    {/* HR Correction Action */}
                    {role === 'hr' && (
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleOpenCorrection(rec)}
                          className="px-2.5 py-1 text-xs text-indigo-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors inline-flex items-center space-x-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Correct</span>
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* HR CORRECTION MODAL (WITH AUDIT TRAIL LOGGING) */}
      {isCorrectModalOpen && recordToCorrect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">HR Attendance Correction</h3>
              </div>
              <button onClick={() => setIsCorrectModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 mb-4 text-xs space-y-1">
              <div><strong>Employee:</strong> {recordToCorrect.employeeName} ({recordToCorrect.employeeId})</div>
              <div><strong>Date:</strong> {recordToCorrect.date}</div>
              <div><strong>Current Status:</strong> {recordToCorrect.status.toUpperCase()}</div>
            </div>

            <form onSubmit={handleSaveCorrection} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">New Attendance Status *</label>
                <select
                  value={correctedStatus}
                  onChange={(e) => setCorrectedStatus(e.target.value as AttendanceStatus)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                >
                  <option value="present">Present</option>
                  <option value="late">Late</option>
                  <option value="half-day">Half-Day</option>
                  <option value="absent">Absent</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Audit Correction Reason * (Required for Compliance)
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Employee was present on off-site client installation verified by team lead..."
                  value={correctionReason}
                  onChange={(e) => setCorrectionReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCorrectModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold transition-all shadow-md shadow-amber-600/20"
                >
                  Save &amp; Log Audit Trail
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
