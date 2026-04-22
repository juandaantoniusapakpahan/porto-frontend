import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User, FileText, Briefcase, GraduationCap, Zap,
  Award, FolderOpen, Trophy, Globe, ExternalLink, CheckCircle2, Circle,
} from 'lucide-react';
import { portfolioService } from '../../api/services/portfolioService';
import { usePortfolioStore } from '../../store/portfolioStore';
import { useAuthStore } from '../../store/authStore';
import { computeCompleteness, overallCompleteness } from '../../utils';
import { SkeletonCard } from '../../components/ui/Skeleton';
import toast from 'react-hot-toast';

const SECTIONS = [
  { key: 'personalInfo', label: 'Personal Info', to: '/dashboard/personal-info', icon: User, color: 'bg-blue-500' },
  { key: 'summary', label: 'Summary', to: '/dashboard/summary', icon: FileText, color: 'bg-indigo-500' },
  { key: 'experience', label: 'Experience', to: '/dashboard/experience', icon: Briefcase, color: 'bg-purple-500' },
  { key: 'education', label: 'Education', to: '/dashboard/education', icon: GraduationCap, color: 'bg-pink-500' },
  { key: 'skills', label: 'Skills', to: '/dashboard/skills', icon: Zap, color: 'bg-orange-500' },
  { key: 'certifications', label: 'Certifications', to: '/dashboard/certifications', icon: Award, color: 'bg-yellow-500' },
  { key: 'projects', label: 'Projects', to: '/dashboard/projects', icon: FolderOpen, color: 'bg-green-500' },
  { key: 'awards', label: 'Awards', to: '/dashboard/awards', icon: Trophy, color: 'bg-teal-500' },
  { key: 'languages', label: 'Languages', to: '/dashboard/languages', icon: Globe, color: 'bg-cyan-500' },
];

export const DashboardHome: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const store = usePortfolioStore();
  const { user } = useAuthStore();

  useEffect(() => {
    (async () => {
      try {
        const [
          personalInfo, summary, experiences, educations,
          skills, certifications, projects, awards, languages,
        ] = await Promise.all([
          portfolioService.getPersonalInfo(),
          portfolioService.getSummary(),
          portfolioService.getExperiences(),
          portfolioService.getEducations(),
          portfolioService.getSkills(),
          portfolioService.getCertifications(),
          portfolioService.getProjects(),
          portfolioService.getAwards(),
          portfolioService.getLanguages(),
        ]);

        store.setPersonalInfo(personalInfo.data.data);
        store.setSummary(summary.data.data);
        store.setExperiences(experiences.data.data || []);
        store.setEducations(educations.data.data || []);
        store.setSkills(skills.data.data || []);
        store.setCertifications(certifications.data.data || []);
        store.setProjects(projects.data.data || []);
        store.setAwards(awards.data.data || []);
        store.setLanguages(languages.data.data || []);
      } catch {
        toast.error('Failed to load portfolio data');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const completeness = computeCompleteness({
    personalInfo: store.personalInfo,
    summary: store.summary,
    experiences: store.experiences,
    educations: store.educations,
    skills: store.skills,
    certifications: store.certifications,
    projects: store.projects,
    awards: store.awards,
    languages: store.languages,
  });

  const overall = overallCompleteness(completeness);

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Welcome header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.fullName?.split(' ')[0] || user?.username} 👋
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Complete your portfolio to attract more opportunities.
        </p>
      </div>

      {/* Overall progress */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-500 rounded-2xl p-6 text-white mb-8 shadow-glow">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-lg">Profile Completeness</h2>
            <p className="text-primary-100 text-sm mt-0.5">
              {overall < 100 ? 'Keep going, you\'re making progress!' : 'Your portfolio is complete!'}
            </p>
          </div>
          <div className="text-right">
            <span className="text-4xl font-extrabold">{overall}%</span>
          </div>
        </div>
        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-700"
            style={{ width: `${overall}%` }}
          />
        </div>
        {user?.username && (
          <div className="mt-4 flex items-center gap-2">
            <a
              href={`/portfolio/${user.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium text-white/90 hover:text-white underline underline-offset-2"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View your public portfolio
            </a>
          </div>
        )}
      </div>

      {/* Section cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SECTIONS.map(({ key, label, to, icon: Icon, color }) => {
          const done = completeness[key] === 100;
          return (
            <Link
              key={key}
              to={to}
              className="group bg-white rounded-2xl border border-gray-100 p-5 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                {done
                  ? <CheckCircle2 className="w-5 h-5 text-green-500" />
                  : <Circle className="w-5 h-5 text-gray-200" />
                }
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">{label}</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {done ? 'Completed' : 'Needs attention'}
              </p>
              <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${done ? 'bg-green-400' : 'bg-primary-400'}`}
                  style={{ width: `${completeness[key]}%` }}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
