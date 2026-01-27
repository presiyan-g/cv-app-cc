import { useState } from 'react';
import { useCVStore } from '../../../../stores/cvStore';
import { Input, Button } from '../../../../components/ui';
import type { Section, SkillsEntry } from '../../../../features/cv/types';
import { generateId } from '../../../../lib/utils';

interface SkillsPanelProps {
  section: Section;
}

export function SkillsPanel({ section }: SkillsPanelProps) {
  const { updateSection, addEntry, updateEntry, removeEntry } = useCVStore();
  const [newSkill, setNewSkill] = useState<{ [key: string]: string }>({});

  const entries = section.entries as SkillsEntry[];

  const handleAddCategory = () => {
    const newEntry: SkillsEntry = {
      id: generateId(),
      type: 'skills',
      category: 'New Category',
      skills: [],
    };
    addEntry(section.id, newEntry);
  };

  const handleAddSkill = (entryId: string) => {
    const entry = entries.find(e => e.id === entryId);
    const skillText = newSkill[entryId]?.trim();
    if (entry && skillText) {
      updateEntry(section.id, entryId, {
        skills: [...entry.skills, skillText],
      });
      setNewSkill(prev => ({ ...prev, [entryId]: '' }));
    }
  };

  const handleRemoveSkill = (entryId: string, skillIndex: number) => {
    const entry = entries.find(e => e.id === entryId);
    if (entry) {
      updateEntry(section.id, entryId, {
        skills: entry.skills.filter((_, i) => i !== skillIndex),
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, entryId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill(entryId);
    }
  };

  return (
    <div className="space-y-4">
      <Input
        label="Section Title"
        value={section.title}
        onChange={e => updateSection(section.id, { title: e.target.value })}
      />

      <div className="space-y-4">
        {entries.map(entry => (
          <div key={entry.id} className="border border-gray-200 rounded-lg p-3 bg-white">
            <div className="flex items-center gap-2 mb-3">
              <Input
                value={entry.category}
                onChange={e => updateEntry(section.id, entry.id, { category: e.target.value })}
                placeholder="Category Name"
                className="flex-1"
              />
              <button
                onClick={() => removeEntry(section.id, entry.id)}
                className="p-2 text-gray-400 hover:text-red-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            {/* Skills Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {entry.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-sm"
                >
                  {skill}
                  <button
                    onClick={() => handleRemoveSkill(entry.id, index)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>

            {/* Add Skill Input */}
            <div className="flex gap-2">
              <Input
                value={newSkill[entry.id] || ''}
                onChange={e => setNewSkill(prev => ({ ...prev, [entry.id]: e.target.value }))}
                onKeyDown={e => handleKeyDown(e, entry.id)}
                placeholder="Add a skill..."
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddSkill(entry.id)}
                disabled={!newSkill[entry.id]?.trim()}
              >
                Add
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button variant="outline" onClick={handleAddCategory} className="w-full">
        + Add Category
      </Button>
    </div>
  );
}
