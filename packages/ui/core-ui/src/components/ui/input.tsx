import type { LucideIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '../../lib/utils';

type InputProps = React.ComponentProps<'input'> & {
  leadingIcon?: LucideIcon;
};

function Input({ className, type, leadingIcon: LeadingIcon, ...props }: InputProps) {
  const input = (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'border-input shadow-xs selection:bg-primary selection:text-primary-foreground file:text-foreground placeholder:text-muted-foreground dark:bg-input/30 h-10 w-full min-w-0 rounded-lg border bg-transparent px-3 py-2 text-sm outline-none transition-[color,box-shadow] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:ring-primary focus-visible:border-transparent focus-visible:ring-2',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
        LeadingIcon && 'pl-9',
        className,
      )}
      {...props}
    />
  );

  if (!LeadingIcon) return input;

  return (
    <div className="relative w-full">
      <LeadingIcon className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2" />
      {input}
    </div>
  );
}

export { Input };
