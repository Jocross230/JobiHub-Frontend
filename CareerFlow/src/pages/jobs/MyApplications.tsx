import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  FileText,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

import AppLayout from '../../components/layout/AppLayout';
import { Card, Spinner } from '../../components/ui';
import { jobsApi, type JobApplication } from '../../api/jobsApi';

export default function MyApplications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await jobsApi.getMyApplications();

      setApplications(data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to load your applications.'
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return '';

    return new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusClasses = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'submitted':
        return 'bg-blue-50 text-blue-700 border-blue-200';

      case 'reviewing':
        return 'bg-amber-50 text-amber-700 border-amber-200';

      case 'shortlisted':
        return 'bg-green-50 text-green-700 border-green-200';

      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';

      case 'hired':
        return 'bg-purple-50 text-purple-700 border-purple-200';

      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/jobs')}
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={18} />
          Back to Jobs
        </button>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            My Applications
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Track the jobs you have applied for and see which CV you submitted.
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!error && applications.length === 0 && (
          <Card className="p-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <Briefcase size={26} className="text-slate-500" />
            </div>

            <h2 className="text-lg font-semibold text-slate-900">
              No applications yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              When you apply for a job, your applications will appear here.
            </p>

            <button
              onClick={() => navigate('/jobs')}
              className="mt-6 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
            >
              Find Jobs
            </button>
          </Card>
        )}

        {applications.length > 0 && (
          <div className="space-y-5">
            {applications.map((application) => (
              <Card key={application.id} className="p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                          {application.job?.title || 'Job Application'}
                        </h2>

                        <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                          <Briefcase size={15} />
                          {application.job?.title || 'JobiHub Job'}
                        </div>
                      </div>

                      <span
                        className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium capitalize ${getStatusClasses(
    application.status
)}`}
                      >
                        <CheckCircle size={14} />
                        {application.status}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                      {application.job?.location && (
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin size={15} />
                          {application.job.location}
                        </span>
                      )}

                      {application.job?.workArrangement && (
                        <span className="inline-flex items-center gap-1.5">
                          <Clock size={15} />
                          {application.job.workArrangement}
                        </span>
                      )}

                      {application.job?.employmentType && (
                        <span>
                          {application.job.employmentType}
                        </span>
                      )}

                      {application.appliedAt && (
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar size={15} />
                          Applied {formatDate(application.appliedAt)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                        <FileText size={20} className="text-slate-600" />
                      </div>

                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          CV submitted
                        </p>

                        <p className="mt-1 font-medium text-slate-900">
                          {application.cv?.fullName || 'CV'}
                        </p>

                        {application.cv?.professionalTitle && (
                          <p className="text-sm text-slate-500">
                            {application.cv.professionalTitle}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        application.jobId &&
                        navigate(`/jobs/${application.jobId}`)
                      }
                      className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      View Job
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
