import { Shield, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import { Card } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';

export default function AdminSettings() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    return (
        <AdminLayout>
            <div className="p-6 lg:p-8">
                <div className="mb-6">
                    <h1 className="text-xl font-bold text-slate-900">
                        Admin Settings
                    </h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        Manage your administrator account and access.
                    </p>
                </div>

                <div className="max-w-2xl space-y-5">
                    <Card className="p-6">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                <Shield className="w-5 h-5 text-blue-600" />
                            </div>

                            <div>
                                <h2 className="text-sm font-semibold text-slate-900">
                                    Administrator Account
                                </h2>
                                <p className="text-xs text-slate-500">
                                    Current administrator session
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-medium text-slate-500">
                                    Username
                                </p>
                                <p className="text-sm text-slate-900 mt-1">
                                    {user?.fullName || 'Administrator'}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium text-slate-500">
                                    Role
                                </p>
                                <p className="text-sm text-slate-900 mt-1">
                                    Administrator
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium text-slate-500">
                                    Access
                                </p>
                                <p className="text-sm text-emerald-600 mt-1">
                                    Full administrative access
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h2 className="text-sm font-semibold text-slate-900 mb-1">
                            Sign out
                        </h2>

                        <p className="text-xs text-slate-500 mb-4">
                            End your current administrator session.
                        </p>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign out
                        </button>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}