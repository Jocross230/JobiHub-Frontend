import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText, Mail, Briefcase, Bookmark, User, ArrowRight, Clock, Plus
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { useAuth } from '../context/AuthContext';
import { useMyCvs } from '../hooks/useMyCvs';
import { Card, Spinner } from '../components/ui';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function QuickCard({ icon: Icon, title, value, subtitle, to, cta, color = 'blue' }: {
  icon: React.ElementType;
  title: string;
  value?: string | number;
  subtitle?: string;
  to: string;
  cta: string;
  color?: string;
}) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    violet: 'bg-violet-50 text-violet-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
    indigo: 'bg-indigo-50 text-indigo-600',
  };
  return (
    <Card className="p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-lg ${colors[color]} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
        {value !== undefined && (
          <span className="text-2xl font-bold text-slate-900">{value}</span>
        )}
      </div>
      <div>
        <h3 className="font-semibold text-slate-900">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      <Link to={to} className="flex items-center gap-1 text-sm text-blue-600 font-medium hover:text-blue-800 mt-auto">
        {cta} <ArrowRight className="w-3 h-3" />
      </Link>
    </Card>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const firstName = user?.fullName?.split(' ')[0] ?? 'there';
  const { cvs, loading: cvsLoading } = useMyCvs();

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            {greeting()}, {firstName} 👋
          </h1>
          <p className="text-slate-500 mt-1">Let&apos;s move your career forward.</p>
        </div>

        {/* CV status banner */}
        {!cvsLoading && cvs.length === 0 && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-5 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-blue-900">You haven&apos;t created a CV yet</p>
              <p className="text-sm text-blue-700 mt-0.5">Build a professional CV in minutes to start applying for jobs.</p>
            </div>
            <Link to="/cv-builder" className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
              <Plus className="w-4 h-4" /> Create My CV
            </Link>
          </div>
        )}

        {/* Quick action cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <QuickCard
            icon={FileText}
            title="My CV"
            value={cvsLoading ? '—' : cvs.length}
            subtitle={cvs.length === 1 ? '1 CV created' : `${cvs.length} CVs created`}
            to="/my-cvs"
            cta="Manage CVs"
            color="blue"
          />
          <QuickCard
            icon={Mail}
            title="Cover Letter"
            subtitle="AI-powered, tailored to each role"
            to="/cover-letter"
            cta="Generate Cover Letter"
            color="violet"
          />
          <QuickCard
            icon={Briefcase}
            title="Find Jobs"
            subtitle="Search and filter available opportunities"
            to="/jobs"
            cta="Browse Jobs"
            color="emerald"
          />
          <QuickCard
            icon={Bookmark}
            title="Saved Jobs"
            subtitle="Jobs you&apos;ve bookmarked"
            to="/saved-jobs"
            cta="View Saved Jobs"
            color="amber"
          />
          <QuickCard
            icon={User}
            title="Career Profile"
            subtitle="Keep your profile up to date"
            to="/profile"
            cta="Edit Profile"
            color="rose"
          />

        </div>

        {/* Recent CVs */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-900">Recent CVs</h2>
            <Link to="/my-cvs" className="text-sm text-blue-600 hover:underline">View all</Link>
          </div>
          {cvsLoading ? (
            <div className="flex justify-center py-8"><Spinner /></div>
          ) : cvs.length === 0 ? (
            <Card className="p-8 text-center">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-600 mb-1">No CVs yet</p>
              <p className="text-xs text-slate-500 mb-4">Create your first professional CV to get started.</p>
              <Link to="/cv-builder" className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1E3A8A] text-white text-sm font-medium rounded-lg hover:bg-blue-900 transition">
                <Plus className="w-4 h-4" /> Create My CV
              </Link>
            </Card>
          ) : (
            <div className="space-y-3">
              {cvs.slice(0, 3).map(cv => (
                <Card key={cv.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{cv.fullName || 'Untitled CV'}</p>
                      <p className="text-xs text-slate-500">{cv.professionalTitle || 'No title'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {cv.updatedAt && (
                      <span className="hidden sm:flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="w-3 h-3" />
                        {new Date(cv.updatedAt).toLocaleDateString()}
                      </span>
                    )}
                    <Link to={`/cv-builder/${cv.id}`} className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition">
                      Edit
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
