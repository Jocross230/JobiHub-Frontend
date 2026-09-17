import { useEffect, useState } from 'react';
import { paymentsApi } from '../../api/paymentsApi';

export default function AdminPayments() {
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [reviewingId, setReviewingId] = useState<number | null>(null);
    const [message, setMessage] = useState('');

    const loadPayments = async () => {
        try {
            setLoading(true);

            const data = await paymentsApi.adminAll();

            setPayments(data);
        } catch (error) {
            console.error('Failed to load payments:', error);
            setMessage('Failed to load payments.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadPayments();
    }, []);

    const reviewPayment = async (
        id: number,
        status: 'Approved' | 'Rejected'
    ) => {
        try {
            setReviewingId(id);
            setMessage('');

            await paymentsApi.review(id, status);

            setMessage(
                status === 'Approved'
                    ? 'Payment approved successfully.'
                    : 'Payment rejected successfully.'
            );

            await loadPayments();
        } catch (error) {
            console.error('Failed to review payment:', error);
            setMessage('Failed to update payment.');
        } finally {
            setReviewingId(null);
        }
    };

    if (loading) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold text-slate-800">
                    Payments
                </h1>

                <p className="mt-4 text-slate-500">
                    Loading payments...
                </p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">
                    Payments
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    Review and verify customer payments.
                </p>
            </div>

            {message && (
                <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    {message}
                </div>
            )}

            {payments.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
                    <p className="text-slate-500">
                        No payment requests found.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                    <table className="min-w-full text-sm">
                        <thead className="border-b border-slate-200 bg-slate-50">
                        <tr>
                            <th className="px-4 py-3 text-left font-semibold text-slate-700">
                                User
                            </th>

                            <th className="px-4 py-3 text-left font-semibold text-slate-700">
                                Product
                            </th>

                            <th className="px-4 py-3 text-left font-semibold text-slate-700">
                                Amount
                            </th>

                            <th className="px-4 py-3 text-left font-semibold text-slate-700">
                                Payment Reference
                            </th>

                            <th className="px-4 py-3 text-left font-semibold text-slate-700">
                                Status
                            </th>

                            <th className="px-4 py-3 text-left font-semibold text-slate-700">
                                Date
                            </th>

                            <th className="px-4 py-3 text-left font-semibold text-slate-700">
                                Action
                            </th>
                        </tr>
                        </thead>

                        <tbody>
                        {payments.map((payment) => (
                            <tr
                                key={payment.id}
                                className="border-b border-slate-100 last:border-b-0"
                            >
                                <td className="px-4 py-4">
                                    <div className="font-medium text-slate-800">
                                        {payment.userName}
                                    </div>

                                    <div className="text-xs text-slate-500">
                                        {payment.userEmail}
                                    </div>
                                </td>

                                <td className="px-4 py-4 text-slate-700">
                                    {payment.product}
                                </td>

                                <td className="px-4 py-4 font-medium text-slate-800">
                                    ₦{Number(payment.amount).toLocaleString()}
                                </td>

                                <td className="px-4 py-4 font-mono text-xs text-slate-600">
                                    {payment.paymentReference}
                                </td>

                                <td className="px-4 py-4">
                                        <span
                                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                                                payment.status === 'Approved'
                                                    ? 'bg-green-100 text-green-700'
                                                    : payment.status === 'Rejected'
                                                        ? 'bg-red-100 text-red-700'
                                                        : 'bg-yellow-100 text-yellow-700'
                                            }`}
                                        >
                                            {payment.status}
                                        </span>
                                </td>

                                <td className="px-4 py-4 text-xs text-slate-500">
                                    {new Date(
                                        payment.createdAt
                                    ).toLocaleString()}
                                </td>

                                <td className="px-4 py-4">
                                    {payment.status === 'Pending' ? (
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                disabled={
                                                    reviewingId ===
                                                    payment.id
                                                }
                                                onClick={() =>
                                                    void reviewPayment(
                                                        payment.id,
                                                        'Approved'
                                                    )
                                                }
                                                className="rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                Approve
                                            </button>

                                            <button
                                                type="button"
                                                disabled={
                                                    reviewingId ===
                                                    payment.id
                                                }
                                                onClick={() =>
                                                    void reviewPayment(
                                                        payment.id,
                                                        'Rejected'
                                                    )
                                                }
                                                className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-slate-400">
                                                Reviewed
                                            </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}