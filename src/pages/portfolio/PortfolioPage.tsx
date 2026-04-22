import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { publicService } from '../../api/services/publicService';
import type { PublicPortfolio } from '../../types';
import { HeroSection } from '../../components/portfolio/HeroSection';
import { ExperienceSection } from '../../components/portfolio/ExperienceSection';
import { EducationSection } from '../../components/portfolio/EducationSection';
import { SkillsSection } from '../../components/portfolio/SkillsSection';
import { ProjectsSection } from '../../components/portfolio/ProjectsSection';
import { CertificationsSection } from '../../components/portfolio/CertificationsSection';
import { AwardsSection } from '../../components/portfolio/AwardsSection';
import { LanguagesSection } from '../../components/portfolio/LanguagesSection';
import { PortfolioNav } from '../../components/portfolio/PortfolioNav';
import { Skeleton } from '../../components/ui/Skeleton';
import toast from 'react-hot-toast';
import { FileText } from 'lucide-react';

const LoadingSkeleton: React.FC = () => (
  <div className="min-h-screen bg-white">
    <div className="section-container py-24 space-y-8">
      <div className="flex flex-col lg:flex-row items-center gap-16">
        <Skeleton className="w-48 h-48 rounded-3xl flex-shrink-0" />
        <div className="flex-1 space-y-4 w-full">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-16 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-64" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-28 rounded-xl" />
            <Skeleton className="h-10 w-28 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const NotFoundPage: React.FC<{ username: string }> = ({ username }) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50/30 flex items-center justify-center">
    <div className="text-center">
      <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center mx-auto mb-6">
        <FileText className="w-10 h-10 text-gray-300" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Portfolio Not Found</h1>
      <p className="text-gray-500 mb-6">
        No portfolio found for <strong>@{username}</strong>
      </p>
      <a href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors">
        Go Home
      </a>
    </div>
  </div>
);

export const PortfolioPage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [data, setData] = useState<PublicPortfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!username) return;
    (async () => {
      try {
        const res = await publicService.getPortfolio(username);
        setData(res.data.data);
      } catch (err: unknown) {
        const status = (err as { response?: { status?: number } })?.response?.status;
        if (status === 404) setNotFound(true);
        else toast.error('Failed to load portfolio');
      } finally {
        setLoading(false);
      }
    })();
  }, [username]);

  const handleDownloadPdf = async () => {
    if (!username) return;
    setDownloading(true);
    try {
      await publicService.downloadPdf(username);
    } catch {
      // Fallback to print
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <LoadingSkeleton />;
  if (notFound || !data) return <NotFoundPage username={username || ''} />;

  // Determine which sections have content
  const availableSections = [
    'hero',
    data.summary?.content ? 'summary' : null,
    data.experiences?.length ? 'experience' : null,
    data.educations?.length ? 'education' : null,
    data.skills?.length ? 'skills' : null,
    data.projects?.length ? 'projects' : null,
    data.certifications?.length ? 'certifications' : null,
    data.awards?.length ? 'awards' : null,
    data.languages?.length ? 'languages' : null,
  ].filter(Boolean) as string[];

  return (
    <div className="bg-white">
      <PortfolioNav availableSections={availableSections} />

      {/* PT for fixed nav */}
      <div className="pt-16">
        <HeroSection
          personalInfo={data.personalInfo}
          onDownloadPdf={handleDownloadPdf}
          isDownloading={downloading}
        />

        {/* Summary */}
        {data.summary?.content && (
          <section id="summary" className="py-24">
            <div className="section-container">
              <div className="max-w-3xl mx-auto">
                <div className="flex flex-col items-center text-center mb-10">
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">About Me</h2>
                  <div className="w-12 h-1 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 mt-2" />
                </div>
                <div className="bg-gradient-to-br from-primary-50 to-accent-50/50 rounded-2xl p-8 border border-primary-100">
                  <p className="text-gray-700 leading-relaxed text-lg font-light whitespace-pre-line">
                    {data.summary.content}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        <ExperienceSection experiences={data.experiences || []} />
        <EducationSection educations={data.educations || []} />
        <SkillsSection skills={data.skills || []} />
        <ProjectsSection projects={data.projects || []} />
        <CertificationsSection certifications={data.certifications || []} />
        <AwardsSection awards={data.awards || []} />
        <LanguagesSection languages={data.languages || []} />

        {/* Footer */}
        <footer className="no-print py-12 bg-gray-900 text-center">
          <p className="text-gray-400 text-sm">
            Built with <span className="text-primary-400 font-semibold">PortfolioBuilder</span>
            {' · '}
            <span className="text-gray-500">© {new Date().getFullYear()}</span>
          </p>
        </footer>
      </div>
    </div>
  );
};
