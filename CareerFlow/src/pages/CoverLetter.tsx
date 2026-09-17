import { useEffect, useState } from 'react';
import { useCoverLetterDraft } from '../context/CoverLetterContext';
import {
  Sparkles,
  Download,
  RefreshCw,
  Edit3,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

import AppLayout from '../components/layout/AppLayout';
import { paymentsApi } from '../api/paymentsApi';
import {
  Input,
  Textarea,
  Card,
  Spinner,
} from '../components/ui';

import { useMyCvs } from '../hooks/useMyCvs';
import { coverLetterApi } from '../api/coverLetterApi';
import { ApiError } from '../api/client';

export default function CoverLetter() {
  const { cvs, loading: cvsLoading } = useMyCvs();
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
          (event.ctrlKey || event.metaKey) &&
          (event.key === 'c' || event.key === 'x')
      ) {
        const selection = window.getSelection();

        if (!selection || !selection.toString().trim()) {
          return;
        }

        const selectedNode = selection.anchorNode;

        if (
            selectedNode &&
            document
                .querySelector('[data-cover-letter-content]')
                ?.contains(selectedNode)
        ) {
          event.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const {
    selectedCvId,
    setSelectedCvId,
    jobTitle,
    setJobTitle,
    company,
    setCompany,
    jobDescription,
    setJobDescription,
    content,
    setContent,
  } = useCoverLetterDraft();

  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  /*const [copied, setCopied] = useState(false);*/


  // -------------------------------------------------------------
  // Automatically select the first CV
  // -------------------------------------------------------------

  useEffect(() => {
    if (cvs.length > 0 && !selectedCvId) {
      setSelectedCvId(cvs[0].id);
    }
  }, [cvs, selectedCvId]);

  // -------------------------------------------------------------
  // Generate cover letter
  // -------------------------------------------------------------

  const generate = async () => {
    setError('');

    if (!selectedCvId) {
      setError('Please select a CV.');
      return;
    }

    if (!jobTitle.trim()) {
      setError('Please enter the job title.');
      return;
    }

    if (!company.trim()) {
      setError('Please enter the company name.');
      return;
    }

    if (!jobDescription.trim()) {
      setError('Please enter the job description.');
      return;
    }

    setGenerating(true);

    try {
      const result = await coverLetterApi.generate({
        cvId: selectedCvId,
        jobTitle: jobTitle.trim(),
        company: company.trim(),
        jobDescription: jobDescription.trim(),
      });

      setContent(result.coverLetter);
    } catch (e) {
      if (e instanceof ApiError) {
        if (e.status === 401) {
          setError(
              'Your session has expired. Please log in again.'
          );
        } else if (e.status === 404) {
          setError(
              'The selected CV could not be found.'
          );
        } else if (e.status === 500) {
          setError(
              'The cover letter could not be generated. Please try again.'
          );
        } else {
          setError(e.message);
        }
      } else {
        setError(
            e instanceof Error
                ? e.message
                : 'Generation failed. Please try again.'
        );
      }
    } finally {
      setGenerating(false);
    }
  };

  // -------------------------------------------------------------
  // Copy cover letter
  // -------------------------------------------------------------

  /*const copy = async () => {
    if (!content.trim()) {
      return;
    }

    try {
      await navigator.clipboard.writeText(content);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setError('Unable to copy the cover letter.');
    }
  };*/

  // -------------------------------------------------------------
  // Generate safe filename
  // -------------------------------------------------------------

  const getSafeFileName = () => {
    const base =
        `${jobTitle || 'cover-letter'}-${company || 'application'}`;

    return base
        .trim()
        .replace(/[^a-z0-9]+/gi, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase();
  };

  const checkCoverLetterPayment = async () => {
    try {
      const payment =
          await paymentsApi.status('CoverLetterPack');

      if (payment.approved === true) {
        return true;
      }

      window.location.href =
          '/payment-verification?product=CoverLetterPack&amount=1000';

      return false;
    } catch (error) {
      console.error(
          'COVER LETTER PAYMENT STATUS ERROR:',
          error
      );

      window.location.href =
          '/payment-verification?product=CoverLetterPack&amount=1000';

      return false;
    }
  };
  // -------------------------------------------------------------
  // Download Word document
  // -------------------------------------------------------------

  const downloadWord = async () => {
    if (!content.trim()) {
      return;
    }

    const paymentApproved =
        await checkCoverLetterPayment();

    if (!paymentApproved) {
      return;
    }

    try {
      const {
        Document,
        Packer,
        Paragraph,
        TextRun,
      } = await import('docx');

      /*
       * Convert each paragraph in the generated cover letter
       * into a Word paragraph.
       */
      const paragraphs = content
          .split(/\n\s*\n/)
          .map((paragraph) => paragraph.trim())
          .filter(Boolean)
          .map(
              (paragraph) =>
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: paragraph,
                        size: 24, // 12pt
                        font: 'Arial',
                      }),
                    ],
                    spacing: {
                      after: 240,
                      line: 360,
                    },
                  })
          );

      /*
       * Create the Word document.
       */
      const doc = new Document({
        sections: [
          {
            properties: {
              page: {
                size: {
                  width: 11906,  // A4 width
                  height: 16838, // A4 height
                },
                margin: {
                  top: 1000,
                  right: 1000,
                  bottom: 1000,
                  left: 1000,
                },
              },
            },

            children: [
              /*
               * Company
               */
              new Paragraph({
                children: [
                  new TextRun({
                    text: company.trim(),
                    bold: true,
                    size: 32,
                    font: 'Arial',
                  }),
                ],
                spacing: {
                  after: 100,
                },
              }),

              /*
               * Job title
               */
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Application for ${jobTitle.trim()}`,
                    size: 22,
                    color: '64748B',
                    font: 'Arial',
                  }),
                ],
                spacing: {
                  after: 500,
                },
              }),

              /*
               * Cover letter paragraphs
               */
              ...paragraphs,
            ],
          },
        ],
      });

      /*
       * Convert the Word document to a Blob.
       */
      const blob = await Packer.toBlob(doc);

      /*
       * Create a temporary browser URL.
       */
      const url = window.URL.createObjectURL(blob);

      /*
       * Create download link.
       *
       * IMPORTANT:
       * window.document refers to the browser document,
       * not the docx Document object.
       */
      const link = window.document.createElement('a');

      link.href = url;
      link.download = `${getSafeFileName()}.docx`;

      window.document.body.appendChild(link);

      link.click();

      window.document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(
          'Word document generation failed:',
          error
      );

      setError(
          'Unable to create the Word document. Please try again.'
      );
    }
  };

  // -------------------------------------------------------------
  // Download PDF
  // -------------------------------------------------------------

  const downloadPdf = async () => {
    if (!content.trim()) {
      return;
    }

    const paymentApproved =
        await checkCoverLetterPayment();

    if (!paymentApproved) {
      return;
    }

    window.print();
  };

  // -------------------------------------------------------------
  // Change selected CV
  // -------------------------------------------------------------

  const changeCv = (value: string) => {
    setSelectedCvId(value);

    /*
     * The generated letter is based on the selected CV,
     * so clear it when the user changes CV.
     */
    setContent('');
    setError('');
  };

  return (
      <>
        {/* =========================================================
          PRINT STYLES
      ========================================================== */}

        <style>{`
        /*
         * Normal screen:
         * Keep the printable version hidden.
         */
        #cover-letter-print-area {
          display: none;
        }

        /*
         * PRINT MODE
         */
        @media print {

          /*
           * Hide everything on the application.
           */
          body * {
            visibility: hidden !important;
          }

          /*
           * Show the printable cover letter.
           */
          #cover-letter-print-area,
          #cover-letter-print-area * {
            visibility: visible !important;
          }

          /*
           * IMPORTANT:
           *
           * We don't give this element a fixed height.
           * That allows the content to continue naturally
           * onto page 2, page 3, etc.
           */
          #cover-letter-print-area {
            display: block !important;

            position: absolute !important;

            left: 0 !important;
            top: 0 !important;

            width: 210mm !important;

            height: auto !important;
            min-height: 0 !important;

            margin: 0 !important;

            padding: 20mm !important;

            background: white !important;

            overflow: visible !important;

            box-sizing: border-box !important;
          }

          /*
           * Printable document.
           */
          #cover-letter-print-area .print-document {
            width: 100% !important;

            max-width: none !important;

            height: auto !important;
            min-height: 0 !important;

            margin: 0 !important;
            padding: 0 !important;

            overflow: visible !important;

            box-sizing: border-box !important;
          }

          /*
           * Header.
           */
          #cover-letter-print-area .print-header {
            margin-bottom: 24px !important;

            page-break-after: avoid !important;
            break-after: avoid !important;
          }

          /*
           * Company name.
           */
          #cover-letter-print-area .print-company {
            margin: 0 !important;

            font-family: Arial, Helvetica, sans-serif !important;

            font-size: 20pt !important;

            line-height: 1.2 !important;

            font-weight: 700 !important;

            color: #111827 !important;
          }

          /*
           * Application title.
           */
          #cover-letter-print-area .print-job-title {
            margin: 5px 0 0 0 !important;

            font-family: Arial, Helvetica, sans-serif !important;

            font-size: 10.5pt !important;

            line-height: 1.4 !important;

            color: #64748b !important;
          }

          /*
           * Main cover letter.
           *
           * NO fixed height.
           * NO max-height.
           * NO overflow hidden.
           */
          #cover-letter-print-area .print-body {
            width: 100% !important;

            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;

            overflow: visible !important;

            font-family: Arial, Helvetica, sans-serif !important;

            font-size: 11pt !important;

            line-height: 1.7 !important;

            color: #111827 !important;

            white-space: pre-wrap !important;

            word-wrap: break-word !important;

            overflow-wrap: break-word !important;

            page-break-inside: auto !important;
            break-inside: auto !important;
          }

          /*
           * Hide anything marked no-print.
           */
          .no-print {
            display: none !important;
          }

          /*
           * Don't print the editable textarea.
           */
          textarea {
            display: none !important;
          }

          /*
           * A4 page.
           */
          @page {
            size: A4 portrait;
            margin: 0;
          }
        }
      `}</style>

        <AppLayout>
          <div className="p-6 lg:p-8 max-w-5xl mx-auto">

            {/* =====================================================
              HEADER
          ====================================================== */}

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">

                <Sparkles className="w-5 h-5 text-blue-600" />

                <h1 className="text-xl font-bold text-slate-900">
                  AI Cover Letter Generator
                </h1>

              </div>

              <p className="text-sm text-slate-500">
                Generate a tailored cover letter using your CV
                and the job description.
              </p>
            </div>

            {/* =====================================================
              MAIN GRID
          ====================================================== */}

            <div className="grid lg:grid-cols-2 gap-6">

              {/* ===================================================
                LEFT SIDE — INPUT
            ==================================================== */}

              <div className="space-y-4">

                <Card className="p-5">

                  <h2 className="text-sm font-semibold text-slate-900 mb-4">
                    Job Details
                  </h2>

                  <div className="space-y-3">

                    {/* ------------------------------------------------
                      CV SELECT
                  ------------------------------------------------- */}

                    <div>

                      <label className="text-sm font-medium text-slate-700 block mb-1">
                        Use CV
                      </label>

                      <select
                          value={selectedCvId}
                          onChange={(e) =>
                              changeCv(e.target.value)
                          }
                          disabled={
                              cvsLoading ||
                              generating
                          }
                          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                      >

                        <option value="">
                          {cvsLoading
                              ? 'Loading CVs...'
                              : 'Select a CV...'}
                        </option>

                        {cvs.map((cv) => (
                            <option
                                key={cv.id}
                                value={cv.id}
                            >
                              {cv.fullName ||
                                  'Untitled CV'}

                              {' — '}

                              {cv.professionalTitle ||
                                  'No title'}
                            </option>
                        ))}

                      </select>

                      {cvs.length === 0 &&
                          !cvsLoading && (
                              <p className="text-xs text-amber-600 mt-1">
                                Create a CV first to use it here.
                              </p>
                          )}

                    </div>

                    {/* ------------------------------------------------
                      JOB TITLE
                  ------------------------------------------------- */}

                    <Input
                        label="Job Title"
                        value={jobTitle}
                        onChange={(e) =>
                            setJobTitle(e.target.value)
                        }
                        placeholder="Software Engineer"
                        disabled={generating}
                    />

                    {/* ------------------------------------------------
                      COMPANY
                  ------------------------------------------------- */}

                    <Input
                        label="Company"
                        value={company}
                        onChange={(e) =>
                            setCompany(e.target.value)
                        }
                        placeholder="Acme Corporation"
                        disabled={generating}
                    />

                    {/* ------------------------------------------------
                      JOB DESCRIPTION
                  ------------------------------------------------- */}

                    <Textarea
                        label="Job Description"
                        value={jobDescription}
                        onChange={(e) =>
                            setJobDescription(e.target.value)
                        }
                        placeholder="Paste the full job description here..."
                        rows={10}
                        disabled={generating}
                    />

                  </div>

                </Card>

                {/* =================================================
                  ERROR
              ================================================== */}

                {error && (
                    <div className="flex items-start gap-2 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">

                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />

                      <span>{error}</span>

                    </div>
                )}

                {/* =================================================
                  GENERATE BUTTON
              ================================================== */}

                <button
                    type="button"
                    onClick={generate}
                    disabled={
                        generating ||
                        cvsLoading ||
                        !selectedCvId ||
                        !jobTitle.trim() ||
                        !company.trim() ||
                        !jobDescription.trim()
                    }
                    className="w-full flex items-center justify-center gap-2 py-3 bg-[#1E3A8A] text-white font-semibold rounded-lg hover:bg-blue-900 disabled:opacity-60 transition"
                >

                  {generating ? (
                      <Spinner size="sm" />
                  ) : (
                      <Sparkles className="w-4 h-4" />
                  )}

                  {generating
                      ? 'Generating...'
                      : 'Generate Cover Letter'}

                </button>

              </div>

              {/* ===================================================
                RIGHT SIDE — OUTPUT
            ==================================================== */}

              <div>

                <Card className="p-5 h-full flex flex-col">

                  {/* ------------------------------------------------
                    OUTPUT HEADER
                ------------------------------------------------- */}

                  <div className="flex items-center justify-between mb-4">

                    <h2 className="text-sm font-semibold text-slate-900">
                      Generated Cover Letter
                    </h2>

                    {content && !generating && (
                        <div className="flex items-center gap-2 no-print">

                          {/* COPY */}


                          {/* REGENERATE */}
                          <button
                              type="button"
                              onClick={generate}
                              disabled={generating}
                              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition disabled:opacity-60"
                          >

                            <RefreshCw className="w-3.5 h-3.5" />

                            Regenerate

                          </button>

                        </div>
                    )}

                  </div>

                  {/* =================================================
                    EMPTY STATE
                ================================================== */}

                  {!content && !generating && (
                      <div className="flex-1 flex flex-col items-center justify-center text-center py-12">

                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-3">

                          <Edit3 className="w-5 h-5 text-blue-400" />

                        </div>

                        <p className="text-sm font-medium text-slate-600 mb-1">
                          Ready to generate
                        </p>

                        <p className="text-xs text-slate-400 max-w-xs">
                          Fill in the job details and click
                          "Generate Cover Letter" to create
                          a tailored cover letter.
                        </p>

                      </div>
                  )}

                  {/* =================================================
                    LOADING STATE
                ================================================== */}

                  {generating && (
                      <div className="flex-1 flex items-center justify-center">

                        <div className="text-center">

                          <Spinner
                              size="lg"
                              className="mx-auto mb-3"
                          />

                          <p className="text-sm text-slate-500">
                            Generating your cover letter...
                          </p>

                          <p className="text-xs text-slate-400 mt-1">
                            This may take a few seconds.
                          </p>

                        </div>

                      </div>
                  )}

                  {/* =================================================
                    GENERATED LETTER
                ================================================== */}

                  {content && !generating && (
                      <div className="flex-1 flex flex-col">

                        {/* ------------------------------------------------
                        EDITABLE SCREEN VERSION
                    ------------------------------------------------- */}

                        <div
                            data-cover-letter-content
                            className="flex-1 min-h-[450px] text-sm text-slate-700 leading-relaxed border border-slate-200 rounded-lg p-4 whitespace-pre-wrap select-none cursor-default overflow-y-auto"
                            onCopy={(e) => e.preventDefault()}
                            onCut={(e) => e.preventDefault()}
                            onContextMenu={(e) => e.preventDefault()}
                            onDragStart={(e) => e.preventDefault()}
                        >
                          {content}
                        </div>

                        {/* ------------------------------------------------
                        DOWNLOAD BUTTONS
                    ------------------------------------------------- */}

                        <div className="mt-3 flex gap-2 no-print">

                          {/* PDF */}
                          <button
                              type="button"
                              onClick={downloadPdf}
                              className="flex items-center gap-1.5 px-4 py-2 bg-[#1E3A8A] text-white text-sm font-medium rounded-lg hover:bg-blue-900 transition"
                          >

                            <Download className="w-4 h-4" />

                            Download PDF

                          </button>

                          {/* WORD */}
                          <button
                              type="button"
                              onClick={downloadWord}
                              className="flex items-center gap-1.5 px-4 py-2 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition"
                          >

                            <Download className="w-4 h-4" />

                            Download Word

                          </button>

                        </div>

                      </div>
                  )}

                </Card>

              </div>

            </div>

          </div>
        </AppLayout>

        {/* =========================================================
          PRINT-ONLY COVER LETTER

          IMPORTANT:

          This is OUTSIDE the screen output Card.

          It is hidden during normal use and becomes visible
          only when the browser's print dialog is opened.
      ========================================================== */}

        {content && (
            <div
                id="cover-letter-print-area"
                aria-hidden="true"
            >
              <div className="print-document">

                {/* ---------------------------------------------------
                PRINT HEADER
            ---------------------------------------------------- */}

                <div className="print-header">

                  <h1 className="print-company">
                    {company.trim()}
                  </h1>

                  <p className="print-job-title">
                    Application for {jobTitle.trim()}
                  </p>

                </div>

                {/* ---------------------------------------------------
                PRINT BODY
            ---------------------------------------------------- */}

                <div
                    className="select-none"
                    onCopy={(e) => e.preventDefault()}
                    onCut={(e) => e.preventDefault()}
                    onContextMenu={(e) => e.preventDefault()}
                >
                  {content}
                </div>

              </div>
            </div>
        )}
      </>
  );
}