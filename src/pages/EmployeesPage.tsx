import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';
import { Employee, Department, EmploymentStatus } from '../types';
import { 
  Users, 
  Search, 
  Plus, 
  Download, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Edit3, 
  UserX, 
  UserCheck, 
  X, 
  Filter,
  Check,
  ShieldAlert
} from 'lucide-react';

export const EmployeesPage: React.FC = () => {
  const { role, user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>(() => StorageService.getEmployees());
  const [departments] = useState<Department[]>(() => StorageService.getDepartments());
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [departmentId, setDepartmentId] = useState('dept-1');
  const [designation, setDesignation] = useState('');
  const [dateOfJoining, setDateOfJoining] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState<EmploymentStatus>('active');
  const [location, setLocation] = useState('San Francisco, CA (HQ)');
  const [salary, setSalary] = useState(120000);

  const reloadEmployees = () => {
    setEmployees(StorageService.getEmployees());
  };

  const handleOpenAddModal = () => {
    setEditingEmployee(null);
    setFullName('');
    setEmail('');
    setPhone('+1 (555) 000-0000');
    setDepartmentId(departments[0]?.id || 'dept-1');
    setDesignation('Software Engineer');
    setDateOfJoining(new Date().toISOString().slice(0, 10));
    setStatus('active');
    setLocation('San Francisco, CA (HQ)');
    setSalary(120000);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (emp: Employee) => {
    setEditingEmployee(emp);
    setFullName(emp.fullName);
    setEmail(emp.email);
    setPhone(emp.phone);
    setDepartmentId(emp.departmentId);
    setDesignation(emp.designation);
    setDateOfJoining(emp.dateOfJoining);
    setStatus(emp.status);
    setLocation(emp.location);
    setSalary(emp.salary || 100000);
    setIsModalOpen(true);
  };

  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    const dept = departments.find(d => d.id === departmentId);

    const saved: Employee = {
      id: editingEmployee ? editingEmployee.id : `emp-${Date.now()}`,
      employeeId: editingEmployee ? editingEmployee.employeeId : `EMP-00${employees.length + 1}`,
      userId: editingEmployee ? editingEmployee.userId : `usr-${Date.now()}`,
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      departmentId,
      departmentName: dept ? dept.name : 'Engineering',
      designation: designation.trim(),
      dateOfJoining,
      status,
      avatar: editingEmployee ? editingEmployee.avatar : `https://images.unsplash.com/photo-${1534528741775 + employees.length}?w=150&auto=format&fit=crop&q=80`,
      location: location.trim(),
      salary: Number(salary),
    };

    StorageService.saveEmployee(saved);
    reloadEmployees();
    setIsModalOpen(false);
  };

  const handleToggleDeactivate = (emp: Employee) => {
    const action = emp.status === 'inactive' ? 'reactivate' : 'deactivate';
    if (window.confirm(`Are you sure you want to ${action} ${emp.fullName} (${emp.employeeId})?`)) {
      StorageService.deactivateEmployee(emp.id);
      reloadEmployees();
    }
  };

  // Filtered employees
  const filteredEmployees = employees.filter((emp) => {
    // If Manager, show their department or assigned team
    if (role === 'manager' && user) {
      if (emp.departmentId !== user.departmentId && emp.managerId !== user.employeeId) {
        return false;
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = emp.fullName.toLowerCase().includes(q);
      const matchEmail = emp.email.toLowerCase().includes(q);
      const matchId = emp.employeeId.toLowerCase().includes(q);
      const matchRole = emp.designation.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchId && !matchRole) return false;
    }

    if (selectedDept !== 'all' && emp.departmentId !== selectedDept) return false;
    if (selectedStatus !== 'all' && emp.status !== selectedStatus) return false;

    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center space-x-2">
            <Users className="w-6 h-6 text-indigo-400" />
            <span>{role === 'manager' ? 'Department Team Directory' : 'Employee Management Directory'}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {role === 'hr' ? 'Add, edit, assign departments, and manage workforce profiles' : 'View your direct reports and department team members'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => StorageService.exportEmployeesCSV()}
            className="px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export CSV</span>
          </button>

          {role === 'hr' && (
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Employee</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 backdrop-blur-md flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by employee name, ID (EMP-001), designation, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployees.map((emp) => (
          <div
            key={emp.id}
            className={`bg-slate-900/70 border rounded-2xl p-5 backdrop-blur-md flex flex-col justify-between transition-all duration-200 hover:shadow-xl ${
              emp.status === 'inactive' ? 'border-rose-900/40 opacity-70' : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              {/* Top row: Avatar, Name, Status */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={emp.avatar}
                    alt={emp.fullName}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-white">{emp.fullName}</h3>
                    <p className="text-xs text-indigo-400 font-medium">{emp.designation}</p>
                    <span className="text-[10px] font-mono text-slate-400">{emp.employeeId}</span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  emp.status === 'active' 
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                }`}>
                  {emp.status}
                </span>
              </div>

              {/* Details List */}
              <div className="space-y-1.5 py-3 border-t border-slate-800/80 text-xs text-slate-400">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-slate-300 font-medium">{emp.departmentName}</span>
                </div>
                <div className="flex items-center space-x-2 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                  <span className="truncate">{emp.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>{emp.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{emp.location}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions for HR */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500 font-mono">
                Joined: {emp.dateOfJoining}
              </span>

              {role === 'hr' && (
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => handleOpenEditModal(emp)}
                    className="p-1.5 text-slate-400 hover:text-indigo-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                    title="Edit Employee Record"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleToggleDeactivate(emp)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      emp.status === 'active' 
                        ? 'text-rose-400 hover:bg-rose-950/40 bg-slate-800' 
                        : 'text-emerald-400 hover:bg-emerald-950/40 bg-slate-800'
                    }`}
                    title={emp.status === 'active' ? 'Deactivate Employee' : 'Reactivate Employee'}
                  >
                    {emp.status === 'active' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* CREATE / EDIT EMPLOYEE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white">
                {editingEmployee ? `Edit ${editingEmployee.fullName}` : 'Add New Employee'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEmployee} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jane Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Work Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="jane.doe@staffsync.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Contact Phone</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 123-4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Department</label>
                  <select
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Designation</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Frontend Engineer"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Date of Joining</label>
                  <input
                    type="date"
                    required
                    value={dateOfJoining}
                    onChange={(e) => setDateOfJoining(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Employment Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as EmploymentStatus)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="probation">Probation</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Work Location</label>
                <input
                  type="text"
                  placeholder="e.g. Austin, TX (Remote) or San Francisco HQ"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
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
                  {editingEmployee ? 'Update Profile' : 'Save Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
