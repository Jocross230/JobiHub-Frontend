import { useEffect, useState } from 'react';
import { Users, FileText, Building2, Briefcase, HeadphonesIcon, MessageSquare, TrendingUp, TrendingDown } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import { adminApi } from '../../api/adminApi';
import type { AdminStats } from '../../api/adminApi';
import { Card, Spinner } from '../../components/ui';

function StatCard({ label, value, icon: Icon, color, trend }: {
  label: string; value: number | string; icon: React.ElementType; color: string; trend?: number;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="w-4 h-4" />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-0.5 text-xs font-medium ${trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
    </Card>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getStats().then(s => { setStats(s); setLoading(false); });
  }, []);

  const STATS = stats ? [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-50 text-blue-600' },
    { label: 'Active Users', value: stats.activeUsers, icon: Users, color: 'bg-emerald-50 text-emerald-600', trend: 12 },
    { label: 'Total CVs', value: stats.totalCvs, icon: FileText, color: 'bg-violet-50 text-violet-600' },
    { label: 'CVs Today', value: stats.cvsToday, icon: FileText, color: 'bg-indigo-50 text-indigo-600', trend: 8 },
    { label: 'Businesses', value: stats.totalBusinesses, icon: Building2, color: 'bg-amber-50 text-amber-600' },
    { label: 'Active Businesses', value: stats.activeBusinesses, icon: Building2, color: 'bg-orange-50 text-orange-600' },
    { label: 'Total Jobs', value: stats.totalJobs, icon: Briefcase, color: 'bg-teal-50 text-teal-600' },
    { label: 'Active Jobs', value: stats.activeJobs, icon: Briefcase, color: 'bg-cyan-50 text-cyan-600' },
    { label: 'Recruitment Requests', value: stats.openRecruitmentRequests, icon: HeadphonesIcon, color: 'bg-pink-50 text-pink-600' },
    { label: 'Open Support Issues', value: stats.openSupportIssues, icon: MessageSquare, color: 'bg-rose-50 text-rose-600' },
  ] : [];

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900">Admin Overview</h1>
          <p className="text-sm text-slate-500 mt-0.5">Platform-wide metrics and activity.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Spinner size="lg" /></div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              {STATS.map(s => <StatCard key={s.label} {...s} />)}
            </div>

            {stats?.totalUsers === 0 && (
              <Card className="p-8 text-center">
                <p className="text-sm font-medium text-slate-600 mb-1">Admin API not yet connected</p>
                <p className="text-xs text-slate-500">
                  The admin dashboard is ready. Connect the backend admin endpoints to start seeing real platform data.
                  <br />The API service layer is in <code className="bg-slate-100 px-1 rounded">src/api/adminApi.ts</code>.
                </p>
              </Card>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}
