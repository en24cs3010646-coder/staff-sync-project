import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Employee, UserRole } from '../types';
import { StorageService } from '../services/storage';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  employee: Employee | null;
  login: (email: string, pass: string) => { success: boolean; error?: string };
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateProfile: (updated: Partial<Employee>) => void;
  isAuthenticated: boolean;
  refreshData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => StorageService.getCurrentUser());
  const [employee, setEmployee] = useState<Employee | null>(null);

  const syncEmployee = (currentUser: User | null) => {
    if (!currentUser) {
      setEmployee(null);
      return;
    }
    const emp = StorageService.getEmployeeById(currentUser.employeeId);
    setEmployee(emp || null);
  };

  useEffect(() => {
    syncEmployee(user);
  }, [user]);

  const login = (email: string, pass: string) => {
    const res = StorageService.login(email, pass);
    if (res.success && res.user) {
      setUser(res.user);
      syncEmployee(res.user);
      return { success: true };
    }
    return { success: false, error: res.error || 'Authentication failed.' };
  };

  const logout = () => {
    StorageService.setCurrentUser(null);
    setUser(null);
    setEmployee(null);
  };

  const switchRole = (newRole: UserRole) => {
    const switched = StorageService.switchUserRole(newRole);
    setUser(switched);
    syncEmployee(switched);
  };

  const updateProfile = (updated: Partial<Employee>) => {
    if (!employee) return;
    const merged: Employee = { ...employee, ...updated };
    StorageService.saveEmployee(merged);
    setEmployee(merged);
    if (user && updated.fullName) {
      const updatedUser: User = { ...user, fullName: updated.fullName };
      StorageService.setCurrentUser(updatedUser);
      setUser(updatedUser);
    }
  };

  const refreshData = () => {
    if (user) {
      const emp = StorageService.getEmployeeById(user.employeeId);
      setEmployee(emp || null);
    }
  };

  const role = user?.role || 'employee';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        employee,
        login,
        logout,
        switchRole,
        updateProfile,
        isAuthenticated: !!user,
        refreshData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
