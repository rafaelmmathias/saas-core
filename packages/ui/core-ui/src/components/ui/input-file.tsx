'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import {
  FileArchiveIcon,
  FileAudioIcon,
  FileCodeIcon,
  FileIcon,
  FileImageIcon,
  FileJsonIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  FileVideoIcon,
  Paperclip,
  UploadCloud,
  X,
} from 'lucide-react';
import * as React from 'react';

import { cn } from '../../lib/utils';

const inputFileVariants = cva('w-full', {
  variants: {
    variant: {
      button: 'flex flex-wrap items-center gap-2',
      dropzone: '',
    },
  },
  defaultVariants: {
    variant: 'button',
  },
});

const dropzoneTriggerVariants = cva(
  [
    'group relative flex w-full cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-xl',
    'border-2 border-dashed px-6 py-10 text-center',
    'transition-all duration-300 ease-out',
    'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      isDragging: {
        false: ['border-border bg-background', 'hover:border-primary/60 hover:bg-primary/[0.03]'],
        true: 'border-primary bg-primary/[0.06]',
      },
    },
    defaultVariants: {
      isDragging: false,
    },
  },
);

type NativeInputProps = Omit<
  React.ComponentProps<'input'>,
  'children' | 'type' | 'value' | 'defaultValue' | 'onChange'
>;

interface InputFileProps extends NativeInputProps, VariantProps<typeof inputFileVariants> {
  files?: File | File[] | FileList | null;
  placeholder?: string;
  buttonText?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onFilesChange?: (files: File[] | null) => void;
}

function normalizeFiles(files: File | File[] | FileList | null, multiple: boolean): File[] | null {
  if (!files) return null;
  const nextFiles = files instanceof File ? [files] : Array.from(files);
  if (nextFiles.length === 0) return null;
  return multiple ? nextFiles : [nextFiles[0]!];
}

/** For UI indication only — filtering/validation is Zod's responsibility. */
function matchesAccept(file: File, accept: string): boolean {
  return accept
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .some((pattern) => {
      if (pattern.startsWith('.')) return file.name.toLowerCase().endsWith(pattern.toLowerCase());
      if (pattern.endsWith('/*')) return file.type.startsWith(pattern.slice(0, -1));
      return file.type === pattern;
    });
}

function getFileIcon(file: File): React.ComponentType<{ className?: string }> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  const { type } = file;
  if (type.startsWith('image/')) return FileImageIcon;
  if (type.startsWith('video/')) return FileVideoIcon;
  if (type.startsWith('audio/')) return FileAudioIcon;
  if (type === 'application/json' || ext === 'json') return FileJsonIcon;
  if (['xls', 'xlsx', 'csv', 'ods'].includes(ext)) return FileSpreadsheetIcon;
  if (['zip', 'rar', 'tar', 'gz', '7z', 'bz2', 'xz'].includes(ext)) return FileArchiveIcon;
  if (
    [
      'js',
      'ts',
      'jsx',
      'tsx',
      'html',
      'css',
      'py',
      'rb',
      'java',
      'cpp',
      'c',
      'cs',
      'go',
      'rs',
      'php',
      'swift',
      'kt',
      'vue',
      'svelte',
    ].includes(ext)
  )
    return FileCodeIcon;
  if (['pdf', 'doc', 'docx', 'txt', 'md', 'rtf', 'odt'].includes(ext)) return FileTextIcon;
  return FileIcon;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Renders an image thumbnail via object URL, or falls back to the appropriate file icon. */
function FilePreview({ file, iconClassName }: { file: File; iconClassName?: string }) {
  const [url, setUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!file.type.startsWith('image/')) return;
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  if (url) {
    return <img src={url} alt={file.name} className="size-full object-cover" />;
  }

  const Icon = getFileIcon(file);
  return <Icon className={iconClassName} />;
}

function InputFile({
  accept,
  buttonText,
  className,
  disabled,
  files,
  id,
  multiple = false,
  name,
  onBlur,
  onFilesChange,
  onChange,
  placeholder,
  required,
  variant = 'button',
  ...props
}: InputFileProps) {
  const inputId = React.useId();
  const resolvedId = id ?? inputId;
  const [isDragging, setIsDragging] = React.useState(false);

  const selectedFiles = React.useMemo(
    () => normalizeFiles(files ?? null, multiple),
    [files, multiple],
  );

  const emptyState = placeholder ?? (multiple ? 'No files selected yet.' : 'No file selected yet.');
  const callToAction = buttonText ?? (multiple ? 'Choose files' : 'Choose file');

  const helperText =
    accept && variant === 'dropzone'
      ? accept
          .split(',')
          .map((v) => v.trim())
          .filter(Boolean)
          .join(', ')
      : null;

  const handleFiles = React.useCallback(
    (nextFiles: File | File[] | FileList | null, event?: React.ChangeEvent<HTMLInputElement>) => {
      onFilesChange?.(normalizeFiles(nextFiles, multiple));
      if (event) onChange?.(event);
    },
    [multiple, onChange, onFilesChange],
  );

  const handleDrop = React.useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      if (disabled) return;
      setIsDragging(false);
      handleFiles(event.dataTransfer.files ? Array.from(event.dataTransfer.files) : null);
    },
    [disabled, handleFiles],
  );

  const handleClearFile = React.useCallback(
    (index: number) => {
      if (!selectedFiles) return;
      const next = selectedFiles.filter((_, i) => i !== index);
      onFilesChange?.(next.length > 0 ? next : null);
    },
    [selectedFiles, onFilesChange],
  );

  /* ── Hidden native input ─────────────────────────────────── */
  const hiddenInput = (
    <input
      accept={accept}
      className="sr-only"
      data-slot="input-file"
      disabled={disabled}
      id={resolvedId}
      multiple={multiple}
      name={name}
      onBlur={onBlur}
      onChange={(event) => handleFiles(event.target.files, event)}
      required={required}
      type="file"
      {...props}
    />
  );

  /* ── Button variant ──────────────────────────────────────── */
  if (variant !== 'dropzone') {
    return (
      <div className={cn('flex flex-col gap-1.5', className)}>
        <div className={cn(inputFileVariants({ variant }))}>
          {hiddenInput}

          <label
            htmlFor={resolvedId}
            aria-disabled={disabled}
            className={cn(
              'bg-background shadow-xs inline-flex cursor-pointer select-none items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium',
              'text-foreground transition-colors',
              'hover:bg-accent hover:text-accent-foreground',
              'focus-visible:ring-ring/50 focus-visible:outline-none focus-visible:ring-[3px]',
              disabled && 'pointer-events-none opacity-50',
            )}
          >
            <Paperclip className="size-3.5 shrink-0" />
            {callToAction}
          </label>

          {selectedFiles && selectedFiles.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {selectedFiles.map((file, i) => {
                const valid = !accept || matchesAccept(file, accept);
                return (
                  <span
                    key={`${file.name}-${i}`}
                    className={cn(
                      'inline-flex max-w-52 items-center gap-1.5 rounded-full border py-0.5 pl-1.5 pr-1 text-xs font-medium',
                      accept
                        ? valid
                          ? 'border-success/25 bg-success/10 text-success'
                          : 'border-destructive/25 bg-destructive/10 text-destructive'
                        : 'bg-accent/60 text-accent-foreground',
                    )}
                  >
                    <span
                      className={cn(
                        'flex size-4 shrink-0 items-center justify-center overflow-hidden rounded-full',
                        accept ? (valid ? 'bg-success/15' : 'bg-destructive/15') : 'bg-muted',
                      )}
                    >
                      <FilePreview file={file} iconClassName="size-2.5" />
                    </span>
                    <span className="truncate">{file.name}</span>
                    {!disabled && (
                      <button
                        type="button"
                        onClick={() => handleClearFile(i)}
                        className={cn(
                          'flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors',
                          valid || !accept
                            ? 'text-muted-foreground hover:bg-foreground/10 hover:text-foreground'
                            : 'text-destructive/60 hover:bg-destructive/10 hover:text-destructive',
                        )}
                        aria-label={`Remove ${file.name}`}
                      >
                        <X className="size-2.5" />
                      </button>
                    )}
                  </span>
                );
              })}
            </div>
          ) : (
            <span className="text-muted-foreground truncate text-sm">{emptyState}</span>
          )}
        </div>
      </div>
    );
  }

  /* ── Dropzone variant ────────────────────────────────────── */
  const hasFiles = selectedFiles && selectedFiles.length > 0;

  return (
    <div className={cn('w-full', className)}>
      {hiddenInput}

      <label
        htmlFor={resolvedId}
        aria-disabled={disabled}
        className={cn(
          dropzoneTriggerVariants({ isDragging }),
          disabled && 'pointer-events-none opacity-50',
        )}
        onDragEnter={() => !disabled && setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDrop={handleDrop}
      >
        {/* Background shimmer on drag */}
        <span
          className={cn(
            'pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-500',
            'bg-[radial-gradient(ellipse_at_50%_0%,hsl(var(--primary)/0.08)_0%,transparent_70%)]',
            isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
          )}
        />

        {/* Upload icon */}
        <span
          className={cn(
            'relative flex size-12 items-center justify-center rounded-full',
            'bg-primary/8 ring-primary/10 ring-4',
            'transition-transform duration-300 group-hover:scale-110',
            isDragging && 'scale-110',
          )}
        >
          <UploadCloud
            className={cn(
              'text-primary size-5 transition-transform duration-300',
              'group-hover:-translate-y-0.5',
              isDragging && '-translate-y-0.5',
            )}
          />
        </span>

        {/* Text content */}
        <div className="relative flex flex-col items-center gap-1">
          <span className="text-foreground text-sm font-semibold">{callToAction}</span>
          <span className="text-muted-foreground text-xs">
            {isDragging ? 'Drop to upload' : 'Drag & drop or click to browse'}
          </span>
          {helperText ? (
            <span className="text-muted-foreground/70 mt-0.5 text-[11px]">
              Accepted: {helperText}
            </span>
          ) : null}
        </div>

        {/* Selected files list */}
        {hasFiles ? (
          <div className="relative w-full" onClick={(e) => e.preventDefault()}>
            <div className="bg-background/80 shadow-xs divide-border/60 divide-y rounded-lg border text-left backdrop-blur-sm">
              {selectedFiles.map((file, i) => {
                const valid = !accept || matchesAccept(file, accept);
                const isImage = file.type.startsWith('image/');
                return (
                  <div key={`${file.name}-${i}`} className="flex items-center gap-2.5 px-3 py-2">
                    {/* Icon / thumbnail */}
                    <span
                      className={cn(
                        'flex size-8 shrink-0 overflow-hidden rounded-md',
                        accept
                          ? valid
                            ? isImage
                              ? 'ring-success/30 ring-1'
                              : 'bg-success/10 items-center justify-center'
                            : isImage
                              ? 'ring-destructive/30 ring-1'
                              : 'bg-destructive/10 items-center justify-center'
                          : isImage
                            ? ''
                            : 'bg-muted/60 items-center justify-center',
                      )}
                    >
                      <FilePreview
                        file={file}
                        iconClassName={cn(
                          'size-4 shrink-0',
                          accept
                            ? valid
                              ? 'text-success'
                              : 'text-destructive'
                            : 'text-muted-foreground',
                        )}
                      />
                    </span>

                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          'truncate text-xs font-medium',
                          accept
                            ? valid
                              ? 'text-foreground'
                              : 'text-destructive'
                            : 'text-foreground',
                        )}
                      >
                        {file.name}
                      </p>
                      <p className="text-muted-foreground text-[11px]">{formatBytes(file.size)}</p>
                    </div>

                    {!disabled && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleClearFile(i);
                        }}
                        className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive flex size-5 shrink-0 items-center justify-center rounded-md transition-colors"
                        aria-label={`Remove ${file.name}`}
                      >
                        <X className="size-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <span className="text-muted-foreground/60 relative text-xs">{emptyState}</span>
        )}
      </label>
    </div>
  );
}

export { InputFile, type InputFileProps };
