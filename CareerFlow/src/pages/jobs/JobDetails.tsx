import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Briefcase,
    MapPin,
    Clock,
    Calendar,
    Bookmark,
    CheckCircle,
    FileText,
} from 'lucide-react';

import AppLayout from '../../components/layout/AppLayout';
import { Card, Spinner } from '../../components/ui';
import { jobsApi } from '../../api/jobsApi';
import { cvApi, type Cv } from '../../api/cvApi';
import { paymentsApi } from '../../api/paymentsApi';

export default function JobDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [job, setJob] = useState<any>(null);

    const [cvs, setCvs] = useState<Cv[]>([]);
    const [selectedCvId, setSelectedCvId] = useState('');

    const [loading, setLoading] = useState(true);
    const [loadingCvs, setLoadingCvs] = useState(false);
    const [applying, setApplying] = useState(false);

    const [showApplyPanel, setShowApplyPanel] = useState(false);

    const [applied, setApplied] = useState(false);

    const [error, setError] = useState('');
    const [applyError, setApplyError] = useState('');

    // ============================================================
    // LOAD JOB
    // ============================================================

    useEffect(() => {
        const loadJob = async () => {
            if (!id) {
                setError('Job ID is missing.');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError('');

                const data = await jobsApi.getById(id);

                setJob(data);
            } catch (err: any) {
                setError(
                    err?.response?.data?.message ||
                    err?.message ||
                    'Failed to load job details.'
                );
            } finally {
                setLoading(false);
            }
        };

        loadJob();
    }, [id]);

    // ============================================================
    // LOAD USER CVs
    // ============================================================

    const openApplyPanel = async () => {
        try {
            setShowApplyPanel(true);
            setApplyError('');
            setLoadingCvs(true);

            const data = await cvApi.myCvs();

            setCvs(data);

            if (data.length > 0) {
                setSelectedCvId(data[0].id);
            }
        } catch (err: any) {
            setApplyError(
                err?.response?.data?.message ||
                err?.message ||
                'Unable to load your CVs.'
            );
        } finally {
            setLoadingCvs(false);
        }
    };

    // ============================================================
    // SUBMIT APPLICATION
    // ============================================================

    const handleApply = async () => {
        if (!id) {
            return;
        }

        if (!selectedCvId) {
            setApplyError('Please select a CV before applying.');
            return;
        }

        try {
            setApplying(true);
            setApplyError('');

            // --------------------------------------------------------
            // Check Job Ready before submitting application
            // --------------------------------------------------------

            const payment =
                await paymentsApi.status('JobReady');

            if (payment.approved !== true) {
                window.location.href =
                    '/payment-verification?product=JobReady&amount=2500';
                return;
            }

            // --------------------------------------------------------
            // Submit application
            // --------------------------------------------------------

            await jobsApi.apply(id, selectedCvId);

            setApplied(true);
            setShowApplyPanel(false);
        } catch (err: any) {
            console.error('APPLICATION ERROR:', err);

            if (err?.status === 403) {
                setApplyError(
                    'An active JobiHub Job Ready subscription is required to apply for this job.'
                );
                return;
            }

            setApplyError(
                err?.response?.data?.message ||
                err?.message ||
                'Failed to submit your application.'
            );
        } finally {
            setApplying(false);
        }
    };

    // ============================================================
    // DATE
    // ============================================================

    const formatDate = (date?: string) => {
        if (!date) {
            return '';
        }

        return new Date(date).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {
        return (
            <AppLayout>
                <div className="flex justify-center py-20">
                    <Spinner size="lg" />
                </div>
            </AppLayout>
        );
    }

    // ============================================================
    // ERROR
    // ============================================================

    if (error) {
        return (
            <AppLayout>
                <div className="p-6 lg:p-8 max-w-5xl mx-auto">

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Jobs
                    </button>

                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>

                </div>
            </AppLayout>
        );
    }

    if (!job) {
        return (
            <AppLayout>
                <div className="p-6 lg:p-8 max-w-5xl mx-auto">
                    <p className="text-sm text-slate-500">
                        Job not found.
                    </p>
                </div>
            </AppLayout>
        );
    }

    // ============================================================
    // NORMALIZE SKILLS
    // ============================================================

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

    // ============================================================
    // PAGE
    // ============================================================

    return (
        <AppLayout>

            <div className="p-6 lg:p-8 max-w-5xl mx-auto">

                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Jobs
                </button>

                <Card className="p-6 lg:p-8">

                    {/* ================================================== */}
                    {/* HEADER */}
                    {/* ================================================== */}

                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

                        <div>

                            <div className="flex items-start gap-4">

                                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                    <Briefcase className="w-6 h-6 text-blue-700" />
                                </div>

                                <div>

                                    <h1 className="text-2xl font-bold text-slate-900">
                                        {job.title}
                                    </h1>

                                    {job.company && (
                                        <p className="mt-1 text-sm font-medium text-slate-600">
                                            {job.company}
                                        </p>
                                    )}

                                </div>

                            </div>

                            <div className="flex flex-wrap gap-x-5 gap-y-2 mt-5 text-sm text-slate-500">

                                {job.location && (
                                    <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                                        {job.location}
                  </span>
                                )}

                                {job.workArrangement && (
                                    <span>{job.workArrangement}</span>
                                )}

                                {job.employmentType && (
                                    <span>{job.employmentType}</span>
                                )}

                                {job.experienceLevel && (
                                    <span>{job.experienceLevel}</span>
                                )}

                            </div>

                        </div>

                        {/* ================================================= */}
                        {/* ACTIONS */}
                        {/* ================================================= */}

                        <div className="flex gap-3 shrink-0">

                            <button
                                type="button"
                                className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 transition"
                            >
                                <Bookmark className="w-4 h-4" />
                                Save Job
                            </button>

                            <button
                                type="button"
                                onClick={async () => {
                                    try {
                                        const payment =
                                            await paymentsApi.status('JobReady');

                                        if (payment.approved === true) {
                                            await openApplyPanel();
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
                                disabled={applied}
                                className={`flex items-center gap-2 px-5 py-2.5 text-white text-sm font-semibold rounded-lg transition ${
                                    applied
                                        ? 'bg-emerald-600 cursor-default'
                                        : 'bg-[#1E3A8A] hover:bg-blue-900'
                                }`}
                            >

                                {applied ? (
                                    <>
                                        <CheckCircle className="w-4 h-4" />
                                        Applied
                                    </>
                                ) : (
                                    'Apply on JobiHub'
                                )}

                            </button>

                        </div>

                    </div>

                    {/* ================================================== */}
                    {/* SUCCESS MESSAGE */}
                    {/* ================================================== */}

                    {applied && (
                        <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                            Your application has been submitted successfully.
                        </div>
                    )}

                    {/* ================================================== */}
                    {/* APPLY PANEL */}
                    {/* ================================================== */}

                    {showApplyPanel && !applied && (
                        <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50/50 p-5">

                            <div className="flex items-start gap-3 mb-5">

                                <div className="w-10 h-10 rounded-lg bg-white border border-blue-100 flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-blue-700" />
                                </div>

                                <div>
                                    <h2 className="font-semibold text-slate-900">
                                        Choose a CV to submit
                                    </h2>

                                    <p className="text-xs text-slate-500 mt-1">
                                        The employer will receive the CV you select below.
                                    </p>
                                </div>

                            </div>

                            {loadingCvs ? (
                                <div className="flex justify-center py-6">
                                    <Spinner />
                                </div>
                            ) : cvs.length === 0 ? (

                                <div className="rounded-lg border border-slate-200 bg-white p-5">

                                    <p className="text-sm font-medium text-slate-700">
                                        You don't have any CVs yet.
                                    </p>

                                    <p className="text-xs text-slate-500 mt-1">
                                        Create a CV before applying for this job.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => navigate('/cv-builder')}
                                        className="mt-4 px-4 py-2 bg-[#1E3A8A] text-white text-sm font-semibold rounded-lg hover:bg-blue-900"
                                    >
                                        Create CV
                                    </button>

                                </div>

                            ) : (

                                <div className="space-y-3">

                                    {cvs.map(cv => (

                                        <label
                                            key={cv.id}
                                            className={`flex items-center gap-4 p-4 bg-white rounded-lg border cursor-pointer transition ${
                                                selectedCvId === cv.id
                                                    ? 'border-blue-500 ring-2 ring-blue-100'
                                                    : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                        >

                                            <input
                                                type="radio"
                                                name="applicationCv"
                                                value={cv.id}
                                                checked={selectedCvId === cv.id}
                                                onChange={() => setSelectedCvId(cv.id)}
                                                className="w-4 h-4 text-blue-600"
                                            />

                                            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                                                <FileText className="w-4 h-4 text-slate-500" />
                                            </div>

                                            <div className="flex-1">

                                                <p className="text-sm font-semibold text-slate-900">
                                                    {cv.fullName || 'Untitled CV'}
                                                </p>

                                                <p className="text-xs text-slate-500 mt-0.5">
                                                    {cv.professionalTitle || 'Professional CV'}
                                                </p>

                                            </div>

                                        </label>

                                    ))}

                                    {applyError && (
                                        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                            {applyError}
                                        </div>
                                    )}

                                    <div className="flex justify-end gap-3 pt-2">

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowApplyPanel(false);
                                                setApplyError('');
                                            }}
                                            className="px-4 py-2.5 border border-slate-200 bg-white text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleApply}
                                            disabled={applying || !selectedCvId}
                                            className="px-5 py-2.5 bg-[#1E3A8A] text-white text-sm font-semibold rounded-lg hover:bg-blue-900 disabled:opacity-60 disabled:cursor-not-allowed"
                                        >
                                            {applying ? 'Submitting...' : 'Submit Application'}
                                        </button>

                                    </div>

                                </div>
                            )}

                        </div>
                    )}

                    {/* ================================================== */}
                    {/* META */}
                    {/* ================================================== */}

                    <div className="flex flex-wrap gap-4 mt-6 pt-5 border-t border-slate-100 text-sm text-slate-500">

                        {job.postedAt && (
                            <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                Posted {formatDate(job.postedAt)}
              </span>
                        )}

                        {job.closingDate && (
                            <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                Closes {formatDate(job.closingDate)}
              </span>
                        )}

                        {job.salary && (
                            <span>
                {job.salary}
              </span>
                        )}

                    </div>

                    {/* ================================================== */}
                    {/* SKILLS */}
                    {/* ================================================== */}

                    {jobSkills.length > 0 && (
                        <div className="mt-8">

                            <h2 className="text-base font-semibold text-slate-900">
                                Skills
                            </h2>

                            <div className="flex flex-wrap gap-2 mt-3">

                                {jobSkills.map((skill, index) => (
                                    <span
                                        key={`${skill}-${index}`}
                                        className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs rounded-full font-medium"
                                    >
                    {skill}
                  </span>
                                ))}

                            </div>

                        </div>
                    )}

                    {/* ================================================== */}
                    {/* DESCRIPTION */}
                    {/* ================================================== */}

                    <div className="mt-8">

                        <h2 className="text-base font-semibold text-slate-900">
                            Job Description
                        </h2>

                        <p className="mt-3 text-sm leading-7 text-slate-600 whitespace-pre-line">
                            {job.description}
                        </p>

                    </div>

                    {job.responsibilities && (
                        <div className="mt-8">

                            <h2 className="text-base font-semibold text-slate-900">
                                Responsibilities
                            </h2>

                            <p className="mt-3 text-sm leading-7 text-slate-600 whitespace-pre-line">
                                {job.responsibilities}
                            </p>

                        </div>
                    )}

                    {job.requirements && (
                        <div className="mt-8">

                            <h2 className="text-base font-semibold text-slate-900">
                                Requirements
                            </h2>

                            <p className="mt-3 text-sm leading-7 text-slate-600 whitespace-pre-line">
                                {job.requirements}
                            </p>

                        </div>
                    )}

                </Card>

            </div>

        </AppLayout>
    );
}