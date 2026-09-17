import { Link } from 'react-router-dom';
import { Building2, Briefcase, Users, Plus, HeadphonesIcon, ArrowRight, Settings } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import { Card } from '../../components/ui';

export default function BusinessDashboard() {
  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Business Dashboard</h1>
            <p className="text-sm text-slate-500 mt-0.5">Manage your company profile, vacancies, and recruitment requests.</p>
          </div>
          <Link to="/business/profile" className="flex items-center gap-1.5 text-sm text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition">
            <Settings className="w-4 h-4" /> Business Settings
          </Link>
        </div>

        {/* NOTE: Business API not yet implemented. Placeholder state. */}
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm font-medium text-amber-900">Business profile pending</p>
          <p className="text-xs text-amber-700 mt-0.5">Complete your business profile to start posting jobs and receiving applications.</p>
          <Link to="/business/profile" className="inline-flex items-center gap-1 text-xs text-amber-800 font-medium mt-2 hover:underline">
            Complete Profile <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-900">Active Vacancies</h2>
              <Link to="/business/post-job" className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                <Plus className="w-3.5 h-3.5" /> Post Job
              </Link>
            </div>
            <div className="text-center py-8 text-slate-400">
              <Briefcase className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-sm">No active vacancies</p>
              <Link to="/business/post-job" className="text-xs text-blue-600 hover:underline mt-1 inline-block">Post your first job</Link>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-900">Recruitment Requests</h2>
              <Link to="/business/recruitment" className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                <Plus className="w-3.5 h-3.5" /> New Request
              </Link>
            </div>
            <div className="text-center py-8 text-slate-400">
              <HeadphonesIcon className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-sm">No recruitment requests</p>
              <Link to="/business/recruitment" className="text-xs text-blue-600 hover:underline mt-1 inline-block">Request support</Link>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
