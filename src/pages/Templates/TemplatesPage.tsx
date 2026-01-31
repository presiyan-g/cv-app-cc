import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Modal, Input } from '../../components/ui';
import { templates, type Template } from '../../features/templates/templates';
import { useDashboardStore } from '../../stores/dashboardStore';
import { cn } from '../../lib/utils';

type Category = 'all' | 'professional' | 'modern' | 'creative';

export function TemplatesPage() {
  const navigate = useNavigate();
  const { createCV } = useDashboardStore();
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [cvName, setCvName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const filteredTemplates = selectedCategory === 'all'
    ? templates
    : templates.filter(t => t.category === selectedCategory);

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setCvName('My Resume');
  };

  const handleCreateCV = async () => {
    if (!selectedTemplate || !cvName.trim()) return;

    setIsCreating(true);
    try {
      const cv = await createCV(cvName.trim(), selectedTemplate.id);
      navigate(`/editor/${cv.id}`);
    } catch (error) {
      console.error('Failed to create CV:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const categories: { value: Category; label: string }[] = [
    { value: 'all', label: 'All Templates' },
    { value: 'professional', label: 'Professional' },
    { value: 'modern', label: 'Modern' },
    { value: 'creative', label: 'Creative' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900">Choose a Template</h1>
        <p className="mt-2 text-lg text-gray-600">
          Select a template to start building your professional resume
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex justify-center gap-2 mb-8">
        {categories.map(cat => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              selectedCategory === cat.value
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map(template => (
          <TemplateCard
            key={template.id}
            template={template}
            onSelect={() => handleSelectTemplate(template)}
          />
        ))}
      </div>

      {/* Create CV Modal */}
      <Modal
        isOpen={!!selectedTemplate}
        onClose={() => setSelectedTemplate(null)}
        title="Create New Resume"
        size="sm"
      >
        <div className="space-y-4">
          <Input
            label="Resume Name"
            value={cvName}
            onChange={e => setCvName(e.target.value)}
            placeholder="Enter a name for your resume"
            autoFocus
          />
          <p className="text-sm text-gray-500">
            Template: <span className="font-medium">{selectedTemplate?.name}</span>
          </p>
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setSelectedTemplate(null)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleCreateCV}
              disabled={!cvName.trim()}
              isLoading={isCreating}
            >
              Create
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

interface TemplateCardProps {
  template: Template;
  onSelect: () => void;
}

function SectionBlock({ color, heading }: { color: string; heading?: boolean }) {
  return (
    <div className="mb-2">
      {heading && (
        <div className="h-1 w-8 rounded mb-1" style={{ backgroundColor: color }} />
      )}
      <div className="space-y-0.5">
        <div className="h-[2px] w-full bg-gray-200 rounded" />
        <div className="h-[2px] w-3/4 bg-gray-100 rounded" />
        <div className="h-[2px] w-5/6 bg-gray-100 rounded" />
      </div>
    </div>
  );
}

function TemplatePreview({ template }: { template: Template }) {
  const { primaryColor, accentBox } = template.defaultTheme;
  const { columns } = template.defaultLayout;
  const { layout: headerLayout } = template.defaultHeader;
  const enabledSections = template.defaultSections.filter(s => s.enabled);
  const hasAccentBox = accentBox?.enabled;
  const accentPosition = accentBox?.position;

  const leftSections = enabledSections.filter(s => s.column === 'left');
  const rightSections = enabledSections.filter(s => s.column === 'right');
  const fullSections = enabledSections.filter(s => s.column === 'full');

  // Header
  const header = (
    <div className={cn('mb-2', headerLayout === 'centered' && 'text-center')}>
      <div
        className={cn('h-1.5 w-14 rounded mb-1', headerLayout === 'centered' && 'mx-auto')}
        style={{ backgroundColor: primaryColor }}
      />
      <div className={cn('h-[2px] w-20 bg-gray-300 rounded', headerLayout === 'centered' && 'mx-auto')} />
      {headerLayout === 'modern' && (
        <div className="flex gap-2 mt-1">
          <div className="h-[2px] w-10 bg-gray-200 rounded" />
          <div className="h-[2px] w-10 bg-gray-200 rounded" />
        </div>
      )}
      {headerLayout === 'minimal' && (
        <div className="h-[2px] w-16 bg-gray-200 rounded mt-0.5" />
      )}
    </div>
  );

  // Top accent box
  if (hasAccentBox && accentPosition === 'top') {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="p-2 pb-1" style={{ backgroundColor: primaryColor }}>
          <div className="h-1.5 w-14 rounded mb-1 bg-white/80" />
          <div className="h-[2px] w-20 bg-white/40 rounded" />
        </div>
        <div className="flex-1 p-2 pt-1.5">
          {columns === 2 ? (
            <div className="flex gap-2 h-full">
              <div className="flex-[2]">
                {leftSections.map((_, i) => <SectionBlock key={i} color={primaryColor} heading />)}
              </div>
              <div className="flex-[3]">
                {rightSections.map((_, i) => <SectionBlock key={i} color={primaryColor} heading />)}
              </div>
            </div>
          ) : (
            fullSections.map((_, i) => <SectionBlock key={i} color={primaryColor} heading />)
          )}
        </div>
      </div>
    );
  }

  // Left sidebar accent box
  if (hasAccentBox && accentPosition === 'left-sidebar') {
    return (
      <div className="w-full h-full flex">
        <div className="p-2" style={{ backgroundColor: primaryColor, width: '30%' }}>
          <div className="h-1.5 w-10 rounded mb-1 bg-white/80" />
          <div className="h-[2px] w-8 bg-white/40 rounded mb-2" />
          {leftSections.map((_, i) => (
            <div key={i} className="mb-1.5">
              <div className="h-[2px] w-6 bg-white/50 rounded mb-0.5" />
              <div className="h-[2px] w-full bg-white/20 rounded" />
              <div className="h-[2px] w-3/4 bg-white/15 rounded mt-0.5" />
            </div>
          ))}
        </div>
        <div className="flex-1 p-2">
          {header}
          {rightSections.map((_, i) => <SectionBlock key={i} color={primaryColor} heading />)}
        </div>
      </div>
    );
  }

  // Right sidebar accent box
  if (hasAccentBox && accentPosition === 'right-sidebar') {
    return (
      <div className="w-full h-full flex">
        <div className="flex-1 p-2">
          {header}
          {(columns === 2 ? leftSections : fullSections).map((_, i) => (
            <SectionBlock key={i} color={primaryColor} heading />
          ))}
        </div>
        <div className="p-2" style={{ backgroundColor: primaryColor, width: '30%' }}>
          <div className="h-[2px] w-6 bg-white/50 rounded mb-1" />
          {rightSections.map((_, i) => (
            <div key={i} className="mb-1.5">
              <div className="h-[2px] w-6 bg-white/50 rounded mb-0.5" />
              <div className="h-[2px] w-full bg-white/20 rounded" />
              <div className="h-[2px] w-3/4 bg-white/15 rounded mt-0.5" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Standard layout (no accent box)
  return (
    <div className="w-full h-full p-3">
      {header}
      <div
        className="h-[1px] w-full mb-2"
        style={{ backgroundColor: template.defaultTheme.separatorColor }}
      />
      {columns === 2 ? (
        <div className="flex gap-2">
          <div style={{ flex: template.defaultLayout.splitRatio }}>
            {leftSections.map((_, i) => <SectionBlock key={i} color={primaryColor} heading />)}
          </div>
          <div style={{ flex: 1 - template.defaultLayout.splitRatio }}>
            {rightSections.map((_, i) => <SectionBlock key={i} color={primaryColor} heading />)}
          </div>
        </div>
      ) : (
        fullSections.map((_, i) => <SectionBlock key={i} color={primaryColor} heading />)
      )}
    </div>
  );
}

function TemplateCard({ template, onSelect }: TemplateCardProps) {
  return (
    <Card padding="none" className="overflow-hidden group cursor-pointer" onClick={onSelect}>
      <div
        className="aspect-[3/4] relative"
        style={{
          background: `linear-gradient(135deg, ${template.defaultTheme.primaryColor}15, ${template.defaultTheme.primaryColor}05)`,
        }}
      >
        <div className="absolute inset-4 bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
          <TemplatePreview template={template} />
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <Button
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Use Template
          </Button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900">{template.name}</h3>
        <p className="text-sm text-gray-500 mt-1">{template.description}</p>
      </div>
    </Card>
  );
}
