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

function TemplateCard({ template, onSelect }: TemplateCardProps) {
  return (
    <Card padding="none" className="overflow-hidden group cursor-pointer" onClick={onSelect}>
      {/* Thumbnail placeholder */}
      <div
        className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 relative"
        style={{
          background: `linear-gradient(135deg, ${template.defaultTheme.primaryColor}15, ${template.defaultTheme.primaryColor}05)`,
        }}
      >
        {/* Preview placeholder */}
        <div className="absolute inset-4 bg-white rounded shadow-sm border border-gray-200 p-4">
          <div
            className="w-12 h-1.5 rounded mb-2"
            style={{ backgroundColor: template.defaultTheme.primaryColor }}
          />
          <div className="w-20 h-1 bg-gray-200 rounded mb-4" />
          <div className="space-y-1">
            <div className="w-full h-1 bg-gray-100 rounded" />
            <div className="w-3/4 h-1 bg-gray-100 rounded" />
            <div className="w-5/6 h-1 bg-gray-100 rounded" />
          </div>
          <div
            className="w-16 h-1 rounded mt-4"
            style={{ backgroundColor: template.defaultTheme.primaryColor }}
          />
          <div className="space-y-1 mt-2">
            <div className="w-full h-1 bg-gray-100 rounded" />
            <div className="w-2/3 h-1 bg-gray-100 rounded" />
          </div>
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
