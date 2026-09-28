import { FormEvent, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
    CheckCircle,
    CreditCard,
    ArrowLeft,
    Clock,
    CalendarDays,
} from 'lucide-react';
import { paymentsApi } from '../api/paymentsApi';
import Layout from '../components/layout/Layout';

type PaymentProduct = {
    name: string;
    amount: number;
    duration: string;
    description: string;
    transferxoUrl: string;
};

const paymentDetails: Record<string, PaymentProduct> = {
    PremiumCV: {
        name: 'Premium CV',
        amount: 2000,
        duration: '1 month',
        description:
            'Your Premium CV access is valid for 1 month after your payment is approved.',
        transferxoUrl:
            'https://transferxo.com/pay/VWAxBSNKWf',
    },

    CoverLetterPack: {
        name: 'AI Cover Letter Pack',
        amount: 1000,
        duration: '7 days',
        description:
            'Your AI Cover Letter Pack is valid for 7 days after your payment is approved. You can generate and download cover letters during this period.',
        transferxoUrl:
            'https://transferxo.com/pay/aehMKIcVsi',
    },

    JobReady: {
        name: 'CareerFlow Job Ready',
        amount: 2500,
        duration: '1 month',
        description:
            'Your Job Ready access is valid for 1 month after your payment is approved. You can apply to eligible jobs through JobiHub during this period.',
        transferxoUrl:
            'https://transferxo.com/pay/hOXdhTBLbr',
    },
};

function formatExpiryDate(dateString: string | null) {
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

    const product =
        searchParams.get('product') || 'PremiumCV';

    const currentPayment =
        paymentDetails[product] || paymentDetails.PremiumCV;

    const [paymentReference, setPaymentReference] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const [paymentStatus, setPaymentStatus] = useState<
        'loading' | 'active' | 'pending' | 'inactive'
    >('loading');

    const [expiresAt, setExpiresAt] = useState<string | null>(null);

    // ============================================================
    // CHECK CURRENT PAYMENT STATUS
    // ============================================================

    const checkPaymentStatus = async () => {
        try {
            setPaymentStatus('loading');
            setExpiresAt(null);

            const status = await paymentsApi.status(product);

            if (status.approved === true) {
                setPaymentStatus('active');
                setExpiresAt(status.expiresAt ?? null);
                return;
            }

            // If there is no active approved payment, check payment history
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

            if (
                latestPayment &&
                latestPayment.status.toLowerCase() === 'pending'
            ) {
                setPaymentStatus('pending');
            } else {
                setPaymentStatus('inactive');
            }
        } catch (err) {
            console.error('PAYMENT STATUS ERROR:', err);
            setPaymentStatus('inactive');
        }
    };

    useEffect(() => {
        checkPaymentStatus();
    }, [product]);

    // ============================================================
    // SUBMIT PAYMENT
    // ============================================================

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        setMessage('');
        setError('');

        if (!paymentReference.trim()) {
            setError(
                'Please enter your TransferXO payment reference.'
            );
            return;
        }

        try {
            setSubmitting(true);

            const response = await paymentsApi.submit({
                product,
                amount: currentPayment.amount,
                paymentReference: paymentReference.trim(),
            });

            setMessage(response.message);
            setPaymentReference('');
            setPaymentStatus('pending');
        } catch (err: any) {
            setError(
                err?.message ||
                'Unable to submit your payment for verification.'
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Layout>
            <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-lg">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">

                        {/* ICON */}
                        <div className="flex justify-center mb-6">
                            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
                                <CreditCard className="w-7 h-7 text-[#1E3A8A]" />
                            </div>
                        </div>

                        {/* TITLE */}
                        <h1 className="text-2xl font-bold text-slate-900 text-center">
                            {currentPayment.name}
                        </h1>

                        <p className="mt-2 text-sm text-slate-500 text-center">
                            Complete your payment and submit your
                            TransferXO payment reference for verification.
                        </p>

                        {/* PRODUCT DETAILS */}
                        <div className="mt-6 rounded-xl bg-slate-50 border border-slate-200 p-4">

                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500">
                                    Product
                                </span>

                                <span className="text-sm font-semibold text-slate-900">
                                    {currentPayment.name}
                                </span>
                            </div>

                            <div className="flex justify-between items-center mt-3">
                                <span className="text-sm text-slate-500">
                                    Amount
                                </span>

                                <span className="text-lg font-bold text-[#1E3A8A]">
                                    ₦
                                    {currentPayment.amount.toLocaleString()}
                                </span>
                            </div>

                            {/* DURATION */}
                            <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-200">
                                <span className="flex items-center gap-2 text-sm text-slate-500">
                                    <Clock className="w-4 h-4" />
                                    Validity
                                </span>

                                <span className="text-sm font-semibold text-slate-900">
                                    {currentPayment.duration}
                                </span>
                            </div>
                        </div>

                        {/* DESCRIPTION */}
                        <div className="mt-4 rounded-xl bg-blue-50 border border-blue-100 p-4">
                            <p className="text-sm text-blue-800">
                                {currentPayment.description}
                            </p>

                            <p className="text-xs text-blue-700 mt-2">
                                Your validity period starts when your payment
                                is approved by JobiHub.
                            </p>
                        </div>

                        {/* LOADING */}
                        {paymentStatus === 'loading' && (
                            <div className="mt-5 rounded-xl bg-slate-50 border border-slate-200 p-4 text-center">
                                <p className="text-sm text-slate-600">
                                    Checking your payment status...
                                </p>
                            </div>
                        )}

                        {/* ACTIVE */}
                        {paymentStatus === 'active' && (
                            <div className="mt-5 rounded-xl bg-green-50 border border-green-200 p-4">
                                <div className="flex gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />

                                    <div>
                                        <p className="text-sm font-semibold text-green-800">
                                            Payment Approved
                                        </p>

                                        <p className="text-sm text-green-700 mt-1">
                                            Your {currentPayment.name} is
                                            currently active.
                                        </p>

                                        {expiresAt && (
                                            <div className="flex items-center gap-2 mt-3 text-sm font-medium text-green-800">
                                                <CalendarDays className="w-4 h-4" />

                                                <span>
                                                    Expires:{' '}
                                                    {formatExpiryDate(
                                                        expiresAt
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* PENDING */}
                        {paymentStatus === 'pending' && (
                            <div className="mt-5 rounded-xl bg-yellow-50 border border-yellow-200 p-4">
                                <div className="flex gap-3">
                                    <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0" />

                                    <div>
                                        <p className="text-sm font-semibold text-yellow-800">
                                            Payment Awaiting Verification
                                        </p>

                                        <p className="text-sm text-yellow-700 mt-1">
                                            Your payment has been submitted
                                            and is waiting for verification.
                                        </p>

                                        <p className="text-xs text-yellow-700 mt-2">
                                            Your access period will begin when
                                            the payment is approved.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* PAYMENT SUBMITTED MESSAGE */}
                        {message && (
                            <div className="mt-5 flex gap-3 rounded-xl bg-green-50 border border-green-200 p-4">
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />

                                <div>
                                    <p className="text-sm font-semibold text-green-800">
                                        Payment submitted
                                    </p>

                                    <p className="text-sm text-green-700 mt-1">
                                        {message}
                                    </p>

                                    <p className="text-xs text-green-700 mt-2">
                                        Your payment will be reviewed shortly.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* ERROR */}
                        {error && (
                            <div className="mt-5 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        {/* PAYMENT SECTION */}
                        {paymentStatus !== 'active' && (
                            <>
                                {/* TRANSFERXO */}
                                <div className="mt-6">
                                    <p className="text-sm font-semibold text-slate-900 mb-2">
                                        Step 1: Make your payment
                                    </p>

                                    <p className="text-sm text-slate-500 mb-4">
                                        Pay the exact amount using the
                                        TransferXO link below.
                                    </p>

                                    <a
                                        href={currentPayment.transferxoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center px-4 py-3 bg-[#1E3A8A] text-white rounded-lg text-sm font-semibold hover:bg-blue-900 transition"
                                    >
                                        Pay ₦
                                        {currentPayment.amount.toLocaleString()}{' '}
                                        with TransferXO
                                    </a>
                                </div>

                                {/* PAYMENT REFERENCE */}
                                <form
                                    onSubmit={handleSubmit}
                                    className="mt-6"
                                >
                                    <p className="text-sm font-semibold text-slate-900 mb-2">
                                        Step 2: Submit your payment reference
                                    </p>

                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        TransferXO Payment Reference
                                    </label>

                                    <input
                                        type="text"
                                        value={paymentReference}
                                        onChange={(e) =>
                                            setPaymentReference(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter your payment reference"
                                        disabled={submitting}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100"
                                    />

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full mt-4 px-4 py-3 bg-[#1E3A8A] text-white rounded-lg text-sm font-semibold hover:bg-blue-900 transition disabled:opacity-50"
                                    >
                                        {submitting
                                            ? 'Submitting...'
                                            : 'Submit Payment for Verification'}
                                    </button>
                                </form>
                            </>
                        )}

                        {/* BACK */}
                        <div className="mt-6 text-center">
                            <Link
                                to="/my-cvs"
                                className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-[#1E3A8A]"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to My CVs
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}