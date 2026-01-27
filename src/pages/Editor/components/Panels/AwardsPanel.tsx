import { useState } from 'react';
import { useCVStore } from '../../../../stores/cvStore';
import { Input, Button, Textarea } from '../../../../components/ui';
import type { Section, AwardEntry } from '../../../../features/cv/types';
import { generateId, cn } from '../../../../lib/utils';

interface AwardsPanelProps {
  section: Section;
}

export function AwardsPanel({ section }: AwardsPanelProps) {
  const { updateSection, addEntry, updateEntry, removeEntry } = useCVStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const entries = section.entries as AwardEntry[];

  const handleAddEntry = () => {
    const newEntry: AwardEntry = {
      id: generateId(),
      type: 'award',
      title: '',
      issuer: '',
      date: '',
      description: '',
    };
    addEntry(section.id, newEntry);
    setExpandedId(newEntry.id);
  };

  return (
    <div className="space-y-4">
      <Input
        label="Section Title"
        value={section.title}
        onChange={e => updateSection(section.id, { title: e.target.value })}
      />

      <div className="space-y-2">
        {entries.map(entry => (
          <div
            key={entry.id}
            className="border border-gray-200 rounded-lg bg-white"
          >
            <div className="flex items-center gap-2 p-3">
              <button
                onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                className="flex-1 text-left"
              >
                <div className="font-medium text-gray-900">{entry.title || 'New Award'}</div>
                <div className="text-sm text-gray-500">{entry.issuer || 'Issuer'}</div>
              </button>

              <button
                onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <svg
                  className={cn('w-5 h-5 transition-transform', expandedId === entry.id && 'rotate-180')}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {expandedId === entry.id && (
              <div className="px-3 pb-3 space-y-3 border-t border-gray-100 pt-3">
                <Input
                  label="Award Title"
                  value={entry.title}
                  onChange={e => updateEntry(section.id, entry.id, { title: e.target.value })}
                  placeholder="Best Innovation Award"
                />
                <Input
                  label="Issuer"
                  value={entry.issuer}
                  onChange={e => updateEntry(section.id, entry.id, { issuer: e.target.value })}
                  placeholder="Organization Name"
                />
                <Input
                  label="Date"
                  type="month"
                  value={entry.date}
                  onChange={e => updateEntry(section.id, entry.id, { date: e.target.value })}
                />
                <Textarea
                  label="Description (optional)"
                  value={entry.description}
                  onChange={e => updateEntry(section.id, entry.id, { description: e.target.value })}
                  placeholder="Brief description..."
                  rows={2}
                />

                <Button variant="danger" size="sm" onClick={() => removeEntry(section.id, entry.id)}>
                  Remove
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      <Button variant="outline" onClick={handleAddEntry} className="w-full">
        + Add Award
      </Button>
    </div>
  );
}
