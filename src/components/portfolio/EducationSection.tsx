import React from 'react';
import { GraduationCap, Calendar, Star } from 'lucide-react';
import type { Education } from '../../types';
import { SectionTitle } from './SectionTitle';
import { useIntersection } from '../../hooks/useIntersection';
import { cn } from '../../utils';

interface EducationSectionProps {
  educations: Education[];
}

const EducationCard: React.FC<{ edu: Education; index: number }> = ({ edu, index }) => {
  const [ref, visible] = useIntersection<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      )}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 h-full">
        {/* Institution badge */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base leading-tight">{edu.institution}</h3>
            <p className="text-primary-600 font-medium text-sm mt-0.5">{edu.degree}</p>
            <p className="text-gray-500 text-sm">{edu.major}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <Calendar className="w-3.5 h-3.5" />
            {edu.startYear} — {edu.endYear}
          </span>
          {edu.gpa && (
            <span className="flex items-center gap-1 px-3 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full text-xs font-bold">
              <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
              GPA {edu.gpa.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export const EducationSection: React.FC<EducationSectionProps> = ({ educations }) => {
  if (!educations.length) return null;
  const sorted = [...educations].sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <section id="education" className="py-24">
      <div className="section-container">
        <SectionTitle
          icon={<GraduationCap className="w-6 h-6" />}
          title="Education"
          subtitle="Academic background and qualifications"
          accent="accent"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {sorted.map((edu, i) => (
            <EducationCard key={edu.id} edu={edu} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};
