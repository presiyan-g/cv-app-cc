import { useCVStore } from '../../../../stores/cvStore';
import { Input } from '../../../../components/ui';
import { RichTextEditor } from '../RichTextEditor/RichTextEditor';
import type { Section, SummaryEntry } from '../../../../features/cv/types';
import { generateId } from '../../../../lib/utils';

interface SummaryPanelProps {
  section: Section;
}

export function SummaryPanel({ section }: SummaryPanelProps) {
  const { updateSection, addEntry, updateEntry } = useCVStore();

  const summaryEntry = section.entries[0] as SummaryEntry | undefined;

  const handleContentChange = (content: string) => {
    if (summaryEntry) {
      updateEntry(section.id, summaryEntry.id, { content });
    } else {
      addEntry(section.id, {
        id: generateId(),
        type: 'summary',
        content,
      });
    }
  };

  return (
    <div className="space-y-4">
      <Input
        label="Section Title"
        value={section.title}
        onChange={e => updateSection(section.id, { title: e.target.value })}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Summary
        </label>
        <RichTextEditor
          content={summaryEntry?.content || ''}
          onChange={handleContentChange}
          placeholder="Write a brief professional summary..."
        />
      </div>
    </div>
  );
}
