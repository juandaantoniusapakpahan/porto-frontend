import { create } from 'zustand';
import type {
  PersonalInfo, Summary, Experience, Education,
  Skill, Certification, Project, Award, Language,
} from '../types';

interface PortfolioState {
  personalInfo: PersonalInfo | null;
  summary: Summary | null;
  experiences: Experience[];
  educations: Education[];
  skills: Skill[];
  certifications: Certification[];
  projects: Project[];
  awards: Award[];
  languages: Language[];
  isLoading: boolean;

  setPersonalInfo: (v: PersonalInfo) => void;
  setSummary: (v: Summary) => void;
  setExperiences: (v: Experience[]) => void;
  setEducations: (v: Education[]) => void;
  setSkills: (v: Skill[]) => void;
  setCertifications: (v: Certification[]) => void;
  setProjects: (v: Project[]) => void;
  setAwards: (v: Award[]) => void;
  setLanguages: (v: Language[]) => void;
  setLoading: (v: boolean) => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  personalInfo: null,
  summary: null,
  experiences: [],
  educations: [],
  skills: [],
  certifications: [],
  projects: [],
  awards: [],
  languages: [],
  isLoading: false,

  setPersonalInfo: (v) => set({ personalInfo: v }),
  setSummary: (v) => set({ summary: v }),
  setExperiences: (v) => set({ experiences: v }),
  setEducations: (v) => set({ educations: v }),
  setSkills: (v) => set({ skills: v }),
  setCertifications: (v) => set({ certifications: v }),
  setProjects: (v) => set({ projects: v }),
  setAwards: (v) => set({ awards: v }),
  setLanguages: (v) => set({ languages: v }),
  setLoading: (v) => set({ isLoading: v }),
}));
