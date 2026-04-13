import * as React from 'react';

import { cn } from '../../lib/utils';

export interface SectionTitleProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function SectionTitle({ title, subtitle, actions, className }: SectionTitleProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4', className)}>
      <div>
        <h2 className="text-foreground text-xl font-bold">{title}</h2>
        {subtitle ? <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}
