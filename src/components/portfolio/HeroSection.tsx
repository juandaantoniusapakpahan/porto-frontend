import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Globe, ExternalLink, Download } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../ui/SocialIcons';
import type { PersonalInfo } from '../../types';
import { getInitials } from '../../utils';

interface HeroSectionProps {
  personalInfo: PersonalInfo;
  onDownloadPdf: () => void;
  isDownloading: boolean;
}

const TAGLINES = [
  'Building digital experiences',
  'Crafting elegant solutions',
  'Turning ideas into reality',
  'Passionate about technology',
];

export const HeroSection: React.FC<HeroSectionProps> = ({ personalInfo, onDownloadPdf, isDownloading }) => {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const target = TAGLINES[taglineIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayed.length < target.length) {
      timeout = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 80);
    } else if (!isDeleting && displayed.length === target.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2200);
    } else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
    } else if (isDeleting && displayed.length === 0) {
      setIsDeleting(false);
      setTaglineIndex((i) => (i + 1) % TAGLINES.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, taglineIndex]);

  const initials = getInitials(personalInfo.fullName || 'U');

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden portfolio-hero">
      {/* Animated background */}
      <div className="absolute inset-0 animated-gradient opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary-950/5 via-transparent to-accent-900/5" />

      {/* Decorative blobs */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-accent-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative section-container py-24 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Avatar */}
          <div className="flex-shrink-0 animate-fade-in">
            <div className="relative">
              <div className="w-48 h-48 lg:w-56 lg:h-56 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/50">
                {personalInfo.avatarUrl ? (
                  <img
                    src={personalInfo.avatarUrl}
                    alt={personalInfo.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full animated-gradient flex items-center justify-center">
                    <span className="text-6xl font-bold text-white">{initials}</span>
                  </div>
                )}
              </div>
              {/* Floating accent badge */}
              <div className="absolute -bottom-3 -right-3 bg-white rounded-2xl shadow-lg px-3 py-2 flex items-center gap-1.5">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs font-semibold text-gray-700">Available</span>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center lg:text-left animate-slide-up">
            <p className="text-accent-600 font-semibold text-sm tracking-widest uppercase mb-3">
              Welcome to my portfolio
            </p>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 mb-4 leading-tight">
              {personalInfo.fullName}
            </h1>
            {personalInfo.professionalTitle && (
              <h2 className="text-xl lg:text-2xl font-medium text-primary-600 mb-4">
                {personalInfo.professionalTitle}
              </h2>
            )}

            {/* Typing tagline */}
            <div className="h-8 mb-6">
              <p className="text-lg text-gray-500 font-light">
                <span className="typing-cursor">{displayed}</span>
              </p>
            </div>

            {/* Contact chips */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8">
              {personalInfo.domicile && (
                <a className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-600 hover:bg-primary-50 hover:text-primary-700 transition-colors">
                  <MapPin className="w-3.5 h-3.5" />
                  {personalInfo.domicile}
                </a>
              )}
              {personalInfo.email && (
                <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-600 hover:bg-primary-50 hover:text-primary-700 transition-colors">
                  <Mail className="w-3.5 h-3.5" />
                  {personalInfo.email}
                </a>
              )}
              {personalInfo.phone && (
                <a href={`tel:${personalInfo.phone}`} className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-600 hover:bg-primary-50 hover:text-primary-700 transition-colors">
                  <Phone className="w-3.5 h-3.5" />
                  {personalInfo.phone}
                </a>
              )}
            </div>

            {/* Social links */}
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3">
              {personalInfo.linkedinUrl && (
                <a href={personalInfo.linkedinUrl} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all hover:shadow-lg">
                  <LinkedinIcon className="w-4 h-4" />
                  LinkedIn
                </a>
              )}
              {personalInfo.githubUrl && (
                <a href={personalInfo.githubUrl} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-all hover:shadow-lg">
                  <GithubIcon className="w-4 h-4" />
                  GitHub
                </a>
              )}
              {personalInfo.websiteUrl && (
                <a href={personalInfo.websiteUrl} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 px-5 py-2.5 bg-accent-500 text-white rounded-xl text-sm font-medium hover:bg-accent-600 transition-all hover:shadow-lg">
                  <Globe className="w-4 h-4" />
                  Website
                </a>
              )}
              {Object.entries(personalInfo.otherLinks || {}).map(([label, url]) => (
                <a key={url} href={url} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-all">
                  <ExternalLink className="w-4 h-4" />
                  {label}
                </a>
              ))}

              <button
                onClick={onDownloadPdf}
                disabled={isDownloading}
                className="no-print flex items-center gap-2 px-5 py-2.5 border-2 border-primary-500 text-primary-600 rounded-xl text-sm font-medium hover:bg-primary-50 transition-all disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {isDownloading ? 'Generating...' : 'Download PDF'}
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="no-print absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs text-gray-400 font-medium">Scroll</span>
          <div className="w-5 h-8 border-2 border-gray-300 rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-gray-400 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
};
