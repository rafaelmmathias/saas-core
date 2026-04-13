import { useCurrency } from '@saas-core/core/currency';
import * as React from 'react';

import { cn } from '../../lib/utils';

interface ChartTooltipPayloadItem {
  name?: string;
  value?: number | string;
  color?: string;
  dataKey?: string;
  payload?: Record<string, unknown>;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: ChartTooltipPayloadItem[];
  label?: React.ReactNode;
  className?: string;
  formatValue?: (value: number | string, item: ChartTooltipPayloadItem) => React.ReactNode;
  currencyThreshold?: number;
}

export function ChartTooltip({
  active,
  payload,
  label,
  className,
  formatValue,
  currencyThreshold = 100,
}: ChartTooltipProps) {
  const { format } = useCurrency();

  if (!active || !payload || payload.length === 0) return null;

  const renderValue = (item: ChartTooltipPayloadItem) => {
    if (item.value === undefined || item.value === null) return '—';
    if (formatValue) return formatValue(item.value, item);
    if (typeof item.value === 'number' && item.value > currencyThreshold) {
      return format(item.value);
    }
    return String(item.value);
  };

  return (
    <div
      className={cn(
        'border-border bg-popover rounded-lg border p-3 text-xs shadow-[var(--shadow-tooltip)]',
        className,
      )}
    >
      {label !== undefined && label !== '' ? (
        <div className="text-foreground mb-1 font-semibold">{label}</div>
      ) : null}
      <div className="flex flex-col gap-1">
        {payload.map((item, i) => (
          <div key={item.dataKey ?? i} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2" style={{ color: item.color }}>
              <span
                className="inline-block size-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              {item.name ?? item.dataKey}
            </span>
            <span className="text-foreground font-medium">{renderValue(item)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
