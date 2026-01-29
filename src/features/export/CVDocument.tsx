import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';
import type { CV, Section, ExperienceEntry, EducationEntry, SkillsEntry, ProjectEntry, CertificationEntry, LanguageEntry, AwardEntry, SummaryEntry, HeaderSettings, PersonalInfo, AccentBoxSettings } from '../cv/types';
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
    contactRowStacked: {
      flexDirection: 'column',
      gap: 4,
      marginTop: 8,
    },
    contactRowTwoColumn: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 8,
    },
    contactRowCentered: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginTop: 8,
      justifyContent: 'center',
    },
    contactItem: {
      fontSize: 9,
      color: '#6B7280',
    },
    headerCentered: {
      marginBottom: 16,
      paddingBottom: 12,
      borderBottomWidth: 2,
      borderBottomColor: theme.primaryColor,
      alignItems: 'center',
    },
    headerMinimal: {
      marginBottom: 16,
      paddingBottom: 12,
      borderBottomWidth: 2,
      borderBottomColor: theme.primaryColor,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
    },
    nameLarge: {
      fontSize: 24,
      fontWeight: 700,
      color: theme.primaryColor,
    },
    summaryInHeader: {
      marginTop: 10,
      fontSize: 9,
      color: '#4B5563',
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
  const { personalInfo, sections, header } = cv;
  const accentBox = cv.theme.accentBox;

  // Get summary content for header if showSummaryInHeader is enabled
  const summarySection = sections.find(s => s.type === 'summary' && s.enabled);
  const summaryContent = header.showSummaryInHeader && summarySection?.entries[0]
    ? stripHtmlTags((summarySection.entries[0] as SummaryEntry).content)
    : null;

  // Filter sections - skip summary if it's shown in header
  const enabledSections = sections
    .filter(s => s.enabled && !(s.type === 'summary' && header.showSummaryInHeader))
    .sort((a, b) => a.order - b.order);

  const renderSections = () => (
    <>
      {enabledSections.map(section => (
        <View key={section.id} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <SectionContent section={section} styles={styles} />
        </View>
      ))}
    </>
  );

  const isSidebar = accentBox?.enabled && (accentBox.position === 'left-sidebar' || accentBox.position === 'right-sidebar');
  const isTop = accentBox?.enabled && accentBox.position === 'top';

  if (isSidebar) {
    return (
      <Document>
        <Page size="A4" style={{ ...styles.page, padding: 0, flexDirection: accentBox.position === 'right-sidebar' ? 'row-reverse' : 'row' }}>
          <View style={{ width: `${accentBox.width}%`, backgroundColor: accentBox.backgroundColor, color: accentBox.textColor, padding: 20 }}>
            <PDFAccentBoxContent accentBox={accentBox} personalInfo={personalInfo} sections={sections} />
          </View>
          <View style={{ flex: 1, padding: 40 }}>
            <PDFHeader personalInfo={personalInfo} header={header} summaryContent={summaryContent} styles={styles} />
            {renderSections()}
          </View>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {isTop && (
          <View style={{ backgroundColor: accentBox.backgroundColor, color: accentBox.textColor, padding: 16, marginHorizontal: -40, marginTop: -40, marginBottom: 16 }}>
            <PDFAccentBoxContent accentBox={accentBox} personalInfo={personalInfo} sections={sections} />
          </View>
        )}
        <PDFHeader personalInfo={personalInfo} header={header} summaryContent={summaryContent} styles={styles} />
        {renderSections()}
      </Page>
    </Document>
  );
}

function PDFAccentBoxContent({ accentBox, personalInfo, sections }: { accentBox: AccentBoxSettings; personalInfo: PersonalInfo; sections: Section[] }) {
  if (accentBox.content === 'contact') {
    const items = [
      { label: 'Name', value: `${personalInfo.firstName} ${personalInfo.lastName}`.trim() },
      { label: 'Email', value: personalInfo.email },
      { label: 'Phone', value: personalInfo.phone },
      { label: 'Location', value: personalInfo.location },
      { label: 'Website', value: personalInfo.website },
      { label: 'LinkedIn', value: personalInfo.linkedin },
    ].filter(item => item.value);

    return (
      <View style={accentBox.position === 'top' ? { flexDirection: 'row', flexWrap: 'wrap', gap: 16 } : { gap: 10 }}>
        {items.map((item, i) => (
          <View key={i}>
            <Text style={{ fontSize: 7, opacity: 0.7, color: accentBox.textColor }}>{item.label}</Text>
            <Text style={{ fontSize: 9, fontWeight: 600, color: accentBox.textColor }}>{item.value}</Text>
          </View>
        ))}
      </View>
    );
  }

  if (accentBox.content === 'skills') {
    const skillsSections = sections.filter(s => s.type === 'skills' && s.enabled);
    return (
      <View style={{ gap: 10 }}>
        {skillsSections.map(section =>
          (section.entries as SkillsEntry[]).map(entry => (
            <View key={entry.id}>
              <Text style={{ fontSize: 8, fontWeight: 600, opacity: 0.7, color: accentBox.textColor, marginBottom: 3 }}>{entry.category}</Text>
              <View style={accentBox.position === 'top' ? { flexDirection: 'row', flexWrap: 'wrap', gap: 4 } : { gap: 2 }}>
                {entry.skills.map((skill, i) => (
                  <Text key={i} style={{ fontSize: 9, color: accentBox.textColor }}>
                    {skill}{accentBox.position === 'top' && i < entry.skills.length - 1 ? ',' : ''}
                  </Text>
                ))}
              </View>
            </View>
          ))
        )}
      </View>
    );
  }

  if (accentBox.content === 'custom' && accentBox.customText) {
    return <Text style={{ fontSize: 9, color: accentBox.textColor }}>{accentBox.customText}</Text>;
  }

  return null;
}

// PDF Header Component with layout variants
interface PDFHeaderProps {
  personalInfo: PersonalInfo;
  header: HeaderSettings;
  summaryContent: string | null;
  styles: ReturnType<typeof createStyles>;
}

function PDFHeader({ personalInfo, header, summaryContent, styles }: PDFHeaderProps) {
  const getContactRowStyle = () => {
    switch (header.contactLayout) {
      case 'stacked':
        return styles.contactRowStacked;
      case 'two-column':
        return styles.contactRowTwoColumn;
      default:
        return styles.contactRow;
    }
  };

  const renderPhoto = () => {
    if (!personalInfo.photo || personalInfo.photoPosition === 'none') return null;
    return <Image src={personalInfo.photo} style={styles.photo} />;
  };

  const renderContactItems = () => (
    <>
      {personalInfo.email && <Text style={styles.contactItem}>{personalInfo.email}</Text>}
      {personalInfo.phone && <Text style={styles.contactItem}>{personalInfo.phone}</Text>}
      {personalInfo.location && <Text style={styles.contactItem}>{personalInfo.location}</Text>}
      {personalInfo.website && <Text style={styles.contactItem}>{personalInfo.website}</Text>}
      {personalInfo.linkedin && <Text style={styles.contactItem}>{personalInfo.linkedin}</Text>}
    </>
  );

  const renderSummary = () => {
    if (!summaryContent) return null;
    return <Text style={styles.summaryInHeader}>{summaryContent}</Text>;
  };

  // Classic Layout
  if (header.layout === 'classic') {
    return (
      <View style={styles.header}>
        <View style={{
          ...styles.headerContent,
          flexDirection: personalInfo.photoPosition === 'right' ? 'row-reverse' : 'row',
        }}>
          {renderPhoto()}
          <View style={styles.headerInfo}>
            <Text style={styles.name}>
              {personalInfo.firstName} {personalInfo.lastName}
            </Text>
            {personalInfo.title && <Text style={styles.title}>{personalInfo.title}</Text>}
            <View style={getContactRowStyle()}>
              {renderContactItems()}
            </View>
            {renderSummary()}
          </View>
        </View>
      </View>
    );
  }

  // Modern Layout
  if (header.layout === 'modern') {
    return (
      <View style={styles.header}>
        <View style={{ ...styles.headerContent, justifyContent: 'space-between' }}>
          <View style={styles.headerInfo}>
            <Text style={styles.nameLarge}>
              {personalInfo.firstName} {personalInfo.lastName}
            </Text>
            {personalInfo.title && <Text style={{ ...styles.title, fontSize: 14 }}>{personalInfo.title}</Text>}
            <View style={getContactRowStyle()}>
              {renderContactItems()}
            </View>
          </View>
          {renderPhoto()}
        </View>
        {renderSummary()}
      </View>
    );
  }

  // Centered Layout
  if (header.layout === 'centered') {
    return (
      <View style={styles.headerCentered}>
        {personalInfo.photo && personalInfo.photoPosition !== 'none' && (
          <View style={{ marginBottom: 8 }}>
            {renderPhoto()}
          </View>
        )}
        <Text style={{ ...styles.name, textAlign: 'center' }}>
          {personalInfo.firstName} {personalInfo.lastName}
        </Text>
        {personalInfo.title && <Text style={{ ...styles.title, textAlign: 'center' }}>{personalInfo.title}</Text>}
        <View style={styles.contactRowCentered}>
          {renderContactItems()}
        </View>
        {renderSummary()}
      </View>
    );
  }

  // Minimal Layout
  if (header.layout === 'minimal') {
    return (
      <View style={styles.headerMinimal}>
        <View>
          <Text style={styles.name}>
            {personalInfo.firstName} {personalInfo.lastName}
          </Text>
          {personalInfo.title && <Text style={styles.title}>{personalInfo.title}</Text>}
        </View>
        <View style={{ ...styles.contactRow, marginTop: 0, fontSize: 8 }}>
          {renderContactItems()}
        </View>
        {summaryContent && (
          <View style={{ width: '100%', marginTop: 8 }}>
            {renderSummary()}
          </View>
        )}
      </View>
    );
  }

  return null;
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
