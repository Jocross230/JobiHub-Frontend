import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import AdminLayout from '../../components/layout/AdminLayout';
import { adminApi } from '../../api/adminApi';
import { Card, PageLoader } from '../../components/ui';

const PERIODS = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

interface AnalyticsSeries {
  date: string;
  count: number;
}

interface AnalyticsData {
  userGrowth: AnalyticsSeries[];
  cvCreation: AnalyticsSeries[];
  jobPostings: AnalyticsSeries[];
  businessRegistrations: AnalyticsSeries[];
}

export default function AdminAnalytics() {
  const [period, setPeriod] = useState('Monthly');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAnalytics = async (selectedPeriod: string) => {
    try {
      setLoading(true);
      setError('');

      const result = await adminApi.getAnalyticsData(selectedPeriod);

      setData(result);
    } catch (err) {
      console.error(err);
      setError('Unable to load analytics data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics(period);
  }, [period]);

  return (
      <AdminLayout>
        <div className="p-6 lg:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Analytics
              </h1>

              <p className="text-sm text-slate-500 mt-0.5">
                Platform growth and activity trends.
              </p>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
              {PERIODS.map((p) => (
                  <button
                      key={p}
                      onClick={() => setPeriod(p)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                          period === p
                              ? 'bg-white text-slate-900 shadow-sm'
                              : 'text-slate-500 hover:text-slate-700'
                      }`}
                  >
                    {p}
                  </button>
              ))}
            </div>
          </div>

          {loading ? (
              <PageLoader />
          ) : error ? (
              <Card className="p-8 text-center">
                <p className="text-sm text-red-500">{error}</p>

                <button
                    onClick={() => loadAnalytics(period)}
                    className="mt-4 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Try Again
                </button>
              </Card>
          ) : data ? (
              <div className="grid lg:grid-cols-2 gap-5">

                {/* User Growth */}
                <Card className="p-5">
                  <h2 className="text-sm font-semibold text-slate-900 mb-4">
                    User Growth
                  </h2>

                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={data.userGrowth}>
                      <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#f1f5f9"
                      />

                      <XAxis
                          dataKey="date"
                          tick={{ fontSize: 11 }}
                      />

                      <YAxis
                          tick={{ fontSize: 11 }}
                      />

                      <Tooltip
                          contentStyle={{ fontSize: 12 }}
                      />

                      <Line
                          type="monotone"
                          dataKey="count"
                          stroke="#3B82F6"
                          strokeWidth={2}
                          dot={false}
                          name="Users"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>

                {/* CV Creation */}
                <Card className="p-5">
                  <h2 className="text-sm font-semibold text-slate-900 mb-4">
                    CV Creation
                  </h2>

                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={data.cvCreation}>
                      <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#f1f5f9"
                      />

                      <XAxis
                          dataKey="date"
                          tick={{ fontSize: 11 }}
                      />

                      <YAxis
                          tick={{ fontSize: 11 }}
                      />

                      <Tooltip
                          contentStyle={{ fontSize: 12 }}
                      />

                      <Bar
                          dataKey="count"
                          fill="#6366F1"
                          name="CVs Created"
                          radius={[3, 3, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>

                {/* Job Postings */}
                <Card className="p-5">
                  <h2 className="text-sm font-semibold text-slate-900 mb-4">
                    Job Postings
                  </h2>

                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={data.jobPostings}>
                      <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#f1f5f9"
                      />

                      <XAxis
                          dataKey="date"
                          tick={{ fontSize: 11 }}
                      />

                      <YAxis
                          tick={{ fontSize: 11 }}
                      />

                      <Tooltip
                          contentStyle={{ fontSize: 12 }}
                      />

                      <Line
                          type="monotone"
                          dataKey="count"
                          stroke="#10B981"
                          strokeWidth={2}
                          dot={false}
                          name="Jobs"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>

                {/* Business Registrations */}
                <Card className="p-5">
                  <h2 className="text-sm font-semibold text-slate-900 mb-4">
                    Business Registrations
                  </h2>

                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={data.businessRegistrations}>
                      <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#f1f5f9"
                      />

                      <XAxis
                          dataKey="date"
                          tick={{ fontSize: 11 }}
                      />

                      <YAxis
                          tick={{ fontSize: 11 }}
                      />

                      <Tooltip
                          contentStyle={{ fontSize: 12 }}
                      />

                      <Bar
                          dataKey="count"
                          fill="#F59E0B"
                          name="Businesses"
                          radius={[3, 3, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>

              </div>
          ) : null}
        </div>
      </AdminLayout>
  );
}