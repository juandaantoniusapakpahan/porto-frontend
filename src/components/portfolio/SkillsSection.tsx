import React from 'react';
import { Zap } from 'lucide-react';
import type { Skill } from '../../types';
import { SectionTitle } from './SectionTitle';
import { proficiencyToPercent } from '../../utils';
import { useIntersection } from '../../hooks/useIntersection';
import { cn } from '../../utils';

interface SkillsSectionProps {
  skills: Skill[];
}

const LEVEL_COLORS: Record<string, string> = {
  BEGINNER: 'bg-blue-100 text-blue-700 border-blue-200',
  INTERMEDIATE: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  ADVANCED: 'bg-orange-100 text-orange-700 border-orange-200',
  EXPERT: 'bg-green-100 text-green-700 border-green-200',
};

const HardSkillBar: React.FC<{ skill: Skill; index: number }> = ({ skill, index }) => {
  const [ref, visible] = useIntersection<HTMLDivElement>();
  const percent = proficiencyToPercent(skill.proficiencyLevel);

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-500',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      )}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-gray-700">{skill.name}</span>
        <span className={cn('badge border text-xs', LEVEL_COLORS[skill.proficiencyLevel])}>
          {skill.proficiencyLevel.charAt(0) + skill.proficiencyLevel.slice(1).toLowerCase()}
        </span>
      </div>
      <div className="skill-bar">
        <div
          className="skill-bar-fill"
          style={{ width: visible ? `${percent}%` : '0%' }}
        />
      </div>
    </div>
  );
};

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  if (!skills.length) return null;

  const hardSkills = skills.filter((s) => s.category === 'HARD').sort((a, b) => a.orderIndex - b.orderIndex);
  const softSkills = skills.filter((s) => s.category === 'SOFT').sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <section id="skills" className="py-24 bg-gradient-to-br from-primary-50/50 to-accent-50/30">
      <div className="section-container">
        <SectionTitle
          icon={<Zap className="w-6 h-6" />}
          title="Skills"
          subtitle="Technical and professional capabilities"
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Hard Skills */}
          {hardSkills.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">H</span>
                </div>
                <h3 className="font-bold text-gray-900 text-xl">Hard Skills</h3>
              </div>
              <div className="space-y-5 bg-white rounded-2xl border border-gray-100 p-6 shadow-card">
                {hardSkills.map((skill, i) => (
                  <HardSkillBar key={skill.id} skill={skill} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* Soft Skills */}
          {softSkills.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg bg-accent-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">S</span>
                </div>
                <h3 className="font-bold text-gray-900 text-xl">Soft Skills</h3>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card">
                <div className="flex flex-wrap gap-3">
                  {softSkills.map((skill, i) => (
                    <SkillPill key={skill.id} skill={skill} index={i} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const SkillPill: React.FC<{ skill: Skill; index: number }> = ({ skill, index }) => {
  const [ref, visible] = useIntersection<HTMLSpanElement>();
  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium',
        'bg-gradient-to-r from-accent-50 to-primary-50 text-primary-700 border border-primary-200',
        'transition-all duration-500 hover:shadow-glow hover:-translate-y-0.5',
        visible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
      )}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      <div className="w-1.5 h-1.5 rounded-full bg-accent-400" />
      {skill.name}
    </span>
  );
};
