import { FormEvent, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, CreditCard, ArrowLeft } from 'lucide-react';
import { paymentsApi } from '../api/paymentsApi';
import Layout from '../components/layout/Layout';

export default function PaymentVerification() {
    const [searchParams] = useSearchParams();

    const product = searchParams.get('product') || 'PremiumCV';
    const amount = Number(searchParams.get('amount')) || 2000;
    const paymentDetails: Record<
        string,
        {
            name: string;
            amount: number;
            transferxoUrl: string;
        }
    > = {
        PremiumCV: {
            name: 'Premium CV',
            amount: 2000,
            transferxoUrl:
                'https://transferxo.com/pay/VWAxBSNKWf',
        },

        CoverLetterPack: {
            name: 'AI Cover Letter Pack',
            amount: 1000,
            transferxoUrl:
                'https://transferxo.com/pay/aehMKIcVsi',
        },

        JobReady: {
            name: 'CareerFlow Job Ready',
            amount: 2500,
            transferxoUrl:
                'https://transferxo.com/pay/hOXdhTBLbr',
        },
    };

    const currentPayment =
        paymentDetails[product] ||
        paymentDetails.PremiumCV;

    const [paymentReference, setPaymentReference] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        setMessage('');
        setError('');

        if (!paymentReference.trim()) {
            setError('Please enter your TransferXO payment reference.');
            return;
        }

        try {
            setSubmitting(true);

            const response = await paymentsApi.submit({
                product,
                amount,
                paymentReference: paymentReference.trim(),
            });

            setMessage(response.message);
            setPaymentReference('');
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
                        <div className="flex justify-center mb-6">
                            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
                                <CreditCard className="w-7 h-7 text-[#1E3A8A]" />
                            </div>
                        </div>

                        <h1 className="text-2xl font-bold text-slate-900 text-center">
                            Confirm Your Payment
                        </h1>

                        <p className="mt-2 text-sm text-slate-500 text-center">
                            After completing your TransferXO payment, enter your
                            payment reference below for verification.
                        </p>

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
                  ₦{amount.toLocaleString()}
                </span>
                            </div>
                        </div>

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

                        {error && (
                            <div className="mt-5 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                                {error}
                            </div>
                        )}
                        <a
                            href={currentPayment.transferxoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center px-4 py-3 bg-[#1E3A8A] text-white rounded-lg text-sm font-semibold hover:bg-blue-900 transition"
                        >
                            Pay ₦{currentPayment.amount.toLocaleString()} with TransferXO
                        </a>

                        <form onSubmit={handleSubmit} className="mt-6">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                TransferXO Payment Reference
                            </label>

                            <input
                                type="text"
                                value={paymentReference}
                                onChange={(e) =>
                                    setPaymentReference(e.target.value)
                                }
                                placeholder="Enter your payment reference"
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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