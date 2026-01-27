import { useEffect, useRef, useState } from 'react';
import { useCVStore } from '../../../../stores/cvStore';
import { cn, formatDate, hexToRgba } from '../../../../lib/utils';
import type { Section, ExperienceEntry, EducationEntry, SkillsEntry, ProjectEntry, CertificationEntry, LanguageEntry, AwardEntry, SummaryEntry } from '../../../../features/cv/types';

export function Canvas() {
  const { cv } = useCVStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Calculate scale based on container width for mobile responsiveness
  // Using ResizeObserver to detect when container becomes visible (tab switch)
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.clientWidth;
      if (containerWidth === 0) return; // Don't update if hidden

      const padding = 32; // 16px padding on each side
      const availableWidth = containerWidth - padding;
      const a4WidthPx = 794; // 210mm in pixels at 96dpi

      // Scale down on smaller screens, but never scale up
      const newScale = Math.min(1, availableWidth / a4WidthPx);
      setScale(newScale);
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  if (!cv) return null;

  const { personalInfo, sections, layout, theme } = cv;
  const enabledSections = sections.filter(s => s.enabled).sort((a, b) => a.order - b.order);

  const fontSizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base',
  };

  const spacingClasses = {
    compact: 'space-y-2',
    normal: 'space-y-4',
    relaxed: 'space-y-6',
  };

  const lineHeightClasses = {
    tight: 'leading-tight',
    normal: 'leading-normal',
    relaxed: 'leading-relaxed',
  };

  const photoSizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-20 h-20',
    large: 'w-24 h-24',
  };

  const photoShapeClasses = {
    circle: 'rounded-full',
    square: 'rounded-none',
    rounded: 'rounded-lg',
  };

  return (
    <div ref={containerRef} className="flex justify-center overflow-x-hidden">
      <div
        className="origin-top"
        style={{
          transform: `scale(${scale})`,
          width: scale < 1 ? '794px' : undefined, // Fixed width when scaled
        }}
      >
        <div
          className={cn(
            'bg-white shadow-lg w-[210mm] min-h-[297mm] p-8',
            fontSizeClasses[theme.fontSize],
            lineHeightClasses[theme.lineHeight]
          )}
          style={{
            fontFamily: theme.fontFamily,
            '--primary-color': theme.primaryColor,
            '--accent-color': theme.accentColor,
          } as React.CSSProperties}
        >
        {/* Header / Personal Info */}
        <header className="mb-6 pb-4 border-b-2" style={{ borderColor: theme.primaryColor }}>
          <div className="flex items-start gap-4">
            {/* Photo */}
            {personalInfo.photo && (
              <div
                className={cn(
                  'shrink-0 overflow-hidden',
                  photoSizeClasses[personalInfo.photoSize],
                  photoShapeClasses[personalInfo.photoShape]
                )}
              >
                <img
                  src={personalInfo.photo}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Name & Contact */}
            <div className="flex-1">
              <h1
                className="text-2xl font-bold"
                style={{ color: theme.primaryColor }}
              >
                {personalInfo.firstName} {personalInfo.lastName}
              </h1>
              {personalInfo.title && (
                <p className="text-lg text-gray-600 mt-1">{personalInfo.title}</p>
              )}

              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-gray-600">
                {personalInfo.email && (
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {personalInfo.email}
                  </span>
                )}
                {personalInfo.phone && (
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {personalInfo.phone}
                  </span>
                )}
                {personalInfo.location && (
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {personalInfo.location}
                  </span>
                )}
                {personalInfo.website && (
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    {personalInfo.website}
                  </span>
                )}
                {personalInfo.linkedin && (
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                    {personalInfo.linkedin}
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Sections */}
        {layout.columns === 1 ? (
          <div className={spacingClasses[layout.sectionSpacing]}>
            {enabledSections.map(section => (
              <SectionRenderer key={section.id} section={section} theme={theme} />
            ))}
          </div>
        ) : (
          <div className="flex gap-6">
            {/* Left Column */}
            <div
              className={cn(spacingClasses[layout.sectionSpacing])}
              style={{ width: `${layout.splitRatio * 100}%` }}
            >
              {enabledSections
                .filter(s => s.column === 'left')
                .map(section => (
                  <SectionRenderer key={section.id} section={section} theme={theme} />
                ))}
            </div>

            {/* Right Column */}
            <div
              className={cn(spacingClasses[layout.sectionSpacing], 'flex-1')}
            >
              {enabledSections
                .filter(s => s.column === 'right' || s.column === 'full')
                .map(section => (
                  <SectionRenderer key={section.id} section={section} theme={theme} />
                ))}
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

interface SectionRendererProps {
  section: Section;
  theme: { primaryColor: string; separatorColor: string; headingStyle: string };
}

function SectionRenderer({ section, theme }: SectionRendererProps) {
  return (
    <div>
      <h2
        className={cn(
          'text-lg font-semibold mb-2 pb-1 border-b',
          theme.headingStyle === 'uppercase' && 'uppercase tracking-wide text-sm'
        )}
        style={{ color: theme.primaryColor, borderColor: theme.separatorColor }}
      >
        {section.title}
      </h2>

      <div className="space-y-3">
        {section.type === 'summary' && <SummaryRenderer entries={section.entries as SummaryEntry[]} />}
        {section.type === 'experience' && <ExperienceRenderer entries={section.entries as ExperienceEntry[]} />}
        {section.type === 'education' && <EducationRenderer entries={section.entries as EducationEntry[]} />}
        {section.type === 'skills' && <SkillsRenderer entries={section.entries as SkillsEntry[]} theme={theme} />}
        {section.type === 'projects' && <ProjectsRenderer entries={section.entries as ProjectEntry[]} />}
        {section.type === 'certifications' && <CertificationsRenderer entries={section.entries as CertificationEntry[]} />}
        {section.type === 'languages' && <LanguagesRenderer entries={section.entries as LanguageEntry[]} />}
        {section.type === 'awards' && <AwardsRenderer entries={section.entries as AwardEntry[]} />}
      </div>
    </div>
  );
}

function SummaryRenderer({ entries }: { entries: SummaryEntry[] }) {
  const entry = entries[0];
  if (!entry?.content) return null;

  return (
    <div
      className="text-gray-700 prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: entry.content }}
    />
  );
}

function ExperienceRenderer({ entries }: { entries: ExperienceEntry[] }) {
  return (
    <>
      {entries.map(entry => (
        <div key={entry.id}>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900">{entry.position}</h3>
              <p className="text-gray-600">{entry.company}{entry.location && ` - ${entry.location}`}</p>
            </div>
            <span className="text-gray-500 text-sm shrink-0">
              {formatDate(entry.startDate)} - {entry.current ? 'Present' : formatDate(entry.endDate)}
            </span>
          </div>
          {entry.description && (
            <div
              className="mt-1 text-gray-700 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: entry.description }}
            />
          )}
        </div>
      ))}
    </>
  );
}

function EducationRenderer({ entries }: { entries: EducationEntry[] }) {
  return (
    <>
      {entries.map(entry => (
        <div key={entry.id}>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900">{entry.degree}{entry.field && ` in ${entry.field}`}</h3>
              <p className="text-gray-600">{entry.institution}{entry.location && ` - ${entry.location}`}</p>
            </div>
            <span className="text-gray-500 text-sm shrink-0">
              {formatDate(entry.startDate)} - {entry.current ? 'Present' : formatDate(entry.endDate)}
            </span>
          </div>
          {entry.description && (
            <p className="mt-1 text-gray-700">{entry.description}</p>
          )}
        </div>
      ))}
    </>
  );
}

function SkillsRenderer({ entries, theme }: { entries: SkillsEntry[]; theme: { primaryColor: string } }) {
  return (
    <>
      {entries.map(entry => (
        <div key={entry.id}>
          <h4 className="font-medium text-gray-800 mb-1">{entry.category}</h4>
          <div className="flex flex-wrap gap-1.5">
            {entry.skills.map((skill, i) => (
              <span
                key={i}
                className="px-2 py-0.5 text-xs rounded"
                style={{
                  backgroundColor: hexToRgba(theme.primaryColor, 0.1),
                  color: theme.primaryColor,
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

function ProjectsRenderer({ entries }: { entries: ProjectEntry[] }) {
  return (
    <>
      {entries.map(entry => (
        <div key={entry.id}>
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-gray-900">
              {entry.name}
              {entry.url && (
                <span className="font-normal text-gray-500 text-sm ml-2">({entry.url})</span>
              )}
            </h3>
            {(entry.startDate || entry.endDate) && (
              <span className="text-gray-500 text-sm shrink-0">
                {formatDate(entry.startDate)}{entry.endDate && ` - ${formatDate(entry.endDate)}`}
              </span>
            )}
          </div>
          {entry.description && (
            <div
              className="mt-1 text-gray-700 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: entry.description }}
            />
          )}
        </div>
      ))}
    </>
  );
}

function CertificationsRenderer({ entries }: { entries: CertificationEntry[] }) {
  return (
    <>
      {entries.map(entry => (
        <div key={entry.id} className="flex justify-between">
          <div>
            <h3 className="font-medium text-gray-900">{entry.name}</h3>
            <p className="text-gray-600 text-sm">{entry.issuer}</p>
          </div>
          <span className="text-gray-500 text-sm">{formatDate(entry.date)}</span>
        </div>
      ))}
    </>
  );
}

function LanguagesRenderer({ entries }: { entries: LanguageEntry[] }) {
  const proficiencyLabels = {
    native: 'Native',
    fluent: 'Fluent',
    advanced: 'Advanced',
    intermediate: 'Intermediate',
    basic: 'Basic',
  };

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1">
      {entries.map(entry => (
        <span key={entry.id} className="text-gray-700">
          <span className="font-medium">{entry.language}</span>
          <span className="text-gray-500"> - {proficiencyLabels[entry.proficiency]}</span>
        </span>
      ))}
    </div>
  );
}

function AwardsRenderer({ entries }: { entries: AwardEntry[] }) {
  return (
    <>
      {entries.map(entry => (
        <div key={entry.id} className="flex justify-between">
          <div>
            <h3 className="font-medium text-gray-900">{entry.title}</h3>
            <p className="text-gray-600 text-sm">{entry.issuer}</p>
            {entry.description && (
              <p className="text-gray-700 text-sm mt-1">{entry.description}</p>
            )}
          </div>
          <span className="text-gray-500 text-sm">{formatDate(entry.date)}</span>
        </div>
      ))}
    </>
  );
}
