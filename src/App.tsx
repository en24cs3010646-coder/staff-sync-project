import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, ActivePage } from './components/layout/Sidebar';
import { HRDashboard } from './components/dashboard/HRDashboard';
import { ManagerDashboard } from './components/dashboard/ManagerDashboard';
import { EmployeeDashboard } from './components/dashboard/EmployeeDashboard';
import { EmployeesPage } from './pages/EmployeesPage';
import { AttendancePage } from './pages/AttendancePage';
import { LeavesPage } from './pages/LeavesPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { TrainingPage } from './pages/TrainingPage';
import { ReportsPage } from './pages/ReportsPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';

function MainLayout() {
  const { isAuthenticated, role } = useAuth();
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <LoginPage onSuccess={() => setActivePage('dashboard')} />;
  }

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        if (role === 'hr') return <HRDashboard onNavigate={setActivePage} />;
        if (role === 'manager') return <ManagerDashboard onNavigate={setActivePage} />;
        return <EmployeeDashboard onNavigate={setActivePage} />;
      case 'employees':
        return <EmployeesPage />;
      case 'attendance':
        return <AttendancePage />;
      case 'leaves':
        return <LeavesPage />;
      case 'announcements':
        return <AnnouncementsPage />;
      case 'training':
        return <TrainingPage />;
      case 'reports':
        return <ReportsPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HRDashboard onNavigate={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onNavigateToProfile={() => setActivePage('profile')}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Collapsible Sidebar */}
        <Sidebar
          activePage={activePage}
          onSelectPage={setActivePage}
          isOpen={isSidebarOpen}
          onCloseMobile={() => setIsSidebarOpen(false)}
        />

        {/* Dynamic Main Workspace Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
