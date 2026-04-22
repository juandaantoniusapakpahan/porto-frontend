import React from 'react';
import { Globe } from 'lucide-react';
import type { Language } from '../../types';
import { SectionTitle } from './SectionTitle';
import { useIntersection } from '../../hooks/useIntersection';
import { cn, languageProficiencyToPercent, languageProficiencyLabel } from '../../utils';

interface LanguagesSectionProps {
  languages: Language[];
}

const CircleProgress: React.FC<{ percent: number; label: string; visible: boolean; delay: number }> = ({
  percent, label, visible, delay,
}) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (visible ? percent / 100 : 0) * circumference;

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-3 transition-all duration-700',
        visible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="8" />
          {/* Progress circle */}
          <circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke="url(#langGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
          />
          <defs>
            <linearGradient id="langGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>
          </defs>
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-700">
          {percent}%
        </span>
      </div>
      <span className="text-sm font-medium text-gray-500">{label}</span>
    </div>
  );
};

const LanguageCard: React.FC<{ lang: Language; index: number }> = ({ lang, index }) => {
  const [ref, visible] = useIntersection<HTMLDivElement>();
  const percent = languageProficiencyToPercent(lang.proficiency);
  const label = languageProficiencyLabel(lang.proficiency);

  return (
    <div ref={ref} className="flex flex-col items-center gap-3">
      <CircleProgress percent={percent} label={label} visible={visible} delay={index * 100} />
      <h3 className={cn(
        'font-bold text-gray-800 text-base transition-all duration-700',
        visible ? 'opacity-100' : 'opacity-0'
      )} style={{ transitionDelay: `${index * 100 + 200}ms` }}>
        {lang.languageName}
      </h3>
    </div>
  );
};

export const LanguagesSection: React.FC<LanguagesSectionProps> = ({ languages }) => {
  if (!languages.length) return null;
  const sorted = [...languages].sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <section id="languages" className="py-24 bg-gray-50/50">
      <div className="section-container">
        <SectionTitle
          icon={<Globe className="w-6 h-6" />}
          title="Languages"
          subtitle="Communication skills across languages"
        />
        <div className="flex flex-wrap justify-center gap-12 max-w-3xl mx-auto">
          {sorted.map((lang, i) => (
            <LanguageCard key={lang.id} lang={lang} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};
