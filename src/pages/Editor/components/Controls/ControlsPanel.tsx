import { useCVStore } from '../../../../stores/cvStore';
import { Select, Slider } from '../../../../components/ui';
import { FONT_FAMILIES, THEME_COLORS } from '../../../../features/cv/types';
import type { HeaderLayout, ContactLayout, AccentBoxSettings } from '../../../../features/cv/types';
import { cn } from '../../../../lib/utils';

export function ControlsPanel() {
  const { cv, updateLayout, updateTheme, updateHeader, updateAccentBox } = useCVStore();

  if (!cv) return null;

  const { layout, theme, header } = cv;
  const accentBox = theme.accentBox;

  return (
    <div className="p-4 pb-20 lg:pb-4 space-y-6">
      {/* Header Settings */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          Header
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Header Layout
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'classic', label: 'Classic' },
                { value: 'modern', label: 'Modern' },
                { value: 'centered', label: 'Centered' },
                { value: 'minimal', label: 'Minimal' },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => updateHeader({ layout: option.value as HeaderLayout })}
                  className={cn(
                    'py-2 px-3 rounded-lg border text-sm font-medium transition-colors',
                    header.layout === option.value
                      ? 'bg-primary-50 border-primary-300 text-primary-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <Select
            label="Contact Layout"
            value={header.contactLayout}
            onChange={e => updateHeader({ contactLayout: e.target.value as ContactLayout })}
            options={[
              { value: 'inline', label: 'Inline (Row)' },
              { value: 'stacked', label: 'Stacked (Column)' },
              { value: 'two-column', label: 'Two Column' },
            ]}
          />

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={header.showSummaryInHeader}
              onChange={e => updateHeader({ showSummaryInHeader: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">Show summary in header</span>
          </label>
        </div>
      </div>

      {/* Layout Settings */}
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

      {/* Accent Box Settings */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          Accent Box
        </h2>

        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={accentBox?.enabled ?? false}
              onChange={e => updateAccentBox({ enabled: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">Enable accent box</span>
          </label>

          {accentBox?.enabled && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'top', label: 'Top' },
                    { value: 'left-sidebar', label: 'Left' },
                    { value: 'right-sidebar', label: 'Right' },
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => updateAccentBox({ position: option.value as AccentBoxSettings['position'] })}
                      className={cn(
                        'py-2 px-3 rounded-lg border text-sm font-medium transition-colors',
                        accentBox.position === option.value
                          ? 'bg-primary-50 border-primary-300 text-primary-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <Select
                label="Content"
                value={accentBox.content}
                onChange={e => updateAccentBox({ content: e.target.value as AccentBoxSettings['content'] })}
                options={[
                  { value: 'contact', label: 'Contact Info' },
                  { value: 'skills', label: 'Skills' },
                  { value: 'custom', label: 'Custom Text' },
                ]}
              />

              {accentBox.content === 'custom' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Text
                  </label>
                  <textarea
                    value={accentBox.customText ?? ''}
                    onChange={e => updateAccentBox({ customText: e.target.value })}
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                    placeholder="Enter custom text..."
                  />
                </div>
              )}

              {(accentBox.position === 'left-sidebar' || accentBox.position === 'right-sidebar') && (
                <Slider
                  label="Sidebar Width"
                  value={accentBox.width}
                  onChange={v => updateAccentBox({ width: v })}
                  min={20}
                  max={40}
                  formatValue={v => `${Math.round(v)}%`}
                />
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Color
                </label>
                <input
                  type="color"
                  value={accentBox.backgroundColor}
                  onChange={e => updateAccentBox({ backgroundColor: e.target.value })}
                  className="w-full h-10 rounded-lg cursor-pointer border border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Color
                </label>
                <input
                  type="color"
                  value={accentBox.textColor}
                  onChange={e => updateAccentBox({ textColor: e.target.value })}
                  className="w-full h-10 rounded-lg cursor-pointer border border-gray-300"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
