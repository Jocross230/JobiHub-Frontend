import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Briefcase,
    Calendar,
    CheckCircle,
    Mail,
    MapPin,
    Phone,
    Users,
    AlertCircle,
    FileText,
    Trash2,
} from 'lucide-react';


import AppLayout from '../../components/layout/AppLayout';
import { Card, Spinner } from '../../components/ui';
import {
    businessApi,
    type BusinessApplicant,
} from '../../api/businessApi';

export default function Applicants() {
    const navigate = useNavigate();

    const [applicants, setApplicants] = useState<BusinessApplicant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadApplicants();
    }, []);

    const loadApplicants = async () => {
        try {
            setLoading(true);
            setError('');

            const data = await businessApi.getApplicants();

            setApplicants(data);
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                err?.message ||
                'Failed to load applicants.'
            );
        } finally {
            setLoading(false);
        }
    };
    const handleDeleteApplicant = async (applicationId: number) => {
        const confirmed = window.confirm(
            'Are you sure you want to remove this applicant? This action cannot be undone.'
        );

        if (!confirmed) {
            return;
        }

        try {
            setError('');

            await businessApi.deleteApplicant(
                applicationId.toString()
            );

            setApplicants((current) =>
                current.filter(
                    (application) => application.id !== applicationId
                )
            );
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                err?.message ||
                'Failed to remove applicant.'
            );
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
                    onClick={() => navigate('/business')}
                    className="mb-6 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
                >
                    <ArrowLeft size={18} />
                    Back to Dashboard
                </button>

                <div className="mb-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50">
                            <Users size={23} className="text-blue-700" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">
                                Applicants
                            </h1>

                            <p className="mt-1 text-sm text-slate-500">
                                Review candidates who have applied to your jobs.
                            </p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        <AlertCircle size={18} className="mt-0.5 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {!error && applicants.length === 0 && (
                    <Card className="p-10 text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                            <Users size={26} className="text-slate-500" />
                        </div>

                        <h2 className="text-lg font-semibold text-slate-900">
                            No applicants yet
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            Applicants will appear here when candidates apply to your jobs.
                        </p>

                        <button
                            onClick={() => navigate('/business/jobs')}
                            className="mt-6 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
                        >
                            View My Job Listings
                        </button>
                    </Card>
                )}

                {applicants.length > 0 && (
                    <div className="mb-5 flex items-center justify-between">
                        <p className="text-sm text-slate-500">
                            {applicants.length}{' '}
                            {applicants.length === 1 ? 'applicant' : 'applicants'}
                        </p>
                    </div>
                )}

                {applicants.length > 0 && (
                    <div className="space-y-5">
                        {applicants.map((application) => (
                            <Card key={application.id} className="p-6">
                                <div className="flex flex-col gap-6">
                                    {/* Candidate header */}
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1E3A8A] text-lg font-semibold text-white">
                                                {application.applicant?.fullName
                                                    ?.charAt(0)
                                                    .toUpperCase() || '?'}
                                            </div>

                                            <div>
                                                <h2 className="text-lg font-semibold text-slate-900">
                                                    {application.applicant?.fullName ||
                                                        'Unknown Applicant'}
                                                </h2>

                                                {application.applicant?.professionalTitle && (
                                                    <p className="mt-1 text-sm text-slate-500">
                                                        {application.applicant.professionalTitle}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <select
                                            value={application.status}
                                            onChange={async (event) => {
                                                const newStatus = event.target.value;

                                                try {
                                                    setError('');

                                                    await businessApi.updateApplicantStatus(
                                                        application.id.toString(),
                                                        newStatus
                                                    );

                                                    setApplicants((current) =>
                                                        current.map((item) =>
                                                            item.id === application.id
                                                                ? {
                                                                    ...item,
                                                                    status: newStatus,
                                                                }
                                                                : item
                                                        )
                                                    );
                                                } catch (err: any) {
                                                    setError(
                                                        err?.response?.data?.message ||
                                                        err?.message ||
                                                        'Failed to update applicant status.'
                                                    );
                                                }
                                            }}
                                            className={`rounded-full border px-3 py-1.5 text-xs font-medium capitalize outline-none ${getStatusClasses(
                                                application.status
                                            )}`}
                                        >
                                            <option value="submitted">Submitted</option>
                                            <option value="reviewing">Reviewing</option>
                                            <option value="shortlisted">Shortlisted</option>
                                            <option value="rejected">Rejected</option>
                                            <option value="hired">Hired</option>
                                        </select>
                                    </div>

                                    {/* Application details */}
                                    <div className="grid gap-4 border-t border-slate-100 pt-5 md:grid-cols-2">
                                        <div>
                                            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                                                Applied for
                                            </p>

                                            <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                                                <Briefcase size={16} className="text-slate-400" />
                                                {application.job?.title || 'Job'}
                                            </div>
                                        </div>

                                        <div>
                                            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                                                Applied
                                            </p>

                                            <div className="flex items-center gap-2 text-sm text-slate-700">
                                                <Calendar size={16} className="text-slate-400" />
                                                {formatDate(application.appliedAt)}
                                            </div>
                                        </div>

                                        {application.applicant?.email && (
                                            <div>
                                                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                                                    Email
                                                </p>

                                                <div className="flex items-center gap-2 text-sm text-slate-700">
                                                    <Mail size={16} className="text-slate-400" />
                                                    {application.applicant.email}
                                                </div>
                                            </div>
                                        )}

                                        {application.applicant?.phone && (
                                            <div>
                                                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                                                    Phone
                                                </p>

                                                <div className="flex items-center gap-2 text-sm text-slate-700">
                                                    <Phone size={16} className="text-slate-400" />
                                                    {application.applicant.phone}
                                                </div>
                                            </div>
                                        )}

                                        {application.applicant?.location && (
                                            <div>
                                                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                                                    Location
                                                </p>

                                                <div className="flex items-center gap-2 text-sm text-slate-700">
                                                    <MapPin size={16} className="text-slate-400" />
                                                    {application.applicant.location}
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                                                CV submitted
                                            </p>

                                            <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                                                <FileText size={16} className="text-slate-400" />
                                                {application.cv?.fullName || 'CV'}
                                            </div>

                                            {application.cv?.professionalTitle && (
                                                <p className="ml-6 mt-1 text-xs text-slate-500">
                                                    {application.cv.professionalTitle}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                                        <button
                                            onClick={() =>
                                                navigate(`/business/applicants/${application.id}`)
                                            }
                                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1E3A8A] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#172F70]"
                                        >
                                            <FileText size={17} />
                                            View Submitted CV
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleDeleteApplicant(application.id)
                                            }
                                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                                        >
                                            <Trash2 size={17} />
                                            Remove Applicant
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