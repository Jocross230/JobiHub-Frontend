import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart2,
  Users,
  FileText,
  Building2,
  Briefcase,
  HeadphonesIcon,
  Activity,
  Settings,
  LogOut,
  Menu,
  ChevronRight,
  MessageSquare,
  TrendingUp,
  CreditCard,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const adminNav = [
  { to: '/admin', icon: TrendingUp, label: 'Overview' },
  { to: '/admin/analytics', icon: BarChart2, label: 'Analytics' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/cvs', icon: FileText, label: 'CVs' },
  { to: '/admin/businesses', icon: Building2, label: 'Businesses' },
  { to: '/admin/jobs', icon: Briefcase, label: 'Jobs' },
  { to: '/admin/recruitment', icon: HeadphonesIcon, label: 'Recruitment' },
  { to: '/admin/payments', icon: CreditCard, label: 'Payments' },
  { to: '/admin/support', icon: MessageSquare, label: 'Support Issues' },
  { to: '/admin/activity', icon: Activity, label: 'Activity' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const SidebarContent = () => (
      <div className="flex flex-col h-full">
        <div className="p-5 border-b border-slate-700">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">CF</span>
            </div>

            <div>
              <p className="font-bold text-white text-sm">JobiHub</p>
              <p className="text-xs text-slate-400">Admin Panel</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {adminNav.map(({ to, icon: Icon, label }) => {
            const active =
                location.pathname === to ||
                (to !== '/admin' && location.pathname.startsWith(to));

            return (
                <Link
                    key={to}
                    to={to}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                        active
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                    }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />

                  {label}

                  {active && (
                      <ChevronRight className="w-3 h-3 ml-auto" />
                  )}
                </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-700">
          <Link
              to="/dashboard"
              className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white transition mb-1"
          >
            ← User Dashboard
          </Link>

          <div className="flex items-center gap-3 p-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">
              {user?.fullName?.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.fullName}
              </p>

              <p className="text-xs text-slate-400">
                Administrator
              </p>
            </div>
          </div>

          <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-900/30 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
  );

  return (
      <div className="flex h-screen bg-slate-950 overflow-hidden">
        <aside className="hidden md:flex flex-col w-60 bg-slate-900 border-r border-slate-700 flex-shrink-0">
          <SidebarContent />
        </aside>

        {sidebarOpen && (
            <div className="fixed inset-0 z-50 md:hidden">
              <div
                  className="absolute inset-0 bg-black/60"
                  onClick={() => setSidebarOpen(false)}
              />

              <aside className="absolute left-0 top-0 bottom-0 w-64 bg-slate-900 shadow-xl">
                <SidebarContent />
              </aside>
            </div>
        )}

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50">
          <header className="md:hidden flex items-center gap-4 px-4 py-3 bg-slate-900 border-b border-slate-700">
            <button
                onClick={() => setSidebarOpen(true)}
                className="p-1 text-slate-400"
            >
              <Menu className="w-5 h-5" />
            </button>

            <span className="font-bold text-white">
            Admin
          </span>
          </header>

          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
  );
}