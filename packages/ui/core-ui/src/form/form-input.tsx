'use client';

import * as React from 'react';
import type { ControllerProps, FieldPath, FieldValues } from 'react-hook-form';

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './form';
import { Input } from '../components/ui/input';

interface FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<ControllerProps<TFieldValues, TName>, 'render'> {
  label?: string;
  description?: string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  className?: string;
}

export function FormInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  label,
  description,
  placeholder,
  type = 'text',
  className,
  ...props
}: FormInputProps<TFieldValues, TName>) {
  return (
    <FormField
      {...props}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input type={type} placeholder={placeholder} className={className} {...field} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
