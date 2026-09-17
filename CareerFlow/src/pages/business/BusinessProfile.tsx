import { useEffect, useState } from 'react';
import { Building2, Save } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import { Card } from '../../components/ui';
import { businessApi } from '../../api/businessApi';

export default function BusinessProfile() {
    const [form, setForm] = useState({
        companyName: '',
        industry: '',
        description: '',
        website: '',
        location: '',
        companySize: '',
        contactEmail: '',
        contactPhone: '',
    });

    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const loadProfile = async () => {
            try {
                setLoading(true);
                setError('');

                const business = await businessApi.getMyBusiness();

                if (business) {
                    setForm({
                        companyName: business.companyName || '',
                        industry: business.industry || '',
                        description: business.description || '',
                        website: business.website || '',
                        location: business.location || '',
                        companySize: business.companySize || '',
                        contactEmail: business.contactEmail || '',
                        contactPhone: business.contactPhone || '',
                    });
                }
            } catch (err) {
                console.error('Failed to load business profile:', err);
                setError('Unable to load your company profile.');
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    const updateField = (
        field: keyof typeof form,
        value: string
    ) => {
        setForm(previous => ({
            ...previous,
            [field]: value,
        }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        setSaving(true);
        setMessage('');
        setError('');

        try {
            await businessApi.updateBusiness('', form);

            setMessage('Company profile saved successfully.');
        } catch (err) {
            console.error('Failed to save business profile:', err);
            setError('Unable to save your company profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <AppLayout>
                <div className="p-6 lg:p-8 max-w-4xl mx-auto">
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                            <p className="text-sm text-slate-500">
                                Loading company profile...
                            </p>
                        </div>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="p-6 lg:p-8 max-w-4xl mx-auto">

                <div className="mb-6">
                    <h1 className="text-xl font-bold text-slate-900">
                        Company Profile
                    </h1>

                    <p className="text-sm text-slate-500 mt-1">
                        Tell job seekers about your company.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    <Card className="p-6">

                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-blue-600" />
                            </div>

                            <div>
                                <h2 className="text-sm font-semibold text-slate-900">
                                    Company Information
                                </h2>

                                <p className="text-xs text-slate-500">
                                    Basic information about your business.
                                </p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-5">

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Company name
                                </label>

                                <input
                                    type="text"
                                    value={form.companyName}
                                    onChange={e =>
                                        updateField('companyName', e.target.value)
                                    }
                                    placeholder="e.g. Acme Technologies"
                                    required
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Industry
                                </label>

                                <input
                                    type="text"
                                    value={form.industry}
                                    onChange={e =>
                                        updateField('industry', e.target.value)
                                    }
                                    placeholder="e.g. Information Technology"
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Website
                                </label>

                                <input
                                    type="url"
                                    value={form.website}
                                    onChange={e =>
                                        updateField('website', e.target.value)
                                    }
                                    placeholder="https://example.com"
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Location
                                </label>

                                <input
                                    type="text"
                                    value={form.location}
                                    onChange={e =>
                                        updateField('location', e.target.value)
                                    }
                                    placeholder="e.g. Lagos, Nigeria"
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Company size
                                </label>

                                <select
                                    value={form.companySize}
                                    onChange={e =>
                                        updateField('companySize', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value="">
                                        Select company size
                                    </option>
                                    <option value="1-10">
                                        1–10 employees
                                    </option>
                                    <option value="11-50">
                                        11–50 employees
                                    </option>
                                    <option value="51-200">
                                        51–200 employees
                                    </option>
                                    <option value="201-500">
                                        201–500 employees
                                    </option>
                                    <option value="501-1000">
                                        501–1,000 employees
                                    </option>
                                    <option value="1001+">
                                        1,001+ employees
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Contact email
                                </label>

                                <input
                                    type="email"
                                    value={form.contactEmail}
                                    onChange={e =>
                                        updateField('contactEmail', e.target.value)
                                    }
                                    placeholder="hr@example.com"
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Contact phone
                                </label>

                                <input
                                    type="tel"
                                    value={form.contactPhone}
                                    onChange={e =>
                                        updateField('contactPhone', e.target.value)
                                    }
                                    placeholder="+234..."
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                        </div>

                        <div className="mt-5">
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Company description
                            </label>

                            <textarea
                                value={form.description}
                                onChange={e =>
                                    updateField('description', e.target.value)
                                }
                                placeholder="Tell candidates about your company, what you do, and what makes your workplace unique."
                                rows={6}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                    </Card>

                    {message && (
                        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end">

                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            <Save className="w-4 h-4" />

                            {saving ? 'Saving...' : 'Save Profile'}
                        </button>

                    </div>

                </form>
            </div>
        </AppLayout>
    );
}