import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui';
import careerflowLogo from '../assets/careerflow-logo.png';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'JobSeeker' as 'JobSeeker' | 'Business',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      await register({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        role: form.role,
      });

      navigate('/dashboard');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const perks = [
    'Professional CV Builder with templates',
    'AI-powered Cover Letter Generator',
    'Job discovery and AI matching',
    'Save jobs and track applications',
  ];

  return (
    <div className="min-h-screen flex">

      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0F172A] flex-col justify-between p-12">

        {/* Real CareerFlow Logo */}
        <Link
          to="/"
          className="flex items-center flex-shrink-0"
        >
          <img
            src={careerflowLogo}
            alt="CareerFlow"
            className="h-16 w-auto object-contain"
          />
        </Link>

        {/* Content */}
        <div>
          <h2
            className="text-4xl font-bold text-white mb-6"
            style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
            }}
          >
            Start your career journey.
          </h2>

          <ul className="space-y-3">
            {perks.map((perk) => (
              <li
                key={perk}
                className="flex items-start gap-3 text-slate-300 text-sm"
              >
                <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />

                <span>{perk}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <p className="text-slate-600 text-sm">
          © {new Date().getFullYear()} JobiHub
        </p>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-8 bg-slate-50">
        <div className="w-full max-w-sm">

          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 flex justify-center">
            <Link
              to="/"
              className="flex items-center justify-center"
            >
              <img
                src={careerflowLogo}
                alt="CareerFlow"
                className="h-16 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Create your account
          </h1>

          <p className="text-sm text-slate-500 mb-8">
            Free forever. No credit card required.
          </p>

          {/* Error */}
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name */}
            <Input
              label="Full name"
              type="text"
              value={form.fullName}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  fullName: e.target.value,
                }))
              }
              placeholder="Sarah Johnson"
              required
              autoComplete="name"
            />

            {/* Email */}
            <Input
              label="Email address"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  email: e.target.value,
                }))
              }
              placeholder="you@example.com"
              required
              autoComplete="email"
            />

            {/* Password */}
            <div className="flex flex-col gap-1">

              <label className="text-sm font-medium text-slate-700">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      password: e.target.value,
                    }))
                  }
                  placeholder="Min. 6 characters"
                  required
                  autoComplete="new-password"
                  className="w-full px-3 py-2 pr-10 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <Input
              label="Confirm password"
              type="password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  confirmPassword: e.target.value,
                }))
              }
              placeholder="Repeat your password"
              required
              autoComplete="new-password"
            />

            {/* Account Type */}
            <div className="flex flex-col gap-2">

              <label className="text-sm font-medium text-slate-700">
                Account type
              </label>

              <div className="grid grid-cols-2 gap-3">

                {/* Job Seeker */}
                <button
                  type="button"
                  onClick={() =>
                    setForm((p) => ({
                      ...p,
                      role: 'JobSeeker',
                    }))
                  }
                  className={`rounded-lg border px-4 py-3 text-left transition ${
  form.role === 'JobSeeker'
      ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-100'
      : 'border-slate-300 bg-white hover:border-slate-400'
}`}
                >
                  <div className="text-sm font-semibold text-slate-900">
                    Job Seeker
                  </div>

                  <div className="mt-1 text-xs text-slate-500">
                    Find jobs, build CVs and apply
                  </div>
                </button>

                {/* Employer */}
                <button
                  type="button"
                  onClick={() =>
                    setForm((p) => ({
                      ...p,
                      role: 'Business',
                    }))
                  }
                  className={`rounded-lg border px-4 py-3 text-left transition ${
  form.role === 'Business'
      ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-100'
      : 'border-slate-300 bg-white hover:border-slate-400'
}`}
                >
                  <div className="text-sm font-semibold text-slate-900">
                    Employer
                  </div>

                  <div className="mt-1 text-xs text-slate-500">
                    Post jobs and find candidates
                  </div>
                </button>

              </div>
            </div>

            {/* Create Account */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#1E3A8A] text-white font-semibold rounded-lg hover:bg-blue-900 disabled:opacity-60 transition"
            >
              {loading
                ? 'Creating account...'
                : 'Create Account'}
            </button>

          </form>

          {/* Login */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}

            <Link
              to="/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
