import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  Settings,
  LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import careerflowLogo from '../../assets/careerflow-logo.png';

export default function Navbar() {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Navbar */}
          <div className="flex items-center justify-between h-20">

            {/* CareerFlow Logo */}
            <Link
                to="/"
                className="flex items-center flex-shrink-0"
                onClick={() => {
                  setMobileOpen(false);
                  setProfileOpen(false);
                }}
            >
              <img
                  src={careerflowLogo}
                  alt="CareerFlow"
                  className="h-14 sm:h-16 w-auto object-contain"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">

              {!isAuthenticated ? (
                  <>
                    <Link
                        to="/jobs"
                        className="text-sm text-slate-600 hover:text-slate-900 transition"
                    >
                      Find Jobs
                    </Link>

                    <Link
                        to="/cv-builder"
                        className="text-sm text-slate-600 hover:text-slate-900 transition"
                    >
                      CV Builder
                    </Link>

                    <Link
                        to="/for-business"
                        className="text-sm text-slate-600 hover:text-slate-900 transition"
                    >
                      For Businesses
                    </Link>

                    <Link
                        to="/login"
                        className="text-sm text-slate-600 hover:text-slate-900 transition"
                    >
                      Login
                    </Link>

                    <Link
                        to="/register"
                        className="px-5 py-2.5 bg-[#1E3A8A] text-white text-sm font-semibold rounded-lg hover:bg-blue-900 transition"
                    >
                      Get Started
                    </Link>
                  </>
              ) : (
                  <>
                    <Link
                        to="/dashboard"
                        className="text-sm text-slate-600 hover:text-slate-900 transition"
                    >
                      Dashboard
                    </Link>

                    <Link
                        to="/my-cvs"
                        className="text-sm text-slate-600 hover:text-slate-900 transition"
                    >
                      My CVs
                    </Link>

                    <Link
                        to="/jobs"
                        className="text-sm text-slate-600 hover:text-slate-900 transition"
                    >
                      Find Jobs
                    </Link>

                    {isAdmin && (
                        <Link
                            to="/admin"
                            className="text-sm text-blue-600 font-medium hover:text-blue-800 transition"
                        >
                          Admin
                        </Link>
                    )}

                    {/* Profile Dropdown */}
                    <div className="relative">
                      <button
                          onClick={() => setProfileOpen(!profileOpen)}
                          className="flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900 transition"
                      >
                        <div className="w-8 h-8 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center text-xs font-semibold">
                          {user?.fullName?.charAt(0).toUpperCase()}
                        </div>

                        <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                                profileOpen ? 'rotate-180' : ''
                            }`}
                        />
                      </button>

                      {profileOpen && (
                          <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50">

                            {/* User Information */}
                            <div className="px-4 py-3 border-b border-slate-100">
                              <p className="text-sm font-semibold text-slate-900 truncate">
                                {user?.fullName}
                              </p>

                              <p className="text-xs text-slate-500 truncate">
                                {user?.email}
                              </p>
                            </div>

                            {/* Dashboard */}
                            <Link
                                to="/dashboard"
                                onClick={() => setProfileOpen(false)}
                                className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                            >
                              <LayoutDashboard className="w-4 h-4" />
                              Dashboard
                            </Link>

                            {/* Profile */}
                            <Link
                                to="/profile"
                                onClick={() => setProfileOpen(false)}
                                className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                            >
                              <User className="w-4 h-4" />
                              Profile
                            </Link>

                            {/* Settings */}
                            <Link
                                to="/settings"
                                onClick={() => setProfileOpen(false)}
                                className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                            >
                              <Settings className="w-4 h-4" />
                              Settings
                            </Link>

                            {/* Logout */}
                            <button
                                onClick={() => {
                                  setProfileOpen(false);
                                  handleLogout();
                                }}
                                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                            >
                              <LogOut className="w-4 h-4" />
                              Sign Out
                            </button>
                          </div>
                      )}
                    </div>
                  </>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 text-slate-600 hover:text-slate-900 transition"
                aria-label="Toggle navigation menu"
            >
              {mobileOpen ? (
                  <X className="w-5 h-5" />
              ) : (
                  <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
            <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 flex flex-col gap-3">

              {!isAuthenticated ? (
                  <>
                    <Link
                        to="/jobs"
                        onClick={() => setMobileOpen(false)}
                        className="text-sm text-slate-700 py-1 hover:text-slate-900"
                    >
                      Find Jobs
                    </Link>

                    <Link
                        to="/cv-builder"
                        onClick={() => setMobileOpen(false)}
                        className="text-sm text-slate-700 py-1 hover:text-slate-900"
                    >
                      CV Builder
                    </Link>

                    <Link
                        to="/for-business"
                        onClick={() => setMobileOpen(false)}
                        className="text-sm text-slate-700 py-1 hover:text-slate-900"
                    >
                      For Businesses
                    </Link>

                    <Link
                        to="/login"
                        onClick={() => setMobileOpen(false)}
                        className="text-sm text-slate-700 py-1 hover:text-slate-900"
                    >
                      Login
                    </Link>

                    <Link
                        to="/register"
                        onClick={() => setMobileOpen(false)}
                        className="btn-primary text-center text-sm"
                    >
                      Get Started
                    </Link>
                  </>
              ) : (
                  <>
                    <Link
                        to="/dashboard"
                        onClick={() => setMobileOpen(false)}
                        className="text-sm text-slate-700 py-1 hover:text-slate-900"
                    >
                      Dashboard
                    </Link>

                    <Link
                        to="/my-cvs"
                        onClick={() => setMobileOpen(false)}
                        className="text-sm text-slate-700 py-1 hover:text-slate-900"
                    >
                      My CVs
                    </Link>

                    <Link
                        to="/jobs"
                        onClick={() => setMobileOpen(false)}
                        className="text-sm text-slate-700 py-1 hover:text-slate-900"
                    >
                      Find Jobs
                    </Link>

                    <Link
                        to="/profile"
                        onClick={() => setMobileOpen(false)}
                        className="text-sm text-slate-700 py-1 hover:text-slate-900"
                    >
                      Profile
                    </Link>

                    <Link
                        to="/settings"
                        onClick={() => setMobileOpen(false)}
                        className="text-sm text-slate-700 py-1 hover:text-slate-900"
                    >
                      Settings
                    </Link>

                    {isAdmin && (
                        <Link
                            to="/admin"
                            onClick={() => setMobileOpen(false)}
                            className="text-sm text-blue-600 font-medium py-1"
                        >
                          Admin
                        </Link>
                    )}

                    <button
                        onClick={() => {
                          setMobileOpen(false);
                          handleLogout();
                        }}
                        className="text-sm text-red-600 py-1 text-left"
                    >
                      Sign Out
                    </button>
                  </>
              )}
            </div>
        )}
      </header>
  );
}