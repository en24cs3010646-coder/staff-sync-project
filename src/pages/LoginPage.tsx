import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  Lock, 
  Mail, 
  Shield, 
  Briefcase, 
  UserCheck, 
  ArrowRight, 
  AlertCircle,
  Sparkles 
} from 'lucide-react';

interface LoginPageProps {
  onSuccess?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('hr@staffsync.com');
  const [password, setPassword] = useState('hr123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const res = login(email, password);
      setLoading(false);
      if (!res.success) {
        setError(res.error || 'Authentication failed. Please verify credentials.');
      } else {
        if (onSuccess) onSuccess();
      }
    }, 300);
  };

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    const res = login(demoEmail, demoPass);
    if (res.success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4 selection:bg-indigo-500 selection:text-white">
      <div className="w-full max-w-md">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center shadow-xl shadow-indigo-500/25 text-white mx-auto mb-3 font-bold">
            <Building2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
            Staff<span className="text-indigo-400">Sync</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Modern Human Resource Management System
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white">Sign In to Workspace</h2>
            <p className="text-xs text-slate-400 mt-0.5">Enter your corporate credentials to continue</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Corporate Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@staffsync.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-slate-300 font-semibold">Password</label>
                <span className="text-[11px] text-indigo-400 cursor-pointer hover:underline">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-600/25 flex items-center justify-center space-x-2 text-xs"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Personas */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Instant Demo Personas:</span>
            </span>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('hr@staffsync.com', 'hr123')}
                className="w-full p-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/25 text-left flex items-center justify-between text-xs transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <Shield className="w-4 h-4 text-purple-400" />
                  <div>
                    <span className="font-bold text-white block">Sarah Jenkins</span>
                    <span className="text-[10px] text-purple-300">HR Administrator (hr@staffsync.com)</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-purple-400">hr123 →</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('manager.eng@staffsync.com', 'mgr123')}
                className="w-full p-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/25 text-left flex items-center justify-between text-xs transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <Briefcase className="w-4 h-4 text-blue-400" />
                  <div>
                    <span className="font-bold text-white block">David Vance</span>
                    <span className="text-[10px] text-blue-300">VP of Engineering (manager.eng@staffsync.com)</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-blue-400">mgr123 →</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('alex.rivera@staffsync.com', 'emp123')}
                className="w-full p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-left flex items-center justify-between text-xs transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <div>
                    <span className="font-bold text-white block">Alex Rivera</span>
                    <span className="text-[10px] text-emerald-300">Senior Frontend (alex.rivera@staffsync.com)</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-400">emp123 →</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
