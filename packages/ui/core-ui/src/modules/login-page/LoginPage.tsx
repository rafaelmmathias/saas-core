'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Alert, AlertDescription } from '../../components/ui/alert';
import { Button } from '../../components/ui/button';
import { Form } from '../../form/form';
import { FormCheckbox } from '../../form/form-checkbox';
import { FormInput } from '../../form/form-input';
import { cn } from '../../lib/utils';

export interface LoginTexts {
  title: string;
  subtitle?: string;
  emailLabel: string;
  emailPlaceholder?: string;
  passwordLabel: string;
  passwordPlaceholder?: string;
  /** When absent, the remember-me checkbox is not rendered */
  rememberMeLabel?: string;
  /** When absent (or when onForgotPassword is not provided), the link is not rendered */
  forgotPasswordLabel?: string;
  submitLabel: string;
  /** Both footerText and footerLinkLabel are required to render the footer row */
  footerText?: string;
  footerLinkLabel?: string;
  /** Optional prefix shown before the server error message, e.g. "Error" */
  errorTitle?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginPageProps {
  texts: LoginTexts;
  onSubmit: (data: LoginFormData) => void | Promise<void>;
  onForgotPassword?: () => void;
  onFooterLink?: () => void;
  /** Rendered above the title — use for logo or wordmark */
  logo?: React.ReactNode;
  /** Disables all form controls and shows a spinner on the submit button */
  isLoading?: boolean;
  /** Server-side error to display above the submit button */
  error?: string;
  /** Applied to the card element */
  className?: string;
  schema?: z.ZodType<LoginFormData, z.ZodTypeDef, unknown>; // Optional custom Zod schema for validation, defaults to loginSchema
}

export const loginSchema = z.object({
  email: z.string().min(1).email(),
  password: z.string().min(1),
  rememberMe: z.boolean().optional().default(false),
});

export function LoginPage({
  texts,
  onSubmit,
  onForgotPassword,
  onFooterLink,
  logo,
  isLoading = false,
  error,
  className,
  schema = loginSchema,
}: LoginPageProps) {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data);
  });

  const showRememberMe = Boolean(texts.rememberMeLabel);
  const showForgotPassword = Boolean(texts.forgotPasswordLabel && onForgotPassword);
  const showMiddleRow = showRememberMe || showForgotPassword;
  const showFooter = Boolean(texts.footerText && texts.footerLinkLabel);

  return (
    <div className="bg-background relative flex min-h-full w-full items-center justify-center overflow-hidden px-4 py-12">
      {/* Decorative background glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <div className="bg-primary/5 absolute -top-1/4 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full blur-3xl" />
      </div>

      {/* Card */}
      <div
        className={cn(
          'relative z-10 w-full max-w-md',
          'border-border bg-card rounded-xl border px-8 py-10 shadow-sm',
          className,
        )}
      >
        {/* Logo */}
        {logo && <div className="mb-6 flex justify-center">{logo}</div>}

        {/* Header */}
        <div className="mb-8 space-y-1.5">
          <h1 className="text-foreground text-2xl font-semibold tracking-tight">{texts.title}</h1>
          {texts.subtitle && <p className="text-muted-foreground text-sm">{texts.subtitle}</p>}
        </div>

        <Form {...form}>
          <form onSubmit={handleSubmit} noValidate>
            <fieldset disabled={isLoading} className="contents">
              <div className="space-y-5">
                <FormInput<LoginFormData>
                  control={form.control}
                  name="email"
                  label={texts.emailLabel}
                  placeholder={texts.emailPlaceholder}
                  type="email"
                />

                <FormInput<LoginFormData>
                  control={form.control}
                  name="password"
                  label={texts.passwordLabel}
                  placeholder={texts.passwordPlaceholder}
                  type="password"
                />

                {/* Remember me + Forgot password */}
                {showMiddleRow && (
                  <div className="flex items-center justify-between">
                    {showRememberMe && (
                      <FormCheckbox<LoginFormData>
                        control={form.control}
                        name="rememberMe"
                        label={texts.rememberMeLabel}
                      />
                    )}
                    {showForgotPassword && (
                      <Button
                        type="button"
                        variant="link"
                        size="sm"
                        className="text-muted-foreground hover:text-foreground ml-auto h-auto px-0"
                        onClick={onForgotPassword}
                        disabled={isLoading}
                      >
                        {texts.forgotPasswordLabel}
                      </Button>
                    )}
                  </div>
                )}

                {/* Server-side error */}
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription className="flex items-center gap-2 text-center">
                      <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <p>{error}</p>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Submit */}
                <Button type="submit" className="mt-2 w-full" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      {texts.submitLabel}
                    </span>
                  ) : (
                    texts.submitLabel
                  )}
                </Button>
              </div>
            </fieldset>
          </form>
        </Form>

        {/* Footer */}
        {showFooter && (
          <div className="mt-8 flex items-center justify-center gap-1 text-sm">
            <span className="text-muted-foreground">{texts.footerText}</span>
            <Button
              type="button"
              variant="link"
              size="sm"
              className="h-auto px-0 font-medium"
              onClick={onFooterLink}
              disabled={isLoading}
            >
              {texts.footerLinkLabel}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
