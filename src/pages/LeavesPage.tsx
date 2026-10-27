import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';
import { LeaveRequest, LeaveType, LeaveStatus, LeaveBalance } from '../types';
import { 
  CalendarDays, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Trash2, 
  Filter, 
  X,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const LeavesPage: React.FC = () => {
  const { role, user, employee } = useAuth();
  const employeeId = employee?.employeeId || 'EMP-004';

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => StorageService.getLeaveRequests());
  const [balance, setBalance] = useState<LeaveBalance>(() => StorageService.getEmployeeLeaveBalance(employeeId));

  const [activeTab, setActiveTab] = useState<'my-leaves' | 'approvals'>('my-leaves');
  const [statusFilter, setStatusFilter] = useState('all');

  // Apply Leave Modal
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [leaveType, setLeaveType] = useState<LeaveType>('casual');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));
  const [reason, setReason] = useState('');
  const [formError, setFormError] = useState('');

  const reloadData = () => {
    setLeaveRequests(StorageService.getLeaveRequests());
    setBalance(StorageService.getEmployeeLeaveBalance(employeeId));
  };

  // Calculate days between start and end date
  const calculateDays = (s: string, e: string): number => {
    const start = new Date(s);
    const end = new Date(e);
    if (end < start) return 0;
    const diff = end.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const days = calculateDays(startDate, endDate);
    if (days <= 0) {
      setFormError('End date must be on or after the start date.');
      return;
    }

    if (!reason.trim()) {
      setFormError('Please specify the reason for your leave.');
      return;
    }

    const res = StorageService.applyLeave({
      employeeId,
      employeeName: employee?.fullName || 'Alex Rivera',
      departmentName: employee?.departmentName || 'Engineering',
      managerId: employee?.managerId,
      leaveType,
      startDate,
      endDate,
      days,
      reason: reason.trim(),
    });

    if (!res.success) {
      setFormError(res.error || 'Failed to submit leave application.');
      return;
    }

    reloadData();
    setIsApplyModalOpen(false);
    confetti({ particleCount: 30, spread: 45 });
  };

  const handleApprove = (leaveId: string) => {
    if (!user) return;
    StorageService.updateLeaveStatus(leaveId, 'approved', user);
    reloadData();
  };

  const handleReject = (leaveId: string) => {
    if (!user) return;
    const rejectReason = window.prompt('Specify reason for leave rejection:') || 'Operational constraints';
    StorageService.updateLeaveStatus(leaveId, 'rejected', user, rejectReason);
    reloadData();
  };

  const handleCancelMyLeave = (leaveId: string) => {
    if (window.confirm('Cancel this pending leave request?')) {
      StorageService.cancelLeave(leaveId, employeeId);
      reloadData();
    }
  };

  // Determine lists
  const myLeaves = leaveRequests.filter(l => l.employeeId === employeeId);

  const approvalQueue = leaveRequests.filter(l => {
    if (role === 'hr') return true; // HR can view all requests
    if (role === 'manager' && user) {
      // Manager reviews department or direct reports
      return l.managerId === employee?.id || l.departmentName === employee?.departmentName;
    }
    return false;
  });

  const getStatusBadge = (st: LeaveStatus) => {
    switch (st) {
      case 'approved':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Approved</span>;
      case 'pending':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">Pending Approval</span>;
      case 'rejected':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">Rejected</span>;
      case 'cancelled':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-500/15 text-slate-400 border border-slate-500/30">Cancelled</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center space-x-2">
            <CalendarDays className="w-6 h-6 text-indigo-400" />
            <span>Leave Management &amp; Approvals</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Apply for paid time-off, check entitlement balances, and process workflow approvals
          </p>
        </div>

        <button
          onClick={() => {
            setFormError('');
            setIsApplyModalOpen(true);
          }}
          className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md shadow-indigo-600/25 flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Apply for Leave</span>
        </button>
      </div>

      {/* Leave Balances Grid (My Balances) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Casual Leave', total: balance.casual.total, used: balance.casual.used, color: 'text-blue-400' },
          { label: 'Sick Leave', total: balance.sick.total, used: balance.sick.used, color: 'text-emerald-400' },
          { label: 'Earned / Annual', total: balance.earned.total, used: balance.earned.used, color: 'text-purple-400' },
          { label: 'Unpaid Leave', total: balance.unpaid.total, used: balance.unpaid.used, color: 'text-slate-400' },
        ].map((item, idx) => {
          const avail = item.total - item.used;
          return (
            <div key={idx} className="bg-slate-900/70 border border-slate-800 p-4 rounded-2xl">
              <span className="text-[11px] font-semibold text-slate-400 block">{item.label}</span>
              <div className="mt-1 flex items-baseline space-x-1.5">
                <span className={`text-2xl font-black font-mono ${item.color}`}>{avail}</span>
                <span className="text-xs text-slate-400">/ {item.total} days</span>
              </div>
              <div className="mt-2 text-[10px] text-slate-500">
                {item.used} days taken this year
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs: My Leaves vs Approvals Queue (for HR / Manager) */}
      <div className="flex border-b border-slate-800 space-x-4">
        <button
          onClick={() => setActiveTab('my-leaves')}
          className={`py-3 px-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'my-leaves'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          My Leave History ({myLeaves.length})
        </button>

        {(role === 'hr' || role === 'manager') && (
          <button
            onClick={() => setActiveTab('approvals')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center space-x-1.5 ${
              activeTab === 'approvals'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Team Approval Queue</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300 font-mono">
              {approvalQueue.filter(a => a.status === 'pending').length}
            </span>
          </button>
        )}
      </div>

      {/* TAB 1: MY LEAVES TABLE */}
      {activeTab === 'my-leaves' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Leave Type</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Dates</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Approver Remarks</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {myLeaves.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500 italic">
                      You haven't submitted any leave applications yet.
                    </td>
                  </tr>
                ) : (
                  myLeaves.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-white uppercase text-[11px]">
                        {req.leaveType}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-indigo-400">
                        {req.days} {req.days === 1 ? 'day' : 'days'}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300 whitespace-nowrap">
                        {req.startDate} to {req.endDate}
                      </td>
                      <td className="py-3 px-4 text-slate-300 max-w-xs">
                        {req.reason}
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(req.status)}
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {req.actionByName ? (
                          <div>
                            <span>By {req.actionByName}</span>
                            {req.rejectionReason && (
                              <div className="text-rose-400 text-[10px]">"{req.rejectionReason}"</div>
                            )}
                          </div>
                        ) : '--'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {req.status === 'pending' && (
                          <button
                            onClick={() => handleCancelMyLeave(req.id)}
                            className="px-2.5 py-1 text-[11px] font-semibold text-rose-400 hover:text-rose-300 bg-rose-950/40 border border-rose-800/40 rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: APPROVAL QUEUE (FOR HR & MANAGERS) */}
      {activeTab === 'approvals' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Applicant</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Leave Type</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Date Span</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Decide</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {approvalQueue.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500 italic">
                      No leave requests pending in your team's queue.
                    </td>
                  </tr>
                ) : (
                  approvalQueue.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-white">{req.employeeName}</div>
                        <div className="text-[10px] font-mono text-slate-500">{req.employeeId}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {req.departmentName}
                      </td>
                      <td className="py-3 px-4 uppercase font-bold text-[11px] text-white">
                        {req.leaveType}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-amber-400">
                        {req.days} days
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300 whitespace-nowrap">
                        {req.startDate} to {req.endDate}
                      </td>
                      <td className="py-3 px-4 text-slate-300 max-w-xs">
                        {req.reason}
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(req.status)}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        {req.status === 'pending' ? (
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => handleApprove(req.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(req.id)}
                              className="px-2.5 py-1 bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 font-bold rounded-lg text-xs transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-500 font-mono">
                            Decided by {req.actionByName}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* APPLY LEAVE MODAL */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <CalendarDays className="w-5 h-5 text-indigo-400" />
                <span>Apply for Leave</span>
              </h3>
              <button onClick={() => setIsApplyModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 mb-4 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleApplyLeave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Leave Category *</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                >
                  <option value="casual">Casual Leave ({balance.casual.total - balance.casual.used} remaining)</option>
                  <option value="sick">Sick Leave ({balance.sick.total - balance.sick.used} remaining)</option>
                  <option value="earned">Earned / Annual Leave ({balance.earned.total - balance.earned.used} remaining)</option>
                  <option value="unpaid">Unpaid Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">End Date *</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-300 font-mono text-[11px] flex justify-between">
                <span>Calculated Working Days:</span>
                <span className="font-bold text-indigo-400">{calculateDays(startDate, endDate)} days</span>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Reason for Leave *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide brief context for your supervisor..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-md shadow-indigo-600/20"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
