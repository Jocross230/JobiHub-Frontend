import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Send, Eye } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import { Input, Textarea, Select, Card, Spinner } from '../../components/ui';
import { businessApi } from '../../api/businessApi';

const WORK_OPTIONS = [
  { value: 'On-site', label: 'On-site' },
  { value: 'Hybrid', label: 'Hybrid' },
  { value: 'Remote', label: 'Remote' },
];

const EMP_OPTIONS = [
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Part-time', label: 'Part-time' },
  { value: 'Contract', label: 'Contract' },
  { value: 'Internship', label: 'Internship' },
];

const EXP_OPTIONS = [
  { value: 'Entry-level', label: 'Entry-level' },
  { value: 'Mid-level', label: 'Mid-level' },
  { value: 'Senior', label: 'Senior' },
  { value: 'Director', label: 'Director' },
  { value: 'Executive', label: 'Executive' },
];

export default function PostJob() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    responsibilities: '',
    requirements: '',
    location: '',
    workArrangement: 'Hybrid',
    employmentType: 'Full-time',
    experienceLevel: 'Mid-level',
    salary: '',
    applicationMethod: 'careerflow',
    closingDate: '',
  });

  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const set = (key: string, value: string) => {
    setForm(previous => ({
      ...previous,
      [key]: value,
    }));
  };

  const addSkill = () => {
    const skill = skillInput.trim();

    if (!skill) {
      return;
    }

    if (!skills.some(x => x.toLowerCase() === skill.toLowerCase())) {
      setSkills(previous => [...previous, skill]);
    }

    setSkillInput('');
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (!form.title.trim()) {
      setError('Job title is required.');
      return;
    }

    if (!form.description.trim()) {
      setError('Job description is required.');
      return;
    }

    try {
      setSubmitting(true);

      await businessApi.postJob('', {
        title: form.title,
        description: form.description,
        responsibilities: form.responsibilities,
        requirements: form.requirements,
        skills: skills,
        location: form.location,
        workArrangement: form.workArrangement,
        employmentType: form.employmentType,
        experienceLevel: form.experienceLevel,
        salary: form.salary,
        applicationMethod: form.applicationMethod,
        closingDate: form.closingDate
            ? new Date(form.closingDate).toISOString()
            : null,
        status: 'published',
      });

      setSuccess('Job posted successfully.');

      setTimeout(() => {
        navigate('/business/jobs');
      }, 1000);
    } catch (error: any) {
      setError(
          error?.response?.data?.message ||
          error?.message ||
          'Failed to post job.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
      <AppLayout>
        <div className="p-6 lg:p-8 max-w-3xl mx-auto">

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Post a Job
              </h1>

              <p className="text-sm text-slate-500 mt-0.5">
                Create a new vacancy listing for your company.
              </p>
            </div>

            <button
                type="button"
                onClick={() => setPreview(value => !value)}
                className="flex items-center gap-1.5 text-sm border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50 transition"
            >
              <Eye className="w-4 h-4" />

              {preview ? 'Edit' : 'Preview'}
            </button>
          </div>

          {error && (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
          )}

          {success && (
              <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {success}
              </div>
          )}

          {preview ? (
              <Card className="p-6">
                <h2 className="text-xl font-bold text-slate-900">
                  {form.title || 'Job Title'}
                </h2>

                <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-500">
                  <span>{form.location || 'Location not specified'}</span>
                  <span>•</span>
                  <span>{form.workArrangement}</span>
                  <span>•</span>
                  <span>{form.employmentType}</span>
                  <span>•</span>
                  <span>{form.experienceLevel}</span>
                </div>

                {form.salary && (
                    <p className="mt-3 text-sm font-medium text-slate-700">
                      Salary: {form.salary}
                    </p>
                )}

                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Job Description
                  </h3>

                  <p className="mt-2 text-sm text-slate-600 whitespace-pre-wrap">
                    {form.description || 'No description provided.'}
                  </p>
                </div>

                {form.responsibilities && (
                    <div className="mt-6">
                      <h3 className="text-sm font-semibold text-slate-900">
                        Responsibilities
                      </h3>

                      <p className="mt-2 text-sm text-slate-600 whitespace-pre-wrap">
                        {form.responsibilities}
                      </p>
                    </div>
                )}

                {form.requirements && (
                    <div className="mt-6">
                      <h3 className="text-sm font-semibold text-slate-900">
                        Requirements
                      </h3>

                      <p className="mt-2 text-sm text-slate-600 whitespace-pre-wrap">
                        {form.requirements}
                      </p>
                    </div>
                )}

                {skills.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-semibold text-slate-900 mb-2">
                        Required Skills
                      </h3>

                      <div className="flex flex-wrap gap-2">
                        {skills.map(skill => (
                            <span
                                key={skill}
                                className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium"
                            >
                      {skill}
                    </span>
                        ))}
                      </div>
                    </div>
                )}

                <button
                    type="button"
                    onClick={() => setPreview(false)}
                    className="mt-6 px-4 py-2 border border-slate-200 text-sm rounded-lg"
                >
                  Back to Edit
                </button>
              </Card>
          ) : (
              <form
                  onSubmit={handlePublish}
                  className="space-y-5"
              >

                <Card className="p-5">
                  <h2 className="text-sm font-semibold text-slate-900 mb-4">
                    Job Details
                  </h2>

                  <div className="space-y-4">

                    <Input
                        label="Job Title"
                        value={form.title}
                        onChange={e => set('title', e.target.value)}
                        placeholder="e.g. Senior React Developer"
                        required
                    />

                    <div className="grid sm:grid-cols-3 gap-3">

                      <Select
                          label="Work Arrangement"
                          value={form.workArrangement}
                          onChange={e =>
                              set('workArrangement', e.target.value)
                          }
                          options={WORK_OPTIONS}
                      />

                      <Select
                          label="Employment Type"
                          value={form.employmentType}
                          onChange={e =>
                              set('employmentType', e.target.value)
                          }
                          options={EMP_OPTIONS}
                      />

                      <Select
                          label="Experience Level"
                          value={form.experienceLevel}
                          onChange={e =>
                              set('experienceLevel', e.target.value)
                          }
                          options={EXP_OPTIONS}
                      />

                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">

                      <Input
                          label="Location"
                          value={form.location}
                          onChange={e =>
                              set('location', e.target.value)
                          }
                          placeholder="London, UK or Remote"
                      />

                      <Input
                          label="Salary (optional)"
                          value={form.salary}
                          onChange={e =>
                              set('salary', e.target.value)
                          }
                          placeholder="e.g. £40,000–£55,000"
                      />

                    </div>

                    <Input
                        label="Closing Date (optional)"
                        type="date"
                        value={form.closingDate}
                        onChange={e =>
                            set('closingDate', e.target.value)
                        }
                    />

                  </div>
                </Card>

                <Card className="p-5">
                  <h2 className="text-sm font-semibold text-slate-900 mb-4">
                    Job Description
                  </h2>

                  <div className="space-y-4">

                    <Textarea
                        label="Job Description"
                        value={form.description}
                        onChange={e =>
                            set('description', e.target.value)
                        }
                        placeholder="Overview of the role and what you're looking for..."
                        rows={5}
                        required
                    />

                    <Textarea
                        label="Responsibilities"
                        value={form.responsibilities}
                        onChange={e =>
                            set('responsibilities', e.target.value)
                        }
                        placeholder="Key responsibilities and duties..."
                        rows={4}
                    />

                    <Textarea
                        label="Requirements"
                        value={form.requirements}
                        onChange={e =>
                            set('requirements', e.target.value)
                        }
                        placeholder="Required qualifications, experience, and skills..."
                        rows={4}
                    />

                  </div>
                </Card>

                <Card className="p-5">
                  <h2 className="text-sm font-semibold text-slate-900 mb-4">
                    Required Skills
                  </h2>

                  <div className="flex gap-2 mb-3">

                    <input
                        value={skillInput}
                        onChange={e =>
                            setSkillInput(e.target.value)
                        }
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addSkill();
                          }
                        }}
                        placeholder="Add required skill..."
                        className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                        type="button"
                        onClick={addSkill}
                        className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-200 transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>

                  </div>

                  <div className="flex flex-wrap gap-2">

                    {skills.map(skill => (
                        <span
                            key={skill}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium"
                        >
                    {skill}

                          <button
                              type="button"
                              onClick={() =>
                                  setSkills(previous =>
                                      previous.filter(x => x !== skill)
                                  )
                              }
                          >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                    ))}

                  </div>
                </Card>

                <div className="flex gap-3">

                  <button
                      type="button"
                      onClick={() =>
                          alert('Draft functionality will be added next.')
                      }
                      className="px-5 py-2.5 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition"
                  >
                    Save Draft
                  </button>

                  <button
                      type="submit"
                      disabled={submitting}
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#1E3A8A] text-white text-sm font-semibold rounded-lg hover:bg-blue-900 disabled:opacity-60 transition"
                  >
                    {submitting ? (
                        <Spinner size="sm" />
                    ) : (
                        <Send className="w-4 h-4" />
                    )}

                    {submitting
                        ? 'Publishing...'
                        : 'Publish Job'}
                  </button>

                </div>
              </form>
          )}

        </div>
      </AppLayout>
  );
}