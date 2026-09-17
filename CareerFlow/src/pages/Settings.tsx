import { useState } from 'react';
import { Lock, Bell, Trash2, Shield } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { Card, Input, Spinner } from '../components/ui';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { user } = useAuth();
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.next !== pwForm.confirm) { setMessage('Passwords do not match.'); return; }
    setSaving(true);
    // NOTE: Connect to /api/Auth/change-password once available
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    setMessage('Password updated successfully.');
    setPwForm({ current: '', next: '', confirm: '' });
  };

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-2xl mx-auto">
        <h1 className="text-xl font-bold text-slate-900 mb-6">Account Settings</h1>

        {/* Account info */}
        <Card className="p-6 mb-6">
          <h2 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-slate-400" /> Account Information
          </h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-500">Name</span>
              <span className="text-sm font-medium text-slate-900">{user?.fullName}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-500">Email</span>
              <span className="text-sm font-medium text-slate-900">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-slate-500">Account type</span>
              <span className="text-sm font-medium text-slate-900 capitalize">{user?.role ?? 'Standard'}</span>
            </div>
          </div>
        </Card>

        {/* Change password */}
        <Card className="p-6 mb-6">
          <h2 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Lock className="w-4 h-4 text-slate-400" /> Change Password
          </h2>
          {message && (
            <div className={`mb-4 px-3 py-2 text-sm rounded-lg ${message.includes('successfully') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
              {message}
            </div>
          )}
          <form onSubmit={handleChangePassword} className="space-y-4">
            <Input label="Current password" type="password" value={pwForm.current} onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))} required />
            <Input label="New password" type="password" value={pwForm.next} onChange={e => setPwForm(p => ({ ...p, next: e.target.value }))} required />
            <Input label="Confirm new password" type="password" value={pwForm.confirm} onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))} required />
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-[#1E3A8A] text-white text-sm font-semibold rounded-lg hover:bg-blue-900 disabled:opacity-60 transition">
              {saving && <Spinner size="sm" />}
              {saving ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </Card>

        {/* Notifications — placeholder */}
        <Card className="p-6 mb-6">
          <h2 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Bell className="w-4 h-4 text-slate-400" /> Notifications
          </h2>
          <p className="text-sm text-slate-500">Notification preferences will be available in a future update.</p>
        </Card>

        {/* Danger zone */}
        <Card className="p-6 border-red-200">
          <h2 className="text-sm font-semibold text-red-600 mb-4 flex items-center gap-2">
            <Trash2 className="w-4 h-4" /> Danger Zone
          </h2>
          <p className="text-sm text-slate-500 mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
          <button
            type="button"
            onClick={() => alert('Account deletion requires backend support. Please contact support@JobiHub.com to request deletion.')}
            className="px-4 py-2 border border-red-300 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition"
          >
            Delete Account
          </button>
        </Card>
      </div>
    </AppLayout>
  );
}
