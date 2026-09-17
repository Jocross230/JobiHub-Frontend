import { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import { adminApi } from '../../api/adminApi';
import type { ActivityLog } from '../../api/adminApi';
import { Card, EmptyState, PageLoader } from '../../components/ui';

const ACTION_COLORS: Record<string, string> = {
  'User registered': 'bg-blue-500',
  'CV created': 'bg-violet-500',
  'CV updated': 'bg-indigo-400',
  'Business registered': 'bg-amber-500',
  'Job posted': 'bg-emerald-500',
  'Recruitment request submitted': 'bg-pink-500',
  'Admin action': 'bg-red-500',
};

export default function AdminActivity() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getActivityLogs().then(l => { setLogs(l); setLoading(false); });
  }, []);

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900">Platform Activity</h1>
          <p className="text-sm text-slate-500 mt-0.5">Recent platform events and actions.</p>
        </div>

        {loading ? <PageLoader /> : (
          <Card className="overflow-hidden">
            {logs.length === 0 ? (
              <EmptyState
                icon={<Activity className="w-12 h-12" />}
                title="No activity logs"
                description="Platform activity will appear here once the activity log API is connected."
              />
            ) : (
              <div className="divide-y divide-slate-100">
                {logs.map(log => (
                  <div key={log.id} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${ACTION_COLORS[log.action] ?? 'bg-slate-400'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-900">{log.action}</p>
                      {log.actorName && <p className="text-xs text-slate-500">by {log.actorName}</p>}
                      {log.details && <p className="text-xs text-slate-400 mt-0.5">{log.details}</p>}
                    </div>
                    <span className="text-xs text-slate-400 flex-shrink-0">{new Date(log.occurredAt).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}
        {!loading && logs.length === 0 && (
          <p className="text-xs text-slate-400 text-center mt-4">
            Connect <code className="bg-slate-100 px-1 rounded">adminApi.getActivityLogs()</code> to <code className="bg-slate-100 px-1 rounded">GET /api/Admin/activity</code> to display real activity data.
          </p>
        )}
      </div>
    </AdminLayout>
  );
}
