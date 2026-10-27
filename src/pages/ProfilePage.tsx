import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';
import { 
  User as UserIcon, 
  Building2, 
  Calendar, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, role, employee, updateProfile } = useAuth();

  const [phone, setPhone] = useState(employee?.phone || '+1 (555) 000-0000');
  const [location, setLocation] = useState(employee?.location || 'San Francisco HQ');
  const [emergencyContact, setEmergencyContact] = useState(employee?.emergencyContact || '+1 (555) 999-9999');

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passMessage, setPassMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [profileSaved, setProfileSaved] = useState(false);

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      phone: phone.trim(),
      location: location.trim(),
      emergencyContact: emergencyContact.trim(),
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassMessage(null);

    if (newPassword.length < 6) {
      setPassMessage({ text: 'New password must be at least 6 characters long.', type: 'error' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassMessage({ text: 'New passwords do not match.', type: 'error' });
      return;
    }

    // Update in storage
    const users = StorageService.getUsers();
    const current = users.find(u => u.id === user?.id);
    if (!current) return;

    if (current.passwordHash !== oldPassword) {
      setPassMessage({ text: 'Current password is incorrect.', type: 'error' });
      return;
    }

    current.passwordHash = newPassword;
    localStorage.setItem('staffsync_users_v1', JSON.stringify(users));

    setPassMessage({ text: 'Password changed successfully!', type: 'success' });
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header Profile Hero Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5 text-center sm:text-left">
          <img
            src={employee?.avatar || user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt={user?.fullName}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-500 shadow-xl"
          />
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                {user?.fullName}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase font-mono bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                {role.toUpperCase()} Role
              </span>
            </div>
            <p className="text-xs text-indigo-300 font-medium">
              {employee?.designation} • {employee?.departmentName}
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400 font-mono">
              <span>Employee ID: <strong>{employee?.employeeId}</strong></span>
              <span>•</span>
              <span>Joined: <strong>{employee?.dateOfJoining}</strong></span>
              <span>•</span>
              <span>Status: <strong className="text-emerald-400 uppercase">{employee?.status}</strong></span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Contact Information Form */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center space-x-2">
            <UserIcon className="w-4 h-4 text-indigo-400" />
            <span>Personal &amp; Contact Details</span>
          </h3>

          {profileSaved && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Contact details updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSaveContact} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Work Email (Read Only)</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3 py-2 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Direct Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Work Location / City</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Emergency Contact</label>
              <input
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-600/20"
            >
              Update Contact Info
            </button>
          </form>
        </div>

        {/* Password Security Form */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center space-x-2">
            <KeyRound className="w-4 h-4 text-amber-400" />
            <span>Security &amp; Password Reset</span>
          </h3>

          {passMessage && (
            <div className={`mb-4 p-3 rounded-xl border text-xs flex items-center space-x-2 ${
              passMessage.type === 'success' 
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
                : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
            }`}>
              {passMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
              <span>{passMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Current Password *</label>
              <input
                type="password"
                required
                placeholder="Enter current password (e.g. hr123, emp123)"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">New Password *</label>
              <input
                type="password"
                required
                placeholder="Minimum 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Confirm New Password *</label>
              <input
                type="password"
                required
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-bold rounded-xl transition-all"
            >
              Change Password
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
