import { useCVStore } from '../../../../stores/cvStore';
import { Select, Slider } from '../../../../components/ui';
import { FONT_FAMILIES, THEME_COLORS } from '../../../../features/cv/types';
import { cn } from '../../../../lib/utils';

export function ControlsPanel() {
  const { cv, updateLayout, updateTheme } = useCVStore();

  if (!cv) return null;

  const { layout, theme } = cv;

  return (
    <div className="p-4 pb-20 lg:pb-4 space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          Layout
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Columns
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => updateLayout({ columns: 1 })}
                className={cn(
                  'flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors',
                  layout.columns === 1
                    ? 'bg-primary-50 border-primary-300 text-primary-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                )}
              >
                Single
              </button>
              <button
                onClick={() => updateLayout({ columns: 2 })}
                className={cn(
                  'flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors',
                  layout.columns === 2
                    ? 'bg-primary-50 border-primary-300 text-primary-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                )}
              >
                Two
              </button>
            </div>
          </div>

          {layout.columns === 2 && (
            <Slider
              label="Column Split"
              value={layout.splitRatio * 100}
              onChange={v => updateLayout({ splitRatio: v / 100 })}
              min={25}
              max={50}
              formatValue={v => `${Math.round(v)}% / ${Math.round(100 - v)}%`}
            />
          )}

          <Select
            label="Section Spacing"
            value={layout.sectionSpacing}
            onChange={e => updateLayout({ sectionSpacing: e.target.value as 'compact' | 'normal' | 'relaxed' })}
            options={[
              { value: 'compact', label: 'Compact' },
              { value: 'normal', label: 'Normal' },
              { value: 'relaxed', label: 'Relaxed' },
            ]}
          />
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          Colors
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Color
            </label>
            <div className="flex flex-wrap gap-2">
              {THEME_COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => updateTheme({ primaryColor: color, accentColor: color })}
                  className={cn(
                    'w-8 h-8 rounded-full transition-transform hover:scale-110',
                    theme.primaryColor === color && 'ring-2 ring-offset-2 ring-gray-400'
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Color
            </label>
            <input
              type="color"
              value={theme.primaryColor}
              onChange={e => updateTheme({ primaryColor: e.target.value, accentColor: e.target.value })}
              className="w-full h-10 rounded-lg cursor-pointer border border-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Separator Line Color
            </label>
            <input
              type="color"
              value={theme.separatorColor}
              onChange={e => updateTheme({ separatorColor: e.target.value })}
              className="w-full h-10 rounded-lg cursor-pointer border border-gray-300"
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          Typography
        </h2>

        <div className="space-y-4">
          <Select
            label="Font Family"
            value={theme.fontFamily}
            onChange={e => updateTheme({ fontFamily: e.target.value as typeof theme.fontFamily })}
            options={FONT_FAMILIES.map(font => ({ value: font, label: font }))}
          />

          <Select
            label="Font Size"
            value={theme.fontSize}
            onChange={e => updateTheme({ fontSize: e.target.value as 'small' | 'medium' | 'large' })}
            options={[
              { value: 'small', label: 'Small' },
              { value: 'medium', label: 'Medium' },
              { value: 'large', label: 'Large' },
            ]}
          />

          <Select
            label="Line Height"
            value={theme.lineHeight}
            onChange={e => updateTheme({ lineHeight: e.target.value as 'tight' | 'normal' | 'relaxed' })}
            options={[
              { value: 'tight', label: 'Tight' },
              { value: 'normal', label: 'Normal' },
              { value: 'relaxed', label: 'Relaxed' },
            ]}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Heading Style
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => updateTheme({ headingStyle: 'normal' })}
                className={cn(
                  'flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors',
                  theme.headingStyle === 'normal'
                    ? 'bg-primary-50 border-primary-300 text-primary-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                )}
              >
                Normal
              </button>
              <button
                onClick={() => updateTheme({ headingStyle: 'uppercase' })}
                className={cn(
                  'flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors uppercase',
                  theme.headingStyle === 'uppercase'
                    ? 'bg-primary-50 border-primary-300 text-primary-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                )}
              >
                Uppercase
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
