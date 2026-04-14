import { ArrowDownRight, ArrowUpRight, type LucideIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '../../lib/utils';

type KpiColor = 'primary' | 'success' | 'warning' | 'danger' | 'purple' | 'cyan';

const colorClasses: Record<KpiColor, { bg: string; text: string }> = {
  primary: { bg: 'bg-primary-bg', text: 'text-primary-text' },
  success: { bg: 'bg-success-bg', text: 'text-success-text' },
  warning: { bg: 'bg-warning-bg', text: 'text-warning-text' },
  danger: { bg: 'bg-danger-bg', text: 'text-danger-text' },
  purple: { bg: 'bg-purple-bg', text: 'text-purple' },
  cyan: { bg: 'bg-cyan-bg', text: 'text-cyan' },
};

export interface KpiCardProps {
  label: string;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  icon: LucideIcon;
  color?: KpiColor;
  trend?: { value: number; direction: 'up' | 'down' };
  size?: 'normal' | 'small';
  className?: string;
}

export function KpiCard({
  label,
  value,
  subtitle,
  icon: Icon,
  color = 'primary',
  trend,
  size = 'normal',
  className,
}: KpiCardProps) {
  const palette = colorClasses[color];
  const isSmall = size === 'small';

  return (
    <div
      className={cn(
        'border-border bg-card shadow-card hover:shadow-card-hover flex items-start justify-between rounded-lg border transition-shadow',
        isSmall ? 'p-3' : 'p-5',
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="text-muted-foreground truncate text-xs font-medium uppercase tracking-wide">
          {label}
        </p>
        <p className={cn('text-foreground mt-1 font-bold', isSmall ? 'text-lg' : 'text-2xl')}>
          {value}
        </p>
        {subtitle ? <p className="text-muted-foreground mt-1 text-xs">{subtitle}</p> : null}
        {trend ? (
          <div
            className={cn(
              'mt-2 flex items-center text-xs',
              trend.direction === 'up' ? 'text-success' : 'text-danger',
            )}
          >
            {trend.direction === 'up' ? (
              <ArrowUpRight className="size-3" />
            ) : (
              <ArrowDownRight className="size-3" />
            )}
            <span className="ml-1 font-medium">{trend.value.toFixed(1)}%</span>
          </div>
        ) : null}
      </div>
      <div className={cn('ml-3 shrink-0 rounded-lg p-2', palette.bg)}>
        <Icon className={cn(palette.text, isSmall ? 'size-4' : 'size-5')} />
      </div>
    </div>
  );
}
