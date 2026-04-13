import { CurrencyProvider } from '@saas-core/core/currency';
import { ThemeProvider } from '@saas-core/core/theme';
import { TooltipProvider } from '@saas-core/core-ui/components/tooltip';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Routes, Route, Link, useLocation } from 'react-router';

import { ComponentsPage } from '@/app/routes/components';
import { DesignSystemPage } from '@/app/routes/design-system';
import { FormsPage } from '@/app/routes/forms';
import { I18nPage } from '@/app/routes/i18n';
import { HomePage } from '@/app/routes/index';
import { ThemingPage } from '@/app/routes/theming';
import { setupI18n } from '@/config/i18n';
import { warmStudioPreset } from '@/config/theme-presets';

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`px-3 pb-px text-sm transition-colors ${
        isActive
          ? 'text-foreground border-primary border-b-2 font-medium'
          : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      {children}
    </Link>
  );
}

function Navigation() {
  const { t } = useTranslation();

  return (
    <nav className="border-primary/20 bg-card border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="font-display text-foreground text-xl font-bold italic">SaaS Core</span>
            <span className="font-display text-muted-foreground text-xl font-light">
              &nbsp;Playground
            </span>
          </div>
          <div className="flex items-center gap-1">
            <NavLink to="/">{t('nav.home')}</NavLink>
            <NavLink to="/components">{t('nav.components')}</NavLink>
            <NavLink to="/design-system">Design System</NavLink>
            <NavLink to="/forms">{t('nav.forms')}</NavLink>
            <NavLink to="/theming">{t('nav.theming')}</NavLink>
            <NavLink to="/i18n">{t('nav.i18n')}</NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

export function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setupI18n().then(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <ThemeProvider presets={[warmStudioPreset]} defaultConfig={{ activePreset: 'default' }}>
      <CurrencyProvider>
        <TooltipProvider>
          <div className="bg-background text-foreground min-h-screen">
            <Navigation />
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/components" element={<ComponentsPage />} />
                <Route path="/design-system" element={<DesignSystemPage />} />
                <Route path="/forms" element={<FormsPage />} />
                <Route path="/theming" element={<ThemingPage />} />
                <Route path="/i18n" element={<I18nPage />} />
              </Routes>
            </main>
          </div>
        </TooltipProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
}
