import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  CalendarDays, 
  Megaphone, 
  GraduationCap, 
  BarChart3, 
  UserCheck, 
  Settings, 
  ShieldCheck, 
  Briefcase,
  ChevronRight
} from 'lucide-react';

export type ActivePage = 
  | 'dashboard' 
  | 'employees' 
  | 'attendance' 
  | 'leaves' 
  | 'announcements' 
  | 'training' 
  | 'reports' 
  | 'profile';

interface SidebarProps {
  activePage: ActivePage;
  onSelectPage: (page: ActivePage) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onSelectPage,
  isOpen,
  onCloseMobile,
}) => {
  const { role, user } = useAuth();

  const getNavItems = () => {
    switch (role) {
      case 'hr':
        return [
          { id: 'dashboard', label: 'HR Dashboard', icon: LayoutDashboard },
          { id: 'employees', label: 'Employee Directory', icon: Users, badge: 'All Staff' },
          { id: 'attendance', label: 'Attendance Monitoring', icon: Clock },
          { id: 'leaves', label: 'Leave Approvals', icon: CalendarDays },
          { id: 'announcements', label: 'Announcements', icon: Megaphone },
          { id: 'training', label: 'Training Programs', icon: GraduationCap },
          { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
          { id: 'profile', label: 'HR Profile & Settings', icon: Settings },
        ];
      case 'manager':
        return [
          { id: 'dashboard', label: 'Manager Dashboard', icon: LayoutDashboard },
          { id: 'employees', label: 'My Team Members', icon: Users, badge: 'Team' },
          { id: 'attendance', label: 'Team Attendance', icon: Clock },
          { id: 'leaves', label: 'Leave Approvals', icon: CalendarDays },
          { id: 'training', label: 'Training & Development', icon: GraduationCap },
          { id: 'announcements', label: 'Company Bulletins', icon: Megaphone },
          { id: 'reports', label: 'Team Analytics', icon: BarChart3 },
          { id: 'profile', label: 'My Profile', icon: Settings },
        ];
      case 'employee':
      default:
        return [
          { id: 'dashboard', label: 'Employee Dashboard', icon: LayoutDashboard },
          { id: 'attendance', label: 'Daily Attendance', icon: Clock, badge: 'Clock In' },
          { id: 'leaves', label: 'Apply for Leave', icon: CalendarDays },
          { id: 'training', label: 'Training Courses', icon: GraduationCap },
          { id: 'announcements', label: 'Announcements', icon: Megaphone },
          { id: 'profile', label: 'My Profile & Details', icon: Settings },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-slate-900/95 border-r border-slate-800 transition-transform duration-200 ease-in-out md:translate-x-0 flex flex-col justify-between p-4 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          
          {/* User mini badge */}
          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono font-bold text-xs">
              {user?.employeeId || 'EMP'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate">
                {user?.fullName}
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                {user?.designation}
              </div>
            </div>
          </div>

          {/* Navigation links */}
          <div className="space-y-1">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {role === 'hr' ? 'Administration' : role === 'manager' ? 'Management' : 'Self Service'}
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectPage(item.id as ActivePage);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                      isActive 
                        ? 'bg-indigo-700 text-indigo-100' 
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
          <span>StaffSync v2.4</span>
          <span className="flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            <span>Operational</span>
          </span>
        </div>
      </aside>
    </>
  );
};
