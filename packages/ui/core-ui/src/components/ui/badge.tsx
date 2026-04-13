import { cva, type VariantProps } from 'class-variance-authority';
import type { LucideIcon } from 'lucide-react';
import { Slot } from 'radix-ui';
import * as React from 'react';

import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
        destructive:
          'bg-destructive text-white focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40 [a&]:hover:bg-destructive/90',
        outline:
          'border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
        ghost: '[a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 [a&]:hover:underline',
        success: 'bg-success-bg text-success-text',
        warning: 'bg-warning-bg text-warning-text',
        danger: 'bg-danger-bg text-danger-text',
        info: 'bg-primary-bg text-primary-text',
        neutral: 'bg-muted text-muted-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

type BadgeProps = React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
    icon?: LucideIcon;
    customColor?: { bg: string; text: string };
  };

function Badge({
  className,
  variant = 'default',
  asChild = false,
  icon: Icon,
  customColor,
  style,
  children,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot.Root : 'span';
  const mergedStyle = customColor
    ? { ...style, backgroundColor: customColor.bg, color: customColor.text }
    : style;

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant: customColor ? undefined : variant }), className)}
      style={mergedStyle}
      {...props}
    >
      {Icon ? <Icon className="size-3" /> : null}
      {children}
    </Comp>
  );
}

export { Badge, badgeVariants };
