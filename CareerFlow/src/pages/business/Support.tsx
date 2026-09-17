import { useState } from 'react';
import {
    HeadphonesIcon,
    Send,
    CheckCircle,
} from 'lucide-react';

import AppLayout from '../../components/layout/AppLayout';
import {
    Input,
    Textarea,
    Select,
    Card,
    Spinner,
} from '../../components/ui';

import { supportApi } from '../../api/supportApi';

const CATEGORY_OPTIONS = [
    {
        value: 'Account',
        label: 'Account',
    },
    {
        value: 'Company Profile',
        label: 'Company Profile',
    },
    {
        value: 'Job Posting',
        label: 'Job Posting',
    },
    {
        value: 'Recruitment',
        label: 'Recruitment',
    },
    {
        value: 'Applicants',
        label: 'Applicants',
    },
    {
        value: 'Technical',
        label: 'Technical Issue',
    },
    {
        value: 'Other',
        label: 'Other',
    },
];

const PRIORITY_OPTIONS = [
    {
        value: 'low',
        label: 'Low',
    },
    {
        value: 'medium',
        label: 'Medium',
    },
    {
        value: 'high',
        label: 'High',
    },
    {
        value: 'critical',
        label: 'Critical',
    },
];

export default function Support() {
    const [form, setForm] = useState({
        category: 'Account',
        subject: '',
        description: '',
        priority: 'medium',
    });

    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [ticketId, setTicketId] = useState<string | number | null>(
        null
    );

    const set = (
        key: keyof typeof form,
        value: string
    ) => {
        setForm(previous => ({
            ...previous,
            [key]: value,
        }));
    };

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        if (!form.subject.trim()) {
            alert('Please enter a subject.');
            return;
        }

        if (!form.description.trim()) {
            alert('Please describe the issue.');
            return;
        }

        setSubmitting(true);

        try {
            const response = await supportApi.submit({
                category: form.category,
                subject: form.subject.trim(),
                description: form.description.trim(),
                priority: form.priority,
            });

            setTicketId(response.id);
            setSubmitted(true);

            setForm({
                category: 'Account',
                subject: '',
                description: '',
                priority: 'medium',
            });
        } catch (error) {
            alert(
                error instanceof Error
                    ? error.message
                    : 'Failed to submit support request.'
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AppLayout>
            <div className="p-6 lg:p-8">
                <div className="max-w-3xl mx-auto">

                    {/* HEADER */}

                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-1">
                            <HeadphonesIcon className="w-5 h-5 text-blue-600" />

                            <h1 className="text-xl font-bold text-slate-900">
                                Support
                            </h1>
                        </div>

                        <p className="text-sm text-slate-500">
                            Contact the JobiHub support team if you
                            need help with your account, jobs, applicants,
                            or recruitment services.
                        </p>
                    </div>

                    {/* SUCCESS */}

                    {submitted && (
                        <Card className="p-5 mb-6 border border-emerald-200 bg-emerald-50">

                            <div className="flex items-start gap-3">

                                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />

                                <div>

                                    <h2 className="text-sm font-semibold text-emerald-800">
                                        Support request submitted
                                    </h2>

                                    <p className="text-xs text-emerald-700 mt-1">
                                        Your request has been sent to the
                                        JobiHub support team.
                                    </p>

                                    {ticketId !== null && (
                                        <p className="text-xs font-semibold text-emerald-800 mt-2">
                                            Ticket #{ticketId}
                                        </p>
                                    )}

                                </div>

                            </div>

                            <button
                                type="button"
                                onClick={() => setSubmitted(false)}
                                className="mt-4 text-xs font-medium text-emerald-700 hover:text-emerald-900"
                            >
                                Submit another request
                            </button>

                        </Card>
                    )}

                    {/* FORM */}

                    <Card className="p-6">

                        <div className="mb-5">

                            <h2 className="text-base font-semibold text-slate-900">
                                Contact Support
                            </h2>

                            <p className="text-xs text-slate-500 mt-1">
                                Provide as much detail as possible so our
                                team can help you quickly.
                            </p>

                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            <Select
                                label="Category"
                                value={form.category}
                                onChange={e =>
                                    set(
                                        'category',
                                        e.target.value
                                    )
                                }
                                options={CATEGORY_OPTIONS}
                            />

                            <Input
                                label="Subject"
                                value={form.subject}
                                onChange={e =>
                                    set(
                                        'subject',
                                        e.target.value
                                    )
                                }
                                placeholder="e.g. I cannot publish my job"
                                required
                            />

                            <Textarea
                                label="Description"
                                value={form.description}
                                onChange={e =>
                                    set(
                                        'description',
                                        e.target.value
                                    )
                                }
                                placeholder="Describe the issue or question..."
                                rows={7}
                                required
                            />

                            <Select
                                label="Priority"
                                value={form.priority}
                                onChange={e =>
                                    set(
                                        'priority',
                                        e.target.value
                                    )
                                }
                                options={PRIORITY_OPTIONS}
                            />

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-[#1E3A8A] text-white text-sm font-semibold rounded-lg hover:bg-blue-900 disabled:opacity-60 transition"
                            >

                                {submitting ? (
                                    <Spinner size="sm" />
                                ) : (
                                    <Send className="w-4 h-4" />
                                )}

                                {submitting
                                    ? 'Submitting...'
                                    : 'Submit Support Request'}

                            </button>

                        </form>

                    </Card>

                </div>
            </div>
        </AppLayout>
    );
}