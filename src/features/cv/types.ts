// Core CV Data Models

export interface CV {
  id: string;
  name: string;
  templateId: string;
  createdAt: number;
  updatedAt: number;
  personalInfo: PersonalInfo;
  sections: Section[];
  layout: LayoutSettings;
  theme: ThemeSettings;
}

export interface CVMetadata {
  id: string;
  name: string;
  templateId: string;
  createdAt: number;
  updatedAt: number;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  photo?: string; // base64 encoded
  photoShape: 'circle' | 'square' | 'rounded';
  photoSize: 'small' | 'medium' | 'large';
}

export interface Section {
  id: string;
  type: SectionType;
  title: string;
  enabled: boolean;
  column: 'left' | 'right' | 'full';
  order: number;
  entries: SectionEntry[];
}

export type SectionType =
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'languages'
  | 'awards';

export type SectionEntry =
  | SummaryEntry
  | ExperienceEntry
  | EducationEntry
  | SkillsEntry
  | ProjectEntry
  | CertificationEntry
  | LanguageEntry
  | AwardEntry;

export interface SummaryEntry {
  id: string;
  type: 'summary';
  content: string; // Rich text HTML
}

export interface ExperienceEntry {
  id: string;
  type: 'experience';
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string; // Rich text HTML
}

export interface EducationEntry {
  id: string;
  type: 'education';
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface SkillsEntry {
  id: string;
  type: 'skills';
  category: string;
  skills: string[];
}

export interface ProjectEntry {
  id: string;
  type: 'project';
  name: string;
  url: string;
  startDate: string;
  endDate: string;
  description: string; // Rich text HTML
}

export interface CertificationEntry {
  id: string;
  type: 'certification';
  name: string;
  issuer: string;
  date: string;
  url: string;
}

export interface LanguageEntry {
  id: string;
  type: 'language';
  language: string;
  proficiency: 'native' | 'fluent' | 'advanced' | 'intermediate' | 'basic';
}

export interface AwardEntry {
  id: string;
  type: 'award';
  title: string;
  issuer: string;
  date: string;
  description: string;
}

export interface LayoutSettings {
  columns: 1 | 2;
  splitRatio: number; // 0.3 to 0.7 for left column width
  sectionSpacing: 'compact' | 'normal' | 'relaxed';
}

export interface ThemeSettings {
  primaryColor: string;
  accentColor: string;
  separatorColor: string;
  fontFamily: FontFamily;
  fontSize: 'small' | 'medium' | 'large';
  lineHeight: 'tight' | 'normal' | 'relaxed';
  headingStyle: 'uppercase' | 'normal';
}

export type FontFamily = 'Inter' | 'Roboto' | 'Open Sans' | 'Lato' | 'Merriweather';

export interface Revision {
  id: string;
  cvId: string;
  timestamp: number;
  data: CV;
}

// Default section configurations
export const DEFAULT_SECTIONS: Omit<Section, 'id'>[] = [
  { type: 'summary', title: 'Professional Summary', enabled: true, column: 'full', order: 0, entries: [] },
  { type: 'experience', title: 'Work Experience', enabled: true, column: 'full', order: 1, entries: [] },
  { type: 'education', title: 'Education', enabled: true, column: 'full', order: 2, entries: [] },
  { type: 'skills', title: 'Skills', enabled: true, column: 'full', order: 3, entries: [] },
  { type: 'projects', title: 'Projects', enabled: false, column: 'full', order: 4, entries: [] },
  { type: 'certifications', title: 'Certifications', enabled: false, column: 'full', order: 5, entries: [] },
  { type: 'languages', title: 'Languages', enabled: false, column: 'full', order: 6, entries: [] },
  { type: 'awards', title: 'Awards & Achievements', enabled: false, column: 'full', order: 7, entries: [] },
];

export const DEFAULT_PERSONAL_INFO: PersonalInfo = {
  firstName: '',
  lastName: '',
  title: '',
  email: '',
  phone: '',
  location: '',
  website: '',
  linkedin: '',
  photoShape: 'circle',
  photoSize: 'medium',
};

export const DEFAULT_LAYOUT: LayoutSettings = {
  columns: 1,
  splitRatio: 0.35,
  sectionSpacing: 'normal',
};

export const DEFAULT_THEME: ThemeSettings = {
  primaryColor: '#2563eb',
  accentColor: '#3b82f6',
  separatorColor: '#e5e7eb', // Gray-200 - subtle separator
  fontFamily: 'Inter',
  fontSize: 'medium',
  lineHeight: 'normal',
  headingStyle: 'normal',
};

export const FONT_FAMILIES: FontFamily[] = ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Merriweather'];

export const THEME_COLORS = [
  '#2563eb', // Blue
  '#059669', // Green
  '#7c3aed', // Purple
  '#dc2626', // Red
  '#ea580c', // Orange
  '#0891b2', // Cyan
  '#4f46e5', // Indigo
  '#be185d', // Pink
  '#1f2937', // Gray
];
