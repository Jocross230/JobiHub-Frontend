import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Bookmark,
    Eye,
    MapPin,
    User,
    Trash2,
} from 'lucide-react';

import AppLayout from '../../components/layout/AppLayout';
import { Card, Spinner } from '../../components/ui';
import {
    businessApi,
    type SavedCandidate,
} from '../../api/businessApi';

export default function SavedCandidates() {
    const [candidates, setCandidates] = useState<SavedCandidate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [removingId, setRemovingId] = useState<string | null>(null);

    const loadSavedCandidates = async () => {
        try {
            setLoading(true);
            setError('');

            const result =
                await businessApi.getSavedCandidates();

            setCandidates(result);
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                err?.message ||
                'Failed to load saved candidates.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSavedCandidates();
    }, []);

    const handleRemove = async (cvId: string) => {
        const confirmed = window.confirm(
            'Remove this candidate from your saved candidates?'
        );

        if (!confirmed) {
            return;
        }

        try {
            setRemovingId(cvId);

            await businessApi.removeSavedCandidate(cvId);

            setCandidates((previous) =>
                previous.filter(
                    (item) => item.cvId !== cvId
                )
            );
        } catch (err: any) {
            alert(
                err?.response?.data?.message ||
                err?.message ||
                'Failed to remove candidate.'
            );
        } finally {
            setRemovingId(null);
        }
    };

    return (
        <AppLayout>
            <div className="mx-auto max-w-7xl p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100">
                            <Bookmark
                                size={22}
                                className="text-blue-600"
                            />
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Saved Candidates
                            </h1>

                            <p className="mt-1 text-gray-600">
                                Candidates you saved for future recruitment.
                            </p>
                        </div>
                    </div>
                </div>

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
                ) : candidates.length === 0 ? (
                    <Card className="py-16 text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                            <Bookmark
                                size={28}
                                className="text-gray-400"
                            />
                        </div>

                        <h2 className="text-lg font-semibold text-gray-900">
                            No saved candidates
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                            Candidates you save from Search Candidates
                            will appear here.
                        </p>

                        <Link
                            to="/business/candidates"
                            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
                        >
                            <User size={17} />
                            Search Candidates
                        </Link>
                    </Card>
                ) : (
                    <>
                        {/* Results count */}
                        <div className="mb-5">
                            <p className="text-sm text-gray-500">
                                {candidates.length}{' '}
                                {candidates.length === 1
                                    ? 'saved candidate'
                                    : 'saved candidates'}
                            </p>
                        </div>

                        {/* Candidates */}
                        <div className="grid gap-5 md:grid-cols-2">
                            {candidates.map((item) => {
                                const candidate = item.candidate;

                                return (
                                    <Card
                                        key={item.id}
                                        className="transition hover:shadow-md"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100">
                                                <User
                                                    size={24}
                                                    className="text-blue-600"
                                                />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <h2 className="text-lg font-semibold text-gray-900">
                                                    {candidate.fullName}
                                                </h2>

                                                <p className="mt-1 text-sm font-medium text-blue-600">
                                                    {candidate.professionalTitle ||
                                                        'Professional'}
                                                </p>

                                                {candidate.location && (
                                                    <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
                                                        <MapPin size={15} />
                                                        {candidate.location}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {candidate.shortBio && (
                                            <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                                                {candidate.shortBio}
                                            </p>
                                        )}

                                        {candidate.skills?.length > 0 && (
                                            <div className="mt-5">
                                                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                    Skills
                                                </p>

                                                <div className="flex flex-wrap gap-2">
                                                    {candidate.skills.map(
                                                        (skill) => (
                                                            <span
                                                                key={skill.id}
                                                                className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                                                            >
                                {skill.name}
                              </span>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="mt-6 flex flex-wrap gap-3 border-t border-gray-100 pt-4">
                                            <Link
                                                to={`/business/candidates/${candidate.id}`}
                                                className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
                                            >
                                                <Eye size={17} />
                                                View CV
                                            </Link>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemove(candidate.id)
                                                }
                                                disabled={
                                                    removingId === candidate.id
                                                }
                                                className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                <Trash2 size={17} />

                                                {removingId === candidate.id
                                                    ? 'Removing...'
                                                    : 'Unsave'}
                                            </button>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </AppLayout>
    );
}