import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Download,
  Clock,
  AlertCircle,
} from 'lucide-react';

import AppLayout from '../../components/layout/AppLayout';
import { paymentsApi } from '../../api/paymentsApi';

import {
  Card,
  EmptyState,
  ErrorState,
  Spinner,
  PageLoader,
} from '../../components/ui';

import { useMyCvs } from '../../hooks/useMyCvs';

import {
  cvApi,
} from '../../api/cvApi';

import type {
  Cv,
  CvSkill,
  CvExperience,
  CvProject,
  CvEducation,
} from '../../api/cvApi';

import {
  CVPreview,
  type LegacyCvData,
} from './CVTemplates';

/*
 * ---------------------------------------------------------------
 * CV TEMPLATE HELPERS
 * ---------------------------------------------------------------
 */

const TEMPLATE_IDS = [
  'template-1',
  'template-2',
  'template-3',
  'template-4',
  'template-5',
  'template-6',
  'template-7',
  'template-8',
  'template-9',
  'template-10',
  'template-11',
  'template-12',
  'template-13',
  'template-14',
  'template-15',
  'template-16',
  'template-17',
  'template-18',
  'template-19',
  'template-20',
] as const;

type TemplateId = (typeof TEMPLATE_IDS)[number];

function normalizeTemplate(
    template?: string
): TemplateId {
  if (
      template &&
      TEMPLATE_IDS.includes(
          template as TemplateId
      )
  ) {
    return template as TemplateId;
  }

  const legacy: Record<
      string,
      TemplateId
  > = {
    modern: 'template-1',
    professional: 'template-3',
    creative: 'template-17',
    minimal: 'template-2',
  };

  return (
      legacy[template || ''] ||
      'template-1'
  );
}

/*
 * Convert API CV data into the exact format
 * expected by CVPreview.
 */
function toLegacyData(
    personal: Partial<Cv>,
    skills: CvSkill[],
    experiences: CvExperience[],
    projects: CvProject[],
    educations: CvEducation[],
): LegacyCvData {
  const bullets = (value?: string) =>
      (value || '')
          .split(/\n+/)
          .map(x => x.trim())
          .filter(Boolean);

  return {
    name: personal.fullName || '',

    title:
        personal.professionalTitle || '',

    workPreference: '',

    bio:
        personal.shortBio || '',

    email:
        personal.email || '',

    phone:
        personal.phone || '',

    linkedin:
        personal.linkedInUrl || '',

    github:
        personal.gitHubUrl || '',

    portfolio: '',

    location:
        personal.location || '',

    skills: skills.map(
        (skill, index) => ({
          id:
              skill.id ||
              `skill-${index}`,

          category: 'Skills',

          items: [
            skill.name,
          ].filter(Boolean),
        })
    ),

    experience: experiences.map(
        experience => ({
          id: experience.id,

          role:
              experience.jobTitle ||
              '',

          company:
              experience.company ||
              '',

          start:
              experience.startDate ||
              '',

          end:
              experience.isCurrent
                  ? 'Present'
                  : (
                      experience.endDate ||
                      ''
                  ),

          workType:
              experience.location ||
              '',

          bullets:
              bullets(
                  experience.description
              ),
        })
    ),

    projects: projects.map(
        project => ({
          id: project.id,

          title:
              project.title ||
              '',

          role:
              project.role ||
              '',

          bullets: [
            ...(project.technologies
                ? [
                  `Technologies: ${project.technologies}`,
                ]
                : []),

            ...bullets(
                project.description
            ),
          ],
        })
    ),

    education: educations.map(
        education => ({
          id: education.id,

          degree:
              `${education.degree || ''}${
                  education.fieldOfStudy
                      ? ` in ${education.fieldOfStudy}`
                      : ''
              }`.trim(),

          school:
              education.institution ||
              '',

          year:
              education.isCurrent
                  ? 'Present'
                  : [
                    education.startDate,
                    education.endDate,
                  ]
                      .filter(Boolean)
                      .join(' — '),
        })
    ),
  };
}

/*
 * ---------------------------------------------------------------
 * COMPONENT
 * ---------------------------------------------------------------
 */

interface PrintableCv {
  personal: Partial<Cv>;
  skills: CvSkill[];
  experiences: CvExperience[];
  projects: CvProject[];
  educations: CvEducation[];
}

export default function MyCVs() {
  const {
    cvs,
    loading,
    error,
    refetch,
  } = useMyCvs();

  const [
    deleting,
    setDeleting,
  ] = useState<string | null>(null);

  const [
    downloading,
    setDownloading,
  ] = useState<string | null>(null);

  const [
    downloadError,
    setDownloadError,
  ] = useState('');

  const [
    printableCv,
    setPrintableCv,
  ] = useState<PrintableCv | null>(
      null
  );

  /*
   * -------------------------------------------------------------
   * DOWNLOAD
   * -------------------------------------------------------------
   *
   * We retrieve the same CV sections that CVBuilder retrieves:
   *
   * CV
   * Skills
   * Experience
   * Projects
   * Education
   *
   * Then we pass them into the same CVPreview component.
   */
  const handlePremiumDownload = async (cv: Cv) => {
    try {
      const payment = await paymentsApi.status('PremiumCV');

      if (payment.approved === true) {
        await handleDownload(cv);
        return;
      }

      window.location.href =
          '/payment-verification?product=PremiumCV&amount=2000';
    } catch (error) {
      console.error('PAYMENT STATUS ERROR:', error);

      window.location.href =
          '/payment-verification?product=PremiumCV&amount=2000';
    }
  };

  const handleDownload = async (
      cv: Cv
  ) => {
    if (downloading) {
      return;
    }

    setDownloadError('');

    setDownloading(cv.id);

    try {
      const [
        fullCv,
        skills,
        experiences,
        projects,
        educations,
      ] = await Promise.all([
        cvApi.get(cv.id),

        cvApi.getSkills(
            cv.id
        ),

        cvApi.getExperiences(
            cv.id
        ),

        cvApi.getProjects(
            cv.id
        ),

        cvApi.getEducations(
            cv.id
        ),
      ]);

      setPrintableCv({
        personal: {
          ...fullCv,

          template:
              normalizeTemplate(
                  fullCv.template
              ),
        },

        skills,

        experiences,

        projects,

        educations,
      });
    } catch (e) {
      setDownloadError(
          e instanceof Error
              ? e.message
              : 'Unable to prepare the CV for download.'
      );

      setDownloading(null);
    }
  };

  /*
   * -------------------------------------------------------------
   * START PRINT AFTER CV HAS RENDERED
   * -------------------------------------------------------------
   */

  useEffect(() => {
    if (!printableCv) {
      return;
    }

    const timer =
        window.setTimeout(() => {
          window.print();
        }, 150);

    const afterPrint =
        () => {
          setPrintableCv(null);
          setDownloading(null);
        };

    window.addEventListener(
        'afterprint',
        afterPrint
    );

    return () => {
      window.clearTimeout(
          timer
      );

      window.removeEventListener(
          'afterprint',
          afterPrint
      );
    };
  }, [printableCv]);

  /*
   * -------------------------------------------------------------
   * DELETE
   * -------------------------------------------------------------
   */

  const handleDelete = async (
      id: string
  ) => {
    if (
        !confirm(
            'Are you sure you want to delete this CV? This cannot be undone.'
        )
    ) {
      return;
    }

    setDeleting(id);

    try {
      await cvApi.delete(id);

      await refetch();
    } catch (e) {
      alert(
          e instanceof Error
              ? e.message
              : 'Failed to delete CV.'
      );
    } finally {
      setDeleting(null);
    }
  };

  return (
      <>
        {/* =========================================================
          PRINT AREA
      ========================================================== */}

        {printableCv && (
            <div
                id="my-cv-print-area"
                aria-hidden="true"
            >
              <CVPreview
                  data={toLegacyData(
                      printableCv.personal,
                      printableCv.skills,
                      printableCv.experiences,
                      printableCv.projects,
                      printableCv.educations,
                  )}
                  template={normalizeTemplate(
                      printableCv.personal
                          .template
                  )}
              />
            </div>
        )}

        {/* =========================================================
          PRINT CSS
      ========================================================== */}

        <style>{`
        #my-cv-print-area {
          display: none;
        }

        @media print {

          /*
           * Hide the CareerFlow interface.
           */
          body * {
            visibility: hidden !important;
          }

          /*
           * Show ONLY the CV.
           */
          #my-cv-print-area,
          #my-cv-print-area * {
            visibility: visible !important;
          }

          /*
           * Put CV at the top-left of the printed page.
           */
          #my-cv-print-area {
            display: block !important;

            position: absolute !important;

            left: 0 !important;
            top: 0 !important;

            width: 210mm !important;

            margin: 0 !important;
            padding: 0 !important;

            background: white !important;
          }

          /*
           * Same A4 sizing used by CVBuilder.
           */
          #my-cv-print-area .cv-document {
            width: 210mm !important;

            min-height: 297mm !important;

            margin: 0 !important;

            box-shadow: none !important;

            /*
             * Do not clip the CV while printing.
             */
            overflow: visible !important;
          }

          /*
           * A4.
           */
          @page {
            size: A4 portrait;
            margin: 0;
          }
        }
      `}</style>

        <AppLayout>
          <div className="p-6 lg:p-8 max-w-4xl mx-auto">

            {/* =====================================================
              HEADER
          ====================================================== */}

            <div className="flex items-center justify-between mb-6">

              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  My CVs
                </h1>

                <p className="text-sm text-slate-500 mt-0.5">
                  Manage and edit your professional CVs.
                </p>
              </div>

              <Link
                  to="/cv-builder"
                  className="flex items-center gap-2 px-4 py-2 bg-[#1E3A8A] text-white text-sm font-semibold rounded-lg hover:bg-blue-900 transition"
              >
                <Plus className="w-4 h-4" />

                New CV
              </Link>

            </div>

            {/* =====================================================
              DOWNLOAD ERROR
          ====================================================== */}

            {downloadError && (
                <div className="flex items-start gap-2 p-4 mb-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">

                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />

                  <span>
                {downloadError}
              </span>

                </div>
            )}

            {/* =====================================================
              LOADING
          ====================================================== */}

            {loading && (
                <PageLoader />
            )}

            {/* =====================================================
              ERROR
          ====================================================== */}

            {error && (
                <ErrorState
                    message={error}
                    onRetry={refetch}
                />
            )}

            {/* =====================================================
              EMPTY
          ====================================================== */}

            {!loading &&
                !error &&
                cvs.length === 0 && (
                    <Card className="p-0 overflow-hidden">

                      <EmptyState
                          icon={
                            <FileText className="w-12 h-12" />
                          }
                          title="No CVs yet"
                          description="You haven't created a CV yet. Build your first professional CV to get started with your job search."
                          action={
                            <Link
                                to="/cv-builder"
                                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#1E3A8A] text-white text-sm font-semibold rounded-lg hover:bg-blue-900 transition"
                            >
                              <Plus className="w-4 h-4" />

                              Create My CV
                            </Link>
                          }
                      />

                    </Card>
                )}

            {/* =====================================================
              CV LIST
          ====================================================== */}

            {!loading &&
                !error &&
                cvs.length > 0 && (

                    <div className="grid md:grid-cols-2 gap-4">

                      {cvs.map(cv => (

                          <Card
                              key={cv.id}
                              className="p-5"
                          >

                            <div className="flex items-start gap-3 mb-4">

                              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">

                                <FileText className="w-5 h-5 text-blue-600" />

                              </div>

                              <div className="min-w-0">

                                <h3 className="font-semibold text-slate-900 truncate">
                                  {cv.fullName ||
                                      'Untitled CV'}
                                </h3>

                                <p className="text-xs text-slate-500 truncate">
                                  {cv.professionalTitle ||
                                      'No title'}
                                </p>

                              </div>

                            </div>

                            {/* Updated date */}

                            {cv.updatedAt && (
                                <div className="flex items-center gap-1 text-xs text-slate-400 mb-4">

                                  <Clock className="w-3 h-3" />

                                  Last updated{' '}

                                  {new Date(
                                      cv.updatedAt
                                  ).toLocaleDateString(
                                      'en-GB',
                                      {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                      }
                                  )}

                                </div>
                            )}

                            {/* Actions */}

                            <div className="flex items-center gap-2">

                              {/* EDIT */}

                              <Link
                                  to={`/cv-builder/${cv.id}`}
                                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#1E3A8A] text-white rounded-lg hover:bg-blue-900 transition"
                              >

                                <Edit className="w-3 h-3" />

                                Edit

                              </Link>

                              {/* DOWNLOAD */}

                              <button
                                  type="button"
                                  onClick={() => void handlePremiumDownload(cv)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition"
                              >
                                <Download className="w-3 h-3" />
                                Download
                              </button>

                              {/* DELETE */}

                              <button
                                  type="button"
                                  onClick={() =>
                                      void handleDelete(
                                          cv.id
                                      )
                                  }
                                  disabled={
                                      deleting === cv.id
                                  }
                                  className="ml-auto flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                              >

                                {deleting === cv.id ? (
                                    <Spinner size="sm" />
                                ) : (
                                    <Trash2 className="w-3 h-3" />
                                )}

                                Delete

                              </button>

                            </div>

                          </Card>

                      ))}

                    </div>

                )}

          </div>
        </AppLayout>
      </>
  );
}