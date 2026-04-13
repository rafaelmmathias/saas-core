'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { Toggle as TogglePrimitive } from 'radix-ui';
import * as React from 'react';

import { cn } from '../../lib/utils';

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg border text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      variant: {
        default:
          'border-border bg-transparent text-muted-foreground hover:bg-muted data-[state=on]:border-primary data-[state=on]:bg-primary-bg data-[state=on]:text-primary-text',
        outline:
          'border-input bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
      },
      size: {
        default: 'h-9 px-3 py-2',
        sm: 'h-8 px-2.5 py-1.5 text-xs',
        lg: 'h-10 px-4 py-2.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
