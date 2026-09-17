import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Briefcase,
    Calendar,
    ExternalLink,
    FolderKanban,
    GraduationCap,
    Mail,
    MapPin,
    Phone,
    User,
    Code2,
} from 'lucide-react';

import AppLayout from '../../components/layout/AppLayout';
import { Card, Spinner } from '../../components/ui';
import {
    businessApi,
    type CandidateCv,
} from '../../api/businessApi';

export default function CandidateCvPage() {
    const navigate = useNavigate();
    const { cvId } = useParams();

    const [data, setData] = useState<CandidateCv | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!cvId) {
            setError('CV ID is missing.');
            setLoading(false);
            return;
        }

        loadCv(cvId);
    }, [cvId]);

    const loadCv = async (id: string) => {
        try {
            setLoading(true);
            setError('');

            const result = await businessApi.getCandidateCv(id);
            setData(result);
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                err?.message ||
                'Failed to load candidate CV.'
            );
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date?: string) => {
        if (!date) return '';

        return new Date(date).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatDateRange = (
        startDate?: string,
        endDate?: string,
        isCurrent?: boolean
    ) => {
        const start = startDate ? formatDate(startDate) : '';

        if (isCurrent) {
            return `${start} - Present`;
        }

        const end = endDate ? formatDate(endDate) : '';

        if (start && end) {
            return `${start} - ${end}`;
        }

        return start || end;
    };

    const normalizeUrl = (url?: string) => {
        if (!url) return '';

        const trimmed = url.trim();

        if (!trimmed) return '';

        if (
            trimmed.startsWith('http://') ||
            trimmed.startsWith('https://')
        ) {
            return trimmed;
        }

        return `https://${trimmed}`;
    };

    if (loading) {
        return (
            <AppLayout>
                <div className="flex min-h-[60vh] items-center justify-center">
                    <Spinner />
                </div>
            </AppLayout>
        );
    }

    if (error || !data) {
        return (
            <AppLayout>
                <div className="mx-auto max-w-5xl p-6 lg:p-8">
                    <button
                        type="button"
                        onClick={() => navigate('/business/candidates')}
                        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft size={18} />
                        Back to Candidates
                    </button>

                    <Card className="border border-red-200 bg-red-50 p-6">
                        <h2 className="text-lg font-semibold text-red-800">
                            Unable to load CV
                        </h2>

                        <p className="mt-2 text-sm text-red-700">
                            {error || 'Candidate CV could not be found.'}
                        </p>
                    </Card>
                </div>
            </AppLayout>
        );
    }

    const { cv } = data;

    return (
        <AppLayout>
            <div className="mx-auto max-w-5xl p-6 lg:p-8">
                {/* Back */}
                <button
                    type="button"
                    onClick={() => navigate('/business/candidates')}
                    className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft size={18} />
                    Back to Candidates
                </button>

                {/* Header */}
                <Card className="overflow-hidden">
                    <div className="border-b border-gray-100 p-6 lg:p-8">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-blue-100">
                                <User
                                    size={38}
                                    className="text-blue-600"
                                />
                            </div>

                            <div className="min-w-0 flex-1">
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {cv.fullName}
                                </h1>

                                <p className="mt-2 text-lg font-medium text-blue-600">
                                    {cv.professionalTitle}
                                </p>

                                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600">
                                    {cv.location && (
                                        <div className="flex items-center gap-2">
                                            <MapPin size={16} />
                                            <span>{cv.location}</span>
                                        </div>
                                    )}

                                    {cv.email && (
                                        <div className="flex items-center gap-2">
                                            <Mail size={16} />
                                            <span>{cv.email}</span>
                                        </div>
                                    )}

                                    {cv.phone && (
                                        <div className="flex items-center gap-2">
                                            <Phone size={16} />
                                            <span>{cv.phone}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 flex flex-wrap gap-4">
                                    {cv.linkedInUrl && (
                                        <a
                                            href={normalizeUrl(cv.linkedInUrl)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
                                        >
                                            LinkedIn
                                            <ExternalLink size={14} />
                                        </a>
                                    )}

                                    {cv.gitHubUrl && (
                                        <a
                                            href={normalizeUrl(cv.gitHubUrl)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:underline"
                                        >
                                            GitHub
                                            <ExternalLink size={14} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Summary */}
                    {cv.shortBio && (
                        <div className="border-b border-gray-100 p-6 lg:p-8">
                            <h2 className="mb-4 text-xl font-semibold text-gray-900">
                                Professional Summary
                            </h2>

                            <p className="whitespace-pre-line leading-7 text-gray-600">
                                {cv.shortBio}
                            </p>
                        </div>
                    )}

                    {/* Skills */}
                    {cv.skills?.length > 0 && (
                        <div className="border-b border-gray-100 p-6 lg:p-8">
                            <div className="mb-4 flex items-center gap-2">
                                <Code2
                                    size={20}
                                    className="text-blue-600"
                                />

                                <h2 className="text-xl font-semibold text-gray-900">
                                    Skills
                                </h2>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {cv.skills.map((skill) => (
                                    <span
                                        key={skill.id}
                                        className="rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700"
                                    >
                    {skill.name}
                  </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Experience */}
                    {cv.experiences?.length > 0 && (
                        <div className="border-b border-gray-100 p-6 lg:p-8">
                            <div className="mb-6 flex items-center gap-2">
                                <Briefcase
                                    size={20}
                                    className="text-blue-600"
                                />

                                <h2 className="text-xl font-semibold text-gray-900">
                                    Experience
                                </h2>
                            </div>

                            <div className="space-y-8">
                                {cv.experiences.map((experience) => (
                                    <div
                                        key={experience.id}
                                        className="relative pl-6"
                                    >
                                        <div className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-blue-600" />

                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {experience.jobTitle}
                                        </h3>

                                        <p className="mt-1 font-medium text-gray-700">
                                            {experience.company}
                                        </p>

                                        {experience.location && (
                                            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                                                <MapPin size={15} />
                                                {experience.location}
                                            </div>
                                        )}

                                        <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                                            <Calendar size={15} />

                                            {formatDateRange(
                                                experience.startDate,
                                                experience.endDate,
                                                experience.isCurrent
                                            )}
                                        </div>

                                        {experience.description && (
                                            <p className="mt-4 whitespace-pre-line leading-7 text-gray-600">
                                                {experience.description}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Projects */}
                    {cv.projects?.length > 0 && (
                        <div className="border-b border-gray-100 p-6 lg:p-8">
                            <div className="mb-6 flex items-center gap-2">
                                <FolderKanban
                                    size={20}
                                    className="text-blue-600"
                                />

                                <h2 className="text-xl font-semibold text-gray-900">
                                    Projects
                                </h2>
                            </div>

                            <div className="space-y-6">
                                {cv.projects.map((project) => (
                                    <div
                                        key={project.id}
                                        className="rounded-lg border border-gray-200 p-5"
                                    >
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {project.title}
                                                </h3>

                                                {project.role && (
                                                    <p className="mt-1 text-sm font-medium text-blue-600">
                                                        {project.role}
                                                    </p>
                                                )}
                                            </div>

                                            {project.projectUrl &&
                                                normalizeUrl(project.projectUrl) && (
                                                    <a
                                                        href={normalizeUrl(
                                                            project.projectUrl
                                                        )}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
                                                    >
                                                        View Project
                                                        <ExternalLink size={14} />
                                                    </a>
                                                )}
                                        </div>

                                        {project.description && (
                                            <p className="mt-4 whitespace-pre-line leading-7 text-gray-600">
                                                {project.description}
                                            </p>
                                        )}

                                        {project.technologies && (
                                            <div className="mt-4">
                                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                    Technologies
                                                </p>

                                                <p className="mt-1 text-sm text-gray-600">
                                                    {project.technologies}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Education */}
                    {cv.educations?.length > 0 && (
                        <div className="p-6 lg:p-8">
                            <div className="mb-6 flex items-center gap-2">
                                <GraduationCap
                                    size={20}
                                    className="text-blue-600"
                                />

                                <h2 className="text-xl font-semibold text-gray-900">
                                    Education
                                </h2>
                            </div>

                            <div className="space-y-6">
                                {cv.educations.map((education) => (
                                    <div
                                        key={education.id}
                                        className="relative pl-6"
                                    >
                                        <div className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-blue-600" />

                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {education.degree}
                                        </h3>

                                        {education.fieldOfStudy && (
                                            <p className="mt-1 font-medium text-gray-700">
                                                {education.fieldOfStudy}
                                            </p>
                                        )}

                                        <p className="mt-1 text-gray-600">
                                            {education.institution}
                                        </p>

                                        {education.location && (
                                            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                                                <MapPin size={15} />
                                                {education.location}
                                            </div>
                                        )}

                                        <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                                            <Calendar size={15} />

                                            {formatDateRange(
                                                education.startDate,
                                                education.endDate,
                                                education.isCurrent
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}