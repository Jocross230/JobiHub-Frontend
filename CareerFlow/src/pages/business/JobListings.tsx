import { useEffect, useState } from 'react';
import { Briefcase, MapPin, Clock, Eye, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import { Card, Spinner } from '../../components/ui';
import { businessApi, BusinessJob } from '../../api/businessApi';

export default function JobListings() {
    const navigate = useNavigate();

    const [jobs, setJobs] = useState<BusinessJob[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadJobs();
    }, []);

    const loadJobs = async () => {
        try {
            setLoading(true);
            setError('');

            const data = await businessApi.getMyJobs();

            setJobs(data);
        } catch (error: any) {
            setError(
                error?.response?.data?.message ||
                error?.message ||
                'Failed to load your job listings.'
            );
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date: string) => {
        if (!date) {
            return '';
        }

        return new Date(date).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <AppLayout>
            <div className="p-6 lg:p-8 max-w-6xl mx-auto">

                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">
                            My Job Listings
                        </h1>

                        <p className="text-sm text-slate-500 mt-0.5">
                            Manage the jobs your company has posted.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate('/business/post-job')}
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#1E3A8A] text-white text-sm font-semibold rounded-lg hover:bg-blue-900 transition"
                    >
                        <Plus className="w-4 h-4" />
                        Post a Job
                    </button>
                </div>

                {error && (
                    <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center py-16">
                        <Spinner size="lg" />
                    </div>
                ) : jobs.length === 0 ? (
                    <Card className="p-10 text-center">
                        <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />

                        <h2 className="mt-4 text-base font-semibold text-slate-900">
                            No job listings yet
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Create your first job listing to start attracting candidates.
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate('/business/post-job')}
                            className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 bg-[#1E3A8A] text-white text-sm font-semibold rounded-lg hover:bg-blue-900 transition"
                        >
                            <Plus className="w-4 h-4" />
                            Post a Job
                        </button>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {jobs.map(job => (
                            <Card
                                key={job.id}
                                className="p-5"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">

                                    <div className="min-w-0">

                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                                <Briefcase className="w-5 h-5 text-blue-700" />
                                            </div>

                                            <div>
                                                <h2 className="text-base font-semibold text-slate-900">
                                                    {job.title}
                                                </h2>

                                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-500">

                                                    {job.location && (
                                                        <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                                                            {job.location}
                            </span>
                                                    )}

                                                    {job.workArrangement && (
                                                        <span>
                              {job.workArrangement}
                            </span>
                                                    )}

                                                    {job.employmentType && (
                                                        <span>
                              {job.employmentType}
                            </span>
                                                    )}

                                                    {job.experienceLevel && (
                                                        <span>
                              {job.experienceLevel}
                            </span>
                                                    )}

                                                </div>
                                            </div>
                                        </div>

                                        <p className="mt-4 text-sm text-slate-600 line-clamp-3">
                                            {job.description}
                                        </p>

                                        {(() => {
                                            let jobSkills: string[] = [];

                                            if (Array.isArray(job.skills)) {
                                                jobSkills = job.skills;
                                            } else if (typeof job.skills === 'string') {
                                                try {
                                                    const parsed = JSON.parse(job.skills);

                                                    if (Array.isArray(parsed)) {
                                                        jobSkills = parsed;
                                                    }
                                                } catch {
                                                    jobSkills = [];
                                                }
                                            }

                                            return jobSkills.length > 0 ? (
                                                <div className="flex flex-wrap gap-2 mt-4">
                                                    {jobSkills.map((skill, index) => (
                                                        <span
                                                            key={`${skill}-${index}`}
                                                            className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium"
                                                        >
                    {skill}
                </span>
                                                    ))}
                                                </div>
                                            ) : null;
                                        })()}

                                        <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-slate-500">

                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Posted {formatDate(job.createdAt)}
                      </span>

                                            {job.salary && (
                                                <span>
                          {job.salary}
                        </span>
                                            )}

                                        </div>

                                    </div>

                                    <div className="flex items-center gap-3 shrink-0">

                    <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            job.status === 'published'
                                ? 'bg-green-50 text-green-700'
                                : job.status === 'closed'
                                    ? 'bg-slate-100 text-slate-600'
                                    : 'bg-amber-50 text-amber-700'
                        }`}
                    >
                      {job.status.charAt(0).toUpperCase() +
                          job.status.slice(1)}
                    </span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                alert('Job details and editing will be added next.')
                                            }
                                            className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50 transition"
                                        >
                                            <Eye className="w-4 h-4" />
                                            View
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