import { useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Link2, Globe, Save, Plus, X } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { Input, Textarea, Card, Spinner } from '../components/ui';
import { useAuth } from '../context/AuthContext';

interface ProfileForm {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  professionalTitle: string;
  bio: string;
  linkedInUrl: string;
  gitHubUrl: string;
  websiteUrl: string;
  skills: string[];
}

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState<ProfileForm>({
    fullName: user?.fullName ?? '',
    email: user?.email ?? '',
    phone: '',
    location: '',
    professionalTitle: '',
    bio: '',
    linkedInUrl: '',
    gitHubUrl: '',
    websiteUrl: '',
    skills: [],
  });
  const [skillInput, setSkillInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (key: keyof ProfileForm, value: string) =>
    setForm(p => ({ ...p, [key]: value }));

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !form.skills.includes(s)) {
      setForm(p => ({ ...p, skills: [...p.skills, s] }));
    }
    setSkillInput('');
  };

  const removeSkill = (skill: string) =>
    setForm(p => ({ ...p, skills: p.skills.filter(s => s !== skill) }));

  const completion = (() => {
    const fields = [form.fullName, form.email, form.phone, form.location, form.professionalTitle, form.bio, form.linkedInUrl];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  })();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // NOTE: Connect to userApi.updateProfile() once endpoint is available
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-3xl mx-auto">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Career Profile</h1>
            <p className="text-sm text-slate-500 mt-0.5">Manage your personal information and career details.</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500 mb-1">Profile completion</div>
            <div className="flex items-center gap-2">
              <div className="w-24 h-1.5 bg-slate-200 rounded-full">
                <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${completion}%` }} />
              </div>
              <span className="text-xs font-semibold text-slate-700">{completion}%</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Personal information */}
          <Card className="p-6">
            <h2 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" /> Personal Information
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Full Name" value={form.fullName} onChange={e => set('fullName', e.target.value)} placeholder="Sarah Johnson" />
              <Input label="Email Address" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" />
              <Input label="Phone" type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+44 7700 000000" />
              <Input label="Location" value={form.location} onChange={e => set('location', e.target.value)} placeholder="London, UK" />
              <div className="sm:col-span-2">
                <Input label="Professional Title" value={form.professionalTitle} onChange={e => set('professionalTitle', e.target.value)} placeholder="Senior Software Engineer" />
              </div>
              <div className="sm:col-span-2">
                <Textarea label="Professional Summary" value={form.bio} onChange={e => set('bio', e.target.value)} placeholder="A brief overview of your career and goals..." rows={4} />
              </div>
            </div>
          </Card>

          {/* Skills */}
          <Card className="p-6">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">Skills</h2>
            <div className="flex gap-2 mb-3">
              <input
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                placeholder="Add a skill (e.g. React, Python)"
                className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="button" onClick={addSkill} className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-200 transition">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.skills.map(skill => (
                <span key={skill} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {form.skills.length === 0 && <p className="text-xs text-slate-400">No skills added yet.</p>}
            </div>
          </Card>

          {/* Social links */}
          <Card className="p-6">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">Social Links</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Link2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <Input value={form.linkedInUrl} onChange={e => set('linkedInUrl', e.target.value)} placeholder="https://linkedin.com/in/yourprofile" className="flex-1" />
              </div>
              <div className="flex items-center gap-3">
                <Link2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <Input value={form.gitHubUrl} onChange={e => set('gitHubUrl', e.target.value)} placeholder="https://github.com/yourusername" className="flex-1" />
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <Input value={form.websiteUrl} onChange={e => set('websiteUrl', e.target.value)} placeholder="https://yourwebsite.com" className="flex-1" />
              </div>
            </div>
          </Card>

          <div className="flex items-center justify-between">
            {saved && <span className="text-sm text-emerald-600 font-medium">Profile saved successfully.</span>}
            <div className="ml-auto">
              <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-[#1E3A8A] text-white text-sm font-semibold rounded-lg hover:bg-blue-900 disabled:opacity-60 transition">
                {saving ? <Spinner size="sm" /> : <Save className="w-4 h-4" />}
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
