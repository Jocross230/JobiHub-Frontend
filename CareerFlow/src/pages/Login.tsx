import { useState } from 'react';
import {
  Link,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui';
import careerflowLogo from '../assets/careerflow-logo.png';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const returnTo = location.state?.returnTo as string | undefined;
  const loginMessage = location.state?.message as string | undefined;

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      const loggedInUser = await login(form);

      /*
       * If the user was trying to apply for a job,
       * send them back to the page they came from.
       */
      if (returnTo) {
        navigate(returnTo);
        return;
      }

      const role = loggedInUser.role?.toLowerCase();

      if (role === 'business') {
        navigate('/business');
      } else if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(
          err instanceof Error
              ? err.message
              : 'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex">

        {/* Left panel */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#0F172A] flex-col justify-between p-12">

          {/* Real CareerFlow Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img
                src={careerflowLogo}
                alt="CareerFlow"
                className="h-16 w-auto object-contain"
            />
          </Link>

          <div>
            <h2
                className="text-4xl font-bold text-white mb-4"
                style={{
                  fontFamily: "'DM Serif Display', Georgia, serif",
                }}
            >
              Your career command center.
            </h2>

            <p className="text-slate-400 text-lg">
              Build CVs, discover jobs, and track your career progress
              — all in one place.
            </p>
          </div>

          <p className="text-slate-600 text-sm">
            © {new Date().getFullYear()} JobiHub
          </p>
        </div>

        {/* Right panel */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-8 bg-slate-50">
          <div className="w-full max-w-sm">

            {/* Mobile Logo */}
            <div className="lg:hidden mb-8 flex justify-center">
              <Link to="/" className="flex items-center justify-center">
                <img
                    src={careerflowLogo}
                    alt="CareerFlow"
                    className="h-16 w-auto object-contain"
                />
              </Link>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 mb-1">
              Welcome back
            </h1>

            <p className="text-sm text-slate-500 mb-8">
              Sign in to continue to JobiHub
            </p>

            {/* Apply message */}
            {loginMessage && (
                <div className="mb-4 px-4 py-3 bg-blue-50 border border-blue-200 text-blue-700 text-sm rounded-lg">
                  {loginMessage}
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                  {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

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

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700">
                    Password
                  </label>

                  <Link
                      to="/forgot-password"
                      className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

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
                      placeholder="Your password"
                      required
                      autoComplete="current-password"
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

              {/* Sign in */}
              <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-[#1E3A8A] text-white font-semibold rounded-lg hover:bg-blue-900 disabled:opacity-60 transition"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Register */}
            <p className="mt-6 text-center text-sm text-slate-500">
              Don&apos;t have an account?{' '}

              <Link
                  to="/register"
                  state={{
                    returnTo,
                  }}
                  className="text-blue-600 font-medium hover:underline"
              >
                Create one free
              </Link>
            </p>
          </div>
        </div>
      </div>
  );
}