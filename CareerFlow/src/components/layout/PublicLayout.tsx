import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Briefcase,
    Building2,
    LayoutDashboard,
    LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import careerflowLogo from '../../assets/careerflow-logo.png';

export default function PublicLayout({
                                         children,
                                     }: {
    children: ReactNode;
}) {
    const { user, isAuthenticated, isBusiness, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-slate-50">

            {/* Header */}
            <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="h-16 flex items-center justify-between">

                        {/* Logo */}
                        <Link
                            to="/"
                            className="flex items-center"
                        >
                            <img
                                src={careerflowLogo}
                                alt="JobiHub"
                                className="h-9 w-auto object-contain"
                            />
                        </Link>

                        {/* Navigation */}
                        <nav className="hidden md:flex items-center gap-6">

                            <Link
                                to="/jobs"
                                className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-700 transition"
                            >
                                <Briefcase className="w-4 h-4" />
                                Find Jobs
                            </Link>


                        </nav>

                        {/* Actions */}
                        <div className="flex items-center gap-2">

                            {isAuthenticated ? (
                                <>
                                    <Link
                                        to={
                                            isBusiness
                                                ? '/business'
                                                : '/dashboard'
                                        }
                                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-blue-700 transition"
                                    >
                                        <LayoutDashboard className="w-4 h-4" />

                                        <span className="hidden sm:inline">
                      {user?.fullName || 'Dashboard'}
                    </span>

                                        <span className="sm:hidden">
                      Dashboard
                    </span>
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
                                    >
                                        <LogOut className="w-4 h-4" />

                                        <span className="hidden sm:inline">
                      Sign Out
                    </span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
                                    >
                                        Sign In
                                    </Link>

                                    <Link
                                        to="/register"
                                        className="px-4 py-2 text-sm font-semibold bg-[#1E3A8A] text-white rounded-lg hover:bg-blue-900 transition"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}

                        </div>

                    </div>

                </div>
            </header>

            {/* Page */}
            <main>
                {children}
            </main>

            {/* Footer */}
            <footer className="mt-16 bg-white border-t border-slate-200">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                        <div>
                            <p className="text-sm font-semibold text-slate-900">
                                JobiHub
                            </p>

                            <p className="text-sm text-slate-500 mt-1">
                                Find jobs, build your CV and grow your career.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-5">

                            <Link
                                to="/jobs"
                                className="text-sm text-slate-500 hover:text-blue-700"
                            >
                                Jobs
                            </Link>

                            {isAuthenticated ? (
                                <>
                                    <Link
                                        to={
                                            isBusiness
                                                ? '/business'
                                                : '/dashboard'
                                        }
                                        className="text-sm text-slate-500 hover:text-blue-700"
                                    >
                                        Dashboard
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="text-sm text-slate-500 hover:text-red-600"
                                    >
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="text-sm text-slate-500 hover:text-blue-700"
                                    >
                                        Sign In
                                    </Link>

                                    <Link
                                        to="/register"
                                        className="text-sm text-slate-500 hover:text-blue-700"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}

                        </div>

                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100">

                        <p className="text-xs text-slate-400">
                            © {new Date().getFullYear()} JobiHub. All rights reserved.
                        </p>

                    </div>

                </div>

            </footer>

        </div>
    );
}