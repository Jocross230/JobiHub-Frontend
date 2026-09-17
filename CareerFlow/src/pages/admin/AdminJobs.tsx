import { useEffect, useState } from 'react';
import { Briefcase, Search, XCircle } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import { adminApi } from '../../api/adminApi';
import { Card, EmptyState, PageLoader } from '../../components/ui';

export default function AdminJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    adminApi.getAllJobs().then((j: any) => {
      setJobs(j);
      setLoading(false);
    });
  }, []);

  const filtered = jobs.filter((j: any) =>
      !search ||
      j.title?.toLowerCase().includes(search.toLowerCase()) ||
      j.companyName?.toLowerCase().includes(search.toLowerCase()) ||
      j.company?.toLowerCase().includes(search.toLowerCase())
  );

  const handleStatusChange = async (
      jobId: string,
      newStatus: string
  ) => {
    const currentJob = jobs.find((j: any) => j.id === jobId);

    if (!currentJob || currentJob.status === newStatus) {
      return;
    }

    try {
      await adminApi.changeJobStatus(jobId, newStatus);

      setJobs(prev =>
          prev.map((job: any) =>
              job.id === jobId
                  ? {
                    ...job,
                    status: newStatus
                  }
                  : job
          )
      );
    } catch (error) {
      console.error('Failed to change job status:', error);
      alert('Failed to change job status.');
    }
  };

  const handleRemove = async (jobId: string) => {
    if (!confirm('Remove this job?')) {
      return;
    }

    try {
      await adminApi.removeJob(jobId);

      setJobs(prev =>
          prev.filter((job: any) => job.id !== jobId)
      );
    } catch (error) {
      console.error('Failed to remove job:', error);
      alert('Failed to remove job.');
    }
  };

  return (
      <AdminLayout>
        <div className="p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-slate-900">
              Job Management
            </h1>

            <p className="text-sm text-slate-500 mt-0.5">
              Review and moderate job listings across the platform.
            </p>
          </div>

          <div className="relative mb-5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

            <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search jobs..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {loading ? (
              <PageLoader />
          ) : (
              <Card className="overflow-hidden">
                {filtered.length === 0 ? (
                    <EmptyState
                        icon={<Briefcase className="w-12 h-12" />}
                        title="No jobs found"
                        description="Job listings will appear here once the admin jobs API is connected."
                    />
                ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                        <tr className="border-b border-slate-100 bg-slate-50">
                          <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                            Job
                          </th>

                          <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                            Company
                          </th>

                          <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                            Location
                          </th>

                          <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                            Status
                          </th>

                          <th className="px-4 py-3"></th>
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                        {filtered.map((j: any) => (
                            <tr
                                key={j.id}
                                className="hover:bg-slate-50"
                            >
                              <td className="px-4 py-3 font-medium text-slate-900">
                                {j.title}
                              </td>

                              <td className="px-4 py-3 text-slate-600">
                                {j.companyName || j.company || 'Unknown Company'}
                              </td>

                              <td className="px-4 py-3 text-slate-600">
                                {j.location}
                              </td>

                              <td className="px-4 py-3">
                                <select
                                    value={j.status ?? 'draft'}
                                    onChange={e =>
                                        handleStatusChange(
                                            j.id,
                                            e.target.value
                                        )
                                    }
                                    className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="draft">
                                    draft
                                  </option>

                                  <option value="published">
                                    published
                                  </option>

                                  <option value="closed">
                                    closed
                                  </option>
                                </select>
                              </td>

                              <td className="px-4 py-3">
                                <button
                                    onClick={() =>
                                        handleRemove(j.id)
                                    }
                                    className="flex items-center gap-1 px-2 py-1 text-xs text-red-500 hover:bg-red-50 rounded"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                  Remove
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