import type { LayoutSettings, ThemeSettings, HeaderSettings, SectionType } from '../cv/types';
import { DEFAULT_ACCENT_BOX } from '../cv/types';

export interface SectionConfig {
  type: SectionType;
  title: string;
  enabled: boolean;
  column: 'left' | 'right' | 'full';
}

export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: 'professional' | 'modern' | 'creative';
  defaultLayout: LayoutSettings;
  defaultTheme: ThemeSettings;
  defaultHeader: HeaderSettings;
  defaultSections: SectionConfig[];
}

const ALL_FULL_SECTIONS: SectionConfig[] = [
  { type: 'summary', title: 'Professional Summary', enabled: true, column: 'full' },
  { type: 'experience', title: 'Work Experience', enabled: true, column: 'full' },
  { type: 'education', title: 'Education', enabled: true, column: 'full' },
  { type: 'skills', title: 'Skills', enabled: true, column: 'full' },
  { type: 'projects', title: 'Projects', enabled: false, column: 'full' },
  { type: 'certifications', title: 'Certifications', enabled: false, column: 'full' },
  { type: 'languages', title: 'Languages', enabled: false, column: 'full' },
  { type: 'awards', title: 'Awards & Achievements', enabled: false, column: 'full' },
];

export const templates: Template[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'A timeless, professional design perfect for traditional industries.',
    thumbnail: '/templates/classic.png',
    category: 'professional',
    defaultLayout: { columns: 1, splitRatio: 0.35, sectionSpacing: 'normal' },
    defaultTheme: {
      primaryColor: '#1f2937',
      accentColor: '#4b5563',
      separatorColor: '#d1d5db',
      fontFamily: 'Inter',
      fontSize: 'medium',
      lineHeight: 'normal',
      headingStyle: 'uppercase',
      accentBox: { ...DEFAULT_ACCENT_BOX, enabled: false },
    },
    defaultHeader: { layout: 'classic', showSummaryInHeader: false, contactLayout: 'inline' },
    defaultSections: ALL_FULL_SECTIONS,
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and contemporary with a two-column layout for maximum impact.',
    thumbnail: '/templates/modern.png',
    category: 'modern',
    defaultLayout: { columns: 2, splitRatio: 0.35, sectionSpacing: 'normal' },
    defaultTheme: {
      primaryColor: '#2563eb',
      accentColor: '#3b82f6',
      separatorColor: '#e5e7eb',
      fontFamily: 'Inter',
      fontSize: 'medium',
      lineHeight: 'normal',
      headingStyle: 'normal',
      accentBox: { ...DEFAULT_ACCENT_BOX, enabled: false },
    },
    defaultHeader: { layout: 'modern', showSummaryInHeader: false, contactLayout: 'two-column' },
    defaultSections: [
      { type: 'skills', title: 'Skills', enabled: true, column: 'left' },
      { type: 'languages', title: 'Languages', enabled: true, column: 'left' },
      { type: 'certifications', title: 'Certifications', enabled: false, column: 'left' },
      { type: 'summary', title: 'Professional Summary', enabled: true, column: 'right' },
      { type: 'experience', title: 'Work Experience', enabled: true, column: 'right' },
      { type: 'education', title: 'Education', enabled: true, column: 'right' },
      { type: 'projects', title: 'Projects', enabled: false, column: 'right' },
      { type: 'awards', title: 'Awards & Achievements', enabled: false, column: 'right' },
    ],
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and elegant, letting your content speak for itself.',
    thumbnail: '/templates/minimal.png',
    category: 'modern',
    defaultLayout: { columns: 1, splitRatio: 0.35, sectionSpacing: 'relaxed' },
    defaultTheme: {
      primaryColor: '#6b7280',
      accentColor: '#9ca3af',
      separatorColor: '#f3f4f6',
      fontFamily: 'Open Sans',
      fontSize: 'medium',
      lineHeight: 'relaxed',
      headingStyle: 'normal',
      accentBox: { ...DEFAULT_ACCENT_BOX, enabled: false },
    },
    defaultHeader: { layout: 'minimal', showSummaryInHeader: false, contactLayout: 'stacked' },
    defaultSections: ALL_FULL_SECTIONS,
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Sophisticated design for senior professionals and executives.',
    thumbnail: '/templates/executive.png',
    category: 'professional',
    defaultLayout: { columns: 2, splitRatio: 0.3, sectionSpacing: 'normal' },
    defaultTheme: {
      primaryColor: '#1e3a5f',
      accentColor: '#2d5a8e',
      separatorColor: '#e5e7eb',
      fontFamily: 'Merriweather',
      fontSize: 'medium',
      lineHeight: 'normal',
      headingStyle: 'uppercase',
      accentBox: {
        enabled: true,
        position: 'left-sidebar',
        backgroundColor: '#1e3a5f',
        textColor: '#ffffff',
        content: 'contact',
        width: 30,
      },
    },
    defaultHeader: { layout: 'classic', showSummaryInHeader: false, contactLayout: 'inline' },
    defaultSections: [
      { type: 'skills', title: 'Skills', enabled: true, column: 'left' },
      { type: 'languages', title: 'Languages', enabled: true, column: 'left' },
      { type: 'certifications', title: 'Certifications', enabled: false, column: 'left' },
      { type: 'summary', title: 'Executive Summary', enabled: true, column: 'right' },
      { type: 'experience', title: 'Professional Experience', enabled: true, column: 'right' },
      { type: 'education', title: 'Education', enabled: true, column: 'right' },
      { type: 'projects', title: 'Projects', enabled: false, column: 'right' },
      { type: 'awards', title: 'Awards & Achievements', enabled: false, column: 'right' },
    ],
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold and eye-catching for creative professionals.',
    thumbnail: '/templates/creative.png',
    category: 'creative',
    defaultLayout: { columns: 2, splitRatio: 0.4, sectionSpacing: 'normal' },
    defaultTheme: {
      primaryColor: '#7c3aed',
      accentColor: '#a78bfa',
      separatorColor: '#ede9fe',
      fontFamily: 'Lato',
      fontSize: 'medium',
      lineHeight: 'normal',
      headingStyle: 'normal',
      accentBox: {
        enabled: true,
        position: 'top',
        backgroundColor: '#7c3aed',
        textColor: '#ffffff',
        content: 'contact',
        width: 30,
      },
    },
    defaultHeader: { layout: 'centered', showSummaryInHeader: false, contactLayout: 'stacked' },
    defaultSections: [
      { type: 'summary', title: 'About Me', enabled: true, column: 'left' },
      { type: 'experience', title: 'Experience', enabled: true, column: 'left' },
      { type: 'education', title: 'Education', enabled: true, column: 'left' },
      { type: 'projects', title: 'Projects', enabled: false, column: 'left' },
      { type: 'skills', title: 'Skills', enabled: true, column: 'right' },
      { type: 'languages', title: 'Languages', enabled: true, column: 'right' },
      { type: 'certifications', title: 'Certifications', enabled: true, column: 'right' },
      { type: 'awards', title: 'Awards & Achievements', enabled: false, column: 'right' },
    ],
  },
  {
    id: 'tech',
    name: 'Tech',
    description: 'Modern design tailored for tech industry professionals.',
    thumbnail: '/templates/tech.png',
    category: 'modern',
    defaultLayout: { columns: 2, splitRatio: 0.35, sectionSpacing: 'compact' },
    defaultTheme: {
      primaryColor: '#059669',
      accentColor: '#34d399',
      separatorColor: '#d1fae5',
      fontFamily: 'Roboto',
      fontSize: 'small',
      lineHeight: 'normal',
      headingStyle: 'normal',
      accentBox: {
        enabled: true,
        position: 'right-sidebar',
        backgroundColor: '#059669',
        textColor: '#ffffff',
        content: 'skills',
        width: 30,
      },
    },
    defaultHeader: { layout: 'modern', showSummaryInHeader: false, contactLayout: 'two-column' },
    defaultSections: [
      { type: 'summary', title: 'Summary', enabled: true, column: 'left' },
      { type: 'experience', title: 'Experience', enabled: true, column: 'left' },
      { type: 'projects', title: 'Projects', enabled: true, column: 'left' },
      { type: 'education', title: 'Education', enabled: true, column: 'left' },
      { type: 'skills', title: 'Technical Skills', enabled: true, column: 'right' },
      { type: 'languages', title: 'Languages', enabled: true, column: 'right' },
      { type: 'certifications', title: 'Certifications', enabled: true, column: 'right' },
      { type: 'awards', title: 'Awards', enabled: false, column: 'right' },
    ],
  },
];

export function getTemplateById(id: string): Template | undefined {
  return templates.find(t => t.id === id);
}
