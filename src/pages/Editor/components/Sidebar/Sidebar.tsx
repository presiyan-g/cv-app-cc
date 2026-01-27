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
} from '@dnd-kit/sortable';
import { useCVStore } from '../../../../stores/cvStore';
import { SectionItem } from './SectionItem';
import { PersonalInfoPanel } from '../Panels/PersonalInfoPanel';
import { SummaryPanel } from '../Panels/SummaryPanel';
import { ExperiencePanel } from '../Panels/ExperiencePanel';
import { EducationPanel } from '../Panels/EducationPanel';
import { SkillsPanel } from '../Panels/SkillsPanel';
import { ProjectsPanel } from '../Panels/ProjectsPanel';
import { CertificationsPanel } from '../Panels/CertificationsPanel';
import { LanguagesPanel } from '../Panels/LanguagesPanel';
import { AwardsPanel } from '../Panels/AwardsPanel';

export function Sidebar() {
  const { cv, reorderSections } = useCVStore();
  const [activeSection, setActiveSection] = useState<string | null>('personal');
  const [isSectionListExpanded, setIsSectionListExpanded] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (!cv) return null;

  const sortedSections = [...cv.sections].sort((a, b) => a.order - b.order);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sortedSections.findIndex(s => s.id === active.id);
      const newIndex = sortedSections.findIndex(s => s.id === over.id);
      const newOrder = arrayMove(sortedSections, oldIndex, newIndex);
      reorderSections(newOrder.map(s => s.id));
    }
  };

  const renderPanel = () => {
    if (activeSection === 'personal') {
      return <PersonalInfoPanel />;
    }

    const section = cv.sections.find(s => s.id === activeSection);
    if (!section) return null;

    switch (section.type) {
      case 'summary':
        return <SummaryPanel section={section} />;
      case 'experience':
        return <ExperiencePanel section={section} />;
      case 'education':
        return <EducationPanel section={section} />;
      case 'skills':
        return <SkillsPanel section={section} />;
      case 'projects':
        return <ProjectsPanel section={section} />;
      case 'certifications':
        return <CertificationsPanel section={section} />;
      case 'languages':
        return <LanguagesPanel section={section} />;
      case 'awards':
        return <AwardsPanel section={section} />;
      default:
        return null;
    }
  };

  const getActiveSectionName = () => {
    if (activeSection === 'personal') return 'Personal Info';
    const section = cv?.sections.find(s => s.id === activeSection);
    return section?.title || 'Section';
  };

  return (
    <div className="h-full flex flex-col">
      {/* Section List */}
      <div className="border-b border-gray-200">
        {/* Mobile: Collapsible header */}
        <button
          onClick={() => setIsSectionListExpanded(!isSectionListExpanded)}
          className="w-full p-4 flex items-center justify-between lg:hidden"
        >
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Sections
          </h2>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${isSectionListExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Desktop: Static header */}
        <div className="hidden lg:block p-4 pb-0">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Sections
          </h2>
        </div>

        {/* Section list content - collapsible on mobile */}
        <div className={`px-4 pb-4 lg:block ${isSectionListExpanded ? 'block' : 'hidden'}`}>
          {/* Personal Info (not draggable) */}
          <button
            onClick={() => {
              setActiveSection('personal');
              setIsSectionListExpanded(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-lg mb-2 transition-colors ${
              activeSection === 'personal'
                ? 'bg-primary-50 text-primary-700 border border-primary-200'
                : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-sm font-medium">Personal Info</span>
            </div>
          </button>

          {/* Draggable Sections */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sortedSections.map(s => s.id)}
              strategy={verticalListSortingStrategy}
            >
              {sortedSections.map(section => (
                <SectionItem
                  key={section.id}
                  section={section}
                  isActive={activeSection === section.id}
                  onClick={() => {
                    setActiveSection(section.id);
                    setIsSectionListExpanded(false);
                  }}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </div>

      {/* Active Panel */}
      <div className="flex-1 overflow-y-auto p-4 pb-20 lg:pb-4">
        {/* Mobile: Button to change section */}
        <button
          onClick={() => setIsSectionListExpanded(true)}
          className="lg:hidden w-full mb-3 flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg text-sm"
        >
          <div className="flex items-center gap-2 text-gray-500">
            <span>Editing:</span>
            <span className="font-medium text-gray-900">{getActiveSectionName()}</span>
          </div>
          <span className="text-primary-600 font-medium">Change</span>
        </button>
        {renderPanel()}
      </div>
    </div>
  );
}
