import { useEffect, useState } from 'react';
import { Building2, Search, CheckCircle, XCircle } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import { adminApi } from '../../api/adminApi';
import { Card, EmptyState, PageLoader, StatusBadge } from '../../components/ui';

export default function AdminBusinesses() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    adminApi.getBusinesses().then((b: any) => { setBusinesses(b); setLoading(false); });
  }, []);

  const filtered = businesses.filter((b: any) =>
    !search || b.companyName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900">Business Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">Review and manage registered businesses.</p>
        </div>

        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search businesses..." className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        {loading ? <PageLoader /> : (
          <Card className="overflow-hidden">
            {filtered.length === 0 ? (
              <EmptyState icon={<Building2 className="w-12 h-12" />} title="No businesses found" description="Business records will appear here once the admin business API is connected." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Company</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Industry</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Location</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map((b: any) => (
                      <tr key={b.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-900">{b.companyName}</td>
                        <td className="px-4 py-3 text-slate-600">{b.industry}</td>
                        <td className="px-4 py-3 text-slate-600">{b.location}</td>
                        <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            {b.status === 'pending' && (
                              <button onClick={() => adminApi.approveBusiness(b.id).then(() => setBusinesses(p => p.map((x: any) => x.id === b.id ? { ...x, status: 'active' } : x)))} className="flex items-center gap-1 px-2 py-1 text-xs text-emerald-600 hover:bg-emerald-50 rounded">
                                <CheckCircle className="w-3.5 h-3.5" /> Approve
                              </button>
                            )}
                            {b.status === 'active' && (
                              <button onClick={() => adminApi.suspendBusiness(b.id).then(() => setBusinesses(p => p.map((x: any) => x.id === b.id ? { ...x, status: 'suspended' } : x)))} className="flex items-center gap-1 px-2 py-1 text-xs text-red-500 hover:bg-red-50 rounded">
                                <XCircle className="w-3.5 h-3.5" /> Suspend
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
      </div>
    </AdminLayout>
  );
}
