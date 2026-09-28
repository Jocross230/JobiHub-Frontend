import { useEffect, useState } from 'react';
import { aiJobsApi, ExternalJob } from '../../api/aiJobsApi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  MapPin,
  SlidersHorizontal,
  Bookmark,
  ExternalLink,
  Sparkles,
  Building2,
  Clock,
} from 'lucide-react';
import PublicLayout from '../../components/layout/PublicLayout';
import { Badge, Card } from '../../components/ui';
import type { Job, SavedJob } from '../../api/jobsApi';
import { jobsApi } from '../../api/jobsApi';
import { paymentsApi } from '../../api/paymentsApi';

const WORK_TYPES = ['All', 'Remote', 'Hybrid', 'On-site'];
const EMP_TYPES = [
  'All',
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
];

const EXTERNAL_SAVED_JOBS_KEY =
    'careerflow_external_saved_jobs';

/* =========================================================
   EXTERNAL / PUBLIC JOB HELPERS
========================================================= */

function getExternalJobId(job: ExternalJob): string {
  const raw = `${job.sourceName}-${job.company}-${job.title}-${job.externalUrl}`;

  let hash = 0;

  for (let i = 0; i < raw.length; i++) {
    hash = (hash << 5) - hash + raw.charCodeAt(i);
    hash |= 0;
  }

  return `external-${Math.abs(hash)}`;
}

function getSavedExternalJobs(): Job[] {
  try {
    const saved = localStorage.getItem(
        EXTERNAL_SAVED_JOBS_KEY
    );

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : [];
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

function convertExternalJob(job: ExternalJob): Job {
  return {
    id: getExternalJobId(job),

    title: job.title || 'Untitled Job',

    company: job.company || 'Unknown Company',

    location: job.location || 'Remote',

    workArrangement:
        job.workArrangement === 'Hybrid'
            ? 'Hybrid'
            : job.workArrangement === 'On-site'
                ? 'On-site'
                : 'Remote',

    employmentType:
        job.employmentType === 'Part-time'
            ? 'Part-time'
            : job.employmentType === 'Contract'
                ? 'Contract'
                : job.employmentType === 'Internship'
                    ? 'Internship'
                    : 'Full-time',

    experienceLevel:
        job.experienceLevel || '',

    salary:
        job.salary || '',

    description:
        job.description || '',

    skills:
        Array.isArray(job.skills)
            ? job.skills
            : [],

    source: 'external',

    externalUrl:
        job.externalUrl || '',

    postedAt:
        job.postedAt || '',
  };
}

/* =========================================================
   CAREERFLOW JOB CARD
========================================================= */

function JobCard({
                   job,
                 }: {
  job: Job;
}) {
  const [saved, setSaved] =
      useState(false);

  const [saving, setSaving] =
      useState(false);

  const [savedJobId, setSavedJobId] =
      useState<number | null>(null);

  const navigate = useNavigate();

  /* -------------------------------------------------------
     Check whether this job is already saved
  ------------------------------------------------------- */

  useEffect(() => {
    const checkSaved = async () => {
      /*
       * External jobs are stored locally.
       */
      if (job.source === 'external') {
        const externalJobs =
            getSavedExternalJobs();

        const existing =
            externalJobs.find(
                savedJob =>
                    String(savedJob.id) ===
                    String(job.id)
            );

        setSaved(Boolean(existing));

        return;
      }

      /*
       * CareerFlow jobs are stored in the database.
       */
      try {
        const savedJobs =
            await jobsApi.getSavedJobs();

        const existingSaved =
            savedJobs.find(
                savedJob =>
                    String(savedJob.jobId) ===
                    String(job.id)
            );

        if (existingSaved) {
          setSaved(true);
          setSavedJobId(
              Number(existingSaved.id)
          );
        } else {
          setSaved(false);
          setSavedJobId(null);
        }
      } catch (error) {
        console.error(
            'Failed to check saved job:',
            error
        );

        setSaved(false);
        setSavedJobId(null);
      }
    };

    checkSaved();
  }, [job.id, job.source]);

  /* -------------------------------------------------------
     Save / Remove Job
  ------------------------------------------------------- */

  const handleSave = async () => {
    if (saving) {
      return;
    }

    setSaving(true);

    try {
      /* =====================================================
         EXTERNAL JOB
      ===================================================== */

      if (job.source === 'external') {
        const existing =
            getSavedExternalJobs();

        const alreadySaved =
            existing.some(
                savedJob =>
                    String(savedJob.id) ===
                    String(job.id)
            );

        if (alreadySaved) {
          const updated =
              existing.filter(
                  savedJob =>
                      String(savedJob.id) !==
                      String(job.id)
              );

          saveExternalJobs(updated);

          setSaved(false);
        } else {
          saveExternalJobs([
            ...existing,
            job,
          ]);

          setSaved(true);
        }

        return;
      }

      /* =====================================================
         CAREERFLOW JOB
      ===================================================== */

      if (saved) {
        /*
         * If we already know the saved record ID,
         * use it directly.
         */
        if (savedJobId !== null) {
          await jobsApi.removeSavedJob(
              savedJobId
          );
        } else {
          /*
           * Otherwise find the saved record.
           */
          const savedJobs =
              await jobsApi.getSavedJobs();

          const existingSaved =
              savedJobs.find(
                  savedJob =>
                      String(savedJob.jobId) ===
                      String(job.id)
              );

          if (existingSaved) {
            await jobsApi.removeSavedJob(
                Number(existingSaved.id)
            );
          }
        }

        setSaved(false);
        setSavedJobId(null);
      } else {
        /*
         * Save the CareerFlow job.
         */
        const result =
            await jobsApi.saveJob(job.id);

        setSaved(true);

        /*
         * Store the database saved-job ID.
         * This lets us remove it later without
         * searching again.
         */
        if (result?.id !== undefined) {
          setSavedJobId(
              Number(result.id)
          );
        }
      }
    } catch (error) {
      console.error(
          'Failed to save/remove job:',
          error
      );
    } finally {
      setSaving(false);
    }
  };

  /* -------------------------------------------------------
     Posted date
  ------------------------------------------------------- */

  const postedDate =
      job.postedAt
          ? new Date(job.postedAt)
          : null;

  const daysAgo =
      postedDate &&
      !Number.isNaN(
          postedDate.getTime()
      )
          ? Math.floor(
              (Date.now() -
                  postedDate.getTime()) /
              86400000
          )
          : null;

  /* -------------------------------------------------------
     UI
  ------------------------------------------------------- */

  return (
      <Card className="p-5 hover:shadow-md hover:border-blue-200 transition-all">
        <div className="flex items-start justify-between gap-3 mb-3">

          <div className="flex items-start gap-3">

            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5 text-slate-400" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">

                <h3 className="font-semibold text-slate-900 text-sm">
                  {job.title}
                </h3>

                {job.source === 'careerflow' && (
                    <Badge variant="info">
                      JobiHub
                    </Badge>
                )}

              </div>

              <p className="text-xs text-slate-500 mt-0.5">
                {job.company}
              </p>
            </div>
          </div>

          <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              title={
                saved
                    ? 'Remove saved job'
                    : 'Save job'
              }
              className={`p-2 rounded-lg transition flex-shrink-0 ${
                  saved
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              } ${
                  saving
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
              }`}
          >
            <Bookmark
                className="w-4 h-4"
                fill={
                  saved
                      ? 'currentColor'
                      : 'none'
                }
            />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">

          <div className="flex items-center gap-1 text-xs text-slate-500">
            <MapPin className="w-3 h-3" />
            {job.location}
          </div>

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
            <p className="text-sm font-semibold text-emerald-700 mb-3">
              {job.salary}
            </p>
        )}

        <div className="flex flex-wrap gap-1.5 mb-4">

          {Array.isArray(job.skills) &&
              job.skills
                  .slice(0, 4)
                  .map(
                      (skill, index) => (
                          <span
                              key={`${skill}-${index}`}
                              className="px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded"
                          >
                  {skill}
                </span>
                      )
                  )}

        </div>

        <div className="flex items-center justify-between">

        <span className="flex items-center gap-1 text-xs text-slate-400">

          <Clock className="w-3 h-3" />

          {daysAgo === null
              ? 'Date unavailable'
              : daysAgo <= 0
                  ? 'Today'
                  : daysAgo === 1
                      ? 'Yesterday'
                      : `${daysAgo} days ago`}

        </span>

          <div className="flex gap-2">

            <button
                type="button"
                onClick={() =>
                    navigate(
                        `/jobs/${job.id}`
                    )
                }
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition"
            >
              View Job
            </button>

            {job.source === 'external' ? (
                <a
                    href={job.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition"
                >
                  Apply

                  <ExternalLink className="w-3 h-3" />
                </a>
            ) : (
                <button
                    type="button"
                    onClick={async () => {
                      try {
                        const payment =
                            await paymentsApi.status('JobReady');

                        if (payment.approved === true) {
                          navigate(`/jobs/${job.id}`);
                          return;
                        }

                        window.location.href =
                            '/payment-verification?product=JobReady&amount=2500';
                      } catch (error) {
                        console.error(
                            'JOB READY PAYMENT STATUS ERROR:',
                            error
                        );

                        window.location.href =
                            '/payment-verification?product=JobReady&amount=2500';
                      }
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-[#1E3A8A] text-white rounded-lg hover:bg-blue-900 transition"
                >
                  Apply on JobiHub

                </button>
            )}

          </div>
        </div>
      </Card>
  );
}

/* =========================================================
   PUBLIC / EXTERNAL JOB CARD
========================================================= */

function AIJobCard({
                     job,
                   }: {
  job: ExternalJob;
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [saved, setSaved] =
      useState(false);

  const [saving, setSaving] =
      useState(false);

  const hasUrl =
      Boolean(
          job.externalUrl?.trim()
      );

  const convertedJob =
      convertExternalJob(job);

  /* -------------------------------------------------------
     Check local saved state
  ------------------------------------------------------- */

  useEffect(() => {
    const savedJobs =
        getSavedExternalJobs();

    const existing =
        savedJobs.some(
            savedJob =>
                String(savedJob.id) ===
                String(convertedJob.id)
        );

    setSaved(existing);
  }, [convertedJob.id]);

  /* -------------------------------------------------------
     Save / Remove external job
  ------------------------------------------------------- */

  const handleSave = () => {
    if (saving) {
      return;
    }

    setSaving(true);

    try {
      const existing =
          getSavedExternalJobs();

      const alreadySaved =
          existing.some(
              savedJob =>
                  String(savedJob.id) ===
                  String(convertedJob.id)
          );

      if (alreadySaved) {
        const updated =
            existing.filter(
                savedJob =>
                    String(savedJob.id) !==
                    String(convertedJob.id)
            );

        saveExternalJobs(updated);

        setSaved(false);
      } else {
        saveExternalJobs([
          ...existing,
          convertedJob,
        ]);

        setSaved(true);
      }
    } catch (error) {
      console.error(
          'Failed to save public job:',
          error
      );
    } finally {
      setSaving(false);
    }
  };

  /* -------------------------------------------------------
     Apply externally
  ------------------------------------------------------- */

  const handleApply = () => {
    if (!hasUrl) return;

    if (!user) {
      navigate('/login', {
        state: {
          returnTo: '/jobs',
          message: 'Please sign in or register before applying for a job.',
        },
      });
      return;
    }

    window.open(job.externalUrl, '_blank', 'noopener,noreferrer');
  };

  /* -------------------------------------------------------
     UI
  ------------------------------------------------------- */

  return (
      <Card className="p-5 hover:shadow-md hover:border-blue-200 transition-all">

        <div className="flex items-start justify-between gap-4">

          <div className="flex items-start gap-3 flex-1 min-w-0">

            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>

            <div className="min-w-0 flex-1">

              <div className="flex items-center gap-2 flex-wrap">

                <h3 className="font-semibold text-slate-900 text-sm">
                  {job.title}
                </h3>

                <Badge variant="info">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Public Job
                </Badge>

              </div>

              <p className="text-xs text-slate-500 mt-0.5">
                {job.company}
              </p>

              {job.sourceName && (
                  <p className="text-xs text-slate-400 mt-1">
                    Found on {job.sourceName}
                  </p>
              )}

            </div>
          </div>

          <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              title={
                saved
                    ? 'Remove saved job'
                    : 'Save job'
              }
              className={`p-2 rounded-lg transition flex-shrink-0 ${
                  saved
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              } ${
                  saving
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
              }`}
          >
            <Bookmark
                className="w-4 h-4"
                fill={
                  saved
                      ? 'currentColor'
                      : 'none'
                }
            />
          </button>

        </div>

        <div className="flex flex-wrap gap-2 mt-4 mb-3">

          {job.location && (
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <MapPin className="w-3 h-3" />
                {job.location}
              </div>
          )}

          {job.workArrangement &&
              job.workArrangement !== 'Unknown' && (
                  <Badge variant="outline">
                    {job.workArrangement}
                  </Badge>
              )}

          {job.employmentType && (
              <Badge variant="outline">
                {job.employmentType}
              </Badge>
          )}

          {job.experienceLevel && (
              <Badge variant="outline">
                {job.experienceLevel}
              </Badge>
          )}

        </div>

        {job.salary && (
            <p className="text-sm font-semibold text-emerald-700 mb-3">
              {job.salary}
            </p>
        )}

        {job.description && (
            <p className="text-sm text-slate-600 leading-6 mb-4">
              {job.description}
            </p>
        )}

        {Array.isArray(job.skills) &&
            job.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">

                  {job.skills
                      .slice(0, 8)
                      .map(
                          (skill, index) => (
                              <span
                                  key={`${skill}-${index}`}
                                  className="px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded"
                              >
                    {skill}
                  </span>
                          )
                      )}

                </div>
            )}

        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">

        <span className="flex items-center gap-1 text-xs text-slate-400">

          <Clock className="w-3 h-3" />

          {job.postedAt
              ? new Date(
                  job.postedAt
              ).toLocaleDateString()
              : 'Date not available'}

        </span>

          <button
              type="button"
              onClick={handleApply}
              disabled={!hasUrl}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-[#1E3A8A] text-white rounded-lg hover:bg-blue-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Apply Externally

            <ExternalLink className="w-3 h-3" />
          </button>

        </div>
      </Card>
  );
}

/* =========================================================
   FIND JOBS PAGE
========================================================= */

export default function FindJobs() {

  /* -------------------------------------------------------
     CareerFlow search
  ------------------------------------------------------- */

  const [query, setQuery] =
      useState('');

  const [location, setLocation] =
      useState('');

  const [workType, setWorkType] =
      useState('All');

  const [empType, setEmpType] =
      useState('All');

  const [showFilters, setShowFilters] =
      useState(false);

  const [jobs, setJobs] =
      useState<Job[]>([]);

  const [loading, setLoading] =
      useState(true);

  const [error, setError] =
      useState('');

  /* -------------------------------------------------------
     Tabs
  ------------------------------------------------------- */

  const [activeTab, setActiveTab] =
      useState<
          'ai' | 'careerflow'
      >('ai');

  /* -------------------------------------------------------
     Public job search
  ------------------------------------------------------- */

  const [aiQuery, setAiQuery] =
      useState('');

  const [aiLocation, setAiLocation] =
      useState('');

  const [aiJobs, setAiJobs] =
      useState<ExternalJob[]>([]);

  const [aiLoading, setAiLoading] =
      useState(false);

  const [aiError, setAiError] =
      useState('');

  const [aiSearched, setAiSearched] =
      useState(false);

  /* =======================================================
     PUBLIC JOB SEARCH
  ======================================================= */

  const handleAISearch = async () => {

    if (!aiQuery.trim()) {
      setAiError(
          'Please enter a job title, skill, or keyword.'
      );

      return;
    }

    setAiLoading(true);

    setAiError('');

    setAiSearched(true);

    setAiJobs([]);

    try {
      const response =
          await aiJobsApi.search({
            query:
                aiQuery.trim(),

            location:
                aiLocation.trim(),
          });

      setAiJobs(
          response.jobs || []
      );
    } catch (err) {

      console.error(
          'Public Job Search failed:',
          err
      );

      setAiJobs([]);

      setAiError(
          'Unable to search for jobs right now. Please try again.'
      );
    } finally {
      setAiLoading(false);
    }
  };

  /* =======================================================
     CAREERFLOW JOB SEARCH
  ======================================================= */

  useEffect(() => {

    const loadJobs = async () => {

      try {
        setLoading(true);

        setError('');

        const result =
            await jobsApi.search({
              query,
              location,
              workArrangement:
              workType,
              employmentType:
              empType,
            });

        setJobs(
            result.jobs
        );

      } catch (err) {

        console.error(
            'Failed to load jobs:',
            err
        );

        setError(
            'Unable to load jobs right now.'
        );

      } finally {
        setLoading(false);
      }
    };

    loadJobs();

  }, [
    query,
    location,
    workType,
    empType,
  ]);

  /* =======================================================
     PAGE
  ======================================================= */

  return (
       <PublicLayout>

        <div className="p-6 lg:p-8 max-w-5xl mx-auto">

          {/* =================================================
            HEADER
        ================================================= */}

          <div className="mb-6">

            <h1 className="text-xl font-bold text-slate-900 mb-1">
              Find Jobs
            </h1>

            <p className="text-sm text-slate-500">
              Search public job listings from external
              job sources or apply directly to
              opportunities posted by JobiHub
              employers.
            </p>

          </div>

          {/* =================================================
            TABS
        ================================================= */}

          <div className="flex gap-2 border-b border-slate-200 mb-6">

            <button
                type="button"
                onClick={() =>
                    setActiveTab('ai')
                }
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'ai'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
            >

            <span className="inline-flex items-center gap-2">

              <Sparkles className="w-4 h-4" />

              Public Job Search

            </span>

            </button>

            <button
                type="button"
                onClick={() =>
                    setActiveTab(
                        'careerflow'
                    )
                }
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'careerflow'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
            >

            <span className="inline-flex items-center gap-2">

              <Building2 className="w-4 h-4" />

              JobiHub Jobs

            </span>

            </button>

          </div>

          {/* =================================================
            PUBLIC JOB SEARCH
        ================================================= */}

          {activeTab === 'ai' && (

              <div className="space-y-6">

                <Card className="p-6">

                  <div className="flex items-start gap-3 mb-5">

                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">

                      <Sparkles className="w-5 h-5 text-blue-600" />

                    </div>

                    <div>

                      <h2 className="text-lg font-semibold text-slate-900">
                        Search public job listings
                      </h2>

                      <p className="text-sm text-slate-500 mt-1">
                        Search public job listings from
                        external job sources and apply
                        directly on the original vacancy.
                      </p>

                    </div>

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3">

                    {/* Job search */}

                    <div className="relative">

                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                      <input
                          type="text"
                          value={aiQuery}
                          onChange={e =>
                              setAiQuery(
                                  e.target.value
                              )
                          }
                          onKeyDown={e => {

                            if (
                                e.key ===
                                'Enter'
                            ) {
                              handleAISearch();
                            }

                          }}
                          placeholder="Job title, skill, or keyword"
                          className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />

                    </div>

                    {/* Location */}

                    <div className="relative">

                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                      <input
                          type="text"
                          value={aiLocation}
                          onChange={e =>
                              setAiLocation(
                                  e.target.value
                              )
                          }
                          onKeyDown={e => {

                            if (
                                e.key ===
                                'Enter'
                            ) {
                              handleAISearch();
                            }

                          }}
                          placeholder="Location e.g. Lagos or Remote"
                          className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />

                    </div>

                    {/* Search button */}

                    <button
                        type="button"
                        onClick={
                          handleAISearch
                        }
                        disabled={
                          aiLoading
                        }
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium bg-[#1E3A8A] text-white rounded-lg hover:bg-blue-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >

                      <Sparkles className="w-4 h-4" />

                      {aiLoading
                          ? 'Searching...'
                          : 'Search Jobs'}

                    </button>

                  </div>

                  {aiError && (

                      <p className="text-sm text-red-600 mt-3">
                        {aiError}
                      </p>

                  )}

                </Card>

                {/* Loading */}

                {aiLoading && (

                    <Card className="p-10 text-center">

                      <Sparkles className="w-7 h-7 mx-auto mb-3 text-blue-600 animate-pulse" />

                      <p className="text-sm font-medium text-slate-700">
                        Searching public job sources...
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        This may take a few seconds.
                      </p>

                    </Card>

                )}

                {/* No results */}

                {!aiLoading &&
                    aiSearched &&
                    aiJobs.length === 0 &&
                    !aiError && (

                        <Card className="p-10 text-center">

                          <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />

                          <p className="text-sm font-medium text-slate-600">
                            No matching jobs found
                          </p>

                          <p className="text-xs text-slate-400 mt-1">
                            Try a different job title,
                            skill, or location.
                          </p>

                        </Card>

                    )}

                {/* Results */}

                {!aiLoading &&
                    aiJobs.length > 0 && (

                        <div className="space-y-3">

                          <div className="flex items-center justify-between mb-3">

                            <div>

                              <p className="text-sm font-medium text-slate-700">
                                Public Job Search Results
                              </p>

                              <p className="text-xs text-slate-400 mt-0.5">
                                {aiJobs.length}{' '}
                                {aiJobs.length === 1
                                    ? 'vacancy'
                                    : 'vacancies'}{' '}
                                found from public job
                                sources.
                              </p>

                            </div>

                          </div>

                          {aiJobs.map(
                              (
                                  job,
                                  index
                              ) => (

                                  <AIJobCard
                                      key={`${job.company}-${job.title}-${job.externalUrl}-${index}`}
                                      job={job}
                                  />

                              )
                          )}

                        </div>

                    )}

                {/* Initial state */}

                {!aiLoading &&
                    !aiSearched &&
                    aiJobs.length === 0 && (

                        <Card className="p-10 text-center">

                          <Sparkles className="w-10 h-10 text-blue-200 mx-auto mb-3" />

                          <p className="text-sm font-medium text-slate-600">
                            Search for your next opportunity
                          </p>

                          <p className="text-xs text-slate-400 mt-1">
                            Enter a job title or skill above
                            to search public vacancies.
                          </p>

                        </Card>

                    )}

              </div>
          )}

          {/* =================================================
            CAREERFLOW JOBS
        ================================================= */}

          {activeTab ===
              'careerflow' && (

                  <div>

                    {/* Search bar */}

                    <div className="flex flex-col sm:flex-row gap-3 mb-4">

                      <div className="relative flex-1">

                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                        <input
                            value={query}
                            onChange={e =>
                                setQuery(
                                    e.target.value
                                )
                            }
                            placeholder="Job title, keywords, or company..."
                            className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                      </div>

                      <div className="relative sm:w-56">

                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                        <input
                            value={location}
                            onChange={e =>
                                setLocation(
                                    e.target.value
                                )
                            }
                            placeholder="Location..."
                            className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                      </div>

                      <button
                          type="button"
                          onClick={() =>
                              setShowFilters(
                                  v => !v
                              )
                          }
                          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border rounded-lg transition ${
                              showFilters
                                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                                  : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                          }`}
                      >

                        <SlidersHorizontal className="w-4 h-4" />

                        Filters

                      </button>

                    </div>

                    {/* Filters */}

                    {showFilters && (

                        <Card className="p-4 mb-4">

                          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">

                            <div>

                              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                                Work Type
                              </label>

                              <div className="flex flex-wrap gap-1.5">

                                {WORK_TYPES.map(
                                    type => (

                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() =>
                                                setWorkType(
                                                    type
                                                )
                                            }
                                            className={`px-2.5 py-1 text-xs rounded-full transition ${
                                                workType ===
                                                type
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                        >
                                          {type}
                                        </button>

                                    )
                                )}

                              </div>

                            </div>

                            <div>

                              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                                Employment
                              </label>

                              <div className="flex flex-wrap gap-1.5">

                                {EMP_TYPES.map(
                                    type => (

                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() =>
                                                setEmpType(
                                                    type
                                                )
                                            }
                                            className={`px-2.5 py-1 text-xs rounded-full transition ${
                                                empType ===
                                                type
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                        >
                                          {type}
                                        </button>

                                    )
                                )}

                              </div>

                            </div>

                          </div>

                        </Card>

                    )}

                    {/* Result count */}

                    <div className="flex items-center justify-between mb-3">

                      <p className="text-sm text-slate-500">

                        {jobs.length}{' '}

                        {jobs.length === 1
                            ? 'job'
                            : 'jobs'}{' '}

                        found

                      </p>

                      <select
                          className="text-xs text-slate-600 border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >

                        <option>
                          Most Recent
                        </option>

                        <option>
                          Relevance
                        </option>

                        <option>
                          Salary
                        </option>

                      </select>

                    </div>

                    {/* CareerFlow results */}

                    <div className="space-y-3">

                      {loading ? (

                          <Card className="p-10 text-center">

                            <p className="text-sm text-slate-500">
                              Loading JobiHub jobs...
                            </p>

                          </Card>

                      ) : error ? (

                          <Card className="p-10 text-center">

                            <p className="text-sm font-medium text-red-600">
                              {error}
                            </p>

                            <p className="text-xs text-slate-400 mt-1">
                              Please try again.
                            </p>

                          </Card>

                      ) : jobs.length === 0 ? (

                          <Card className="p-10 text-center">

                            <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />

                            <p className="text-sm font-medium text-slate-600">
                              No JobiHub jobs match your search
                            </p>

                            <p className="text-xs text-slate-400 mt-1">
                              Try adjusting your filters or
                              search terms.
                            </p>

                          </Card>

                      ) : (

                          jobs.map(job => (

                              <JobCard
                                  key={job.id}
                                  job={job}
                              />

                          ))

                      )}

                    </div>

                  </div>
              )}

        </div>

      </PublicLayout>
  );
}