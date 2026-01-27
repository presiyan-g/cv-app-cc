import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';
import type { CV, Section, ExperienceEntry, EducationEntry, SkillsEntry, ProjectEntry, CertificationEntry, LanguageEntry, AwardEntry, SummaryEntry } from '../cv/types';
import { hexToRgba } from '../../lib/utils';

// Using built-in Helvetica font (no registration needed)
// For custom fonts, TTF files would need to be bundled with the app

const createStyles = (theme: CV['theme']) =>
  StyleSheet.create({
    page: {
      padding: 40,
      fontFamily: 'Helvetica',
      fontSize: theme.fontSize === 'small' ? 9 : theme.fontSize === 'large' ? 11 : 10,
      lineHeight: theme.lineHeight === 'tight' ? 1.3 : theme.lineHeight === 'relaxed' ? 1.7 : 1.5,
      color: '#374151',
    },
    header: {
      marginBottom: 16,
      paddingBottom: 12,
      borderBottomWidth: 2,
      borderBottomColor: theme.primaryColor,
    },
    headerContent: {
      flexDirection: 'row',
      gap: 12,
    },
    photo: {
      width: 60,
      height: 60,
      borderRadius: 30,
      objectFit: 'cover',
    },
    headerInfo: {
      flex: 1,
    },
    name: {
      fontSize: 20,
      fontWeight: 700,
      color: theme.primaryColor,
    },
    title: {
      fontSize: 12,
      color: '#6B7280',
      marginTop: 2,
    },
    contactRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginTop: 8,
    },
    contactItem: {
      fontSize: 9,
      color: '#6B7280',
    },
    section: {
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: theme.headingStyle === 'uppercase' ? 10 : 12,
      fontWeight: 600,
      color: theme.primaryColor,
      marginBottom: 6,
      paddingBottom: 3,
      borderBottomWidth: 1,
      borderBottomColor: theme.separatorColor,
      textTransform: theme.headingStyle === 'uppercase' ? 'uppercase' : 'none',
      letterSpacing: theme.headingStyle === 'uppercase' ? 1 : 0,
    },
    entryContainer: {
      marginBottom: 8,
    },
    entryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    entryTitle: {
      fontSize: 10,
      fontWeight: 600,
      color: '#1F2937',
    },
    entrySubtitle: {
      fontSize: 9,
      color: '#6B7280',
    },
    entryDate: {
      fontSize: 8,
      color: '#9CA3AF',
    },
    entryDescription: {
      marginTop: 3,
      fontSize: 9,
      color: '#4B5563',
    },
    skillsCategory: {
      marginBottom: 4,
    },
    skillsCategoryName: {
      fontSize: 9,
      fontWeight: 600,
      color: '#374151',
      marginBottom: 2,
    },
    skillsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 4,
    },
    skillTag: {
      fontSize: 8,
      paddingHorizontal: 6,
      paddingVertical: 2,
      backgroundColor: hexToRgba(theme.primaryColor, 0.15),
      color: theme.primaryColor,
      borderRadius: 3,
    },
    languagesRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    languageItem: {
      fontSize: 9,
    },
    languageName: {
      fontWeight: 600,
      color: '#374151',
    },
    languageLevel: {
      color: '#6B7280',
    },
    bulletList: {
      paddingLeft: 12,
    },
    bulletItem: {
      flexDirection: 'row',
      marginBottom: 2,
    },
    bullet: {
      width: 12,
      fontSize: 9,
    },
    bulletText: {
      flex: 1,
      fontSize: 9,
      color: '#4B5563',
    },
  });

function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function stripHtmlTags(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

function extractListItems(html: string): string[] {
  const items: string[] = [];
  const liRegex = /<li[^>]*>(.*?)<\/li>/gi;
  let match;
  while ((match = liRegex.exec(html)) !== null) {
    items.push(stripHtmlTags(match[1]));
  }
  return items;
}

function hasListItems(html: string): boolean {
  return /<li/i.test(html);
}

interface CVDocumentProps {
  cv: CV;
}

export function CVDocument({ cv }: CVDocumentProps) {
  const styles = createStyles(cv.theme);
  const { personalInfo, sections } = cv;
  const enabledSections = sections.filter(s => s.enabled).sort((a, b) => a.order - b.order);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{
            ...styles.headerContent,
            flexDirection: personalInfo.photoPosition === 'right' ? 'row-reverse' : 'row',
          }}>
            {personalInfo.photo && personalInfo.photoPosition !== 'none' && (
              <Image src={personalInfo.photo} style={styles.photo} />
            )}
            <View style={styles.headerInfo}>
              <Text style={styles.name}>
                {personalInfo.firstName} {personalInfo.lastName}
              </Text>
              {personalInfo.title && <Text style={styles.title}>{personalInfo.title}</Text>}
              <View style={styles.contactRow}>
                {personalInfo.email && <Text style={styles.contactItem}>{personalInfo.email}</Text>}
                {personalInfo.phone && <Text style={styles.contactItem}>{personalInfo.phone}</Text>}
                {personalInfo.location && <Text style={styles.contactItem}>{personalInfo.location}</Text>}
                {personalInfo.website && <Text style={styles.contactItem}>{personalInfo.website}</Text>}
                {personalInfo.linkedin && <Text style={styles.contactItem}>{personalInfo.linkedin}</Text>}
              </View>
            </View>
          </View>
        </View>

        {/* Sections */}
        {enabledSections.map(section => (
          <View key={section.id} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <SectionContent section={section} styles={styles} />
          </View>
        ))}
      </Page>
    </Document>
  );
}

interface SectionContentProps {
  section: Section;
  styles: ReturnType<typeof createStyles>;
}

function SectionContent({ section, styles }: SectionContentProps) {
  switch (section.type) {
    case 'summary':
      return <SummaryContent entries={section.entries as SummaryEntry[]} styles={styles} />;
    case 'experience':
      return <ExperienceContent entries={section.entries as ExperienceEntry[]} styles={styles} />;
    case 'education':
      return <EducationContent entries={section.entries as EducationEntry[]} styles={styles} />;
    case 'skills':
      return <SkillsContent entries={section.entries as SkillsEntry[]} styles={styles} />;
    case 'projects':
      return <ProjectsContent entries={section.entries as ProjectEntry[]} styles={styles} />;
    case 'certifications':
      return <CertificationsContent entries={section.entries as CertificationEntry[]} styles={styles} />;
    case 'languages':
      return <LanguagesContent entries={section.entries as LanguageEntry[]} styles={styles} />;
    case 'awards':
      return <AwardsContent entries={section.entries as AwardEntry[]} styles={styles} />;
    default:
      return null;
  }
}

function SummaryContent({ entries, styles }: { entries: SummaryEntry[]; styles: ReturnType<typeof createStyles> }) {
  const entry = entries[0];
  if (!entry?.content) return null;
  return <Text style={styles.entryDescription}>{stripHtmlTags(entry.content)}</Text>;
}

function ExperienceContent({ entries, styles }: { entries: ExperienceEntry[]; styles: ReturnType<typeof createStyles> }) {
  return (
    <>
      {entries.map(entry => (
        <View key={entry.id} style={styles.entryContainer}>
          <View style={styles.entryHeader}>
            <View>
              <Text style={styles.entryTitle}>{entry.position}</Text>
              <Text style={styles.entrySubtitle}>
                {entry.company}
                {entry.location && ` - ${entry.location}`}
              </Text>
            </View>
            <Text style={styles.entryDate}>
              {formatDate(entry.startDate)} - {entry.current ? 'Present' : formatDate(entry.endDate)}
            </Text>
          </View>
          {entry.description && (
            hasListItems(entry.description) ? (
              <View style={styles.bulletList}>
                {extractListItems(entry.description).map((item, i) => (
                  <View key={i} style={styles.bulletItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>{item}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.entryDescription}>{stripHtmlTags(entry.description)}</Text>
            )
          )}
        </View>
      ))}
    </>
  );
}

function EducationContent({ entries, styles }: { entries: EducationEntry[]; styles: ReturnType<typeof createStyles> }) {
  return (
    <>
      {entries.map(entry => (
        <View key={entry.id} style={styles.entryContainer}>
          <View style={styles.entryHeader}>
            <View>
              <Text style={styles.entryTitle}>
                {entry.degree}
                {entry.field && ` in ${entry.field}`}
              </Text>
              <Text style={styles.entrySubtitle}>
                {entry.institution}
                {entry.location && ` - ${entry.location}`}
              </Text>
            </View>
            <Text style={styles.entryDate}>
              {formatDate(entry.startDate)} - {entry.current ? 'Present' : formatDate(entry.endDate)}
            </Text>
          </View>
          {entry.description && (
            <Text style={styles.entryDescription}>{entry.description}</Text>
          )}
        </View>
      ))}
    </>
  );
}

function SkillsContent({ entries, styles }: { entries: SkillsEntry[]; styles: ReturnType<typeof createStyles> }) {
  return (
    <>
      {entries.map(entry => (
        <View key={entry.id} style={styles.skillsCategory}>
          <Text style={styles.skillsCategoryName}>{entry.category}</Text>
          <View style={styles.skillsRow}>
            {entry.skills.map((skill, i) => (
              <Text key={i} style={styles.skillTag}>{skill}</Text>
            ))}
          </View>
        </View>
      ))}
    </>
  );
}

function ProjectsContent({ entries, styles }: { entries: ProjectEntry[]; styles: ReturnType<typeof createStyles> }) {
  return (
    <>
      {entries.map(entry => (
        <View key={entry.id} style={styles.entryContainer}>
          <View style={styles.entryHeader}>
            <View>
              <Text style={styles.entryTitle}>{entry.name}</Text>
              {entry.url && <Text style={styles.entrySubtitle}>{entry.url}</Text>}
            </View>
            {(entry.startDate || entry.endDate) && (
              <Text style={styles.entryDate}>
                {formatDate(entry.startDate)}
                {entry.endDate && ` - ${formatDate(entry.endDate)}`}
              </Text>
            )}
          </View>
          {entry.description && (
            hasListItems(entry.description) ? (
              <View style={styles.bulletList}>
                {extractListItems(entry.description).map((item, i) => (
                  <View key={i} style={styles.bulletItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>{item}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.entryDescription}>{stripHtmlTags(entry.description)}</Text>
            )
          )}
        </View>
      ))}
    </>
  );
}

function CertificationsContent({ entries, styles }: { entries: CertificationEntry[]; styles: ReturnType<typeof createStyles> }) {
  return (
    <>
      {entries.map(entry => (
        <View key={entry.id} style={styles.entryContainer}>
          <View style={styles.entryHeader}>
            <View>
              <Text style={styles.entryTitle}>{entry.name}</Text>
              <Text style={styles.entrySubtitle}>{entry.issuer}</Text>
            </View>
            <Text style={styles.entryDate}>{formatDate(entry.date)}</Text>
          </View>
        </View>
      ))}
    </>
  );
}

function LanguagesContent({ entries, styles }: { entries: LanguageEntry[]; styles: ReturnType<typeof createStyles> }) {
  const proficiencyLabels: Record<string, string> = {
    native: 'Native',
    fluent: 'Fluent',
    advanced: 'Advanced',
    intermediate: 'Intermediate',
    basic: 'Basic',
  };

  return (
    <View style={styles.languagesRow}>
      {entries.map(entry => (
        <Text key={entry.id} style={styles.languageItem}>
          <Text style={styles.languageName}>{entry.language}</Text>
          <Text style={styles.languageLevel}> - {proficiencyLabels[entry.proficiency]}</Text>
        </Text>
      ))}
    </View>
  );
}

function AwardsContent({ entries, styles }: { entries: AwardEntry[]; styles: ReturnType<typeof createStyles> }) {
  return (
    <>
      {entries.map(entry => (
        <View key={entry.id} style={styles.entryContainer}>
          <View style={styles.entryHeader}>
            <View>
              <Text style={styles.entryTitle}>{entry.title}</Text>
              <Text style={styles.entrySubtitle}>{entry.issuer}</Text>
              {entry.description && (
                <Text style={styles.entryDescription}>{entry.description}</Text>
              )}
            </View>
            <Text style={styles.entryDate}>{formatDate(entry.date)}</Text>
          </View>
        </View>
      ))}
    </>
  );
}
