import { Progress as ProgressPrimitive } from 'radix-ui';
import * as React from 'react';

import { cn } from '../../lib/utils';

type ProgressProps = React.ComponentProps<typeof ProgressPrimitive.Root> & {
  label?: React.ReactNode;
  showPercentage?: boolean;
  barHeight?: number;
};

function Progress({ className, value, label, showPercentage, barHeight, ...props }: ProgressProps) {
  const pct = Math.min(Math.max(value ?? 0, 0), 100);
  const heightStyle = typeof barHeight === 'number' ? { height: `${barHeight}px` } : undefined;

  const root = (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={pct}
      className={cn(
        'bg-muted relative w-full overflow-hidden rounded-full',
        typeof barHeight !== 'number' && 'h-2',
        className,
      )}
      style={heightStyle}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-primary h-full w-full flex-1 transition-all duration-700"
        style={{ transform: `translateX(-${100 - pct}%)` }}
      />
    </ProgressPrimitive.Root>
  );

  if (!label && !showPercentage) return root;

  return (
    <div className="w-full">
      <div className="text-muted-foreground mb-1 flex items-center justify-between text-xs">
        {label ? <span>{label}</span> : <span />}
        {showPercentage ? <span className="font-medium">{pct.toFixed(1)}%</span> : null}
      </div>
      {root}
    </div>
  );
}

export { Progress };
