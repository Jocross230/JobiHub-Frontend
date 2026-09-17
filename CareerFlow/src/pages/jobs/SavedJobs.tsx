import {
  Bookmark,
  MapPin,
  Trash2,
  ExternalLink,
  Building2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AppLayout from '../../components/layout/AppLayout';
import {
  Card,
  EmptyState,
  ErrorState,
  PageLoader,
  Badge,
} from '../../components/ui';

import { useSavedJobs } from '../../hooks/useSavedJobs';
import type { Job } from '../../api/jobsApi';

const EXTERNAL_SAVED_JOBS_KEY =
    'careerflow_external_saved_jobs';

function getSavedExternalJobs(): Job[] {
  try {
    const saved = localStorage.getItem(
        EXTERNAL_SAVED_JOBS_KEY
    );

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed)
        ? parsed
        : [];
  } catch {
    return [];
  }
}

function saveExternalJobs(jobs: Job[]) {
  localStorage.setItem(
      EXTERNAL_SAVED_JOBS_KEY,
      JSON.stringify(jobs)
  );
}

export default function SavedJobs() {
  const navigate = useNavigate();

  const {
    savedJobs,
    loading,
    error,
    refetch,
    removeJob,
  } = useSavedJobs();

  const [externalJobs, setExternalJobs] =
      useState<Job[]>([]);

  useEffect(() => {
    setExternalJobs(
        getSavedExternalJobs()
    );
  }, []);

  const removeExternalJob = (
      jobId: string
  ) => {
    const updated =
        externalJobs.filter(
            job =>
                String(job.id) !==
                String(jobId)
        );

    saveExternalJobs(updated);
    setExternalJobs(updated);
  };

  const totalSavedJobs =
      savedJobs.length +
      externalJobs.length;

  return (
      <AppLayout>
        <div className="p-6 lg:p-8 max-w-3xl mx-auto">

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Saved Jobs
              </h1>

              <p className="text-sm text-slate-500 mt-0.5">
                Jobs you've bookmarked for later.
              </p>
            </div>

            <button
                type="button"
                onClick={() =>
                    navigate('/jobs')
                }
                className="text-sm text-blue-600 hover:underline"
            >
              Browse more jobs
            </button>
          </div>

          {loading && <PageLoader />}

          {error && (
              <ErrorState
                  message={error}
                  onRetry={refetch}
              />
          )}

          {!loading &&
              !error &&
              totalSavedJobs === 0 && (
                  <Card>
                    <EmptyState
                        icon={
                          <Bookmark className="w-12 h-12" />
                        }
                        title="No saved jobs"
                        description="You haven't saved any jobs yet. Browse available opportunities and bookmark roles you're interested in."
                        action={
                          <button
                              type="button"
                              onClick={() =>
                                  navigate('/jobs')
                              }
                              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#1E3A8A] text-white text-sm font-semibold rounded-lg hover:bg-blue-900 transition"
                          >
                            Browse Jobs
                          </button>
                        }
                    />
                  </Card>
              )}

          {!loading &&
              !error &&
              totalSavedJobs > 0 && (
                  <div className="space-y-3">

                    {/* CareerFlow saved jobs */}
                    {savedJobs.map(
                        ({
                           id,
                           job,
                           savedAt,
                         }) => (
                            <Card
                                key={`careerflow-${id}`}
                                className="p-4"
                            >
                              <div className="flex items-start justify-between gap-3">

                                <div className="flex-1 min-w-0">

                                  <div className="flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-blue-600 flex-shrink-0" />

                                    <h3 className="font-semibold text-slate-900 text-sm">
                                      {job.title}
                                    </h3>

                                    <Badge variant="info">
                                      JobiHub
                                    </Badge>
                                  </div>

                                  <p className="text-xs text-slate-500 mt-1">
                                    {job.company}
                                  </p>

                                  <div className="flex flex-wrap items-center gap-2 mt-2">

                          <span className="flex items-center gap-1 text-xs text-slate-500">
                            <MapPin className="w-3 h-3" />
                            {job.location}
                          </span>

                                    <Badge variant="outline">
                                      {job.workArrangement}
                                    </Badge>

                                    <Badge variant="outline">
                                      {job.employmentType}
                                    </Badge>

                                    {job.experienceLevel && (
                                        <Badge variant="outline">
                                          {job.experienceLevel}
                                        </Badge>
                                    )}

                                  </div>

                                  {job.salary && (
                                      <p className="text-xs font-semibold text-emerald-700 mt-1">
                                        {job.salary}
                                      </p>
                                  )}

                                  <p className="text-xs text-slate-400 mt-1">
                                    Saved{' '}
                                    {new Date(
                                        savedAt
                                    ).toLocaleDateString()}
                                  </p>

                                </div>

                                <div className="flex flex-col gap-1.5">

                                  <button
                                      type="button"
                                      onClick={() =>
                                          navigate(
                                              `/jobs/${job.id}`
                                          )
                                      }
                                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-[#1E3A8A] text-white rounded-lg hover:bg-blue-900 transition"
                                  >
                                    Apply
                                  </button>

                                  <button
                                      type="button"
                                      onClick={() =>
                                          removeJob(id)
                                      }
                                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    Remove
                                  </button>

                                </div>

                              </div>
                            </Card>
                        )
                    )}

                    {/* External/public saved jobs */}
                    {externalJobs.map(
                        job => (
                            <Card
                                key={`external-${job.id}`}
                                className="p-4"
                            >
                              <div className="flex items-start justify-between gap-3">

                                <div className="flex-1 min-w-0">

                                  <div className="flex items-center gap-2">

                                    <Building2 className="w-4 h-4 text-blue-600 flex-shrink-0" />

                                    <h3 className="font-semibold text-slate-900 text-sm">
                                      {job.title}
                                    </h3>

                                    <Badge variant="info">
                                      Public Job
                                    </Badge>

                                  </div>

                                  <p className="text-xs text-slate-500 mt-1">
                                    {job.company}
                                  </p>

                                  <div className="flex flex-wrap items-center gap-2 mt-2">

                          <span className="flex items-center gap-1 text-xs text-slate-500">
                            <MapPin className="w-3 h-3" />
                            {job.location}
                          </span>

                                    {job.workArrangement && (
                                        <Badge variant="outline">
                                          {job.workArrangement}
                                        </Badge>
                                    )}

                                    {job.employmentType && (
                                        <Badge variant="outline">
                                          {job.employmentType}
                                        </Badge>
                                    )}

                                  </div>

                                  {job.salary && (
                                      <p className="text-xs font-semibold text-emerald-700 mt-1">
                                        {job.salary}
                                      </p>
                                  )}

                                  {job.source && (
                                      <p className="text-xs text-slate-400 mt-1">
                                        Source:{' '}
                                        {job.source ===
                                        'external'
                                            ? 'External job source'
                                            : job.source}
                                      </p>
                                  )}

                                </div>

                                <div className="flex flex-col gap-1.5">

                                  {job.externalUrl ? (
                                      <a
                                          href={
                                            job.externalUrl
                                          }
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-[#1E3A8A] text-white rounded-lg hover:bg-blue-900 transition"
                                      >
                                        Apply
                                        <ExternalLink className="w-3 h-3" />
                                      </a>
                                  ) : (
                                      <button
                                          type="button"
                                          disabled
                                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-slate-300 text-white rounded-lg cursor-not-allowed"
                                      >
                                        Apply
                                      </button>
                                  )}

                                  <button
                                      type="button"
                                      onClick={() =>
                                          removeExternalJob(
                                              job.id
                                          )
                                      }
                                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    Remove
                                  </button>

                                </div>

                              </div>
                            </Card>
                        )
                    )}

                  </div>
              )}

        </div>
      </AppLayout>
  );
}