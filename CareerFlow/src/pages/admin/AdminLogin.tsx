import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
    const navigate = useNavigate();
    const { adminLogin } = useAuth();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        setError('');
        setIsSubmitting(true);

        try {
            await adminLogin(username, password);
            navigate('/admin', { replace: true });
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Invalid admin username or password.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mb-4">
                        <ShieldCheck className="w-8 h-8 text-white" />
                    </div>

                    <h1 className="text-2xl font-bold text-white">
                        JobiHub Admin
                    </h1>

                    <p className="text-slate-400 mt-2">
                        Secure administrator access
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="flex items-start gap-3 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div>
                            <label
                                htmlFor="admin-username"
                                className="block text-sm font-medium text-slate-700 mb-2"
                            >
                                Admin Username
                            </label>

                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                                <input
                                    id="admin-username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter admin username"
                                    autoComplete="username"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="admin-password"
                                className="block text-sm font-medium text-slate-700 mb-2"
                            >
                                Password
                            </label>

                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                                <input
                                    id="admin-password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter admin password"
                                    autoComplete="current-password"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            {isSubmitting ? 'Signing in...' : 'Sign In to Admin Panel'}
                        </button>
                    </form>

                    <div className="mt-6 pt-5 border-t border-slate-200 text-center">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="text-sm text-slate-500 hover:text-slate-700"
                        >
                            ← Back to JobiHub
                        </button>
                    </div>
                </div>

                <p className="text-center text-xs text-slate-500 mt-6">
                    Authorized administrators only
                </p>
            </div>
        </div>
    );
}