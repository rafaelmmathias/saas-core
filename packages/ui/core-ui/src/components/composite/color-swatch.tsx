'use client';

import { CheckIcon } from 'lucide-react';

import { parseHsl } from '../../lib/color';
import { cn } from '../../lib/utils';

interface ColorSwatchProps {
  color: string;
  label?: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

function ColorSwatch({ color, label, isActive = false, onClick, className }: ColorSwatchProps) {
  const { h, s, l } = parseHsl(color);
  const previewColor = `hsl(${h} ${s}% ${l}%)`;

  return (
    <button
      aria-label={label ? `Edit ${label}` : 'Edit color'}
      aria-pressed={isActive}
      className={cn('group flex flex-col items-center gap-1.5 focus:outline-none', className)}
      onClick={onClick}
      type="button"
    >
      <div
        className="relative size-12 rounded-xl border-2 shadow-sm transition-all duration-150 group-hover:scale-110 group-hover:shadow-md"
        style={{
          backgroundColor: previewColor,
          borderColor: isActive ? `hsl(${h} ${s}% ${Math.max(l - 20, 0)}%)` : 'transparent',
          boxShadow: isActive
            ? `0 0 0 3px hsl(${h} ${s}% ${l}% / 0.3), 0 2px 8px hsl(${h} ${s}% ${l}% / 0.3)`
            : undefined,
        }}
      >
        {isActive ? (
          <span className="absolute inset-0 flex items-center justify-center">
            <CheckIcon
              className="size-4"
              stroke={l > 55 ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.9)'}
              strokeWidth={2.5}
            />
          </span>
        ) : null}
      </div>
      {label ? (
        <span
          className="text-muted-foreground group-hover:text-foreground max-w-[52px] truncate text-center text-[10px] font-medium leading-tight transition-colors"
          title={label}
        >
          {label}
        </span>
      ) : null}
    </button>
  );
}

export { ColorSwatch };
