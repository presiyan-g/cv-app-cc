import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useCVStore } from '../../../../stores/cvStore';
import { Input, Button, Switch, Textarea } from '../../../../components/ui';
import type { Section, EducationEntry } from '../../../../features/cv/types';
import { generateId, cn } from '../../../../lib/utils';

interface EducationPanelProps {
  section: Section;
}

export function EducationPanel({ section }: EducationPanelProps) {
  const { updateSection, addEntry, updateEntry, removeEntry, reorderEntries } = useCVStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const entries = section.entries as EducationEntry[];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleAddEntry = () => {
    const newEntry: EducationEntry = {
      id: generateId(),
      type: 'education',
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    };
    addEntry(section.id, newEntry);
    setExpandedId(newEntry.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = entries.findIndex(e => e.id === active.id);
      const newIndex = entries.findIndex(e => e.id === over.id);
      const newOrder = arrayMove(entries, oldIndex, newIndex);
      reorderEntries(section.id, newOrder.map(e => e.id));
    }
  };

  return (
    <div className="space-y-4">
      <Input
        label="Section Title"
        value={section.title}
        onChange={e => updateSection(section.id, { title: e.target.value })}
      />

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={entries.map(e => e.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {entries.map(entry => (
              <EducationEntryItem
                key={entry.id}
                entry={entry}
                isExpanded={expandedId === entry.id}
                onToggle={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                onUpdate={(updates) => updateEntry(section.id, entry.id, updates)}
                onRemove={() => removeEntry(section.id, entry.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Button variant="outline" onClick={handleAddEntry} className="w-full">
        + Add Education
      </Button>
    </div>
  );
}

interface EducationEntryItemProps {
  entry: EducationEntry;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (updates: Partial<EducationEntry>) => void;
  onRemove: () => void;
}

function EducationEntryItem({
  entry,
  isExpanded,
  onToggle,
  onUpdate,
  onRemove,
}: EducationEntryItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: entry.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn('border border-gray-200 rounded-lg bg-white', isDragging && 'opacity-50')}
    >
      <div className="flex items-center gap-2 p-3">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
          </svg>
        </button>

        <button onClick={onToggle} className="flex-1 text-left">
          <div className="font-medium text-gray-900">{entry.degree || 'New Degree'}</div>
          <div className="text-sm text-gray-500">{entry.institution || 'Institution'}</div>
        </button>

        <button onClick={onToggle} className="p-1 text-gray-400 hover:text-gray-600">
          <svg
            className={cn('w-5 h-5 transition-transform', isExpanded && 'rotate-180')}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {isExpanded && (
        <div className="px-3 pb-3 space-y-3 border-t border-gray-100 pt-3">
          <Input
            label="Institution"
            value={entry.institution}
            onChange={e => onUpdate({ institution: e.target.value })}
            placeholder="University Name"
          />
          <Input
            label="Degree"
            value={entry.degree}
            onChange={e => onUpdate({ degree: e.target.value })}
            placeholder="Bachelor of Science"
          />
          <Input
            label="Field of Study"
            value={entry.field}
            onChange={e => onUpdate({ field: e.target.value })}
            placeholder="Computer Science"
          />
          <Input
            label="Location"
            value={entry.location}
            onChange={e => onUpdate({ location: e.target.value })}
            placeholder="City, Country"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Start Date"
              type="month"
              value={entry.startDate}
              onChange={e => onUpdate({ startDate: e.target.value })}
            />
            <Input
              label="End Date"
              type="month"
              value={entry.endDate}
              onChange={e => onUpdate({ endDate: e.target.value })}
              disabled={entry.current}
            />
          </div>

          <Switch
            label="Currently studying"
            checked={entry.current}
            onChange={current => onUpdate({ current, endDate: current ? '' : entry.endDate })}
          />

          <Textarea
            label="Description (optional)"
            value={entry.description}
            onChange={e => onUpdate({ description: e.target.value })}
            placeholder="Notable achievements, GPA, relevant coursework..."
            rows={3}
          />

          <Button variant="danger" size="sm" onClick={onRemove}>
            Remove
          </Button>
        </div>
      )}
    </div>
  );
}
