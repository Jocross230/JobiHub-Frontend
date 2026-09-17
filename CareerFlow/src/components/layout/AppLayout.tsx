import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Mail,
  Briefcase,
  Bookmark,
  User,
  Settings,
  Menu,
  Users,
  HeadphonesIcon,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import careerflowLogo from '../../assets/careerflow-logo.png';

const jobSeekerNavItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/my-cvs', icon: FileText, label: 'My CVs' },
  { to: '/cover-letter', icon: Mail, label: 'Cover Letters' },
  { to: '/jobs', icon: Briefcase, label: 'Find Jobs' },
  { to: '/saved-jobs', icon: Bookmark, label: 'Saved Jobs' },
  { to: '/my-applications', icon: FileText, label: 'My Applications' },
  { to: '/profile', icon: User, label: 'Career Profile' },
  { to: '/settings', icon: Settings, label: 'Settings' },
  { to: '/support', icon: HeadphonesIcon, label: 'Support' },
];

const businessNavItems = [
  { to: '/business', icon: LayoutDashboard, label: 'Employer Dashboard' },
  { to: '/business/profile', icon: User, label: 'Company Profile' },
  { to: '/business/post-job', icon: Briefcase, label: 'Post a Job' },
  { to: '/business/jobs', icon: FileText, label: 'My Job Listings' },
  { to: '/business/applicants', icon: Users, label: 'Applicants' },
  { to: '/business/candidates', icon: Users, label: 'Search Candidates' },
  { to: '/business/saved-candidates', icon: Bookmark, label: 'Saved Candidates' },
  { to: '/business/recruitment', icon: Mail, label: 'Recruitment Requests' },
  { to: '/business/support', icon: HeadphonesIcon, label: 'Support' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, logout, isAdmin, isBusiness } = useAuth();

  const navItems = isBusiness
      ? businessNavItems
      : jobSeekerNavItems;

  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const SidebarContent = () => (
      <div className="flex flex-col h-full">

        {/* CareerFlow Logo */}
        <div className="px-5 py-4 border-b border-slate-200">
          <Link to="/" className="flex items-center">
            <img
                src={careerflowLogo}
                alt="CareerFlow"
                className="w-full max-w-[185px] h-auto object-contain"
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => {
            const active =
                location.pathname === to ||
                (to !== '/dashboard' &&
                    location.pathname.startsWith(to));

            return (
                <Link
                    key={to}
                    to={to}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition group ${
                        active
                            ? 'bg-[#1E3A8A] text-white'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
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

          {/* Admin Panel */}
          {isAdmin && (
              <Link
                  to="/admin"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 transition mt-2 border-t border-slate-200 pt-4"
              >
                <Users className="w-4 h-4" />
                Admin Panel
              </Link>
          )}
        </nav>

        {/* User section */}
        <div className="p-3 border-t border-slate-200">

          <div className="flex items-center gap-3 p-2 mb-2">

            <div className="w-9 h-9 rounded-full bg-[#1E3A8A] flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
              {user?.fullName?.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {user?.fullName}
              </p>

              <p className="text-xs text-slate-500 truncate">
                {user?.email}
              </p>
            </div>

          </div>

          <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>

        </div>
      </div>
  );

  return (
      <div className="flex h-screen bg-slate-50 overflow-hidden">

        {/* Desktop sidebar */}
        <aside className="hidden md:flex flex-col w-60 bg-white border-r border-slate-200 flex-shrink-0">
          <SidebarContent />
        </aside>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
            <div className="fixed inset-0 z-50 md:hidden">

              <div
                  className="absolute inset-0 bg-slate-900/50"
                  onClick={() => setSidebarOpen(false)}
              />

              <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl">
                <SidebarContent />
              </aside>

            </div>
        )}

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* Mobile header */}
          <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200">

            <button
                onClick={() => setSidebarOpen(true)}
                className="p-1 text-slate-600"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Actual CareerFlow PNG logo */}
            <Link to="/" className="flex items-center">
              <img
                  src={careerflowLogo}
                  alt="CareerFlow"
                  className="h-8 w-auto object-contain"
              />
            </Link>

            <div className="w-7 h-7 rounded-full bg-[#1E3A8A] flex items-center justify-center text-white text-xs font-semibold">
              {user?.fullName?.charAt(0).toUpperCase()}
            </div>

          </header>

          {/* Page */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>

        </div>
      </div>
  );
}