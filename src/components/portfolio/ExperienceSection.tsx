import React from 'react';
import { Briefcase, MapPin, Calendar } from 'lucide-react';
import type { Experience } from '../../types';
import { formatDate } from '../../utils';
import { SectionTitle } from './SectionTitle';
import { useIntersection } from '../../hooks/useIntersection';
import { cn } from '../../utils';

interface ExperienceSectionProps {
  experiences: Experience[];
}

const ExperienceItem: React.FC<{ exp: Experience; index: number }> = ({ exp, index }) => {
  const [ref, visible] = useIntersection<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        'relative pl-10 transition-all duration-700',
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Timeline dot */}
      <div className="timeline-dot" />

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 mb-8">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
            <div className="flex items-center gap-1.5 text-primary-600 font-semibold mt-0.5">
              <Briefcase className="w-3.5 h-3.5" />
              <span className="text-sm">{exp.companyName}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={cn(
              'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold',
              exp.isCurrent
                ? 'bg-green-100 text-green-700 border border-green-200'
                : 'bg-gray-100 text-gray-600 border border-gray-200'
            )}>
              {exp.isCurrent ? 'Current' : 'Past'}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Calendar className="w-3 h-3" />
              {formatDate(exp.startDate)} — {exp.isCurrent ? 'Present' : formatDate(exp.endDate || '')}
            </span>
          </div>
        </div>

        {exp.location && (
          <div className="flex items-center gap-1 text-xs text-gray-400 mb-4">
            <MapPin className="w-3 h-3" />
            {exp.location}
          </div>
        )}

        {/* Description points */}
        {exp.descriptionPoints?.length > 0 && (
          <ul className="space-y-1.5">
            {exp.descriptionPoints.map((point, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-600">
                <span className="flex-shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" />
                {point}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences }) => {
  if (!experiences.length) return null;
  const sorted = [...experiences].sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <section id="experience" className="py-24 bg-gray-50/50">
      <div className="section-container">
        <SectionTitle
          icon={<Briefcase className="w-6 h-6" />}
          title="Work Experience"
          subtitle="My professional journey and key achievements"
        />
        <div className="relative max-w-3xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-[5px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary-400 via-accent-400 to-primary-300 opacity-30" />
          {sorted.map((exp, i) => (
            <ExperienceItem key={exp.id} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};
