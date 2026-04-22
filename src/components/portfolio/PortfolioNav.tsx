import React, { useState, useEffect } from 'react';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import { cn } from '../../utils';
import {
  Home, Briefcase, GraduationCap, Zap, FolderOpen,
  Award, Trophy, Globe, FileText, User,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'hero',            label: 'Home',            icon: Home },
  { id: 'summary',         label: 'About',           icon: User },
  { id: 'experience',      label: 'Experience',      icon: Briefcase },
  { id: 'education',       label: 'Education',       icon: GraduationCap },
  { id: 'skills',          label: 'Skills',          icon: Zap },
  { id: 'projects',        label: 'Projects',        icon: FolderOpen },
  { id: 'certifications',  label: 'Certifications',  icon: Award },
  { id: 'awards',          label: 'Awards',          icon: Trophy },
  { id: 'languages',       label: 'Languages',       icon: Globe },
];

interface PortfolioNavProps {
  availableSections: string[];
}

export const PortfolioNav: React.FC<PortfolioNavProps> = ({ availableSections }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const visibleItems = NAV_ITEMS.filter((item) => availableSections.includes(item.id));
  const activeId = useScrollSpy(visibleItems.map((i) => i.id));

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <>
      {/* Desktop sticky top nav */}
      <nav className={cn(
        'no-print fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        isScrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-100'
          : 'bg-transparent'
      )}>
        <div className="section-container">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => scrollTo('hero')}
              className="flex items-center gap-2 font-bold text-gray-900 hover:text-primary-600 transition-colors"
            >
              <FileText className="w-5 h-5 text-primary-600" />
              Portfolio
            </button>

            {/* Desktop nav items */}
            <div className="hidden md:flex items-center gap-1">
              {visibleItems.slice(1).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
                    activeId === id
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            >
              <div className={cn('w-5 h-0.5 bg-current transition-all', mobileOpen && 'rotate-45 translate-y-1.5')} />
              <div className={cn('w-5 h-0.5 bg-current my-1 transition-all', mobileOpen && 'opacity-0')} />
              <div className={cn('w-5 h-0.5 bg-current transition-all', mobileOpen && '-rotate-45 -translate-y-1.5')} />
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-2 px-4">
            {visibleItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={cn(
                  'flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  activeId === id
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50'
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        )}
      </nav>
    </>
  );
};
