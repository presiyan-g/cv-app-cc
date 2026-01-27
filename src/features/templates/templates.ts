export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: 'professional' | 'modern' | 'creative';
  defaultLayout: {
    columns: 1 | 2;
    splitRatio: number;
  };
  defaultTheme: {
    primaryColor: string;
    fontFamily: string;
  };
}

export const templates: Template[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'A timeless, professional design perfect for traditional industries.',
    thumbnail: '/templates/classic.png',
    category: 'professional',
    defaultLayout: {
      columns: 1,
      splitRatio: 0.35,
    },
    defaultTheme: {
      primaryColor: '#1f2937',
      fontFamily: 'Inter',
    },
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and contemporary with a two-column layout for maximum impact.',
    thumbnail: '/templates/modern.png',
    category: 'modern',
    defaultLayout: {
      columns: 2,
      splitRatio: 0.35,
    },
    defaultTheme: {
      primaryColor: '#2563eb',
      fontFamily: 'Inter',
    },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and elegant, letting your content speak for itself.',
    thumbnail: '/templates/minimal.png',
    category: 'modern',
    defaultLayout: {
      columns: 1,
      splitRatio: 0.35,
    },
    defaultTheme: {
      primaryColor: '#374151',
      fontFamily: 'Open Sans',
    },
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Sophisticated design for senior professionals and executives.',
    thumbnail: '/templates/executive.png',
    category: 'professional',
    defaultLayout: {
      columns: 2,
      splitRatio: 0.3,
    },
    defaultTheme: {
      primaryColor: '#1e3a5f',
      fontFamily: 'Merriweather',
    },
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold and eye-catching for creative professionals.',
    thumbnail: '/templates/creative.png',
    category: 'creative',
    defaultLayout: {
      columns: 2,
      splitRatio: 0.4,
    },
    defaultTheme: {
      primaryColor: '#7c3aed',
      fontFamily: 'Lato',
    },
  },
  {
    id: 'tech',
    name: 'Tech',
    description: 'Modern design tailored for tech industry professionals.',
    thumbnail: '/templates/tech.png',
    category: 'modern',
    defaultLayout: {
      columns: 2,
      splitRatio: 0.35,
    },
    defaultTheme: {
      primaryColor: '#059669',
      fontFamily: 'Roboto',
    },
  },
];

export function getTemplateById(id: string): Template | undefined {
  return templates.find(t => t.id === id);
}
