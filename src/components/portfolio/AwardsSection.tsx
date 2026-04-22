import React from 'react';
import { Trophy, Calendar } from 'lucide-react';
import type { Award } from '../../types';
import { SectionTitle } from './SectionTitle';
import { useIntersection } from '../../hooks/useIntersection';
import { cn, formatDate } from '../../utils';

interface AwardsSectionProps {
  awards: Award[];
}

const AwardItem: React.FC<{ award: Award; index: number }> = ({ award, index }) => {
  const [ref, visible] = useIntersection<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        'flex gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300',
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
      )}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-primary-500 flex items-center justify-center flex-shrink-0 shadow-sm">
        <Trophy className="w-5 h-5 text-white" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 text-sm">{award.title}</h3>
        <p className="text-primary-600 text-xs font-medium mt-0.5">{award.issuer}</p>
        {award.description && (
          <p className="text-gray-500 text-xs mt-1.5 leading-relaxed">{award.description}</p>
        )}
        <span className="flex items-center gap-1 text-xs text-gray-400 mt-2">
          <Calendar className="w-3 h-3" />
          {formatDate(award.date)}
        </span>
      </div>
    </div>
  );
};

export const AwardsSection: React.FC<AwardsSectionProps> = ({ awards }) => {
  if (!awards.length) return null;
  const sorted = [...awards].sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <section id="awards" className="py-24 bg-gradient-to-br from-purple-50/40 to-primary-50/40">
      <div className="section-container">
        <SectionTitle
          icon={<Trophy className="w-6 h-6" />}
          title="Awards & Recognition"
          subtitle="Honors and accomplishments"
          accent="accent"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {sorted.map((award, i) => (
            <AwardItem key={award.id} award={award} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};
