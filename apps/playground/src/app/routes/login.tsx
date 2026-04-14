import { Alert, AlertDescription, AlertTitle } from '@saas-core/core-ui/components/alert';
import { LoginPage } from '@saas-core/core-ui/modules/login-page';
import type { LoginFormData } from '@saas-core/core-ui/modules/login-page';
import { useState } from 'react';

export function LoginShowcasePage() {
  const [submittedData, setSubmittedData] = useState<LoginFormData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleSubmit = async (data: LoginFormData) => {
    setError(undefined);
    setSubmittedData(null);
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);

    if (data.email === 'error@example.com') {
      setError('Invalid email or password. Please try again.');
      return;
    }

    setSubmittedData(data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Login Page</h1>
        <p className="text-muted-foreground mt-1">
          A reusable, project-agnostic login module from{' '}
          <code className="bg-muted rounded px-1 py-0.5 font-mono text-xs">
            @saas-core/core-ui/modules/login-page
          </code>
          . All text is passed as props — no hardcoded strings.
        </p>
      </div>

      {submittedData && (
        <Alert variant="success">
          <AlertTitle>Submitted successfully!</AlertTitle>
          <AlertDescription>
            <pre className="mt-1 text-xs">{JSON.stringify(submittedData, null, 2)}</pre>
          </AlertDescription>
        </Alert>
      )}

      <div className="border-border h-170 overflow-hidden rounded-xl border shadow-sm">
        <LoginPage
          texts={{
            title: 'Welcome back',
            subtitle: 'Sign in to your account to continue',
            emailLabel: 'Email address',
            emailPlaceholder: 'you@example.com',
            passwordLabel: 'Password',
            passwordPlaceholder: '••••••••',
            rememberMeLabel: 'Remember me',
            forgotPasswordLabel: 'Forgot password?',
            submitLabel: 'Sign in',
            footerText: "Don't have an account?",
            footerLinkLabel: 'Sign up',
            errorTitle: 'Error',
          }}
          onSubmit={handleSubmit}
          onForgotPassword={() => alert('Navigate to forgot password')}
          onFooterLink={() => alert('Navigate to sign up')}
          isLoading={isLoading}
          error={error}
        />
      </div>

      <p className="text-muted-foreground text-xs">
        Tip: use <code className="bg-muted rounded px-1 py-0.5 font-mono">error@example.com</code>{' '}
        to trigger the server error state.
      </p>
    </div>
  );
}
