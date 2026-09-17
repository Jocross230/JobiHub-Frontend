import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { passwordApi } from '../api/passwordApi';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        setError('');
        setMessage('');

        if (!email.trim()) {
            setError('Please enter your email address.');
            return;
        }

        setLoading(true);

        try {
            const response = await passwordApi.forgotPassword(
                email.trim()
            );

            setMessage(response.message);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Unable to process your request.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    <div className="flex justify-center mb-6">
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                            <Mail className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-slate-900">
                            Forgot your password?
                        </h1>

                        <p className="text-sm text-slate-500 mt-2">
                            Enter your email address and we'll send you a
                            password reset link.
                        </p>
                    </div>

                    {message && (
                        <div className="mb-6 rounded-lg bg-emerald-50 border border-emerald-200 p-4">
                            <div className="flex gap-3">
                                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />

                                <p className="text-sm text-emerald-700">
                                    {message}
                                </p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
                            <p className="text-sm text-red-700">
                                {error}
                            </p>
                        </div>
                    )}

                    {!message && (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-slate-700 mb-1.5"
                                >
                                    Email address
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    className="w-full px-4 py-3 rounded-lg border border-slate-300
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    focus:border-blue-500"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 rounded-lg bg-blue-600 text-white
                  font-medium hover:bg-blue-700 transition
                  disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </form>
                    )}

                    <div className="mt-6 text-center">
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 text-sm
                text-blue-600 hover:text-blue-800 font-medium"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}