import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  User, FileText, Briefcase, GraduationCap, Zap,
  Award, FolderOpen, Trophy, Globe, LayoutDashboard,
  LogOut, ExternalLink, ChevronRight,
} from 'lucide-react';
import { cn } from '../../utils';
import { useAuth } from '../../hooks/useAuth';
import { usePortfolioStore } from '../../store/portfolioStore';
import { computeCompleteness, overallCompleteness } from '../../utils';
import toast from 'react-hot-toast';

const NAV_SECTIONS = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { to: '/dashboard/personal-info', label: 'Personal Info', icon: User },
  { to: '/dashboard/summary', label: 'Summary', icon: FileText },
  { to: '/dashboard/experience', label: 'Experience', icon: Briefcase },
  { to: '/dashboard/education', label: 'Education', icon: GraduationCap },
  { to: '/dashboard/skills', label: 'Skills', icon: Zap },
  { to: '/dashboard/certifications', label: 'Certifications', icon: Award },
  { to: '/dashboard/projects', label: 'Projects', icon: FolderOpen },
  { to: '/dashboard/awards', label: 'Awards', icon: Trophy },
  { to: '/dashboard/languages', label: 'Languages', icon: Globe },
];

interface SidebarProps {
  completeness: Record<string, number>;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ completeness, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const store = usePortfolioStore();

  const overall = overallCompleteness(
    computeCompleteness({
      personalInfo: store.personalInfo,
      summary: store.summary,
      experiences: store.experiences,
      educations: store.educations,
      skills: store.skills,
      certifications: store.certifications,
      projects: store.projects,
      awards: store.awards,
      languages: store.languages,
    })
  );

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-100">
      {/* Brand */}
      <div className="px-5 py-6 border-b border-gray-100">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-lg animated-gradient flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900 text-lg">PortfolioBuilder</span>
        </div>

        {/* User info */}
        {user && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white font-bold text-sm">
              {(user.fullName || user.username)?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900 truncate">{user.fullName || user.username}</p>
              <p className="text-xs text-gray-400 truncate">@{user.username}</p>
            </div>
          </div>
        )}
      </div>

      {/* Completeness bar */}
      <div className="px-5 py-4 border-b border-gray-50">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-500 font-medium">Profile Completeness</span>
          <span className="text-xs font-bold text-primary-600">{overall}%</span>
        </div>
        <div className="skill-bar">
          <div
            className="skill-bar-fill transition-all duration-700"
            style={{ width: `${overall}%` }}
          />
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_SECTIONS.map(({ to, label, icon: Icon, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            onClick={onClose}
            className={({ isActive }) => cn(
              'sidebar-item',
              isActive && 'active'
            )}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1">{label}</span>
            {completeness[label.toLowerCase().replace(' ', '')] === 100 && (
              <div className="w-2 h-2 rounded-full bg-green-400" title="Complete" />
            )}
            <ChevronRight className="w-3 h-3 opacity-40" />
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-gray-100 space-y-1">
        {user?.username && (
          <a
            href={`/portfolio/${user.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="sidebar-item"
          >
            <ExternalLink className="w-4 h-4" />
            View Portfolio
          </a>
        )}
        <button
          onClick={handleLogout}
          className="sidebar-item w-full text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
};
