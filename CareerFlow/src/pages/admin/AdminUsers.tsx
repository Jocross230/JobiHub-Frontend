import { useEffect, useState } from 'react';
import { Search, UserX, UserCheck, Eye } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import { adminApi } from '../../api/adminApi';
import type { AdminUser } from '../../api/adminApi';
import { Card, PageLoader, EmptyState, StatusBadge, Spinner } from '../../components/ui';

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionUser, setActionUser] = useState<string | null>(null);

  useEffect(() => {
    adminApi.getUsers().then(u => { setUsers(u); setLoading(false); });
  }, []);

  const handleDeactivate = async (id: string) => {
    if (!confirm('Deactivate this user?')) return;
    setActionUser(id);
    await adminApi.deactivateUser(id);
    setUsers(p => p.map(u => u.id === id ? { ...u, status: 'inactive' as const } : u));
    setActionUser(null);
  };

  const handleReactivate = async (id: string) => {
    setActionUser(id);
    await adminApi.reactivateUser(id);
    setUsers(p => p.map(u => u.id === id ? { ...u, status: 'active' as const } : u));
    setActionUser(null);
  };

  const filtered = users.filter(u =>
    !search || u.fullName.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Users</h1>
            <p className="text-sm text-slate-500 mt-0.5">Manage platform users and their accounts.</p>
          </div>
        </div>

        <Card className="mb-5 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search users by name or email..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </Card>

        {loading ? <PageLoader /> : (
          <Card className="overflow-hidden">
            {filtered.length === 0 ? (
              <EmptyState title="No users found" description={search ? 'No users match your search.' : 'No users in the system yet.'} />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">User</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Role</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">CVs</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Joined</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map(u => (
                      <tr key={u.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-slate-900">{u.fullName}</p>
                            <p className="text-xs text-slate-500">{u.email}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-600 capitalize">{u.role}</td>
                        <td className="px-4 py-3 text-slate-600">{u.cvCount}</td>
                        <td className="px-4 py-3 text-slate-500 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3"><StatusBadge status={u.status} /></td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            {actionUser === u.id ? (
                              <Spinner size="sm" />
                            ) : u.status === 'active' ? (
                              <button onClick={() => handleDeactivate(u.id)} className="flex items-center gap-1 px-2 py-1 text-xs text-red-500 hover:bg-red-50 rounded">
                                <UserX className="w-3.5 h-3.5" /> Deactivate
                              </button>
                            ) : (
                              <button onClick={() => handleReactivate(u.id)} className="flex items-center gap-1 px-2 py-1 text-xs text-emerald-600 hover:bg-emerald-50 rounded">
                                <UserCheck className="w-3.5 h-3.5" /> Reactivate
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}

        {users.length === 0 && !loading && (
          <p className="text-xs text-slate-400 text-center mt-4">
            Connect <code className="bg-slate-100 px-1 rounded">adminApi.getUsers()</code> to <code className="bg-slate-100 px-1 rounded">GET /api/Admin/users</code> to see real user data.
          </p>
        )}
      </div>
    </AdminLayout>
  );
}
