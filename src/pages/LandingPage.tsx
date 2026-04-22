import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Zap, Globe, Download, CheckCircle, ArrowRight } from 'lucide-react';

const FEATURES = [
  { icon: FileText, title: 'Complete Portfolio', desc: 'Experience, education, skills, projects & more in one place' },
  { icon: Zap, title: 'Live Preview', desc: 'See your public portfolio update in real-time as you edit' },
  { icon: Globe, title: 'Public URL', desc: 'Share portfolio.you/username with recruiters instantly' },
  { icon: Download, title: 'PDF Export', desc: 'Download a beautiful PDF version for job applications' },
];

const CHECKLIST = [
  'Personal Info & Contact',
  'Professional Summary',
  'Work Experience (timeline)',
  'Education',
  'Hard & Soft Skills',
  'Projects with tech stack',
  'Certifications',
  'Awards & Recognition',
  'Languages',
];

export const LandingPage: React.FC = () => (
  <div className="min-h-screen bg-white">
    {/* Nav */}
    <nav className="flex items-center justify-between px-6 lg:px-12 py-5 border-b border-gray-100">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg animated-gradient flex items-center justify-center">
          <FileText className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-gray-900">PortfolioBuilder</span>
      </div>
      <div className="flex items-center gap-3">
        <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">
          Sign In
        </Link>
        <Link to="/signup" className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-all hover:shadow-glow">
          Get Started Free
        </Link>
      </div>
    </nav>

    {/* Hero */}
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 animated-gradient opacity-5" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-50 to-transparent opacity-60" />

      <div className="relative section-container py-24 lg:py-36">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
            Free forever · No credit card required
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
            Build your{' '}
            <span className="gradient-text">dream portfolio</span>{' '}
            in minutes
          </h1>
          <p className="text-xl text-gray-500 mb-10 leading-relaxed max-w-2xl">
            Create a stunning professional portfolio website with a public URL you can share anywhere.
            Perfect for developers, designers, and all tech professionals.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/signup" className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white rounded-2xl text-base font-semibold hover:bg-primary-700 transition-all hover:shadow-glow active:scale-[0.98]">
              Create your portfolio
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/portfolio/demo" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-2xl text-base font-semibold hover:border-primary-300 hover:text-primary-700 transition-all">
              See demo
            </Link>
          </div>
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="py-24 bg-gray-50">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Everything you need</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            A complete toolkit to showcase your professional journey
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 border border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Checklist */}
    <section className="py-24">
      <div className="section-container">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Complete portfolio sections, all in one dashboard
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CHECKLIST.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 bg-gradient-to-br from-primary-600 to-accent-500 rounded-3xl p-10 text-white shadow-2xl">
            <div className="text-center">
              <div className="text-6xl font-extrabold mb-2">100%</div>
              <div className="text-xl font-semibold text-white/90 mb-2">Profile Completeness</div>
              <div className="text-white/70 text-sm mb-8">All sections filled & ready to impress</div>
              <Link to="/signup" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-700 rounded-xl font-semibold text-sm hover:bg-primary-50 transition-colors">
                Start building now
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-24 bg-gray-900">
      <div className="section-container text-center">
        <h2 className="text-3xl lg:text-5xl font-extrabold text-white mb-6">
          Ready to stand out?
        </h2>
        <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
          Join professionals who have built their portfolio in under 30 minutes.
        </p>
        <Link to="/signup" className="inline-flex items-center gap-2 px-10 py-4 animated-gradient text-white rounded-2xl text-lg font-bold hover:opacity-90 transition-opacity shadow-2xl">
          Get started for free
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>

    {/* Footer */}
    <footer className="py-8 bg-gray-900 border-t border-gray-800 text-center">
      <p className="text-gray-500 text-sm">
        © {new Date().getFullYear()} PortfolioBuilder — Built with React & TailwindCSS
      </p>
    </footer>
  </div>
);
