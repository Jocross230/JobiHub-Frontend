import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../../components/Layout';
import { paymentsApi } from '../../api/paymentsApi';

type ProductKey = 'PremiumCV' | 'CoverLetterPack' | 'JobReady';

type PaymentInfo = {
    name: string;
    amount: number;
    duration: string;
    description: string;
    transferxoUrl: string;
};

const paymentDetails: Record<ProductKey, PaymentInfo> = {
    PremiumCV: {
        name: 'Premium CV',
        amount: 2000,
        duration: '1 month',
        description:
            'Your Premium CV access remains active for 1 month after your payment is approved.',
        transferxoUrl: 'https://transferxo.com/pay/VWAxBSNKWf',
    },

    CoverLetterPack: {
        name: 'AI Cover Letter Pack',
        amount: 1000,
        duration: '7 days',
        description:
            'Your Cover Letter Pack remains active for 7 days after your payment is approved. During this period, you can generate and download your cover letters.',
        transferxoUrl: 'https://transferxo.com/pay/aehMKIcVsi',
    },

    JobReady: {
        name: 'Job Ready',
        amount: 2500,
        duration: '1 month',
        description:
            'Your Job Ready access remains active for 1 month after your payment is approved. During this period, you can apply through JobiHub to eligible jobs.',
        transferxoUrl: 'https://transferxo.com/pay/hOXdhTBLbr',
    },
};

function formatDate(dateString?: string | null) {
    if (!dateString) return '';

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return '';
    }

    return date.toLocaleDateString('en-NG', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export default function PaymentVerification() {
    const [searchParams] = useSearchParams();

    const productParam =
        searchParams.get('product') || 'PremiumCV';

    const product: ProductKey =
        productParam in paymentDetails
            ? (productParam as ProductKey)
            : 'PremiumCV';

    const currentPayment = useMemo(
        () => paymentDetails[product],
        [product]
    );

    const [paymentReference, setPaymentReference] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const [currentStatus, setCurrentStatus] = useState<
        'loading' | 'active' | 'pending' | 'inactive'
    >('loading');

    const [expiresAt, setExpiresAt] = useState<string | null>(null);

    useEffect(() => {
        loadPaymentStatus();
    }, [product]);

    const loadPaymentStatus = async () => {
        setCurrentStatus('loading');
        setExpiresAt(null);

        try {
            const result = await paymentsApi.status(product);

            if (result.approved === true) {
                setCurrentStatus('active');
                setExpiresAt(result.expiresAt ?? null);
                return;
            }

            setCurrentStatus('inactive');
        } catch (err) {
            console.error('PAYMENT STATUS ERROR:', err);
            setCurrentStatus('inactive');
        }
    };

    const checkPendingPayment = async () => {
        try {
            const payments = await paymentsApi.myPayments();

            const latestPayment = payments
                .filter(
                    (payment) =>
                        payment.product.toLowerCase() ===
                        product.toLowerCase()
                )
                .sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                )[0];

            if (latestPayment?.status?.toLowerCase() === 'pending') {
                setCurrentStatus('pending');
            }
        } catch (err) {
            console.error('PAYMENT HISTORY ERROR:', err);
        }
    };

    useEffect(() => {
        if (currentStatus === 'inactive') {
            checkPendingPayment();
        }
    }, [currentStatus]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setError('');
        setMessage('');

        const reference = paymentReference.trim();

        if (!reference) {
            setError('Please enter your TransferXO payment reference.');
            return;
        }

        setSubmitting(true);

        try {
            const result = await paymentsApi.submit({
                product,
                amount: currentPayment.amount,
                paymentReference: reference,
            });

            setMessage(
                result.message ||
                'Payment submitted successfully for verification.'
            );

            setPaymentReference('');
            setCurrentStatus('pending');
        } catch (err: any) {
            console.error('PAYMENT SUBMISSION ERROR:', err);

            setError(
                err?.message ||
                'Unable to submit your payment. Please try again.'
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-3xl mx-auto px-4 py-10">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <div className="px-6 py-7 border-b border-gray-200">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Payment & Activation
                        </h1>

                        <p className="mt-2 text-gray-600">
                            Complete your payment and submit your payment
                            reference for verification.
                        </p>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Product */}
                        <div className="rounded-xl bg-gray-50 border border-gray-200 p-5">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        {currentPayment.name}
                                    </h2>

                                    <p className="mt-1 text-gray-600">
                                        {currentPayment.description}
                                    </p>
                                </div>

                                <div className="sm:text-right">
                                    <div className="text-2xl font-bold text-gray-900">
                                        ₦
                                        {currentPayment.amount.toLocaleString()}
                                    </div>

                                    <div className="text-sm text-gray-500">
                                        {currentPayment.duration} access
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Current status */}
                        {currentStatus === 'active' && (
                            <div className="rounded-xl border border-green-200 bg-green-50 p-5">
                                <div className="flex items-start gap-3">
                                    <div className="text-green-600 text-xl">
                                        ✓
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-green-800">
                                            Your payment is approved
                                        </h3>

                                        <p className="mt-1 text-sm text-green-700">
                                            Your {currentPayment.name} access
                                            is currently active.
                                        </p>

                                        {expiresAt && (
                                            <p className="mt-2 text-sm font-medium text-green-800">
                                                Expires:{' '}
                                                {formatDate(expiresAt)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStatus === 'pending' && (
                            <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-5">
                                <div className="flex items-start gap-3">
                                    <div className="text-yellow-600 text-xl">
                                        ⏳
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-yellow-800">
                                            Payment awaiting verification
                                        </h3>

                                        <p className="mt-1 text-sm text-yellow-700">
                                            Your payment reference has been
                                            submitted. Your access will begin
                                            once the payment is approved.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Duration information */}
                        <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
                            <h3 className="font-semibold text-blue-900">
                                How long does this payment last?
                            </h3>

                            <div className="mt-3 space-y-2 text-sm text-blue-800">
                                <p>
                                    <strong>Access period:</strong>{' '}
                                    {currentPayment.duration}
                                </p>

                                <p>
                                    Your access period starts when your payment
                                    is <strong>approved</strong> by JobiHub.
                                </p>

                                {product === 'CoverLetterPack' && (
                                    <p>
                                        You can generate and download your AI
                                        cover letters while your access is
                                        active.
                                    </p>
                                )}

                                {product === 'JobReady' && (
                                    <p>
                                        You can apply through JobiHub to
                                        eligible jobs while your Job Ready
                                        access is active.
                                    </p>
                                )}

                                {product === 'PremiumCV' && (
                                    <p>
                                        Your Premium CV access remains active
                                        for the full payment period after
                                        approval.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Payment instructions */}
                        {currentStatus !== 'active' && (
                            <>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Step 1: Make your payment
                                    </h3>

                                    <p className="mt-1 text-sm text-gray-600">
                                        Use the TransferXO payment link below
                                        to pay the exact amount.
                                    </p>

                                    <a
                                        href={currentPayment.transferxoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-4 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
                                    >
                                        Pay ₦
                                        {currentPayment.amount.toLocaleString()}{' '}
                                        with TransferXO
                                    </a>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Step 2: Submit your payment reference
                                    </h3>

                                    <p className="mt-1 text-sm text-gray-600">
                                        After making the payment, enter the
                                        payment reference provided by
                                        TransferXO.
                                    </p>

                                    <form
                                        onSubmit={handleSubmit}
                                        className="mt-4 space-y-4"
                                    >
                                        <div>
                                            <label
                                                htmlFor="paymentReference"
                                                className="block text-sm font-medium text-gray-700 mb-2"
                                            >
                                                Payment Reference
                                            </label>

                                            <input
                                                id="paymentReference"
                                                type="text"
                                                value={paymentReference}
                                                onChange={(e) =>
                                                    setPaymentReference(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Enter your TransferXO payment reference"
                                                disabled={submitting}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                            />
                                        </div>

                                        {error && (
                                            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                                {error}
                                            </div>
                                        )}

                                        {message && (
                                            <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                                                {message}
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="w-full rounded-lg bg-gray-900 px-5 py-3 font-semibold text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                        >
                                            {submitting
                                                ? 'Submitting...'
                                                : 'Submit Payment for Verification'}
                                        </button>
                                    </form>
                                </div>
                            </>
                        )}

                        {/* Footer note */}
                        <div className="pt-4 border-t border-gray-200">
                            <p className="text-xs text-gray-500">
                                Payments are manually reviewed. Your access
                                period begins from the date your payment is
                                approved, not from the date you submit the
                                payment reference.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}