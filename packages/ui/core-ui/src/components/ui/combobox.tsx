'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

import { Button } from './button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './command';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { cn } from '../../lib/utils';

export interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  disabled?: boolean;
}

export function Combobox({
  options,
  value = '',
  onValueChange,
  placeholder = 'Select option...',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No results found.',
  className,
  disabled = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selectedLabel = React.useMemo(
    () => options.find((option) => option.value === value)?.label,
    [options, value],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'border-input focus-visible:ring-primary h-10 w-full justify-between rounded-lg px-3 py-2 pr-8 text-sm font-normal focus-visible:border-transparent focus-visible:ring-2',
            !selectedLabel && 'text-muted-foreground',
            className,
          )}
          disabled={disabled}
        >
          {selectedLabel ?? placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    onValueChange?.(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === option.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
