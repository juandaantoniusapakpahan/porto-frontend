import React from 'react';
import { Award as AwardIcon, Calendar, ExternalLink } from 'lucide-react';
import type { Certification } from '../../types';
import { SectionTitle } from './SectionTitle';
import { useIntersection } from '../../hooks/useIntersection';
import { cn, formatDate } from '../../utils';

interface CertificationsSectionProps {
  certifications: Certification[];
}

const CertCard: React.FC<{ cert: Certification; index: number }> = ({ cert, index }) => {
  const [ref, visible] = useIntersection<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        'flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-card',
        'hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      )}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center flex-shrink-0 shadow-sm">
        <AwardIcon className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight">{cert.name}</h3>
          {cert.credentialUrl && (
            <a
              href={cert.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
        <p className="text-primary-600 text-xs font-medium mt-0.5">{cert.issuer}</p>
        <div className="flex items-center gap-3 mt-2">
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Calendar className="w-3 h-3" />
            {formatDate(cert.issueDate)}
          </span>
          {cert.expiryDate && (
            <span className="text-xs text-gray-400">
              Expires: {formatDate(cert.expiryDate)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export const CertificationsSection: React.FC<CertificationsSectionProps> = ({ certifications }) => {
  if (!certifications.length) return null;
  const sorted = [...certifications].sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <section id="certifications" className="py-24">
      <div className="section-container">
        <SectionTitle
          icon={<AwardIcon className="w-6 h-6" />}
          title="Certifications"
          subtitle="Professional credentials and achievements"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {sorted.map((cert, i) => (
            <CertCard key={cert.id} cert={cert} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};
