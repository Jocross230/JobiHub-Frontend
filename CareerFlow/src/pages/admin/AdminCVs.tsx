import { useEffect, useState } from 'react';
import { FileText, Search, Trash2 } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import { adminApi } from '../../api/adminApi';
import { Card, EmptyState, PageLoader } from '../../components/ui';

export default function AdminCVs() {
  const [cvs, setCvs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    adminApi.getCvs().then((c: any) => { setCvs(c); setLoading(false); });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this CV?')) return;
    await adminApi.deleteCv(id);
    setCvs(p => p.filter((c: any) => c.id !== id));
  };

  const filtered = cvs.filter((c: any) =>
    !search || c.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900">CV Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">View and manage CV records across the platform.</p>
        </div>

        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search CVs..." className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        {loading ? <PageLoader /> : (
          <Card className="overflow-hidden">
            {filtered.length === 0 ? (
              <EmptyState icon={<FileText className="w-12 h-12" />} title="No CVs found" description="CV records will appear here once the admin CV API is connected." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Name</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Title</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Updated</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map((cv: any) => (
                      <tr key={cv.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-900">{cv.fullName}</td>
                        <td className="px-4 py-3 text-slate-600">{cv.professionalTitle}</td>
                        <td className="px-4 py-3 text-xs text-slate-500">{cv.updatedAt ? new Date(cv.updatedAt).toLocaleDateString() : '—'}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => handleDelete(cv.id)} className="flex items-center gap-1 px-2 py-1 text-xs text-red-500 hover:bg-red-50 rounded">
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
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
