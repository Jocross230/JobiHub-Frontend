import { FormEvent, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { passwordApi } from '../api/passwordApi';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get('token') || '';

    const [form, setForm] = useState({
        newPassword: '',
        confirmNewPassword: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        setError('');
        setSuccess('');

        if (!token) {
            setError('This password reset link is invalid.');
            return;
        }

        if (form.newPassword.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        if (form.newPassword !== form.confirmNewPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            const response = await passwordApi.resetPassword({
                token,
                newPassword: form.newPassword,
                confirmNewPassword: form.confirmNewPassword,
            });

            setSuccess(response.message);

            setForm({
                newPassword: '',
                confirmNewPassword: '',
            });
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Unable to reset your password.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md">

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">

                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  CF
                </span>
                            </div>

                            <span className="font-bold text-slate-900 text-lg">
                JobiHub
              </span>
                        </Link>
                    </div>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                            <Lock className="w-6 h-6 text-blue-600" />
                        </div>

                        <h1 className="text-2xl font-bold text-slate-900">
                            Reset your password
                        </h1>

                        <p className="text-sm text-slate-500 mt-2">
                            Enter a new password for your JobiHub account.
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-6 flex items-start gap-3 rounded-lg bg-red-50 border border-red-200 p-4">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />

                            <p className="text-sm text-red-700">
                                {error}
                            </p>
                        </div>
                    )}

                    {/* Success */}
                    {success && (
                        <div className="mb-6 rounded-lg bg-emerald-50 border border-emerald-200 p-4">
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />

                                <div>
                                    <p className="text-sm text-emerald-700">
                                        {success}
                                    </p>

                                    <Link
                                        to="/login"
                                        className="inline-block mt-3 text-sm font-medium text-emerald-700 hover:underline"
                                    >
                                        Go to Login
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    {!success && (
                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* New password */}
                            <div>
                                <label
                                    htmlFor="new-password"
                                    className="block text-sm font-medium text-slate-700 mb-1.5"
                                >
                                    New password
                                </label>

                                <div className="relative">
                                    <input
                                        id="new-password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={form.newPassword}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                newPassword: e.target.value,
                                            }))
                                        }
                                        placeholder="Enter your new password"
                                        autoComplete="new-password"
                                        required
                                        className="w-full px-4 py-3 pr-11 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((value) => !value)
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>

                                <p className="text-xs text-slate-500 mt-1.5">
                                    Must be at least 6 characters.
                                </p>
                            </div>

                            {/* Confirm password */}
                            <div>
                                <label
                                    htmlFor="confirm-password"
                                    className="block text-sm font-medium text-slate-700 mb-1.5"
                                >
                                    Confirm new password
                                </label>

                                <div className="relative">
                                    <input
                                        id="confirm-password"
                                        type={
                                            showConfirmPassword
                                                ? 'text'
                                                : 'password'
                                        }
                                        value={form.confirmNewPassword}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                confirmNewPassword: e.target.value,
                                            }))
                                        }
                                        placeholder="Confirm your new password"
                                        autoComplete="new-password"
                                        required
                                        className="w-full px-4 py-3 pr-11 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                (value) => !value
                                            )
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                {loading
                                    ? 'Resetting password...'
                                    : 'Reset Password'}
                            </button>
                        </form>
                    )}

                    {/* Back to login */}
                    {!success && (
                        <div className="mt-6 text-center">
                            <Link
                                to="/login"
                                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                            >
                                ← Back to Login
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}