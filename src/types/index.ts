export type UserRole = 'hr' | 'manager' | 'employee';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  employeeId: string;
  fullName: string;
  avatar?: string;
  departmentId: string;
  designation: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  managerId?: string;
  managerName?: string;
  employeeCount: number;
}

export type EmploymentStatus = 'active' | 'probation' | 'inactive' | 'on-leave';

export interface Employee {
  id: string;
  employeeId: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  departmentId: string;
  departmentName: string;
  designation: string;
  managerId?: string;
  managerName?: string;
  dateOfJoining: string;
  status: EmploymentStatus;
  avatar: string;
  location: string;
  salary?: number;
  emergencyContact?: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'half-day';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  departmentName: string;
  date: string; // YYYY-MM-DD
  checkInTime?: string; // HH:mm:ss
  checkOutTime?: string; // HH:mm:ss
  workHours?: number;
  status: AttendanceStatus;
  notes?: string;
  correctedBy?: string;
  correctedAt?: string;
  correctionReason?: string;
}

export type LeaveType = 'casual' | 'sick' | 'earned' | 'unpaid';
export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  departmentName: string;
  managerId?: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  appliedAt: string;
  actionBy?: string;
  actionByName?: string;
  actionAt?: string;
  rejectionReason?: string;
}

export interface LeaveBalance {
  employeeId: string;
  casual: { total: number; used: number };
  sick: { total: number; used: number };
  earned: { total: number; used: number };
  unpaid: { total: number; used: number };
}

export type AnnouncementCategory = 'General' | 'Policy' | 'Event' | 'Urgent';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: AnnouncementCategory;
  authorName: string;
  createdAt: string;
  pinned: boolean;
}

export type TrainingCategory = 'Technical' | 'Leadership' | 'Compliance' | 'Design' | 'Productivity';

export interface TrainingProgram {
  id: string;
  title: string;
  description: string;
  trainer: string;
  category: TrainingCategory;
  date: string;
  duration: string;
  capacity: number;
  registeredEmployeeIds: string[];
  status: 'upcoming' | 'ongoing' | 'completed';
  createdBy: string;
}

export interface AuditLog {
  id: string;
  action: string;
  category: 'Attendance' | 'Employee' | 'Leave' | 'Security';
  details: string;
  performedBy: string;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  read: boolean;
  createdAt: string;
}
