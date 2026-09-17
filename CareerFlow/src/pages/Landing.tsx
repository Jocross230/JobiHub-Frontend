import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Briefcase, Building2, Sparkles, Shield, TrendingUp, CheckCircle } from 'lucide-react';
import Layout from '../components/layout/Layout';
//import careerflowLogo from '../assets/careerflow-logo.png';

const features = [
  {
    icon: FileText,
    title: 'Professional CV Builder',
    description: 'Build a polished, ATS-ready CV in minutes with guided templates and real-time preview.',
  },
  {
    icon: Sparkles,
    title: 'AI Cover Letter Generator',
    description: 'Generate tailored cover letters in seconds. Personalised to every job application.',
  },
  {
    icon: Briefcase,
    title: 'Job Discovery',
    description: 'Explore thousands of opportunities. AI-matched to your profile, skills, and career goals.',
  },
  {
    icon: Building2,
    title: 'For Businesses',
    description: 'Post vacancies, manage candidates, and request expert recruitment support from JobiHub.',
  },
  {
    icon: TrendingUp,
    title: 'Career Tracking',
    description: 'Track applications, saved jobs, and career progress from one unified workspace.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is yours. Secure JWT authentication and strict ownership model throughout.',
  },
];

const steps = [
  { step: '01', title: 'Create Your Account', desc: 'Sign up in under 60 seconds.' },
  { step: '02', title: 'Build Your CV', desc: 'Complete your profile and generate a professional CV.' },
  { step: '03', title: 'Find Your Role', desc: 'Search, filter, and save jobs that match your goals.' },
  { step: '04', title: 'Apply with Confidence', desc: 'Use AI-generated cover letters tailored to each role.' },
];

export default function Landing() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative bg-[#0F172A] overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,#3B82F6,transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-2xl">

            {/* CareerFlow Logo */}
            <div className="mb-8">
              <Link to="/" className="inline-flex items-center">
               {/* <img
                    src={careerflowLogo}
                    alt="CareerFlow"
                    className="w-auto h-14 sm:h-16 object-contain"
                />*/}
              </Link>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-900/40 border border-blue-800 rounded-full mb-6">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs text-blue-300 font-medium">AI-powered career platform</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
              Your career,<br />
              <span className="text-blue-400">accelerated.</span>
            </h1>
            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
              JobiHub combines a professional CV builder, AI cover letter generator, intelligent job discovery, and business recruitment tools into one unified platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/register" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/jobs" className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-slate-600 text-slate-300 rounded-lg hover:border-slate-400 hover:text-white transition">
                Browse Jobs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '10K+', label: 'Professionals' },
            { value: '50K+', label: 'CVs Created' },
            { value: '5K+', label: 'Job Listings' },
            { value: '500+', label: 'Businesses' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-bold text-[#1E3A8A]">{s.value}</p>
              <p className="text-sm text-slate-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
              Everything you need
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">One platform. Every tool your career needs — from creating your first CV to landing your next role.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(f => (
              <div key={f.title} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md hover:border-blue-200 transition-all">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
              How it works
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={s.step} className="relative text-center">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-[60%] w-full h-px bg-slate-200" />
                )}
                <div className="w-12 h-12 rounded-full bg-[#1E3A8A] text-white font-bold text-sm flex items-center justify-center mx-auto mb-4 relative z-10">
                  {s.step}
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{s.title}</h3>
                <p className="text-sm text-slate-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business CTA */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0F172A] rounded-2xl p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                Hiring? Let JobiHub help.
              </h2>
              <p className="text-slate-400 max-w-lg">Post vacancies, manage candidates, and connect with JobiHub's Recruitment Team to source qualified talent.</p>
              <ul className="mt-4 space-y-2">
                {['Post job vacancies', 'Manage applications', 'Request expert recruitment support'].map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-3 flex-shrink-0">
              <Link to="/for-business" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition whitespace-nowrap">
                Register Your Business <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-white text-center">
        <div className="max-w-xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-4" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
            Ready to move forward?
          </h2>
          <p className="text-slate-500 mb-8">Join thousands of professionals using JobiHub to build CVs, discover jobs, and advance their careers.</p>
          <Link to="/register" className="inline-flex items-center gap-2 px-8 py-3 bg-[#1E3A8A] text-white font-semibold rounded-lg hover:bg-blue-900 transition">
            Create Free Account <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
