'use client';

import { ClockIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { cn } from '../../lib/utils';

interface TimePickerProps {
  value?: string;
  onValueChange?: (value: string | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  minuteStep?: number;
}

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

function parseTime(value: string | undefined): { hour: number; minute: number } | null {
  if (!value) return null;
  const match = /^(\d{1,2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  return { hour, minute };
}

export function TimePicker({
  value,
  onValueChange,
  placeholder = 'Pick a time',
  className,
  disabled = false,
  minuteStep = 5,
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const parsed = parseTime(value);

  const hours = React.useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const minutes = React.useMemo(
    () => Array.from({ length: Math.floor(60 / minuteStep) }, (_, i) => i * minuteStep),
    [minuteStep],
  );

  const commit = (hour: number, minute: number) => {
    onValueChange?.(`${pad(hour)}:${pad(minute)}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !value && 'text-muted-foreground',
            className,
          )}
          disabled={disabled}
        >
          <ClockIcon className="mr-2 h-4 w-4" />
          {value ?? <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex h-56 divide-x">
          <ScrollColumn
            label="HH"
            items={hours}
            selected={parsed?.hour}
            onSelect={(h) => commit(h, parsed?.minute ?? 0)}
          />
          <ScrollColumn
            label="MM"
            items={minutes}
            selected={parsed?.minute}
            onSelect={(m) => commit(parsed?.hour ?? 0, m)}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

function ScrollColumn({
  label,
  items,
  selected,
  onSelect,
}: {
  label: string;
  items: number[];
  selected: number | undefined;
  onSelect: (value: number) => void;
}) {
  return (
    <div className="flex flex-col">
      <div className="text-muted-foreground border-b px-3 py-1.5 text-center text-[10px] font-medium uppercase tracking-wider">
        {label}
      </div>
      <div className="flex-1 overflow-y-auto p-1">
        <div className="flex flex-col gap-0.5">
          {items.map((item) => {
            const isSelected = item === selected;
            return (
              <Button
                key={item}
                type="button"
                variant={isSelected ? 'default' : 'ghost'}
                size="sm"
                className="h-8 w-14 justify-center font-mono text-sm"
                onClick={() => onSelect(item)}
              >
                {pad(item)}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
