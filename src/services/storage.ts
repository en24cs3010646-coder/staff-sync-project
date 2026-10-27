import { 
  User, 
  Department, 
  Employee, 
  AttendanceRecord, 
  LeaveRequest, 
  LeaveBalance, 
  Announcement, 
  TrainingProgram, 
  AuditLog, 
  AttendanceStatus 
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_DEPARTMENTS, 
  INITIAL_EMPLOYEES, 
  INITIAL_ATTENDANCE, 
  INITIAL_LEAVE_BALANCES, 
  INITIAL_LEAVE_REQUESTS, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_TRAININGS, 
  INITIAL_AUDIT_LOGS 
} from './mockData';

const STORAGE_KEYS = {
  USERS: 'staffsync_users_v1',
  DEPARTMENTS: 'staffsync_departments_v1',
  EMPLOYEES: 'staffsync_employees_v1',
  ATTENDANCE: 'staffsync_attendance_v1',
  LEAVE_BALANCES: 'staffsync_leave_balances_v1',
  LEAVE_REQUESTS: 'staffsync_leave_requests_v1',
  ANNOUNCEMENTS: 'staffsync_announcements_v1',
  TRAININGS: 'staffsync_trainings_v1',
  AUDIT_LOGS: 'staffsync_audit_logs_v1',
  CURRENT_USER: 'staffsync_current_user_v1',
  AUTH_TOKEN: 'staffsync_auth_token_v1',
};

// Safe JSON loader
function loadKey<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error(`Error loading key ${key}:`, e);
    return fallback;
  }
}

function saveKey<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving key ${key}:`, e);
  }
}

export const StorageService = {
  // RESET ALL DATA TO DEFAULTS
  resetToDefaults() {
    saveKey(STORAGE_KEYS.USERS, INITIAL_USERS);
    saveKey(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
    saveKey(STORAGE_KEYS.EMPLOYEES, INITIAL_EMPLOYEES);
    saveKey(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
    saveKey(STORAGE_KEYS.LEAVE_BALANCES, INITIAL_LEAVE_BALANCES);
    saveKey(STORAGE_KEYS.LEAVE_REQUESTS, INITIAL_LEAVE_REQUESTS);
    saveKey(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
    saveKey(STORAGE_KEYS.TRAININGS, INITIAL_TRAININGS);
    saveKey(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    // default to HR user
    const defaultUser = INITIAL_USERS[0];
    const { passwordHash, ...cleanUser } = defaultUser;
    saveKey(STORAGE_KEYS.CURRENT_USER, cleanUser);
    saveKey(STORAGE_KEYS.AUTH_TOKEN, `jwt-simulated-token-${cleanUser.id}`);
  },

  // USERS & AUTH
  getUsers() {
    return loadKey(STORAGE_KEYS.USERS, INITIAL_USERS);
  },

  getCurrentUser(): User | null {
    return loadKey<User | null>(STORAGE_KEYS.CURRENT_USER, {
      id: 'usr-1',
      email: 'hr@staffsync.com',
      role: 'hr',
      employeeId: 'EMP-001',
      fullName: 'Sarah Jenkins',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      departmentId: 'dept-3',
      designation: 'Director of Human Resources',
    });
  },

  setCurrentUser(user: User | null) {
    if (user) {
      saveKey(STORAGE_KEYS.CURRENT_USER, user);
      saveKey(STORAGE_KEYS.AUTH_TOKEN, `jwt-simulated-token-${user.id}`);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    }
  },

  login(email: string, password: string): { success: boolean; user?: User; error?: string } {
    const users = this.getUsers();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      return { success: false, error: 'User with this email not found.' };
    }
    if (found.passwordHash !== password) {
      return { success: false, error: 'Invalid password. Please check your credentials.' };
    }
    const { passwordHash, ...safeUser } = found;
    this.setCurrentUser(safeUser);
    return { success: true, user: safeUser };
  },

  // Switch role quickly for testing and demoing
  switchUserRole(role: 'hr' | 'manager' | 'employee'): User {
    const users = this.getUsers();
    let target = users.find(u => u.role === role);
    if (!target) target = users[0];
    const { passwordHash, ...safeUser } = target;
    this.setCurrentUser(safeUser);
    return safeUser;
  },

  // EMPLOYEES
  getEmployees(): Employee[] {
    return loadKey(STORAGE_KEYS.EMPLOYEES, INITIAL_EMPLOYEES);
  },

  getEmployeeById(id: string): Employee | undefined {
    return this.getEmployees().find(e => e.id === id || e.employeeId === id);
  },

  getEmployeesByManager(managerId: string): Employee[] {
    return this.getEmployees().filter(e => e.managerId === managerId);
  },

  saveEmployee(employee: Employee): Employee {
    const list = this.getEmployees();
    const idx = list.findIndex(e => e.id === employee.id);
    let updatedList: Employee[];
    if (idx >= 0) {
      updatedList = list.map(e => e.id === employee.id ? employee : e);
      this.addAuditLog('Employee Updated', 'Employee', `Updated employee ${employee.employeeId} (${employee.fullName})`);
    } else {
      updatedList = [employee, ...list];
      this.addAuditLog('Employee Created', 'Employee', `Registered new employee ${employee.employeeId} (${employee.fullName})`);
    }
    saveKey(STORAGE_KEYS.EMPLOYEES, updatedList);
    return employee;
  },

  deactivateEmployee(id: string): void {
    const list = this.getEmployees();
    const emp = list.find(e => e.id === id);
    if (!emp) return;
    const newStatus = emp.status === 'inactive' ? 'active' : 'inactive';
    const updated = list.map(e => e.id === id ? { ...e, status: newStatus as any } : e);
    saveKey(STORAGE_KEYS.EMPLOYEES, updated);
    this.addAuditLog(
      newStatus === 'inactive' ? 'Employee Deactivated' : 'Employee Reactivated',
      'Employee',
      `Changed status for ${emp.employeeId} (${emp.fullName}) to ${newStatus}`
    );
  },

  // DEPARTMENTS
  getDepartments(): Department[] {
    return loadKey(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
  },

  saveDepartment(dept: Department): void {
    const list = this.getDepartments();
    const idx = list.findIndex(d => d.id === dept.id);
    let updated: Department[];
    if (idx >= 0) {
      updated = list.map(d => d.id === dept.id ? dept : d);
    } else {
      updated = [...list, dept];
    }
    saveKey(STORAGE_KEYS.DEPARTMENTS, updated);
  },

  // ATTENDANCE
  getAttendance(): AttendanceRecord[] {
    return loadKey(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
  },

  getTodayAttendance(): AttendanceRecord[] {
    const today = new Date().toISOString().slice(0, 10);
    return this.getAttendance().filter(a => a.date === today);
  },

  getMyTodayAttendance(employeeId: string): AttendanceRecord | undefined {
    const today = new Date().toISOString().slice(0, 10);
    return this.getAttendance().find(a => a.employeeId === employeeId && a.date === today);
  },

  checkIn(employee: Employee): AttendanceRecord {
    const today = new Date().toISOString().slice(0, 10);
    const now = new Date();
    const timeStr = now.toTimeString().slice(0, 8); // HH:mm:ss
    const hours = now.getHours();
    const minutes = now.getMinutes();

    // Determine status: Late if check in after 09:30 AM
    let status: AttendanceStatus = 'present';
    if (hours > 9 || (hours === 9 && minutes > 30)) {
      status = 'late';
    }

    const records = this.getAttendance();
    const existingIdx = records.findIndex(a => a.employeeId === employee.employeeId && a.date === today);

    let newRecord: AttendanceRecord;
    if (existingIdx >= 0) {
      // already exists
      return records[existingIdx];
    } else {
      newRecord = {
        id: `att-${Date.now()}`,
        employeeId: employee.employeeId,
        employeeName: employee.fullName,
        departmentName: employee.departmentName,
        date: today,
        checkInTime: timeStr,
        status,
        notes: 'Mobile / Web Portal check-in',
      };
      saveKey(STORAGE_KEYS.ATTENDANCE, [newRecord, ...records]);
    }
    return newRecord;
  },

  checkOut(employeeId: string): AttendanceRecord | undefined {
    const today = new Date().toISOString().slice(0, 10);
    const timeStr = new Date().toTimeString().slice(0, 8);
    const records = this.getAttendance();
    const record = records.find(a => a.employeeId === employeeId && a.date === today);
    if (!record) return undefined;

    // Calculate work hours
    let workHours = 8.0;
    if (record.checkInTime) {
      const [inH, inM] = record.checkInTime.split(':').map(Number);
      const [outH, outM] = timeStr.split(':').map(Number);
      const diffMins = (outH * 60 + outM) - (inH * 60 + inM);
      workHours = Number((Math.max(0, diffMins) / 60).toFixed(2));
    }

    const updated = records.map(a => 
      a.id === record.id 
        ? { ...a, checkOutTime: timeStr, workHours } 
        : a
    );
    saveKey(STORAGE_KEYS.ATTENDANCE, updated);
    return { ...record, checkOutTime: timeStr, workHours };
  },

  correctAttendance(recordId: string, newStatus: AttendanceStatus, reason: string, correctedByName: string): void {
    const records = this.getAttendance();
    const rec = records.find(r => r.id === recordId);
    if (!rec) return;

    const oldStatus = rec.status;
    const nowStr = new Date().toLocaleString();

    const updated = records.map(r => 
      r.id === recordId 
        ? {
            ...r,
            status: newStatus,
            correctedBy: correctedByName,
            correctedAt: nowStr,
            correctionReason: reason,
          } 
        : r
    );
    saveKey(STORAGE_KEYS.ATTENDANCE, updated);
    this.addAuditLog(
      'Attendance Corrected',
      'Attendance',
      `Corrected ${rec.employeeName} (${rec.date}) from ${oldStatus.toUpperCase()} to ${newStatus.toUpperCase()}. Reason: ${reason}`
    );
  },

  // LEAVE MANAGEMENT
  getLeaveRequests(): LeaveRequest[] {
    return loadKey(STORAGE_KEYS.LEAVE_REQUESTS, INITIAL_LEAVE_REQUESTS);
  },

  getLeaveBalances(): Record<string, LeaveBalance> {
    return loadKey(STORAGE_KEYS.LEAVE_BALANCES, INITIAL_LEAVE_BALANCES);
  },

  getEmployeeLeaveBalance(employeeId: string): LeaveBalance {
    const balances = this.getLeaveBalances();
    if (!balances[employeeId]) {
      const defaultBal: LeaveBalance = {
        employeeId,
        casual: { total: 12, used: 0 },
        sick: { total: 10, used: 0 },
        earned: { total: 15, used: 0 },
        unpaid: { total: 10, used: 0 },
      };
      balances[employeeId] = defaultBal;
      saveKey(STORAGE_KEYS.LEAVE_BALANCES, balances);
      return defaultBal;
    }
    return balances[employeeId];
  },

  applyLeave(req: Omit<LeaveRequest, 'id' | 'status' | 'appliedAt'>): { success: boolean; error?: string; request?: LeaveRequest } {
    const existing = this.getLeaveRequests();

    // Check for overlapping dates for this employee
    const hasOverlap = existing.some(e => 
      e.employeeId === req.employeeId &&
      e.status !== 'rejected' &&
      e.status !== 'cancelled' &&
      ((req.startDate >= e.startDate && req.startDate <= e.endDate) ||
       (req.endDate >= e.startDate && req.endDate <= e.endDate))
    );

    if (hasOverlap) {
      return { success: false, error: 'You already have an existing leave request spanning these dates.' };
    }

    // Check balance
    const balance = this.getEmployeeLeaveBalance(req.employeeId);
    const leaveCategory = balance[req.leaveType];
    const available = leaveCategory.total - leaveCategory.used;
    if (req.days > available && req.leaveType !== 'unpaid') {
      return { success: false, error: `Insufficient ${req.leaveType} leave balance. Available: ${available} days, Requested: ${req.days} days.` };
    }

    const newLeave: LeaveRequest = {
      ...req,
      id: `leave-${Date.now()}`,
      status: 'pending',
      appliedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };

    saveKey(STORAGE_KEYS.LEAVE_REQUESTS, [newLeave, ...existing]);
    this.addAuditLog('Leave Applied', 'Leave', `${req.employeeName} applied for ${req.days} days of ${req.leaveType} leave (${req.startDate} to ${req.endDate})`);
    return { success: true, request: newLeave };
  },

  updateLeaveStatus(leaveId: string, status: 'approved' | 'rejected', actionUser: User, rejectionReason?: string): void {
    const requests = this.getLeaveRequests();
    const target = requests.find(r => r.id === leaveId);
    if (!target) return;

    const updated = requests.map(r => 
      r.id === leaveId 
        ? {
            ...r,
            status,
            actionBy: actionUser.employeeId,
            actionByName: actionUser.fullName,
            actionAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
            rejectionReason: status === 'rejected' ? rejectionReason : undefined,
          }
        : r
    );
    saveKey(STORAGE_KEYS.LEAVE_REQUESTS, updated);

    // If approved, deduct from leave balance
    if (status === 'approved') {
      const balances = this.getLeaveBalances();
      const bal = balances[target.employeeId] || this.getEmployeeLeaveBalance(target.employeeId);
      bal[target.leaveType].used += target.days;
      balances[target.employeeId] = bal;
      saveKey(STORAGE_KEYS.LEAVE_BALANCES, balances);
    }

    this.addAuditLog(
      `Leave ${status.toUpperCase()}`,
      'Leave',
      `${actionUser.fullName} (${actionUser.role.toUpperCase()}) ${status} leave for ${target.employeeName} (${target.days} days)`
    );
  },

  cancelLeave(leaveId: string, employeeId: string): boolean {
    const requests = this.getLeaveRequests();
    const target = requests.find(r => r.id === leaveId && r.employeeId === employeeId);
    if (!target || target.status !== 'pending') return false;

    const updated = requests.map(r => r.id === leaveId ? { ...r, status: 'cancelled' as const } : r);
    saveKey(STORAGE_KEYS.LEAVE_REQUESTS, updated);
    this.addAuditLog('Leave Cancelled', 'Leave', `${target.employeeName} cancelled pending leave request (${target.startDate} to ${target.endDate})`);
    return true;
  },

  // ANNOUNCEMENTS
  getAnnouncements(): Announcement[] {
    return loadKey(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
  },

  saveAnnouncement(ann: Announcement): void {
    const list = this.getAnnouncements();
    const idx = list.findIndex(a => a.id === ann.id);
    let updated: Announcement[];
    if (idx >= 0) {
      updated = list.map(a => a.id === ann.id ? ann : a);
    } else {
      updated = [ann, ...list];
    }
    saveKey(STORAGE_KEYS.ANNOUNCEMENTS, updated);
  },

  deleteAnnouncement(id: string): void {
    const list = this.getAnnouncements().filter(a => a.id !== id);
    saveKey(STORAGE_KEYS.ANNOUNCEMENTS, list);
  },

  // TRAININGS
  getTrainings(): TrainingProgram[] {
    return loadKey(STORAGE_KEYS.TRAININGS, INITIAL_TRAININGS);
  },

  saveTraining(trn: TrainingProgram): void {
    const list = this.getTrainings();
    const idx = list.findIndex(t => t.id === trn.id);
    let updated: TrainingProgram[];
    if (idx >= 0) {
      updated = list.map(t => t.id === trn.id ? trn : t);
    } else {
      updated = [trn, ...list];
    }
    saveKey(STORAGE_KEYS.TRAININGS, updated);
  },

  registerForTraining(trainingId: string, employeeId: string): { success: boolean; message: string } {
    const list = this.getTrainings();
    const trn = list.find(t => t.id === trainingId);
    if (!trn) return { success: false, message: 'Training session not found.' };

    if (trn.registeredEmployeeIds.includes(employeeId)) {
      return { success: false, message: 'You are already registered for this session.' };
    }

    if (trn.registeredEmployeeIds.length >= trn.capacity) {
      return { success: false, message: 'This training program has reached full capacity.' };
    }

    trn.registeredEmployeeIds.push(employeeId);
    saveKey(STORAGE_KEYS.TRAININGS, list);
    return { success: true, message: 'Successfully registered for training program!' };
  },

  cancelTrainingRegistration(trainingId: string, employeeId: string): { success: boolean; message: string } {
    const list = this.getTrainings();
    const trn = list.find(t => t.id === trainingId);
    if (!trn) return { success: false, message: 'Training session not found.' };

    trn.registeredEmployeeIds = trn.registeredEmployeeIds.filter(id => id !== employeeId);
    saveKey(STORAGE_KEYS.TRAININGS, list);
    return { success: true, message: 'Cancelled registration.' };
  },

  // AUDIT LOGS
  getAuditLogs(): AuditLog[] {
    return loadKey(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  },

  addAuditLog(action: string, category: AuditLog['category'], details: string): void {
    const logs = this.getAuditLogs();
    const user = this.getCurrentUser();
    const performer = user ? `${user.fullName} (${user.role.toUpperCase()})` : 'System';
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      action,
      category,
      details,
      performedBy: performer,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };
    saveKey(STORAGE_KEYS.AUDIT_LOGS, [newLog, ...logs]);
  },

  // CSV EXPORT GENERATOR
  exportEmployeesCSV(): void {
    const employees = this.getEmployees();
    const headers = ['Employee ID', 'Full Name', 'Email', 'Phone', 'Department', 'Designation', 'Status', 'Joining Date', 'Location'];
    const rows = employees.map(e => [
      e.employeeId,
      `"${e.fullName}"`,
      e.email,
      e.phone,
      `"${e.departmentName}"`,
      `"${e.designation}"`,
      e.status,
      e.dateOfJoining,
      `"${e.location}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `StaffSync_Employees_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  exportAttendanceCSV(): void {
    const attendance = this.getAttendance();
    const headers = ['Record ID', 'Employee ID', 'Employee Name', 'Department', 'Date', 'Check In', 'Check Out', 'Hours', 'Status', 'Notes'];
    const rows = attendance.map(a => [
      a.id,
      a.employeeId,
      `"${a.employeeName}"`,
      `"${a.departmentName}"`,
      a.date,
      a.checkInTime || '--',
      a.checkOutTime || '--',
      a.workHours || 0,
      a.status.toUpperCase(),
      `"${a.notes || ''}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `StaffSync_Attendance_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};
