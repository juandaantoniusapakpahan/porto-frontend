// ─── Auth ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  fullName?: string;
  username: string;
  email: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  usernameOrEmail: string;
  password: string;
}

// ─── API Wrapper ─────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string>;
  timestamp: string;
}

// ─── Portfolio ───────────────────────────────────────────────────────────────

export interface PersonalInfo {
  fullName: string;
  professionalTitle?: string;
  phone: string;
  email: string;
  domicile: string;
  avatarUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  websiteUrl?: string;
  otherLinks?: Record<string, string>;
}

export interface Summary {
  content: string;
}

export interface Experience {
  id: string;
  companyName: string;
  location: string;
  position: string;
  startDate: string;        // "YYYY-MM"
  endDate?: string;         // "YYYY-MM", nullable if isCurrent
  isCurrent: boolean;
  descriptionPoints: string[];
  orderIndex: number;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  major: string;
  startYear: number;
  endYear: number;
  gpa?: number;
  orderIndex: number;
}

export type SkillCategory = 'HARD' | 'SOFT';
export type ProficiencyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  proficiencyLevel: ProficiencyLevel;
  orderIndex: number;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialUrl?: string;
  orderIndex: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  projectUrl?: string;
  repoUrl?: string;
  thumbnailUrl?: string;
  startDate?: string;
  endDate?: string;
  orderIndex: number;
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
  orderIndex: number;
}

export type LanguageProficiency = 'BASIC' | 'CONVERSATIONAL' | 'PROFESSIONAL' | 'FLUENT' | 'NATIVE';

export interface Language {
  id: string;
  languageName: string;
  proficiency: LanguageProficiency;
  orderIndex: number;
}

// ─── Public Portfolio ─────────────────────────────────────────────────────────

export interface PublicPortfolio {
  personalInfo: PersonalInfo;
  summary: Summary;
  experiences: Experience[];
  educations: Education[];
  skills: Skill[];
  certifications: Certification[];
  projects: Project[];
  awards: Award[];
  languages: Language[];
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export interface SectionCompletion {
  personalInfo: number;
  summary: number;
  experience: number;
  education: number;
  skills: number;
  certifications: number;
  projects: number;
  awards: number;
  languages: number;
}
