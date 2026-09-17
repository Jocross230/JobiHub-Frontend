import { Link } from 'react-router-dom';
import { Building2, Briefcase, Users, HeadphonesIcon, ArrowRight, CheckCircle } from 'lucide-react';
import Layout from '../../components/layout/Layout';

const features = [
  { icon: Building2, title: 'Company Profile', desc: 'Create a verified business profile visible to thousands of job seekers.' },
  { icon: Briefcase, title: 'Post Vacancies', desc: 'Publish job listings and receive applications directly through JobiHub.' },
  { icon: Users, title: 'Manage Candidates', desc: 'Track and manage candidate applications and pipeline from your dashboard.' },
  { icon: HeadphonesIcon, title: 'Recruitment Support', desc: 'Request expert support from the JobiHub Recruitment Team to source qualified talent.' },
];

export default function ForBusiness() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-[#0F172A] py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-900/40 border border-blue-800 rounded-full mb-6">
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs text-blue-300 font-medium">JobiHub for Business</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-5" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
            Find the talent your business needs.
          </h1>
          <p className="text-lg text-slate-400 mb-8 max-w-xl mx-auto">
            Register your business on JobiHub to post vacancies, manage candidates, and connect with our expert Recruitment Team.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/business/register" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
              Register Your Business <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/business/recruitment" className="inline-flex items-center gap-2 px-6 py-3 border border-slate-600 text-slate-300 rounded-lg hover:border-slate-400 hover:text-white transition">
              Request Recruitment Support
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-10" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
            Everything a growing business needs
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(f => (
              <div key={f.title} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
                  <f.icon className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recruitment team CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-5">
            <HeadphonesIcon className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
            Need qualified candidates?
          </h2>
          <p className="text-slate-500 mb-6 max-w-lg mx-auto">
            The JobiHub Recruitment Team helps businesses identify and connect with qualified candidates. Submit a request and we'll start working for you.
          </p>
          <div className="grid sm:grid-cols-3 gap-6 mb-8">
            {[
              { step: '1', title: 'Submit Request', desc: 'Share your role requirements with our team.' },
              { step: '2', title: 'We Source Candidates', desc: 'Our team identifies and screens qualified candidates.' },
              { step: '3', title: 'Review & Connect', desc: 'Receive shortlisted candidates and take it from there.' },
            ].map(s => (
              <div key={s.step} className="text-left bg-slate-50 rounded-xl p-4">
                <div className="w-8 h-8 rounded-full bg-[#1E3A8A] text-white text-sm font-bold flex items-center justify-center mb-3">{s.step}</div>
                <h3 className="font-semibold text-slate-900 text-sm mb-1">{s.title}</h3>
                <p className="text-xs text-slate-500">{s.desc}</p>
              </div>
            ))}
          </div>
          <Link to="/business/recruitment" className="inline-flex items-center gap-2 px-6 py-3 bg-[#1E3A8A] text-white font-semibold rounded-lg hover:bg-blue-900 transition">
            Request Recruitment Support <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
