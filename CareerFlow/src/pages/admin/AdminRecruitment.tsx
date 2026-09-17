import { useEffect, useState } from 'react';
import {
  HeadphonesIcon,
  X,
  Mail,
  Phone,
  Globe,
  MapPin,
} from 'lucide-react';

import AdminLayout from '../../components/layout/AdminLayout';
import { adminApi } from '../../api/adminApi';
import {
  Card,
  EmptyState,
  PageLoader,
  Select,
} from '../../components/ui';

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'Pending', label: 'Request Submitted' },
  { value: 'Under Review', label: 'Under Review' },
  { value: 'In Progress', label: 'Recruitment In Progress' },
  { value: 'Candidates Sourced', label: 'Candidates Being Sourced' },
  { value: 'Candidates Screened', label: 'Candidates Screened' },
  { value: 'Shortlist Ready', label: 'Shortlist Ready' },
  { value: 'Interview Stage', label: 'Interview Stage' },
  { value: 'Filled', label: 'Position Filled' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Declined', label: 'Declined' },
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

interface RecruitmentRequest {
  id: number;
  businessId: number;

  companyName: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  companyLocation?: string;

  positionTitle: string;
  numberOfCandidates: number;

  urgency: string;
  employmentType: string;
  experienceLevel: string;
  location: string;
  salaryRange: string;

  jobDescription?: string;
  requirements?: string;
  skills?: string;
  additionalMessage?: string;

  status: string;
  adminNotes?: string;

  createdAt: string;
  updatedAt: string;
}

export default function AdminRecruitment() {
  const [requests, setRequests] = useState<RecruitmentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const [selectedRequest, setSelectedRequest] =
      useState<RecruitmentRequest | null>(null);

  const [detailLoading, setDetailLoading] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const response = await adminApi.getRecruitmentRequests();

      setRequests(response as RecruitmentRequest[]);
    } catch (error) {
      console.error(
          'Failed to load recruitment requests:',
          error
      );
    } finally {
      setLoading(false);
    }
  };

  const filtered = requests.filter(
      request =>
          !statusFilter ||
          request.status === statusFilter
  );

  const openRequest = async (id: number) => {
    setDetailLoading(true);

    try {
      const response = await fetch(
          `https://localhost:44378/api/admin/recruitment/${id}`,
          {
            headers: {
              Authorization:
                  `Bearer ${localStorage.getItem(
                      'careerflow_token'
                  )}`,
            },
          }
      );

      if (!response.ok) {
        throw new Error(
            'Failed to load recruitment request.'
        );
      }

      const data =
          (await response.json()) as RecruitmentRequest;

      setSelectedRequest(data);
    } catch (error) {
      console.error(
          'Failed to load recruitment request:',
          error
      );

      alert(
          'Failed to load recruitment request.'
      );
    } finally {
      setDetailLoading(false);
    }
  };

  const handleStatusChange = async (
      id: number,
      status: string
  ) => {
    try {
      setSavingStatus(true);

      await adminApi.updateRecruitmentStatus(
          id.toString(),
          status
      );

      setRequests(previous =>
          previous.map(request =>
              request.id === id
                  ? {
                    ...request,
                    status,
                  }
                  : request
          )
      );

      if (
          selectedRequest &&
          selectedRequest.id === id
      ) {
        setSelectedRequest(previous =>
            previous
                ? {
                  ...previous,
                  status,
                }
                : null
        );
      }
    } catch (error) {
      console.error(
          'Failed to update recruitment status:',
          error
      );

      alert(
          'Failed to update recruitment status.'
      );
    } finally {
      setSavingStatus(false);
    }
  };

  const getProgressIndex = (status: string) => {
    const index =
        PROGRESS_STEPS.indexOf(status);

    return index >= 0 ? index : 0;
  };

  const urgencyClass: Record<string, string> = {
    High: 'text-red-600',
    Medium: 'text-amber-600',
    Low: 'text-slate-500',
    high: 'text-red-600',
    medium: 'text-amber-600',
    low: 'text-slate-500',
  };

  return (
      <AdminLayout>
        <div className="p-6 lg:p-8">

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Recruitment Requests
              </h1>

              <p className="text-sm text-slate-500 mt-0.5">
                Manage business recruitment support requests.
              </p>
            </div>

            <Select
                value={statusFilter}
                onChange={e =>
                    setStatusFilter(e.target.value)
                }
                options={STATUS_OPTIONS}
                className="w-56"
            />
          </div>

          {loading ? (
              <PageLoader />
          ) : (
              <Card className="overflow-hidden">

                {filtered.length === 0 ? (
                    <EmptyState
                        icon={
                          <HeadphonesIcon className="w-12 h-12" />
                        }
                        title="No recruitment requests"
                        description={
                          statusFilter
                              ? 'No requests match this status.'
                              : 'No recruitment support requests submitted yet.'
                        }
                    />
                ) : (
                    <div className="overflow-x-auto">

                      <table className="w-full text-sm">

                        <thead>
                        <tr className="border-b border-slate-100 bg-slate-50">

                          <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                            Request
                          </th>

                          <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                            Business
                          </th>

                          <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                            Urgency
                          </th>

                          <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                            Submitted
                          </th>

                          <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                            Status
                          </th>

                        </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">

                        {filtered.map(request => (
                            <tr
                                key={request.id}
                                className="hover:bg-slate-50 cursor-pointer"
                                onClick={() =>
                                    openRequest(request.id)
                                }
                            >

                              <td className="px-4 py-4">
                                <p className="font-medium text-slate-900">
                                  {request.positionTitle}
                                </p>

                                <p className="text-xs text-slate-500 mt-1">
                                  {request.numberOfCandidates}
                                  {' '}
                                  candidate
                                  {request.numberOfCandidates !== 1
                                      ? 's'
                                      : ''}
                                  {' '}needed
                                </p>
                              </td>

                              <td className="px-4 py-4 text-slate-600">
                                {request.companyName}
                              </td>

                              <td className="px-4 py-4">
                          <span
                              className={`text-xs font-semibold ${
                                  urgencyClass[
                                      request.urgency
                                      ] ??
                                  'text-slate-600'
                              }`}
                          >
                            {request.urgency}
                          </span>
                              </td>

                              <td className="px-4 py-4 text-xs text-slate-500">
                                {new Date(
                                    request.createdAt
                                ).toLocaleDateString()}
                              </td>

                              <td
                                  className="px-4 py-4"
                                  onClick={e =>
                                      e.stopPropagation()
                                  }
                              >
                                <select
                                    value={request.status}
                                    disabled={savingStatus}
                                    onChange={e =>
                                        handleStatusChange(
                                            request.id,
                                            e.target.value
                                        )
                                    }
                                    className="text-xs border border-slate-200 rounded px-2 py-1.5 bg-white focus:outline-none"
                                >
                                  {STATUS_OPTIONS
                                      .filter(
                                          option =>
                                              option.value
                                      )
                                      .map(option => (
                                          <option
                                              key={
                                                option.value
                                              }
                                              value={
                                                option.value
                                              }
                                          >
                                            {option.label}
                                          </option>
                                      ))}
                                </select>
                              </td>

                            </tr>
                        ))}

                        </tbody>

                      </table>

                    </div>
                )}

              </Card>
          )}

          {detailLoading && (
              <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6">
                  <PageLoader />
                </div>
              </div>
          )}

          {selectedRequest && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

                <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">

                  <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">

                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        Recruitment Request
                      </h2>

                      <p className="text-sm text-slate-500">
                        Request #{selectedRequest.id}
                      </p>
                    </div>

                    <button
                        onClick={() =>
                            setSelectedRequest(null)
                        }
                        className="p-2 rounded-lg hover:bg-slate-100"
                    >
                      <X className="w-5 h-5" />
                    </button>

                  </div>

                  <div className="p-6 space-y-6">

                    {/* COMPANY CONTACT DETAILS */}
                    <section>
                      <h3 className="text-sm font-semibold text-slate-900 mb-3">
                        Company Contact
                      </h3>

                      <div className="border border-slate-200 rounded-xl p-4">

                        <p className="text-lg font-semibold text-slate-900">
                          {selectedRequest.companyName}
                        </p>

                        <div className="grid sm:grid-cols-2 gap-3 mt-4 text-sm">

                          {selectedRequest.contactEmail && (
                              <a
                                  href={`mailto:${selectedRequest.contactEmail}`}
                                  className="flex items-center gap-2 text-blue-600 hover:underline"
                              >
                                <Mail className="w-4 h-4" />
                                <span>
                            {selectedRequest.contactEmail}
                          </span>
                              </a>
                          )}

                          {selectedRequest.contactPhone && (
                              <a
                                  href={`tel:${selectedRequest.contactPhone}`}
                                  className="flex items-center gap-2 text-blue-600 hover:underline"
                              >
                                <Phone className="w-4 h-4" />
                                <span>
                            {selectedRequest.contactPhone}
                          </span>
                              </a>
                          )}

                          {selectedRequest.website && (
                              <a
                                  href={
                                    selectedRequest.website.startsWith(
                                        'http'
                                    )
                                        ? selectedRequest.website
                                        : `https://${selectedRequest.website}`
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center gap-2 text-blue-600 hover:underline"
                              >
                                <Globe className="w-4 h-4" />
                                <span>
                            {selectedRequest.website}
                          </span>
                              </a>
                          )}

                          {selectedRequest.companyLocation && (
                              <div className="flex items-center gap-2 text-slate-600">
                                <MapPin className="w-4 h-4" />
                                <span>
                            {selectedRequest.companyLocation}
                          </span>
                              </div>
                          )}

                        </div>

                        {!selectedRequest.contactEmail &&
                            !selectedRequest.contactPhone && (
                                <p className="text-sm text-slate-500 mt-4">
                                  No contact details have been provided.
                                </p>
                            )}

                      </div>
                    </section>

                    {/* POSITION DETAILS */}
                    <section>
                      <h3 className="text-sm font-semibold text-slate-900 mb-3">
                        Position
                      </h3>

                      <div className="grid sm:grid-cols-2 gap-4">

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
                            label="Job Location"
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

                      </div>
                    </section>

                    {/* REQUEST DETAILS */}
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

                      <DetailBlock
                          title="Additional Message"
                          value={
                            selectedRequest.additionalMessage
                          }
                      />

                    </section>

                    {/* RECRUITMENT PROGRESS */}
                    <section>

                      <div className="flex items-center justify-between mb-4">

                        <h3 className="text-sm font-semibold text-slate-900">
                          Recruitment Progress
                        </h3>

                        <span className="text-xs text-slate-500">
                      Current stage:
                          {' '}
                          {selectedRequest.status}
                    </span>

                      </div>

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
                                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                                              completed ||
                                              current
                                                  ? 'bg-blue-600 text-white'
                                                  : 'bg-slate-100 text-slate-400'
                                          }`}
                                      >
                                        {index + 1}
                                      </div>

                                      <span
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
                                    : step}
                              </span>

                                    </div>
                                );
                              }
                          )}

                        </div>

                      </div>

                    </section>

                    {/* ADMIN NOTES */}
                    {selectedRequest.adminNotes && (
                        <DetailBlock
                            title="Internal Admin Notes"
                            value={
                              selectedRequest.adminNotes
                            }
                        />
                    )}

                  </div>

                </div>

              </div>
          )}

        </div>
      </AdminLayout>
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
  value?: string;
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