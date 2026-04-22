import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function formatYear(year: number): string {
  return String(year);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

export function proficiencyToPercent(level: string): number {
  const map: Record<string, number> = {
    BEGINNER: 25,
    INTERMEDIATE: 50,
    ADVANCED: 75,
    EXPERT: 100,
  };
  return map[level] ?? 50;
}

export function languageProficiencyToPercent(level: string): number {
  const map: Record<string, number> = {
    BASIC: 20,
    CONVERSATIONAL: 40,
    PROFESSIONAL: 60,
    FLUENT: 80,
    NATIVE: 100,
  };
  return map[level] ?? 50;
}

export function languageProficiencyLabel(level: string): string {
  const map: Record<string, string> = {
    BASIC: 'Basic',
    CONVERSATIONAL: 'Conversational',
    PROFESSIONAL: 'Professional',
    FLUENT: 'Fluent',
    NATIVE: 'Native',
  };
  return map[level] ?? level;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export function computeCompleteness(data: {
  personalInfo: unknown;
  summary: unknown;
  experiences: unknown[];
  educations: unknown[];
  skills: unknown[];
  certifications: unknown[];
  projects: unknown[];
  awards: unknown[];
  languages: unknown[];
}): Record<string, number> {
  return {
    personalInfo: data.personalInfo ? 100 : 0,
    summary: data.summary ? 100 : 0,
    experience: data.experiences.length > 0 ? 100 : 0,
    education: data.educations.length > 0 ? 100 : 0,
    skills: data.skills.length > 0 ? 100 : 0,
    certifications: data.certifications.length > 0 ? 100 : 0,
    projects: data.projects.length > 0 ? 100 : 0,
    awards: data.awards.length > 0 ? 100 : 0,
    languages: data.languages.length > 0 ? 100 : 0,
  };
}

export function overallCompleteness(sections: Record<string, number>): number {
  const values = Object.values(sections);
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

export function handleApiError(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const axiosErr = error as { response: { data: { message: string } } };
    return axiosErr.response?.data?.message || 'Something went wrong';
  }
  return 'Network error. Please try again.';
}
