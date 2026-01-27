import { useCVStore } from '../../../../stores/cvStore';
import { Input, Button, Select } from '../../../../components/ui';
import type { Section, LanguageEntry } from '../../../../features/cv/types';
import { generateId } from '../../../../lib/utils';

interface LanguagesPanelProps {
  section: Section;
}

const proficiencyOptions = [
  { value: 'native', label: 'Native' },
  { value: 'fluent', label: 'Fluent' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'basic', label: 'Basic' },
];

export function LanguagesPanel({ section }: LanguagesPanelProps) {
  const { updateSection, addEntry, updateEntry, removeEntry } = useCVStore();

  const entries = section.entries as LanguageEntry[];

  const handleAddEntry = () => {
    const newEntry: LanguageEntry = {
      id: generateId(),
      type: 'language',
      language: '',
      proficiency: 'intermediate',
    };
    addEntry(section.id, newEntry);
  };

  return (
    <div className="space-y-4">
      <Input
        label="Section Title"
        value={section.title}
        onChange={e => updateSection(section.id, { title: e.target.value })}
      />

      <div className="space-y-3">
        {entries.map(entry => (
          <div key={entry.id} className="flex items-center gap-2">
            <Input
              value={entry.language}
              onChange={e => updateEntry(section.id, entry.id, { language: e.target.value })}
              placeholder="Language"
              className="flex-1"
            />
            <Select
              value={entry.proficiency}
              onChange={e => updateEntry(section.id, entry.id, {
                proficiency: e.target.value as LanguageEntry['proficiency']
              })}
              options={proficiencyOptions}
              className="w-32"
            />
            <button
              onClick={() => removeEntry(section.id, entry.id)}
              className="p-2 text-gray-400 hover:text-red-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <Button variant="outline" onClick={handleAddEntry} className="w-full">
        + Add Language
      </Button>
    </div>
  );
}
