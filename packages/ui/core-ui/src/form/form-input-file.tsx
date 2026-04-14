'use client';

import type { ControllerProps, FieldPath, FieldValues } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './form';
import { InputFile, type InputFileProps } from '../components/ui/input-file';

interface FormInputFileProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>
  extends
    Omit<ControllerProps<TFieldValues, TName>, 'render'>,
    Pick<
      InputFileProps,
      'accept' | 'buttonText' | 'className' | 'disabled' | 'multiple' | 'placeholder' | 'variant'
    > {
  label?: string;
  description?: string;
}

export function FormInputFile<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  accept,
  buttonText,
  className,
  description,
  disabled,
  label,
  multiple,
  placeholder,
  variant,
  ...props
}: FormInputFileProps<TFieldValues, TName>) {
  const { trigger } = useFormContext();

  return (
    <FormField
      {...props}
      render={({ field }) => (
        <FormItem>
          {label ? <FormLabel>{label}</FormLabel> : null}
          <FormControl>
            <InputFile
              accept={accept}
              buttonText={buttonText}
              className={className}
              disabled={disabled}
              files={(field.value as File[] | null | undefined) ?? null}
              multiple={multiple}
              onBlur={field.onBlur}
              onFilesChange={(files) => {
                field.onChange(files);
                void trigger(field.name);
              }}
              placeholder={placeholder}
              variant={variant}
            />
          </FormControl>
          {description ? <FormDescription>{description}</FormDescription> : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
