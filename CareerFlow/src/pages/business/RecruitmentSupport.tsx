import { useEffect, useState } from 'react';
import {
  HeadphonesIcon,
  Send,
  CheckCircle,
  Clock,
  RefreshCw,
  ChevronRight,
  Mail,
  Phone,
} from 'lucide-react';

import AppLayout from '../../components/layout/AppLayout';
import {
  Input,
  Textarea,
  Select,
  Card,
  Spinner,
} from '../../components/ui';

import {
  recruitmentApi,
  type RecruitmentRequest,
} from '../../api/recruitmentApi';

const URGENCY_OPTIONS = [
  {
    value: 'Low',
    label: 'Low — within 3 months',
  },
  {
    value: 'Medium',
    label: 'Medium — within 1 month',
  },
  {
    value: 'High',
    label: 'High — within 2 weeks',
  },
];

const EMP_OPTIONS = [
  {
    value: 'Full-time',
    label: 'Full-time',
  },
  {
    value: 'Part-time',
    label: 'Part-time',
  },
  {
    value: 'Contract',
    label: 'Contract',
  },
];

const EXP_OPTIONS = [
  {
    value: 'Entry-level',
    label: 'Entry-level',
  },
  {
    value: 'Mid-level',
    label: 'Mid-level',
  },
  {
    value: 'Senior',
    label: 'Senior',
  },
  {
    value: 'Executive',
    label: 'Executive',
  },
];

const PROGRESS_STEPS = [
  'Pending',
  'Under Review',
  'In Progress',
  'Candidates Sourced',
  'Candidates Screened',
  'Shortlist Ready',
  'Interview Stage',
  'Filled',
  'Completed',
];

const STATUS_LABELS: Record<string, string> = {
  Pending: 'Request Submitted',
  'Under Review': 'Under Review',
  'In Progress': 'Recruitment In Progress',
  'Candidates Sourced': 'Candidates Being Sourced',
  'Candidates Screened': 'Candidates Screened',
  'Shortlist Ready': 'Shortlist Ready',
  'Interview Stage': 'Interview Stage',
  Filled: 'Position Filled',
  Completed: 'Completed',
  Declined: 'Declined',
};

export default function RecruitmentSupport() {
  const [form, setForm] = useState({
    position: '',
    jobDescription: '',
    location: '',
    skills: '',
    experienceLevel: 'Mid-level',
    employmentType: 'Full-time',
    candidatesRequired: '1',
    salaryRange: '',
    urgency: 'Medium',
    additionalRequirements: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [requestId, setRequestId] = useState<number | null>(null);

  const [requests, setRequests] = useState<RecruitmentRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  const [selectedRequest, setSelectedRequest] =
      useState<RecruitmentRequest | null>(null);

  const [loadingDetail, setLoadingDetail] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const set = (key: string, value: string) => {
    setForm(previous => ({
      ...previous,
      [key]: value,
    }));
  };

  const loadRequests = async (showRefresh = false) => {
    if (showRefresh) {
      setRefreshing(true);
    }

    try {
      const response = await recruitmentApi.getMyRequests();

      setRequests(response);
    } catch (error) {
      console.error(
          'Failed to load recruitment requests:',
          error
      );
    } finally {
      setLoadingRequests(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleSubmit = async (
      e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!form.position.trim()) {
      alert('Please enter the Position / Job Title.');
      return;
    }

    if (!form.jobDescription.trim()) {
      alert('Please enter a Job Description.');
      return;
    }

    const numberOfCandidates = parseInt(
        form.candidatesRequired,
        10
    );

    if (
        Number.isNaN(numberOfCandidates) ||
        numberOfCandidates < 1
    ) {
      alert(
          'Number of Candidates must be at least 1.'
      );
      return;
    }

    setSubmitting(true);

    try {
      const response = await recruitmentApi.submit({
        positionTitle: form.position.trim(),

        numberOfCandidates,

        urgency: form.urgency,

        employmentType: form.employmentType,

        experienceLevel: form.experienceLevel,

        location: form.location.trim(),

        salaryRange: form.salaryRange.trim(),

        jobDescription:
            form.jobDescription.trim(),

        requirements:
            form.additionalRequirements.trim(),

        skills: form.skills.trim(),

        additionalMessage: '',
      });

      setRequestId(response.id);
      setSubmitted(true);

      await loadRequests();

      setShowForm(false);

      setForm({
        position: '',
        jobDescription: '',
        location: '',
        skills: '',
        experienceLevel: 'Mid-level',
        employmentType: 'Full-time',
        candidatesRequired: '1',
        salaryRange: '',
        urgency: 'Medium',
        additionalRequirements: '',
      });
    } catch (error) {
      alert(
          error instanceof Error
              ? error.message
              : 'Submission failed.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const openRequest = async (id: number) => {
    setLoadingDetail(true);

    try {
      const request =
          await recruitmentApi.getById(id);

      setSelectedRequest(request);
    } catch (error) {
      console.error(
          'Failed to load recruitment request:',
          error
      );

      alert(
          'Failed to load recruitment request.'
      );
    } finally {
      setLoadingDetail(false);
    }
  };

  const getProgressIndex = (status: string) => {
    const index =
        PROGRESS_STEPS.indexOf(status);

    return index >= 0 ? index : 0;
  };

  const getStatusLabel = (status: string) => {
    return STATUS_LABELS[status] ?? status;
  };

  const getStatusClasses = (status: string) => {
    if (status === 'Completed') {
      return 'bg-emerald-50 text-emerald-700';
    }

    if (status === 'Filled') {
      return 'bg-emerald-50 text-emerald-700';
    }

    if (status === 'Declined') {
      return 'bg-red-50 text-red-700';
    }

    if (status === 'Under Review') {
      return 'bg-amber-50 text-amber-700';
    }

    if (status === 'In Progress') {
      return 'bg-blue-50 text-blue-700';
    }

    return 'bg-blue-50 text-blue-700';
  };

  return (
      <AppLayout>
        <div className="p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">

            {/* HEADER */}

            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              <div>
                <div className="flex items-center gap-2 mb-1">

                  <HeadphonesIcon className="w-5 h-5 text-blue-600" />

                  <h1 className="text-xl font-bold text-slate-900">
                    Recruitment Support
                  </h1>

                </div>

                <p className="text-sm text-slate-500">
                  Request professional recruitment
                  support and track your hiring process.
                </p>
              </div>

              <button
                  type="button"
                  onClick={() =>
                      setShowForm(previous => !previous)
                  }
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1E3A8A] text-white text-sm font-semibold rounded-lg hover:bg-blue-900 transition"
              >
                <Send className="w-4 h-4" />

                {showForm
                    ? 'Close Request Form'
                    : 'Request Recruitment Support'}
              </button>

            </div>

            {/* SUCCESS MESSAGE */}

            {submitted && (
                <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-5">

                  <div className="flex items-start gap-3">

                    <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />

                    <div className="flex-1">

                      <p className="text-sm font-semibold text-emerald-800">
                        Recruitment request submitted successfully.
                      </p>

                      {requestId !== null && (
                          <p className="text-xs text-emerald-700 mt-1">
                            Request #{requestId} has been sent
                            to the JobiHub Recruitment Team.
                          </p>
                      )}

                      <div className="mt-4 border-t border-emerald-200 pt-4">

                        <p className="text-sm font-semibold text-emerald-800">
                          What happens next?
                        </p>

                        <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                          Our Recruitment Team will review
                          your request and contact your business
                          using the contact details in your
                          Company Profile.
                        </p>

                        <div className="mt-3 space-y-2">

                          <div className="flex items-center gap-2 text-xs text-emerald-700">
                            <Mail className="w-3.5 h-3.5" />
                            <span>
                          We may contact you by email.
                        </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-emerald-700">
                            <Phone className="w-3.5 h-3.5" />
                            <span>
                          We may also contact you by phone.
                        </span>
                          </div>

                        </div>

                        <p className="text-xs text-emerald-700 mt-3">
                          You can track the progress of this
                          request below at any time.
                        </p>

                      </div>

                    </div>

                    <button
                        type="button"
                        onClick={() => setSubmitted(false)}
                        className="text-xs font-medium text-emerald-700 hover:text-emerald-900"
                    >
                      Dismiss
                    </button>

                  </div>

                </div>
            )}

            {/* REQUEST FORM */}

            {showForm && (
                <Card className="p-5 mb-8">

                  <div className="mb-5">

                    <h2 className="text-base font-semibold text-slate-900">
                      New Recruitment Request
                    </h2>

                    <p className="text-xs text-slate-500 mt-1">
                      Tell our Recruitment Team about
                      the position you need to fill.
                    </p>

                  </div>

                  <form
                      onSubmit={handleSubmit}
                      className="space-y-5"
                  >

                    <div className="space-y-4">

                      <Input
                          label="Position / Job Title"
                          value={form.position}
                          onChange={e =>
                              set(
                                  'position',
                                  e.target.value
                              )
                          }
                          placeholder="e.g. Senior Data Engineer"
                          required
                      />

                      <div className="grid sm:grid-cols-2 gap-3">

                        <Input
                            label="Number of Candidates"
                            type="number"
                            min="1"
                            max="50"
                            value={
                              form.candidatesRequired
                            }
                            onChange={e =>
                                set(
                                    'candidatesRequired',
                                    e.target.value
                                )
                            }
                        />

                        <Select
                            label="Urgency"
                            value={form.urgency}
                            onChange={e =>
                                set(
                                    'urgency',
                                    e.target.value
                                )
                            }
                            options={
                              URGENCY_OPTIONS
                            }
                        />

                      </div>

                      <div className="grid sm:grid-cols-2 gap-3">

                        <Select
                            label="Employment Type"
                            value={
                              form.employmentType
                            }
                            onChange={e =>
                                set(
                                    'employmentType',
                                    e.target.value
                                )
                            }
                            options={
                              EMP_OPTIONS
                            }
                        />

                        <Select
                            label="Experience Level"
                            value={
                              form.experienceLevel
                            }
                            onChange={e =>
                                set(
                                    'experienceLevel',
                                    e.target.value
                                )
                            }
                            options={
                              EXP_OPTIONS
                            }
                        />

                      </div>

                      <Input
                          label="Location"
                          value={form.location}
                          onChange={e =>
                              set(
                                  'location',
                                  e.target.value
                              )
                          }
                          placeholder="Lagos, Nigeria or Remote"
                      />

                      <Input
                          label="Salary Range (optional)"
                          value={
                            form.salaryRange
                          }
                          onChange={e =>
                              set(
                                  'salaryRange',
                                  e.target.value
                              )
                          }
                          placeholder="e.g. ₦800,000 – ₦1,200,000"
                      />

                      <Textarea
                          label="Job Description"
                          value={
                            form.jobDescription
                          }
                          onChange={e =>
                              set(
                                  'jobDescription',
                                  e.target.value
                              )
                          }
                          placeholder="Describe the role, responsibilities, and what you're looking for..."
                          rows={5}
                          required
                      />

                      <Input
                          label="Required Skills"
                          value={form.skills}
                          onChange={e =>
                              set(
                                  'skills',
                                  e.target.value
                              )
                          }
                          placeholder="React, TypeScript, Node.js, AWS"
                      />

                      <Textarea
                          label="Additional Requirements"
                          value={
                            form.additionalRequirements
                          }
                          onChange={e =>
                              set(
                                  'additionalRequirements',
                                  e.target.value
                              )
                          }
                          placeholder="Certifications, industry experience, start date requirements..."
                          rows={3}
                      />

                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-[#1E3A8A] text-white font-semibold rounded-lg hover:bg-blue-900 disabled:opacity-60 transition"
                    >

                      {submitting ? (
                          <Spinner size="sm" />
                      ) : (
                          <Send className="w-4 h-4" />
                      )}

                      {submitting
                          ? 'Submitting...'
                          : 'Submit Recruitment Request'}

                    </button>

                  </form>

                </Card>
            )}

            {/* EXISTING REQUESTS */}

            <div className="flex items-center justify-between mb-4">

              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  My Recruitment Requests
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Track the progress of your
                  recruitment requests.
                </p>
              </div>

              <button
                  type="button"
                  onClick={() =>
                      loadRequests(true)
                  }
                  disabled={refreshing}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
              >

                <RefreshCw
                    className={`w-3.5 h-3.5 ${
                        refreshing
                            ? 'animate-spin'
                            : ''
                    }`}
                />

                Refresh

              </button>

            </div>

            {loadingRequests ? (

                <div className="py-12 flex justify-center">
                  <Spinner size="md" />
                </div>

            ) : requests.length === 0 ? (

                <Card className="p-8 text-center">

                  <HeadphonesIcon className="w-10 h-10 text-slate-300 mx-auto mb-3" />

                  <h3 className="text-sm font-semibold text-slate-900">
                    No recruitment requests yet
                  </h3>

                  <p className="text-xs text-slate-500 mt-1 mb-4">
                    Submit a recruitment request and
                    our team will help you find qualified
                    candidates.
                  </p>

                  <button
                      type="button"
                      onClick={() =>
                          setShowForm(true)
                      }
                      className="px-4 py-2 bg-[#1E3A8A] text-white text-xs font-semibold rounded-lg hover:bg-blue-900"
                  >
                    Create Recruitment Request
                  </button>

                </Card>

            ) : (

                <div className="space-y-4">

                  {requests.map(request => (

                      <div
                          key={request.id}
                          onClick={() =>
                              openRequest(request.id)
                          }
                          className="cursor-pointer"
                      >

                        <Card className="p-5 hover:shadow-md transition">

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                            <div className="min-w-0">

                              <div className="flex items-center gap-2">

                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                  <HeadphonesIcon className="w-4 h-4 text-blue-600" />
                                </div>

                                <h3 className="text-sm font-semibold text-slate-900">
                                  {request.positionTitle}
                                </h3>

                              </div>

                              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">

                          <span>
                            {request.numberOfCandidates}{' '}
                            candidate
                            {request.numberOfCandidates !== 1
                                ? 's'
                                : ''}
                          </span>

                                <span>•</span>

                                <span>
                            {request.employmentType}
                          </span>

                                <span>•</span>

                                <span>
                            {request.location ||
                                'Location not specified'}
                          </span>

                              </div>

                            </div>

                            <div className="flex items-center gap-3">

                              <div className="text-right">

                          <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusClasses(
                                  request.status
                              )}`}
                          >

                            <Clock className="w-3 h-3" />

                            {getStatusLabel(
                                request.status
                            )}

                          </span>

                                <p className="text-[11px] text-slate-400 mt-1">
                                  Updated{' '}
                                  {new Date(
                                      request.updatedAt
                                  ).toLocaleDateString()}
                                </p>

                              </div>

                              <ChevronRight className="w-4 h-4 text-slate-400" />

                            </div>

                          </div>

                        </Card>

                      </div>

                  ))}

                </div>

            )}

          </div>

          {/* DETAIL MODAL */}

          {selectedRequest && (

              <div
                  className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
                  onClick={() =>
                      setSelectedRequest(null)
                  }
              >

                <div
                    className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                    onClick={e =>
                        e.stopPropagation()
                    }
                >

                  {/* MODAL HEADER */}

                  <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">

                    <div>

                      <h2 className="text-lg font-bold text-slate-900">
                        {selectedRequest.positionTitle}
                      </h2>

                      <p className="text-xs text-slate-500 mt-1">
                        Recruitment Request #
                        {selectedRequest.id}
                      </p>

                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            setSelectedRequest(null)
                        }
                        className="text-sm text-slate-500 hover:text-slate-900 px-2 py-1"
                    >
                      Close
                    </button>

                  </div>

                  <div className="p-6 space-y-6">

                    {/* CURRENT STATUS */}

                    <section>

                      <div className="flex items-center justify-between mb-4">

                        <h3 className="text-sm font-semibold text-slate-900">
                          Recruitment Progress
                        </h3>

                        <span
                            className={`text-xs font-semibold ${
                                selectedRequest.status ===
                                'Declined'
                                    ? 'text-red-600'
                                    : 'text-blue-600'
                            }`}
                        >
                      {getStatusLabel(
                          selectedRequest.status
                      )}
                    </span>

                      </div>

                      {selectedRequest.status ===
                      'Declined' ? (

                          <div className="border border-red-200 bg-red-50 rounded-xl p-5">

                            <p className="text-sm font-semibold text-red-700">
                              Recruitment Request Declined
                            </p>

                            <p className="text-xs text-red-600 mt-1">
                              Please contact the JobiHub
                              Recruitment Team for more
                              information.
                            </p>

                          </div>

                      ) : (

                          <div className="border border-slate-200 rounded-xl p-5">

                            <div className="space-y-4">

                              {PROGRESS_STEPS.map(
                                  (step, index) => {

                                    const currentIndex =
                                        getProgressIndex(
                                            selectedRequest.status
                                        );

                                    const completed =
                                        index <
                                        currentIndex;

                                    const current =
                                        index ===
                                        currentIndex;

                                    return (
                                        <div
                                            key={step}
                                            className="flex items-center gap-3"
                                        >

                                          <div
                                              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                  completed
                                                      ? 'bg-emerald-500 text-white'
                                                      : current
                                                          ? 'bg-blue-600 text-white'
                                                          : 'bg-slate-100 text-slate-400'
                                              }`}
                                          >

                                            {completed ? (
                                                <CheckCircle className="w-4 h-4" />
                                            ) : (
                                                index + 1
                                            )}

                                          </div>

                                          <div>

                                            <p
                                                className={`text-sm ${
                                                    current
                                                        ? 'font-semibold text-blue-600'
                                                        : completed
                                                            ? 'text-slate-700'
                                                            : 'text-slate-400'
                                                }`}
                                            >
                                              {step ===
                                              'Pending'
                                                  ? 'Request Submitted'
                                                  : STATUS_LABELS[
                                                  step
                                                  ] ?? step}
                                            </p>

                                            {current && (
                                                <p className="text-xs text-blue-500 mt-0.5">
                                                  Current stage
                                                </p>
                                            )}

                                          </div>

                                        </div>
                                    );
                                  }
                              )}

                            </div>

                          </div>

                      )}

                      <p className="text-xs text-slate-400 mt-3">
                        Last updated{' '}
                        {new Date(
                            selectedRequest.updatedAt
                        ).toLocaleString()}
                      </p>

                    </section>

                    {/* REQUEST INFORMATION */}

                    <section>

                      <h3 className="text-sm font-semibold text-slate-900 mb-3">
                        Request Details
                      </h3>

                      <div className="grid sm:grid-cols-2 gap-3">

                        <Info
                            label="Position"
                            value={
                              selectedRequest.positionTitle
                            }
                        />

                        <Info
                            label="Candidates Required"
                            value={String(
                                selectedRequest.numberOfCandidates
                            )}
                        />

                        <Info
                            label="Employment Type"
                            value={
                              selectedRequest.employmentType
                            }
                        />

                        <Info
                            label="Experience Level"
                            value={
                              selectedRequest.experienceLevel
                            }
                        />

                        <Info
                            label="Location"
                            value={
                                selectedRequest.location ||
                                'Not specified'
                            }
                        />

                        <Info
                            label="Salary Range"
                            value={
                                selectedRequest.salaryRange ||
                                'Not specified'
                            }
                        />

                        <Info
                            label="Urgency"
                            value={
                              selectedRequest.urgency
                            }
                        />

                        <Info
                            label="Submitted"
                            value={new Date(
                                selectedRequest.createdAt
                            ).toLocaleString()}
                        />

                      </div>

                    </section>

                    {/* FULL DETAILS */}

                    <section className="space-y-4">

                      <DetailBlock
                          title="Job Description"
                          value={
                            selectedRequest.jobDescription
                          }
                      />

                      <DetailBlock
                          title="Requirements"
                          value={
                            selectedRequest.requirements
                          }
                      />

                      <DetailBlock
                          title="Required Skills"
                          value={
                            selectedRequest.skills
                          }
                      />

                      {selectedRequest.additionalMessage && (
                          <DetailBlock
                              title="Additional Message"
                              value={
                                selectedRequest.additionalMessage
                              }
                          />
                      )}

                    </section>

                    {/* RECRUITMENT TEAM UPDATE */}

                    {selectedRequest.adminNotes && (

                        <section>

                          <h3 className="text-sm font-semibold text-slate-900 mb-2">
                            Recruitment Team Update
                          </h3>

                          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-slate-700 whitespace-pre-wrap">
                            {
                              selectedRequest.adminNotes
                            }
                          </div>

                        </section>

                    )}

                  </div>

                </div>

              </div>

          )}

          {/* LOADING DETAIL */}

          {loadingDetail && (

              <div className="fixed inset-0 z-[60] bg-black/30 flex items-center justify-center">

                <div className="bg-white rounded-xl p-5">
                  <Spinner size="md" />
                </div>

              </div>

          )}

        </div>
      </AppLayout>
  );
}

function Info({
                label,
                value,
              }: {
  label: string;
  value: string;
}) {
  return (
      <div className="border border-slate-200 rounded-lg p-3">

        <p className="text-xs text-slate-500">
          {label}
        </p>

        <p className="text-sm font-medium text-slate-900 mt-1">
          {value}
        </p>

      </div>
  );
}

function DetailBlock({
                       title,
                       value,
                     }: {
  title: string;
  value: string;
}) {
  return (
      <div>

        <h3 className="text-sm font-semibold text-slate-900 mb-2">
          {title}
        </h3>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-slate-700 whitespace-pre-wrap">
          {value || 'Not provided'}
        </div>

      </div>
  );
}