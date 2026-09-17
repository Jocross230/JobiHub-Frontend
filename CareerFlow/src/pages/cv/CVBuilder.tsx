import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  User, Briefcase, GraduationCap, Sparkles, FolderOpen, Layout, Download,
  Plus, Trash2, ChevronLeft, ChevronRight, Check, X
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import { Input, Textarea, Card, Spinner, SaveStatus } from '../../components/ui';
import { cvApi } from '../../api/cvApi';
import type { Cv, CvSkill, CvExperience, CvProject, CvEducation } from '../../api/cvApi';
import { CVPreview, type LegacyCvData } from './CVTemplates';
import { paymentsApi } from '../../api/paymentsApi';

const STEPS = [
  { id: 'basics', label: 'Basics', icon: User },
  { id: 'skills', label: 'Skills', icon: Sparkles },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'templates', label: 'Templates', icon: Layout },
];

const TEMPLATES = [
  ['template-1', 'Classic Professional', 'Clean, traditional and suitable for most careers'],
  ['template-2', 'Clean ATS', 'Simple single-column recruiter-friendly layout'],
  ['template-3', 'Corporate Professional', 'Formal layout for business and corporate roles'],
  ['template-4', 'Traditional Resume', 'Classic chronological professional CV'],
  ['template-5', 'Compact ATS', 'Dense but readable recruiter-focused layout'],
  ['template-6', 'Modern Executive', 'Premium layout for senior professionals'],
  ['template-7', 'Executive Sidebar', 'Executive layout with a strong sidebar'],
  ['template-8', 'Career Timeline', 'Timeline-focused professional presentation'],
  ['template-9', 'Leadership Executive', 'Leadership-focused premium hierarchy'],
  ['template-10', 'Modern Slate', 'Modern high-contrast professional layout'],
  ['template-11', 'Software Engineer', 'Technical layout for software engineers'],
  ['template-12', 'Tech Stack First', 'Technical skills and stack come first'],
  ['template-13', 'Engineering Profile', 'Engineering-focused professional structure'],
  ['template-14', 'Developer Compact', 'Compact developer-focused layout'],
  ['template-15', 'Technical Dark', 'Distinctive technical presentation'],
  ['template-16', 'Premium Executive', 'High-end executive presentation'],
  ['template-17', 'Creative Split', 'Creative two-column presentation'],
  ['template-18', 'Premium Compact', 'Premium compact professional layout'],
  ['template-19', 'Bold Portfolio', 'Large typography and project emphasis'],
  ['template-20', 'Signature Premium', 'Distinctive high-end professional layout'],
] as const;
type TemplateId = (typeof TEMPLATES)[number][0];

const TEMPLATE_IDS = new Set<TemplateId>(
    TEMPLATES.map(([id]) => id)
);

function normalizeTemplate(template?: string): TemplateId {
  if (template && TEMPLATE_IDS.has(template as TemplateId)) {
    return template as TemplateId;
  }

  const legacy: Record<string, TemplateId> = {
    modern: 'template-1',
    professional: 'template-3',
    creative: 'template-17',
    minimal: 'template-2',
  };

  return legacy[template || ''] || 'template-1';
}

function toLegacyData(
  personal: Partial<Cv>,
  skills: CvSkill[],
  experiences: CvExperience[],
  projects: CvProject[],
  educations: CvEducation[],
): LegacyCvData {
  const bullets = (value?: string) => (value || '').split(/\n+/).map(x => x.trim()).filter(Boolean);
  return {
    name: personal.fullName || '',
    title: personal.professionalTitle || '',
    workPreference: '',
    bio: personal.shortBio || '',
    email: personal.email || '',
    phone: personal.phone || '',
    linkedin: personal.linkedInUrl || '',
    github: personal.gitHubUrl || '',
    portfolio: '',
    location: personal.location || '',
    skills: skills.map((skill, index) => ({ id: skill.id || `skill-${index}`, category: 'Skills', items: [skill.name].filter(Boolean) })),
    experience: experiences.map(exp => ({
      id: exp.id, role: exp.jobTitle || '', company: exp.company || '', start: exp.startDate || '',
      end: exp.isCurrent ? 'Present' : (exp.endDate || ''), workType: exp.location || '', bullets: bullets(exp.description),
    })),
    projects: projects.map(project => ({
      id: project.id, title: project.title || '', role: project.role || '', bullets: [
        ...(project.technologies ? [`Technologies: ${project.technologies}`] : []),
        ...bullets(project.description),
      ],
    })),
    education: educations.map(edu => ({
      id: edu.id, degree: `${edu.degree || ''}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}`.trim(),
      school: edu.institution || '', year: edu.isCurrent ? 'Present' : [edu.startDate, edu.endDate].filter(Boolean).join(' — '),
    })),
  };
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error';
function monthToDateOnly(value?: string): string | undefined {
  if (!value) return undefined;

  // HTML <input type="month"> returns YYYY-MM.
  // ASP.NET DateOnly requires YYYY-MM-DD.
  if (/^\d{4}-\d{2}$/.test(value)) {
    return `${value}-01`;
  }

  // Already a complete date.
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  return undefined;
}

export default function CVBuilder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [cvId, setCvId] = useState<string | null>(id || null);
  const [saveStatus, setSaveStatus] = useState<SaveState>('idle');
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Personal info
  const [personal, setPersonal] = useState<Partial<Cv>>({
    fullName: '', professionalTitle: '', shortBio: '', email: '',
    phone: '', location: '', linkedInUrl: '', gitHubUrl: '', template: 'template-1',
  });

  // Sections
  const [skills, setSkills] = useState<CvSkill[]>([]);
  const [experiences, setExperiences] = useState<CvExperience[]>([]);
  const [projects, setProjects] = useState<CvProject[]>([]);
  const [educations, setEducations] = useState<CvEducation[]>([]);

  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState('');

  // Load existing CV
  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const [cv, sk, ex, pr, ed] = await Promise.all([
          cvApi.get(id),
          cvApi.getSkills(id),
          cvApi.getExperiences(id),
          cvApi.getProjects(id),
          cvApi.getEducations(id),
        ]);
        setPersonal({ ...cv, template: normalizeTemplate(cv.template) });
        setSkills(sk);
        setExperiences(ex);
        setProjects(pr);
        setEducations(ed);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load CV.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const savePersonal = useCallback(
      async (
          data: Partial<Cv>,
          redirectAfterCreate = false
      ): Promise<string | null> => {
        setSaveStatus('saving');

        try {
          if (cvId) {
            await cvApi.update(cvId, data);
            setSaveStatus('saved');
            return cvId;
          }

          const created = await cvApi.create(data);

          setCvId(created.id);

          // Only navigate when explicitly requested.
          // Autosave must NOT navigate while the user is typing.
          if (redirectAfterCreate) {
            navigate(`/cv-builder/${created.id}`, { replace: true });
          }

          setSaveStatus('saved');
          return created.id;
        } catch {
          setSaveStatus('error');
          return null;
        }
      },
      [cvId, navigate]
  );

  const setPersonalField = (key: keyof Cv, value: string) => {
    const next = { ...personal, [key]: value };
    setPersonal(next);
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      void savePersonal(next, false);
    }, 1000);
  };
  useEffect(() => {
    return () => {
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }
    };
  }, []);

  // Step: Personal Info
  const StepPersonal = () => (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Full Name" value={personal.fullName ?? ''} onChange={e => { setPersonalField('fullName', e.target.value); }} placeholder="Sarah Johnson" />
        <Input label="Professional Title" value={personal.professionalTitle ?? ''} onChange={e => { setPersonalField('professionalTitle', e.target.value);  }} placeholder="Senior Software Engineer" />
        <Input label="Email" type="email" value={personal.email ?? ''} onChange={e => { setPersonalField('email', e.target.value); }} placeholder="you@example.com" />
        <Input label="Phone" value={personal.phone ?? ''} onChange={e => { setPersonalField('phone', e.target.value);  }} placeholder="+44 7700 000000" />
        <Input label="Location" value={personal.location ?? ''} onChange={e => { setPersonalField('location', e.target.value);  }} placeholder="London, UK" />
        <Input label="LinkedIn URL" value={personal.linkedInUrl ?? ''} onChange={e => { setPersonalField('linkedInUrl', e.target.value);  }} placeholder="linkedin.com/in/..." />
        <Input label="GitHub URL" value={personal.gitHubUrl ?? ''} onChange={e => { setPersonalField('gitHubUrl', e.target.value);  }} placeholder="github.com/..." />
      </div>
      <Textarea label="Professional Summary" value={personal.shortBio ?? ''} onChange={e => { setPersonalField('shortBio', e.target.value);  }} placeholder="A compelling summary of your experience, skills, and what you bring to a role..." rows={4} />
    </div>
  );

  // Step: Experience
  const [expForm, setExpForm] = useState<Partial<CvExperience>>({});
  const [editingExpId, setEditingExpId] = useState<string | null>(null);
  const [expLoading, setExpLoading] = useState(false);

  const saveExperience = async () => {
    let activeCvId = cvId;

    if (!activeCvId) {
      activeCvId = await savePersonal(personal, false);
    }

    if (!activeCvId) return;

    if (!expForm.jobTitle?.trim()) {
      alert('Job title is required.');
      return;
    }

    if (!expForm.company?.trim()) {
      alert('Company is required.');
      return;
    }

    if (!expForm.startDate) {
      alert('Start date is required.');
      return;
    }

    const startDate = monthToDateOnly(expForm.startDate);

    if (!startDate) {
      alert('Please enter a valid start date.');
      return;
    }

    const endDate = expForm.isCurrent
        ? undefined
        : monthToDateOnly(expForm.endDate);

    if (!expForm.isCurrent && expForm.endDate && !endDate) {
      alert('Please enter a valid end date.');
      return;
    }

    const payload: Partial<CvExperience> = {
      jobTitle: expForm.jobTitle.trim(),
      company: expForm.company.trim(),
      location: expForm.location?.trim() ?? '',
      startDate,
      endDate,
      isCurrent: expForm.isCurrent ?? false,
      description: expForm.description?.trim() ?? '',
    };

    setExpLoading(true);

    try {
      if (editingExpId) {
        const updated = await cvApi.updateExperience(
            activeCvId,
            editingExpId,
            payload
        );

        setExperiences(previous =>
            previous.map(experience =>
                experience.id === editingExpId
                    ? updated
                    : experience
            )
        );
      } else {
        const created = await cvApi.addExperience(
            activeCvId,
            payload
        );

        setExperiences(previous => [
          ...previous,
          created,
        ]);
      }

      setExpForm({});
      setEditingExpId(null);
    } catch (e) {
      alert(
          e instanceof Error
              ? e.message
              : 'Failed to save experience.'
      );
    } finally {
      setExpLoading(false);
    }
  };

  const deleteExperience = async (expId: string) => {
    if (!cvId || !confirm('Delete this experience?')) return;
    await cvApi.deleteExperience(cvId, expId);
    setExperiences(p => p.filter(e => e.id !== expId));
  };

  const StepExperience = () => (
    <div className="space-y-4">
      {experiences.map(exp => (
        <Card key={exp.id} className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-slate-900 text-sm">{exp.jobTitle}</p>
              <p className="text-xs text-slate-500">{exp.company} · {exp.location}</p>
              <p className="text-xs text-slate-400 mt-0.5">{exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate}</p>
              {exp.description && <p className="text-xs text-slate-600 mt-1 line-clamp-2">{exp.description}</p>}
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <button onClick={() => { setExpForm(exp); setEditingExpId(exp.id); }} className="p-1.5 text-slate-400 hover:text-blue-600 rounded">
                <ChevronRight className="w-4 h-4" />
              </button>
              <button onClick={() => deleteExperience(exp.id)} className="p-1.5 text-slate-400 hover:text-red-500 rounded">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </Card>
      ))}

      <Card className="p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">{editingExpId ? 'Edit Experience' : 'Add Experience'}</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <Input label="Job Title" value={expForm.jobTitle ?? ''} onChange={e => setExpForm(p => ({ ...p, jobTitle: e.target.value }))} placeholder="Software Engineer" />
          <Input label="Company" value={expForm.company ?? ''} onChange={e => setExpForm(p => ({ ...p, company: e.target.value }))} placeholder="Acme Corp" />
          <Input label="Location" value={expForm.location ?? ''} onChange={e => setExpForm(p => ({ ...p, location: e.target.value }))} placeholder="London, UK" />
          <div className="flex items-center gap-2 mt-5">
            <input type="checkbox" id="isCurrent" checked={expForm.isCurrent ?? false} onChange={e => setExpForm(p => ({ ...p, isCurrent: e.target.checked, endDate: e.target.checked ? undefined : p.endDate }))} className="rounded" />
            <label htmlFor="isCurrent" className="text-sm text-slate-700">Current position</label>
          </div>
          <Input label="Start Date" type="month" value={expForm.startDate ?? ''} onChange={e => setExpForm(p => ({ ...p, startDate: e.target.value }))} />
          {!expForm.isCurrent && (
            <Input label="End Date" type="month" value={expForm.endDate ?? ''} onChange={e => setExpForm(p => ({ ...p, endDate: e.target.value }))} />
          )}
          <div className="sm:col-span-2">
            <Textarea label="Description" value={expForm.description ?? ''} onChange={e => setExpForm(p => ({ ...p, description: e.target.value }))} placeholder="Describe your responsibilities and achievements..." rows={3} />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={saveExperience} disabled={expLoading} className="flex items-center gap-1.5 px-4 py-2 bg-[#1E3A8A] text-white text-sm font-medium rounded-lg hover:bg-blue-900 transition disabled:opacity-60">
            {expLoading ? <Spinner size="sm" /> : <Check className="w-4 h-4" />}
            {editingExpId ? 'Update' : 'Add'}
          </button>
          {editingExpId && (
            <button onClick={() => { setExpForm({}); setEditingExpId(null); }} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </Card>
    </div>
  );

  // Step: Education
  const [eduForm, setEduForm] = useState<Partial<CvEducation>>({});
  const [editingEduId, setEditingEduId] = useState<string | null>(null);
  const [eduLoading, setEduLoading] = useState(false);

  const saveEducation = async () => {
    let activeCvId = cvId;

    if (!activeCvId) {
      activeCvId = await savePersonal(personal);
    }

    if (!activeCvId) return;

    // Validate before sending anything to the backend
    const institution = (eduForm.institution ?? '').trim();
    const degree = (eduForm.degree ?? '').trim();
    const fieldOfStudy = (eduForm.fieldOfStudy ?? '').trim();
    const location = (eduForm.location ?? '').trim();
    const startDate = eduForm.startDate ?? '';
    const endDate = eduForm.endDate ?? '';

    if (!institution) {
      alert('Please enter the institution.');
      return;
    }

    if (!degree) {
      alert('Please enter your degree or qualification.');
      return;
    }

    if (!fieldOfStudy) {
      alert('Please enter your field of study.');
      return;
    }

    if (!startDate) {
      alert('Please enter the start date.');
      return;
    }

    if (!eduForm.isCurrent && !endDate) {
      alert('Please enter the end date or select "Currently studying".');
      return;
    }

    // Backend expects a full date: YYYY-MM-DD.
    // Convert YYYY-MM from the month input if an old value is still present.
    const normalizeDate = (value: string): string => {
      if (!value) return '';

      // Already YYYY-MM-DD
      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return value;
      }

      // Convert YYYY-MM -> YYYY-MM-01
      if (/^\d{4}-\d{2}$/.test(value)) {
        return `${value}-01`;
      }

      return value;
    };

    const payload: Partial<CvEducation> = {
      institution,
      degree,
      fieldOfStudy,
      location,
      startDate: normalizeDate(startDate),
      endDate: eduForm.isCurrent
          ? undefined
          : normalizeDate(endDate),
      isCurrent: Boolean(eduForm.isCurrent),
    };

    console.log('EDUCATION PAYLOAD:', payload);

    setEduLoading(true);

    try {
      if (editingEduId) {
        const updated = await cvApi.updateEducation(
            activeCvId,
            editingEduId,
            payload
        );

        setEducations(previous =>
            previous.map(education =>
                education.id === editingEduId
                    ? updated
                    : education
            )
        );
      } else {
        const created = await cvApi.addEducation(
            activeCvId,
            payload
        );

        setEducations(previous => [
          ...previous,
          created
        ]);
      }

      setEduForm({});
      setEditingEduId(null);

    } catch (e) {
      console.error('SAVE EDUCATION ERROR:', e);

      alert(
          e instanceof Error
              ? e.message
              : 'Failed to save education.'
      );
    } finally {
      setEduLoading(false);
    }
  };

  const StepEducation = () => (
    <div className="space-y-4">
      {educations.map(edu => (
        <Card key={edu.id} className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-slate-900 text-sm">{edu.degree} in {edu.fieldOfStudy}</p>
              <p className="text-xs text-slate-500">{edu.institution} · {edu.location}</p>
              <p className="text-xs text-slate-400 mt-0.5">{edu.startDate} — {edu.isCurrent ? 'Present' : edu.endDate}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => { setEduForm(edu); setEditingEduId(edu.id); }} className="p-1.5 text-slate-400 hover:text-blue-600 rounded">
                <ChevronRight className="w-4 h-4" />
              </button>
              <button onClick={async () => { if (!cvId || !confirm('Delete?')) return; await cvApi.deleteEducation(cvId, edu.id); setEducations(p => p.filter(e => e.id !== edu.id)); }} className="p-1.5 text-slate-400 hover:text-red-500 rounded">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </Card>
      ))}
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">{editingEduId ? 'Edit Education' : 'Add Education'}</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <Input label="Institution" value={eduForm.institution ?? ''} onChange={e => setEduForm(p => ({ ...p, institution: e.target.value }))} placeholder="University of London" />
          <Input label="Degree" value={eduForm.degree ?? ''} onChange={e => setEduForm(p => ({ ...p, degree: e.target.value }))} placeholder="BSc / MSc / PhD" />
          <Input label="Field of Study" value={eduForm.fieldOfStudy ?? ''} onChange={e => setEduForm(p => ({ ...p, fieldOfStudy: e.target.value }))} placeholder="Computer Science" />
          <Input label="Location" value={eduForm.location ?? ''} onChange={e => setEduForm(p => ({ ...p, location: e.target.value }))} placeholder="London, UK" />
          <div className="flex items-center gap-2 mt-5">
            <input type="checkbox" id="isCurrEdu" checked={eduForm.isCurrent ?? false} onChange={e => setEduForm(p => ({ ...p, isCurrent: e.target.checked }))} className="rounded" />
            <label htmlFor="isCurrEdu" className="text-sm text-slate-700">Currently studying</label>
          </div>
          <Input
              label="Start Date"
              type="date"
              value={eduForm.startDate ?? ''}
              onChange={e =>
                  setEduForm(p => ({
                    ...p,
                    startDate: e.target.value
                  }))
              }
          />
          {!eduForm.isCurrent && <Input
              label="End Date"
              type="date"
              value={eduForm.endDate ?? ''}
              disabled={eduForm.isCurrent}
              onChange={e =>
                  setEduForm(p => ({
                    ...p,
                    endDate: e.target.value
                  }))
              }
          />}
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={saveEducation} disabled={eduLoading} className="flex items-center gap-1.5 px-4 py-2 bg-[#1E3A8A] text-white text-sm font-medium rounded-lg disabled:opacity-60">
            {eduLoading ? <Spinner size="sm" /> : <Check className="w-4 h-4" />}
            {editingEduId ? 'Update' : 'Add'}
          </button>
          {editingEduId && <button onClick={() => { setEduForm({}); setEditingEduId(null); }} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg"><X className="w-4 h-4" /></button>}
        </div>
      </Card>
    </div>
  );

  // Step: Skills
  const [skillInput, setSkillInput] = useState('');
  const [skillLoading, setSkillLoading] = useState(false);

  const addSkill = async () => {
    if (!skillInput.trim()) return;
    let activeCvId = cvId;
    if (!activeCvId) activeCvId = await savePersonal(personal);
    if (!activeCvId) return;
    setSkillLoading(true);
    try {
      const created = await cvApi.addSkill(activeCvId, skillInput.trim());
      setSkills(p => [...p, created]);
      setSkillInput('');
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to add skill.');
    } finally {
      setSkillLoading(false);
    }
  };

  const deleteSkill = async (skillId: string) => {
    if (!cvId) return;
    await cvApi.deleteSkill(cvId, skillId);
    setSkills(p => p.filter(s => s.id !== skillId));
  };

  const StepSkills = () => (
    <div className="space-y-4">
      <Card className="p-5">
        <div className="flex gap-2 mb-4">
          <input
            value={skillInput}
            onChange={e => setSkillInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
            placeholder="Add a skill (e.g. React, Python, Project Management)"
            className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={addSkill} disabled={skillLoading || !skillInput.trim()} className="flex items-center gap-1.5 px-4 py-2 bg-[#1E3A8A] text-white text-sm font-medium rounded-lg hover:bg-blue-900 disabled:opacity-60 transition">
            {skillLoading ? <Spinner size="sm" /> : <Plus className="w-4 h-4" />} Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map(skill => (
            <span key={skill.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-full font-medium">
              {skill.name}
              <button onClick={() => deleteSkill(skill.id)} className="hover:text-red-500 transition">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {skills.length === 0 && <p className="text-sm text-slate-400">No skills added yet. Add your first skill above.</p>}
        </div>
      </Card>
    </div>
  );

  // Step: Projects
  const [projForm, setProjForm] = useState<Partial<CvProject>>({});
  const [editingProjId, setEditingProjId] = useState<string | null>(null);
  const [projLoading, setProjLoading] = useState(false);

  const saveProject = async () => {
    let activeCvId = cvId;
    if (!activeCvId) activeCvId = await savePersonal(personal);
    if (!activeCvId) return;
    setProjLoading(true);
    try {
      if (editingProjId) {
        const updated = await cvApi.updateProject(activeCvId, editingProjId, projForm);
        setProjects(p => p.map(pr => pr.id === editingProjId ? updated : pr));
      } else {
        const created = await cvApi.addProject(activeCvId, projForm);
        setProjects(p => [...p, created]);
      }
      setProjForm({});
      setEditingProjId(null);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to save project.');
    } finally {
      setProjLoading(false);
    }
  };

  const StepProjects = () => (
    <div className="space-y-4">
      {projects.map(proj => (
        <Card key={proj.id} className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-slate-900 text-sm">{proj.title}</p>
              <p className="text-xs text-slate-500">{proj.role}</p>
              <p className="text-xs text-slate-400 mt-0.5">{proj.technologies}</p>
              {proj.projectUrl && <a href={proj.projectUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">{proj.projectUrl}</a>}
            </div>
            <div className="flex gap-1">
              <button onClick={() => { setProjForm(proj); setEditingProjId(proj.id); }} className="p-1.5 text-slate-400 hover:text-blue-600 rounded"><ChevronRight className="w-4 h-4" /></button>
              <button onClick={async () => { if (!cvId || !confirm('Delete?')) return; await cvApi.deleteProject(cvId, proj.id); setProjects(p => p.filter(pr => pr.id !== proj.id)); }} className="p-1.5 text-slate-400 hover:text-red-500 rounded"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        </Card>
      ))}
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">{editingProjId ? 'Edit Project' : 'Add Project'}</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <Input label="Project Title" value={projForm.title ?? ''} onChange={e => setProjForm(p => ({ ...p, title: e.target.value }))} placeholder="E-Commerce Platform" />
          <Input label="Your Role" value={projForm.role ?? ''} onChange={e => setProjForm(p => ({ ...p, role: e.target.value }))} placeholder="Lead Developer" />
          <Input label="Technologies" value={projForm.technologies ?? ''} onChange={e => setProjForm(p => ({ ...p, technologies: e.target.value }))} placeholder="React, Node.js, PostgreSQL" />
          <Input label="Project URL" type="url" value={projForm.projectUrl ?? ''} onChange={e => setProjForm(p => ({ ...p, projectUrl: e.target.value }))} placeholder="https://..." />
          <div className="sm:col-span-2">
            <Textarea label="Description" value={projForm.description ?? ''} onChange={e => setProjForm(p => ({ ...p, description: e.target.value }))} placeholder="Describe the project, your contributions, and impact..." rows={3} />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={saveProject} disabled={projLoading} className="flex items-center gap-1.5 px-4 py-2 bg-[#1E3A8A] text-white text-sm font-medium rounded-lg disabled:opacity-60">
            {projLoading ? <Spinner size="sm" /> : <Check className="w-4 h-4" />}
            {editingProjId ? 'Update' : 'Add'}
          </button>
          {editingProjId && <button onClick={() => { setProjForm({}); setEditingProjId(null); }} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg"><X className="w-4 h-4" /></button>}
        </div>
      </Card>
    </div>
  );

  const selectTemplate = async (templateId: TemplateId) => {
    const next = { ...personal, template: templateId };
    setPersonal(next);
    await savePersonal(next);
  };

  const legacyData = toLegacyData(personal, skills, experiences, projects, educations);

  const StepTemplates = () => (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Choose your CV template</h2>
        <p className="text-sm text-slate-500 mt-1">
          All 20 templates are real layouts from the original CV Builder. Changing the template does not change your CV content.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {TEMPLATES.map(([templateId, name, description], index) => {
          const selected = personal.template === templateId;
          return (
            <button
              key={templateId}
              type="button"
              onClick={() => void selectTemplate(templateId)}
              className={`text-left rounded-xl border-2 p-3 transition ${
                selected
                  ? 'border-blue-600 bg-blue-50 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div className="template-card-preview">
                <div className="template-card-preview-inner">
                  <CVPreview data={legacyData} template={templateId} />
                </div>
              </div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{index + 1}. {name}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-4">{description}</p>
                </div>
                {selected && (
                  <span className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
  const handlePrint = () => window.print();

  const handlePremiumDownload = async () => {
    try {
      const payment = await paymentsApi.status('PremiumCV');

      if (payment.approved === true) {
        handlePrint();
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

  const STEP_COMPONENTS = [
    StepPersonal,
    StepSkills,
    StepExperience,
    StepProjects,
    StepEducation,
    StepTemplates,
  ];

  const CurrentStep = STEP_COMPONENTS[step];

  if (loading) return <AppLayout><div className="flex items-center justify-center h-full"><Spinner size="lg" /></div></AppLayout>;
  if (error) return <AppLayout><div className="p-8 text-center text-red-500">{error}</div></AppLayout>;

  return (
    <AppLayout>
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #print-area, #print-area .cv-document, #print-area .cv-document * { visibility: visible !important; }
          #print-area .no-print { display: none !important; }
          #print-area { position: absolute !important; left: 0 !important; top: 0 !important; width: 210mm !important; margin: 0 !important; padding: 0 !important; }
          #print-area .cv-document { box-shadow: none !important; }
        }
      `}</style>
      <div className="cv-builder-shell min-h-full bg-slate-50">
        <div className="border-b border-slate-200 bg-white px-6 py-4 flex items-center justify-between no-print">
          <div>
            <h1 className="text-base font-bold text-slate-900">CV Builder</h1>
            <p className="text-xs text-slate-500">Build, preview and save your professional CV</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-slate-400">Template {TEMPLATES.findIndex(([key]) => key === personal.template) + 1}</span>
            <SaveStatus status={saveStatus} />
          </div>
        </div>

        <div className="border-b border-slate-200 bg-white px-4 overflow-x-auto no-print">
          <div className="flex gap-0 min-w-max">
            {STEPS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setStep(i)}
                className={`flex items-center gap-1.5 px-3 py-3 text-xs font-medium border-b-2 transition whitespace-nowrap ${
                  i === step ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <s.icon className="w-3.5 h-3.5" />
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 lg:p-6 xl:p-8">
          <div className="grid xl:grid-cols-[minmax(0,1fr)_minmax(430px,680px)] gap-6 items-start">
            <section className="min-w-0 no-print">
              <div className="bg-white border border-slate-200 rounded-xl p-5 lg:p-6 shadow-sm">
                <div className="mb-5">
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Step {step + 1} of {STEPS.length}</p>
                  <h2 className="text-lg font-bold text-slate-900 mt-1">{STEPS[step].label}</h2>
                </div>
                {CurrentStep()}
              </div>

              <div className="mt-4 border border-slate-200 bg-white rounded-xl px-4 py-3 flex items-center justify-between">
                <button
                  onClick={() => setStep(p => Math.max(0, p - 1))}
                  disabled={step === 0}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-30 transition"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
                {step < STEPS.length - 1 ? (
                  <button
                    onClick={async () => {
                      if (step === 0) {
                        await savePersonal(personal, true);
                      }
                      setStep(p => Math.min(STEPS.length - 1, p + 1));
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-[#1E3A8A] text-white rounded-lg hover:bg-blue-900 transition"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                    <button
                        type="button"
                        onClick={handlePremiumDownload}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-[#1E3A8A] text-white rounded-lg hover:bg-blue-900 transition"
                    >
                      <Download className="w-4 h-4" />
                      Unlock & Download — ₦2,000
                    </button>
                )}
              </div>
            </section>

            <section
                id="print-area"
                className="min-w-0 xl:sticky xl:top-4"
            >
              <div className="preview-shell">
                <div className="preview-label no-print">
                  <span>Live preview</span>
                  <strong>{TEMPLATES.find(([key]) => key === personal.template)?.[1] || 'Classic Professional'}</strong>
                </div>
                <CVPreview data={legacyData} template={normalizeTemplate(personal.template)} />
              </div>
              <div className="mt-3 text-center text-xs text-slate-400 no-print">
                Your PDF contains the CV only. JobiHub navigation and builder controls are excluded.
              </div>
            </section>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
