import { useEffect, useState } from 'react';
import {
    Briefcase,
    Building2,
    Calendar,
    ChevronRight,
    Clock,
    RefreshCw,
    Users,
    X,
} from 'lucide-react';

import AppLayout from '../../components/layout/AppLayout';
import { Card, Spinner } from '../../components/ui';

import {
    adminRecruitmentApi,
    AdminRecruitmentRequest,
} from '../../api/adminRecruitmentApi';

const STATUS_OPTIONS = [
    'Pending',
    'Under Review',
    'In Progress',
    'Candidates Sourced',
    'Interview Stage',
    'Filled',
    'Completed',
    'Declined',
];

const getStatusClass = (status: string) => {
    switch (status) {
        case 'Pending':
            return 'bg-amber-100 text-amber-700';

        case 'Under Review':
            return 'bg-blue-100 text-blue-700';

        case 'In Progress':
            return 'bg-indigo-100 text-indigo-700';

        case 'Candidates Sourced':
            return 'bg-purple-100 text-purple-700';

        case 'Interview Stage':
            return 'bg-cyan-100 text-cyan-700';

        case 'Filled':
            return 'bg-emerald-100 text-emerald-700';

        case 'Completed':
            return 'bg-green-100 text-green-700';

        case 'Declined':
            return 'bg-red-100 text-red-700';

        default:
            return 'bg-slate-100 text-slate-700';
    }
};

const getUrgencyClass = (urgency: string) => {
    switch (urgency) {
        case 'High':
            return 'text-red-600';

        case 'Medium':
            return 'text-amber-600';

        case 'Low':
            return 'text-emerald-600';

        default:
            return 'text-slate-600';
    }
};

export default function RecruitmentActivity() {
    const [requests, setRequests] = useState<
        AdminRecruitmentRequest[]
    >([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState('');

    const [selectedRequest, setSelectedRequest] =
        useState<AdminRecruitmentRequest | null>(null);

    const [loadingDetails, setLoadingDetails] =
        useState(false);

    const [updatingStatus, setUpdatingStatus] =
        useState<number | null>(null);

    const [notes, setNotes] = useState('');

    const [savingNotes, setSavingNotes] =
        useState(false);

    const loadRequests = async () => {
        try {
            setLoading(true);
            setError('');

            const data =
                await adminRecruitmentApi.getAll();

            setRequests(data);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to load recruitment requests.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRequests();
    }, []);

    const openRequest = async (id: number) => {
        try {
            setLoadingDetails(true);

            const request =
                await adminRecruitmentApi.getById(id);

            setSelectedRequest(request);
            setNotes(request.adminNotes || '');
        } catch (err) {
            alert(
                err instanceof Error
                    ? err.message
                    : 'Failed to load recruitment request.'
            );
        } finally {
            setLoadingDetails(false);
        }
    };

    const handleStatusChange = async (
        id: number,
        status: string
    ) => {
        try {
            setUpdatingStatus(id);

            await adminRecruitmentApi.updateStatus(
                id,
                status
            );

            setRequests((previous) =>
                previous.map((request) =>
                    request.id === id
                        ? {
                            ...request,
                            status,
                            updatedAt:
                                new Date().toISOString(),
                        }
                        : request
                )
            );

            if (
                selectedRequest &&
                selectedRequest.id === id
            ) {
                setSelectedRequest({
                    ...selectedRequest,
                    status,
                    updatedAt:
                        new Date().toISOString(),
                });
            }
        } catch (err) {
            alert(
                err instanceof Error
                    ? err.message
                    : 'Failed to update status.'
            );
        } finally {
            setUpdatingStatus(null);
        }
    };

    const handleSaveNotes = async () => {
        if (!selectedRequest) {
            return;
        }

        try {
            setSavingNotes(true);

            await adminRecruitmentApi.updateNotes(
                selectedRequest.id,
                notes
            );

            setSelectedRequest({
                ...selectedRequest,
                adminNotes: notes,
                updatedAt:
                    new Date().toISOString(),
            });

            setRequests((previous) =>
                previous.map((request) =>
                    request.id === selectedRequest.id
                        ? {
                            ...request,
                            adminNotes: notes,
                            updatedAt:
                                new Date().toISOString(),
                        }
                        : request
                )
            );

            alert('Recruitment notes saved.');
        } catch (err) {
            alert(
                err instanceof Error
                    ? err.message
                    : 'Failed to save notes.'
            );
        } finally {
            setSavingNotes(false);
        }
    };

    return (
        <AppLayout>
            <div className="p-6 lg:p-8">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            Recruitment Activity
                        </h1>

                        <p className="text-sm text-slate-500 mt-1">
                            Manage recruitment service requests
                            submitted by employers.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={loadRequests}
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                    >
                        <RefreshCw
                            size={16}
                            className={
                                loading
                                    ? 'animate-spin'
                                    : ''
                            }
                        />

                        Refresh
                    </button>

                </div>

                {loading && (
                    <div className="flex justify-center py-20">
                        <Spinner size="lg" />
                    </div>
                )}

                {!loading && error && (
                    <Card className="p-6">
                        <div className="text-center">
                            <p className="text-red-600 mb-4">
                                {error}
                            </p>

                            <button
                                type="button"
                                onClick={loadRequests}
                                className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium"
                            >
                                Try Again
                            </button>
                        </div>
                    </Card>
                )}

                {!loading &&
                    !error &&
                    requests.length === 0 && (
                        <Card className="p-10">
                            <div className="text-center">
                                <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />

                                <h2 className="font-semibold text-slate-900">
                                    No Recruitment Requests
                                </h2>

                                <p className="text-sm text-slate-500 mt-1">
                                    Employer recruitment service
                                    requests will appear here.
                                </p>
                            </div>
                        </Card>
                    )}

                {!loading &&
                    !error &&
                    requests.length > 0 && (
                        <div className="space-y-3">

                            {requests.map((request) => (
                                <Card
                                    key={request.id}
                                    className="p-5"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center gap-5">

                                        <div className="flex-1 min-w-0">

                                            <div className="flex flex-wrap items-center gap-2 mb-2">

                        <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                                request.status
                            )}`}
                        >
                          {request.status}
                        </span>

                                                <span
                                                    className={`text-xs font-semibold ${getUrgencyClass(
                                                        request.urgency
                                                    )}`}
                                                >
                          {request.urgency} urgency
                        </span>

                                            </div>

                                            <h2 className="text-lg font-semibold text-slate-900">
                                                {request.positionTitle}
                                            </h2>

                                            <div className="flex flex-wrap gap-x-5 gap-y-2 mt-2 text-sm text-slate-500">

                        <span className="inline-flex items-center gap-1.5">
                          <Building2 size={15} />
                            {request.companyName}
                        </span>

                                                <span className="inline-flex items-center gap-1.5">
                          <Users size={15} />
                                                    {request.numberOfCandidates}{' '}
                                                    candidate
                                                    {request.numberOfCandidates !== 1
                                                        ? 's'
                                                        : ''}
                        </span>

                                                <span className="inline-flex items-center gap-1.5">
                          <Briefcase size={15} />
                                                    {request.employmentType}
                        </span>

                                                <span className="inline-flex items-center gap-1.5">
                          <Calendar size={15} />
                                                    {new Date(
                                                        request.createdAt
                                                    ).toLocaleDateString()}
                        </span>

                                            </div>

                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-2 lg:w-auto">

                                            <select
                                                value={request.status}
                                                disabled={
                                                    updatingStatus ===
                                                    request.id
                                                }
                                                onChange={(e) =>
                                                    handleStatusChange(
                                                        request.id,
                                                        e.target.value
                                                    )
                                                }
                                                className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                                            >
                                                {STATUS_OPTIONS.map(
                                                    (status) => (
                                                        <option
                                                            key={status}
                                                            value={status}
                                                        >
                                                            {status}
                                                        </option>
                                                    )
                                                )}
                                            </select>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openRequest(
                                                        request.id
                                                    )
                                                }
                                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
                                            >
                                                View Request
                                                <ChevronRight size={16} />
                                            </button>

                                        </div>

                                    </div>
                                </Card>
                            ))}

                        </div>
                    )}

                {selectedRequest && (
                    <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center p-4 overflow-y-auto">

                        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl my-8">

                            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                                        Recruitment Request #
                                        {selectedRequest.id}
                                    </p>

                                    <h2 className="text-xl font-bold text-slate-900 mt-1">
                                        {selectedRequest.positionTitle}
                                    </h2>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedRequest(null)
                                    }
                                    className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
                                >
                                    <X size={20} />
                                </button>

                            </div>

                            <div className="p-6 space-y-6">

                                <div className="grid sm:grid-cols-2 gap-4">

                                    <div className="rounded-lg bg-slate-50 p-4">
                                        <p className="text-xs text-slate-500 mb-1">
                                            Company
                                        </p>

                                        <p className="font-semibold text-slate-900">
                                            {selectedRequest.companyName}
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-slate-50 p-4">
                                        <p className="text-xs text-slate-500 mb-1">
                                            Location
                                        </p>

                                        <p className="font-semibold text-slate-900">
                                            {selectedRequest.location ||
                                                'Not specified'}
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-slate-50 p-4">
                                        <p className="text-xs text-slate-500 mb-1">
                                            Candidates Required
                                        </p>

                                        <p className="font-semibold text-slate-900">
                                            {selectedRequest.numberOfCandidates}
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-slate-50 p-4">
                                        <p className="text-xs text-slate-500 mb-1">
                                            Urgency
                                        </p>

                                        <p
                                            className={`font-semibold ${getUrgencyClass(
                                                selectedRequest.urgency
                                            )}`}
                                        >
                                            {selectedRequest.urgency}
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-slate-50 p-4">
                                        <p className="text-xs text-slate-500 mb-1">
                                            Employment Type
                                        </p>

                                        <p className="font-semibold text-slate-900">
                                            {selectedRequest.employmentType}
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-slate-50 p-4">
                                        <p className="text-xs text-slate-500 mb-1">
                                            Experience Level
                                        </p>

                                        <p className="font-semibold text-slate-900">
                                            {selectedRequest.experienceLevel}
                                        </p>
                                    </div>

                                </div>

                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-2">
                                        Salary Range
                                    </h3>

                                    <p className="text-sm text-slate-600">
                                        {selectedRequest.salaryRange ||
                                            'Not specified'}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-2">
                                        Job Description
                                    </h3>

                                    <p className="text-sm text-slate-600 whitespace-pre-wrap">
                                        {selectedRequest.jobDescription ||
                                            'No description provided.'}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-2">
                                        Required Skills
                                    </h3>

                                    <p className="text-sm text-slate-600 whitespace-pre-wrap">
                                        {selectedRequest.skills ||
                                            'No specific skills provided.'}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-2">
                                        Additional Requirements
                                    </h3>

                                    <p className="text-sm text-slate-600 whitespace-pre-wrap">
                                        {selectedRequest.requirements ||
                                            'No additional requirements provided.'}
                                    </p>
                                </div>

                                {selectedRequest.additionalMessage && (
                                    <div>
                                        <h3 className="font-semibold text-slate-900 mb-2">
                                            Additional Message
                                        </h3>

                                        <p className="text-sm text-slate-600 whitespace-pre-wrap">
                                            {
                                                selectedRequest.additionalMessage
                                            }
                                        </p>
                                    </div>
                                )}

                                <div className="border-t border-slate-200 pt-5">

                                    <div className="flex items-center gap-2 mb-3">
                                        <Clock
                                            size={17}
                                            className="text-slate-500"
                                        />

                                        <h3 className="font-semibold text-slate-900">
                                            Internal Recruitment Notes
                                        </h3>
                                    </div>

                                    <textarea
                                        value={notes}
                                        onChange={(e) =>
                                            setNotes(e.target.value)
                                        }
                                        rows={5}
                                        placeholder="Add internal notes for your recruitment team..."
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-700 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />

                                    <button
                                        type="button"
                                        onClick={handleSaveNotes}
                                        disabled={savingNotes}
                                        className="mt-3 px-4 py-2.5 rounded-lg bg-[#1E3A8A] text-white text-sm font-semibold hover:bg-blue-900 disabled:opacity-60"
                                    >
                                        {savingNotes
                                            ? 'Saving...'
                                            : 'Save Notes'}
                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>
                )}

                {loadingDetails && (
                    <div className="fixed inset-0 z-[60] bg-black/20 flex items-center justify-center">
                        <div className="bg-white rounded-xl px-6 py-5 shadow-lg flex items-center gap-3">
                            <Spinner size="sm" />
                            <span className="text-sm text-slate-600">
                Loading request...
              </span>
                        </div>
                    </div>
                )}

            </div>
        </AppLayout>
    );
}