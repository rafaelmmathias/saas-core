import * as React from 'react';

import { cn } from '../../lib/utils';

type StatusColor = 'primary' | 'success' | 'warning' | 'danger';

const paletteMap: Record<StatusColor, { bg: string; text: string; dot: string; fill: string }> = {
  primary: {
    bg: 'bg-primary-bg',
    text: 'text-primary-text',
    dot: 'bg-primary',
    fill: 'bg-primary',
  },
  success: {
    bg: 'bg-success-bg',
    text: 'text-success-text',
    dot: 'bg-success',
    fill: 'bg-success',
  },
  warning: {
    bg: 'bg-warning-bg',
    text: 'text-warning-text',
    dot: 'bg-warning',
    fill: 'bg-warning',
  },
  danger: {
    bg: 'bg-danger-bg',
    text: 'text-danger-text',
    dot: 'bg-danger',
    fill: 'bg-danger',
  },
};

export interface StatusCardProps {
  label: string;
  percentage: number;
  color?: StatusColor;
  className?: string;
}

export function StatusCard({ label, percentage, color = 'primary', className }: StatusCardProps) {
  const palette = paletteMap[color];
  const pct = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className={cn('rounded-lg p-3', palette.bg, className)}>
      <div className="flex items-center gap-2">
        <span className={cn('size-2 animate-pulse rounded-full', palette.dot)} />
        <span className={cn('text-xs font-semibold', palette.text)}>{label}</span>
      </div>
      <p className={cn('mt-1 text-xs', palette.text, 'opacity-80')}>{pct.toFixed(1)}%</p>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/40">
        <div
          className={cn('h-full rounded-full transition-all duration-700', palette.fill)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
