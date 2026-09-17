import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Briefcase,
    Calendar,
    CheckCircle,
    ExternalLink,
    GraduationCap,
    Mail,
    MapPin,
    Phone,
    User,
    Code2,
    FolderKanban,
} from 'lucide-react';

import AppLayout from '../../components/layout/AppLayout';
import { Card, Spinner } from '../../components/ui';
import {
    businessApi,
    type SubmittedCv,
} from '../../api/businessApi';

export default function ApplicantCv() {
    const navigate = useNavigate();
    const { applicationId } = useParams();

    const [data, setData] = useState<SubmittedCv | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!applicationId) {
            setError('Application ID is missing.');
            setLoading(false);
            return;
        }

        loadCv(applicationId);
    }, [applicationId]);

    const loadCv = async (id: string) => {
        try {
            setLoading(true);
            setError('');

            const result = await businessApi.getApplicantCv(id);

            setData(result);
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                err?.message ||
                'Failed to load submitted CV.'
            );
        } finally {
            setLoading(false);
        }
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

    if (loading) {
        return (
            <AppLayout>
                <div className="flex justify-center py-20">
                    <Spinner size="lg" />
                </div>
            </AppLayout>
        );
    }

    if (error || !data) {
        return (
            <AppLayout>
                <div className="mx-auto max-w-5xl p-6 lg:p-8">
                    <button
                        onClick={() => navigate('/business/applicants')}
                        className="mb-6 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
                    >
                        <ArrowLeft size={18} />
                        Back to Applicants
                    </button>

                    <div className="rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                        {error || 'Submitted CV could not be found.'}
                    </div>
                </div>
            </AppLayout>
        );
    }

    const { cv, application } = data;

    return (
        <AppLayout>
            <div className="mx-auto max-w-5xl p-6 lg:p-8">
                <button
                    onClick={() => navigate('/business/applicants')}
                    className="mb-6 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
                >
                    <ArrowLeft size={18} />
                    Back to Applicants
                </button>

                {/* Header */}
                <Card className="overflow-hidden">
                    <div className="bg-[#1E3A8A] px-6 py-8 text-white lg:px-8">
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white text-2xl font-bold text-[#1E3A8A]">
                                {cv.fullName?.charAt(0).toUpperCase() || '?'}
                            </div>

                            <div className="min-w-0">
                                <h1 className="text-3xl font-bold">
                                    {cv.fullName || 'Applicant'}
                                </h1>

                                {cv.professionalTitle && (
                                    <p className="mt-2 text-lg text-blue-100">
                                        {cv.professionalTitle}
                                    </p>
                                )}

                                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-blue-100">
                                    {cv.location && (
                                        <span className="inline-flex items-center gap-1.5">
                      <MapPin size={15} />
                                            {cv.location}
                    </span>
                                    )}

                                    {cv.email && (
                                        <span className="inline-flex items-center gap-1.5">
                      <Mail size={15} />
                                            {cv.email}
                    </span>
                                    )}

                                    {cv.phone && (
                                        <span className="inline-flex items-center gap-1.5">
                      <Phone size={15} />
                                            {cv.phone}
                    </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Application information */}
                    <div className="grid gap-4 border-b border-slate-100 px-6 py-5 md:grid-cols-3 lg:px-8">
                        <div>
                            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                                Applied for
                            </p>

                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                                <Briefcase size={16} className="text-slate-400" />
                                {application.job?.title || 'Job'}
                            </div>
                        </div>

                        <div>
                            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                                Applied
                            </p>

                            <div className="flex items-center gap-2 text-sm text-slate-700">
                                <Calendar size={16} className="text-slate-400" />
                                {formatDate(application.appliedAt)}
                            </div>
                        </div>

                        <div>
                            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                                Status
                            </p>

                            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium capitalize text-blue-700">
                <CheckCircle size={14} />
                                {application.status}
              </span>
                        </div>
                    </div>

                    <div className="px-6 py-8 lg:px-8">
                        {/* Professional Summary */}
                        {cv.shortBio && (
                            <section className="mb-10">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                                        <User size={19} className="text-blue-700" />
                                    </div>

                                    <h2 className="text-xl font-bold text-slate-900">
                                        Professional Summary
                                    </h2>
                                </div>

                                <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                                    {cv.shortBio}
                                </p>
                            </section>
                        )}

                        {/* Contact */}
                        <section className="mb-10">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                                    <User size={19} className="text-slate-700" />
                                </div>

                                <h2 className="text-xl font-bold text-slate-900">
                                    Contact Information
                                </h2>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                {cv.email && (
                                    <div className="rounded-lg border border-slate-200 p-4">
                                        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                                            Email
                                        </p>

                                        <p className="break-all text-sm font-medium text-slate-800">
                                            {cv.email}
                                        </p>
                                    </div>
                                )}

                                {cv.phone && (
                                    <div className="rounded-lg border border-slate-200 p-4">
                                        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                                            Phone
                                        </p>

                                        <p className="text-sm font-medium text-slate-800">
                                            {cv.phone}
                                        </p>
                                    </div>
                                )}

                                {cv.location && (
                                    <div className="rounded-lg border border-slate-200 p-4">
                                        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                                            Location
                                        </p>

                                        <p className="text-sm font-medium text-slate-800">
                                            {cv.location}
                                        </p>
                                    </div>
                                )}

                                {cv.linkedInUrl && (
                                    <a
                                        href={normalizeUrl(cv.linkedInUrl)}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="rounded-lg border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50"
                                    >
                                        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                                            LinkedIn
                                        </p>

                                        <span className="inline-flex items-center gap-2 text-sm font-medium text-blue-700">
                      View LinkedIn
                      <ExternalLink size={14} />
                    </span>
                                    </a>
                                )}

                                {cv.gitHubUrl && (
                                    <a
                                        href={normalizeUrl(cv.gitHubUrl)}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="rounded-lg border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50"
                                    >
                                        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                                            GitHub
                                        </p>

                                        <span className="inline-flex items-center gap-2 text-sm font-medium text-blue-700">
                      View GitHub
                      <ExternalLink size={14} />
                    </span>
                                    </a>
                                )}
                            </div>
                        </section>

                        {/* Skills */}
                        {cv.skills?.length > 0 && (
                            <section className="mb-10">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                                        <Code2 size={19} className="text-blue-700" />
                                    </div>

                                    <h2 className="text-xl font-bold text-slate-900">
                                        Skills
                                    </h2>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {cv.skills.map((skill) => (
                                        <span
                                            key={skill.id}
                                            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700"
                                        >
                      {skill.name}
                    </span>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Experience */}
                        {cv.experiences?.length > 0 && (
                            <section className="mb-10">
                                <div className="mb-5 flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                                        <Briefcase size={19} className="text-blue-700" />
                                    </div>

                                    <h2 className="text-xl font-bold text-slate-900">
                                        Experience
                                    </h2>
                                </div>

                                <div className="space-y-6">
                                    {cv.experiences.map((experience) => (
                                        <div
                                            key={experience.id}
                                            className="relative border-l-2 border-slate-200 pl-5"
                                        >
                                            <h3 className="text-base font-semibold text-slate-900">
                                                {experience.jobTitle}
                                            </h3>

                                            {experience.company && (
                                                <p className="mt-1 text-sm font-medium text-slate-700">
                                                    {experience.company}
                                                </p>
                                            )}

                                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                                                {formatDateRange(
                                                    experience.startDate,
                                                    experience.endDate,
                                                    experience.isCurrent
                                                ) && (
                                                    <span className="inline-flex items-center gap-1.5">
                            <Calendar size={13} />
                                                        {formatDateRange(
                                                            experience.startDate,
                                                            experience.endDate,
                                                            experience.isCurrent
                                                        )}
                          </span>
                                                )}

                                                {experience.location && (
                                                    <span className="inline-flex items-center gap-1.5">
                            <MapPin size={13} />
                                                        {experience.location}
                          </span>
                                                )}
                                            </div>

                                            {experience.description && (
                                                <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
                                                    {experience.description}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Projects */}
                        {cv.projects?.length > 0 && (
                            <section className="mb-10">
                                <div className="mb-5 flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                                        <FolderKanban size={19} className="text-blue-700" />
                                    </div>

                                    <h2 className="text-xl font-bold text-slate-900">
                                        Projects
                                    </h2>
                                </div>

                                <div className="grid gap-5 md:grid-cols-2">
                                    {cv.projects.map((project) => (
                                        <div
                                            key={project.id}
                                            className="rounded-lg border border-slate-200 p-5"
                                        >
                                            <h3 className="font-semibold text-slate-900">
                                                {project.title}
                                            </h3>

                                            {project.role && (
                                                <p className="mt-1 text-sm font-medium text-slate-600">
                                                    {project.role}
                                                </p>
                                            )}

                                            {project.description && (
                                                <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
                                                    {project.description}
                                                </p>
                                            )}

                                            {project.technologies && (
                                                <p className="mt-3 text-xs text-slate-500">
                          <span className="font-semibold">
                            Technologies:
                          </span>{' '}
                                                    {project.technologies}
                                                </p>
                                            )}

                                            {project.projectUrl && (
                                                <a
                                                    href={normalizeUrl(project.projectUrl)}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:text-blue-800"
                                                >
                                                    View Project
                                                    <ExternalLink size={14} />
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Education */}
                        {cv.educations?.length > 0 && (
                            <section>
                                <div className="mb-5 flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                                        <GraduationCap
                                            size={19}
                                            className="text-blue-700"
                                        />
                                    </div>

                                    <h2 className="text-xl font-bold text-slate-900">
                                        Education
                                    </h2>
                                </div>

                                <div className="space-y-5">
                                    {cv.educations.map((education) => (
                                        <div
                                            key={education.id}
                                            className="rounded-lg border border-slate-200 p-5"
                                        >
                                            <h3 className="font-semibold text-slate-900">
                                                {education.institution}
                                            </h3>

                                            {education.degree && (
                                                <p className="mt-1 text-sm font-medium text-slate-700">
                                                    {education.degree}
                                                </p>
                                            )}

                                            {education.fieldOfStudy && (
                                                <p className="mt-1 text-sm text-slate-600">
                                                    {education.fieldOfStudy}
                                                </p>
                                            )}

                                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                                                {formatDateRange(
                                                    education.startDate,
                                                    education.endDate,
                                                    education.isCurrent
                                                ) && (
                                                    <span className="inline-flex items-center gap-1.5">
                            <Calendar size={13} />
                                                        {formatDateRange(
                                                            education.startDate,
                                                            education.endDate,
                                                            education.isCurrent
                                                        )}
                          </span>
                                                )}

                                                {education.location && (
                                                    <span className="inline-flex items-center gap-1.5">
                            <MapPin size={13} />
                                                        {education.location}
                          </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}