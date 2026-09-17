import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Search,
    MapPin,
    User,
    Briefcase,
    Eye,
    RefreshCw,
    Bookmark,
} from 'lucide-react';

import AppLayout from '../../components/layout/AppLayout';
import { Card, Spinner } from '../../components/ui';
import {
    businessApi,
    type Candidate,
} from '../../api/businessApi';

export default function SearchCandidates() {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [query, setQuery] = useState('');
    const [location, setLocation] = useState('');
    const [title, setTitle] = useState('');
    const [savingCandidate, setSavingCandidate] = useState<string | null>(null);
    const [savedCandidates, setSavedCandidates] = useState<Set<string>>(
        new Set()
    );

    const loadCandidates = async () => {
        try {
            setLoading(true);
            setError('');

            const result = await businessApi.searchCandidates({
                query: query.trim() || undefined,
                location: location.trim() || undefined,
                title: title.trim() || undefined,
            });

            setCandidates(result);
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                err?.message ||
                'Failed to load candidates.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCandidates();
        loadSavedCandidateIds();
    }, []);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        await loadCandidates();
    };
    const handleSaveCandidate = async (cvId: string) => {
        try {
            setSavingCandidate(cvId);

            await businessApi.saveCandidate(cvId);

            setSavedCandidates((previous) => {
                const next = new Set(previous);
                next.add(cvId);
                return next;
            });
        } catch (err: any) {
            alert(
                err?.response?.data?.message ||
                err?.message ||
                'Failed to save candidate.'
            );
        } finally {
            setSavingCandidate(null);
        }
    };
    const handleUnsaveCandidate = async (cvId: string) => {
        try {
            setSavingCandidate(cvId);

            await businessApi.removeSavedCandidate(cvId);

            setSavedCandidates((previous) => {
                const next = new Set(previous);
                next.delete(cvId);
                return next;
            });
        } catch (err: any) {
            alert(
                err?.response?.data?.message ||
                err?.message ||
                'Failed to remove candidate from saved candidates.'
            );
        } finally {
            setSavingCandidate(null);
        }
    };
    const loadSavedCandidateIds = async () => {
        try {
            const saved = await businessApi.getSavedCandidates();

            setSavedCandidates(
                new Set(saved.map((item) => item.cvId))
            );
        } catch {
            // Do not prevent candidate search if saved candidates fail to load.
        }
    };

    const handleClear = async () => {
        setQuery('');
        setLocation('');
        setTitle('');

        try {
            setLoading(true);
            setError('');

            const result = await businessApi.searchCandidates();
            setCandidates(result);
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                err?.message ||
                'Failed to load candidates.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout>
            <div className="mx-auto max-w-7xl p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Search Candidates
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Find qualified candidates for your job openings.
                    </p>
                </div>

                {/* Search form */}
                <Card className="mb-8">
                    <form onSubmit={handleSearch}>
                        <div className="grid gap-4 md:grid-cols-3">
                            {/* Keyword */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Keyword
                                </label>

                                <div className="relative">
                                    <Search
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Name, skill or keyword"
                                        className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>
                            </div>

                            {/* Location */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Location
                                </label>

                                <div className="relative">
                                    <MapPin
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="e.g. Lagos"
                                        className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>
                            </div>

                            {/* Professional title */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Professional Title
                                </label>

                                <div className="relative">
                                    <Briefcase
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g. Software Engineer"
                                        className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Search size={18} />
                                Search Candidates
                            </button>

                            <button
                                type="button"
                                onClick={handleClear}
                                disabled={loading}
                                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <RefreshCw size={17} />
                                Clear
                            </button>
                        </div>
                    </form>
                </Card>

                {/* Error */}
                {error && (
                    <Card className="mb-6 border border-red-200 bg-red-50">
                        <p className="text-sm text-red-700">
                            {error}
                        </p>
                    </Card>
                )}

                {/* Loading */}
                {loading ? (
                    <div className="flex justify-center py-16">
                        <Spinner />
                    </div>
                ) : (
                    <>
                        {/* Results header */}
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Candidates
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    {candidates.length}{' '}
                                    {candidates.length === 1
                                        ? 'candidate'
                                        : 'candidates'}{' '}
                                    found
                                </p>
                            </div>
                        </div>

                        {/* Empty state */}
                        {candidates.length === 0 ? (
                            <Card className="py-16 text-center">
                                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                                    <User size={28} className="text-gray-400" />
                                </div>

                                <h3 className="text-lg font-semibold text-gray-900">
                                    No candidates found
                                </h3>

                                <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                                    Try changing your search terms, location, or
                                    professional title.
                                </p>
                            </Card>
                        ) : (
                            <div className="grid gap-5 md:grid-cols-2">
                                {candidates.map((candidate) => (
                                    <Card
                                        key={candidate.id}
                                        className="transition hover:shadow-md"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex min-w-0 items-start gap-4">
                                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100">
                                                    <User
                                                        size={24}
                                                        className="text-blue-600"
                                                    />
                                                </div>

                                                <div className="min-w-0">
                                                    <h3 className="truncate text-lg font-semibold text-gray-900">
                                                        {candidate.fullName}
                                                    </h3>

                                                    <p className="mt-1 text-sm font-medium text-blue-600">
                                                        {candidate.professionalTitle ||
                                                            'Professional'}
                                                    </p>

                                                    {candidate.location && (
                                                        <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
                                                            <MapPin size={15} />
                                                            <span>
                                {candidate.location}
                              </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bio */}
                                        {candidate.shortBio && (
                                            <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                                                {candidate.shortBio}
                                            </p>
                                        )}

                                        {/* Skills */}
                                        {candidate.skills?.length > 0 && (
                                            <div className="mt-5">
                                                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                    Skills
                                                </p>

                                                <div className="flex flex-wrap gap-2">
                                                    {candidate.skills.map((skill) => (
                                                        <span
                                                            key={skill.id}
                                                            className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                                                        >
                              {skill.name}
                            </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Action */}
                                        {/* Actions */}
                                        <div className="mt-6 flex flex-wrap gap-3 border-t border-gray-100 pt-4">
                                            <Link
                                                to={`/business/candidates/${candidate.id}`}
                                                className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
                                            >
                                                <Eye size={17} />
                                                View CV
                                            </Link>

                                            {savedCandidates.has(candidate.id) ? (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleUnsaveCandidate(candidate.id)
                                                    }
                                                    disabled={savingCandidate === candidate.id}
                                                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    <Bookmark size={17} />

                                                    {savingCandidate === candidate.id
                                                        ? 'Removing...'
                                                        : 'Unsave'}
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleSaveCandidate(candidate.id)
                                                    }
                                                    disabled={savingCandidate === candidate.id}
                                                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    <Bookmark size={17} />

                                                    {savingCandidate === candidate.id
                                                        ? 'Saving...'
                                                        : 'Save Candidate'}
                                                </button>
                                            )}
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </AppLayout>
    );
}