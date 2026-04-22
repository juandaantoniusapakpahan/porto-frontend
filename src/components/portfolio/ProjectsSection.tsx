import React from 'react';
import { FolderOpen, ExternalLink, Calendar } from 'lucide-react';
import { GithubIcon } from '../ui/SocialIcons';
import type { Project } from '../../types';
import { SectionTitle } from './SectionTitle';
import { useIntersection } from '../../hooks/useIntersection';
import { cn, formatDate } from '../../utils';

interface ProjectsSectionProps {
  projects: Project[];
}

const TECH_COLORS = [
  'bg-blue-100 text-blue-700',
  'bg-purple-100 text-purple-700',
  'bg-green-100 text-green-700',
  'bg-orange-100 text-orange-700',
  'bg-pink-100 text-pink-700',
  'bg-indigo-100 text-indigo-700',
  'bg-teal-100 text-teal-700',
  'bg-red-100 text-red-700',
];

const ProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  const [ref, visible] = useIntersection<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        'group transition-all duration-700',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
        {/* Thumbnail */}
        <div className="relative h-44 bg-gradient-to-br from-primary-100 via-accent-50 to-primary-50 overflow-hidden">
          {project.thumbnailUrl ? (
            <img
              src={project.thumbnailUrl}
              alt={project.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <FolderOpen className="w-16 h-16 text-primary-200 group-hover:text-primary-300 transition-colors" />
            </div>
          )}
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-primary-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
            {project.projectUrl && (
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-3 bg-white rounded-xl text-primary-600 hover:bg-primary-50 transition-colors shadow-lg"
                title="Live Demo"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-3 bg-white rounded-xl text-gray-900 hover:bg-gray-50 transition-colors shadow-lg"
                title="Repository"
              >
                <GithubIcon className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-bold text-gray-900 text-base leading-tight">{project.name}</h3>
            {(project.startDate || project.endDate) && (
              <span className="flex items-center gap-1 text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                <Calendar className="w-3 h-3" />
                {project.startDate && formatDate(project.startDate)}
                {project.endDate && ` — ${formatDate(project.endDate)}`}
              </span>
            )}
          </div>

          <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-1 line-clamp-3">
            {project.description}
          </p>

          {/* Tech stack tags */}
          {project.techStack?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-auto">
              {project.techStack.map((tech, i) => (
                <span
                  key={tech}
                  className={cn(
                    'px-2.5 py-0.5 rounded-full text-xs font-medium',
                    TECH_COLORS[i % TECH_COLORS.length]
                  )}
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer links */}
        {(project.projectUrl || project.repoUrl) && (
          <div className="px-5 pb-4 flex gap-3 border-t border-gray-50 pt-4">
            {project.projectUrl && (
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:text-primary-700"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Live Demo
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                Repository
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  if (!projects.length) return null;
  const sorted = [...projects].sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <section id="projects" className="py-24 bg-gray-50/50">
      <div className="section-container">
        <SectionTitle
          icon={<FolderOpen className="w-6 h-6" />}
          title="Projects"
          subtitle="Featured work and personal builds"
          accent="accent"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};
