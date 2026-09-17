import { useEffect, useState } from 'react';
import {
  HeadphonesIcon,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import { Card } from '../../components/ui';
import { adminApi, SupportIssue } from '../../api/adminApi';

export default function AdminSupport() {
  const [issues, setIssues] = useState<SupportIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [selectedIssue, setSelectedIssue] =
      useState<SupportIssue | null>(null);

  const loadIssues = async () => {
    try {
      setLoading(true);

      const data = await adminApi.getSupportIssues();

      setIssues(data);
    } catch (error) {
      console.error('Failed to load support issues:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIssues();
  }, []);

  const updateStatus = async (
      id: string,
      status: string
  ) => {
    try {
      setUpdating(id);

      await adminApi.updateIssueStatus(id, status);

      await loadIssues();

      if (selectedIssue?.id === id) {
        setSelectedIssue((current) =>
            current
                ? {
                  ...current,
                  status:
                      status as SupportIssue['status'],
                }
                : null
        );
      }
    } catch (error) {
      console.error(
          'Failed to update support issue:',
          error
      );
    } finally {
      setUpdating(null);
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-red-50 text-red-700';

      case 'In Progress':
        return 'bg-blue-50 text-blue-700';

      case 'Waiting for User':
        return 'bg-amber-50 text-amber-700';

      case 'Resolved':
        return 'bg-emerald-50 text-emerald-700';

      case 'Closed':
        return 'bg-slate-100 text-slate-600';

      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-red-700';

      case 'high':
        return 'text-orange-600';

      case 'medium':
        return 'text-amber-600';

      case 'low':
        return 'text-slate-500';

      default:
        return 'text-slate-500';
    }
  };

  return (
      <AdminLayout>
        <div className="p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Support
              </h1>

              <p className="text-sm text-slate-500 mt-0.5">
                Manage user and business support requests.
              </p>
            </div>

            <button
                onClick={loadIssues}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-slate-200 rounded-lg hover:bg-slate-50 transition disabled:opacity-50"
            >
              <RefreshCw
                  className={`w-4 h-4 ${
                      loading ? 'animate-spin' : ''
                  }`}
              />
              Refresh
            </button>
          </div>

          {loading ? (
              <Card className="p-10">
                <div className="flex flex-col items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-slate-400 animate-spin" />

                  <p className="text-sm text-slate-500 mt-3">
                    Loading support requests...
                  </p>
                </div>
              </Card>
          ) : issues.length === 0 ? (
              <Card className="p-10">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                    <HeadphonesIcon className="w-6 h-6 text-slate-400" />
                  </div>

                  <h2 className="text-sm font-semibold text-slate-900 mt-4">
                    No support requests
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    There are currently no support tickets.
                  </p>
                </div>
              </Card>
          ) : (
              <div className="space-y-3">
                {issues.map((issue) => (
                    <div
                        key={issue.id}
                        onClick={() =>
                            setSelectedIssue(issue)
                        }
                        className="cursor-pointer"
                    >
                      <Card className="p-5 hover:shadow-md transition">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                              <HeadphonesIcon className="w-5 h-5 text-blue-600" />
                            </div>

                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h2 className="text-sm font-semibold text-slate-900">
                                  {issue.subject}
                                </h2>

                                <span
                                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusClass(
                                        issue.status
                                    )}`}
                                >
                                                        {issue.status}
                                                    </span>
                              </div>

                              <p className="text-xs text-slate-500 mt-1">
                                {issue.reporterName}
                                {' • '}
                                {issue.category}
                              </p>

                              <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                                {issue.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-1">
                              <AlertCircle
                                  className={`w-4 h-4 ${getPriorityClass(
                                      issue.priority
                                  )}`}
                              />

                              <span
                                  className={`capitalize ${getPriorityClass(
                                      issue.priority
                                  )}`}
                              >
                                                    {issue.priority}
                                                </span>
                            </div>

                            <span className="text-slate-400">
                                                {new Date(
                                                    issue.createdAt
                                                ).toLocaleDateString()}
                                            </span>
                          </div>
                        </div>
                      </Card>
                    </div>
                ))}
              </div>
          )}

          {selectedIssue && (
              <div
                  className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
                  onClick={() =>
                      setSelectedIssue(null)
                  }
              >
                <div
                    className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                    onClick={(e) =>
                        e.stopPropagation()
                    }
                >
                  <div className="p-6 border-b border-slate-100">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-bold text-slate-900">
                          {selectedIssue.subject}
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                          Support request from{' '}
                          {
                            selectedIssue.reporterName
                          }
                        </p>
                      </div>

                      <button
                          onClick={() =>
                              setSelectedIssue(null)
                          }
                          className="text-slate-400 hover:text-slate-600 text-xl"
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  <div className="p-6 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium text-slate-500">
                          Category
                        </p>

                        <p className="text-sm text-slate-900 mt-1">
                          {
                            selectedIssue.category
                          }
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-slate-500">
                          Priority
                        </p>

                        <p
                            className={`text-sm capitalize mt-1 font-medium ${getPriorityClass(
                                selectedIssue.priority
                            )}`}
                        >
                          {
                            selectedIssue.priority
                          }
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-slate-500">
                          Reporter
                        </p>

                        <p className="text-sm text-slate-900 mt-1">
                          {
                            selectedIssue.reporterName
                          }
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-slate-500">
                          Submitted
                        </p>

                        <p className="text-sm text-slate-900 mt-1">
                          {new Date(
                              selectedIssue.createdAt
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-slate-500 mb-2">
                        Description
                      </p>

                      <div className="p-4 rounded-lg bg-slate-50 text-sm text-slate-700 whitespace-pre-wrap">
                        {
                          selectedIssue.description
                        }
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-slate-500 mb-2">
                        Update status
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {[
                          'Open',
                          'In Progress',
                          'Waiting for User',
                          'Resolved',
                          'Closed',
                        ].map((status) => (
                            <button
                                key={status}
                                onClick={() =>
                                    updateStatus(
                                        selectedIssue.id,
                                        status
                                    )
                                }
                                disabled={
                                    updating ===
                                    selectedIssue.id
                                }
                                className={`px-3 py-2 rounded-lg text-xs font-medium border transition ${
                                    selectedIssue.status ===
                                    status
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                              {updating ===
                              selectedIssue.id &&
                              selectedIssue.status !==
                              status ? (
                                  <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3 animate-spin" />
                                                        Updating
                                                    </span>
                              ) : (
                                  status
                              )}
                            </button>
                        ))}
                      </div>
                    </div>

                    {selectedIssue.resolution && (
                        <div>
                          <p className="text-xs font-medium text-slate-500 mb-2">
                            Resolution
                          </p>

                          <div className="flex gap-2 p-4 rounded-lg bg-emerald-50 text-sm text-emerald-800">
                            <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />

                            <span>
                                                {
                                                  selectedIssue.resolution
                                                }
                                            </span>
                          </div>
                        </div>
                    )}
                  </div>
                </div>
              </div>
          )}
        </div>
      </AdminLayout>
  );
}