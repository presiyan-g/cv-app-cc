import { cn } from '../../lib/utils';

export interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
  formatValue?: (value: number) => string;
  className?: string;
}

export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = true,
  formatValue = v => v.toString(),
  className,
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="flex justify-between mb-2">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showValue && <span className="text-sm text-gray-500">{formatValue(value)}</span>}
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
        style={{
          background: `linear-gradient(to right, #2563eb 0%, #2563eb ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
        }}
      />
    </div>
  );
}
