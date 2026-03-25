import { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ThemeProvider } from '@saas-core/core/theme';
import { CurrencyProvider } from '@saas-core/core/currency';
import { TooltipProvider } from '@saas-core/core-ui';

import { setupI18n } from '@/config/i18n';
import { warmStudioPreset } from '@/config/theme-presets';
import { HomePage } from '@/app/routes/index';
import { ComponentsPage } from '@/app/routes/components';
import { FormsPage } from '@/app/routes/forms';
import { ThemingPage } from '@/app/routes/theming';
import { I18nPage } from '@/app/routes/i18n';

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`px-3 pb-px text-sm transition-colors ${
        isActive
          ? 'text-foreground font-medium border-b-2 border-primary'
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
    <nav className="border-b border-primary/20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-1">
            <span className="font-display text-xl font-bold italic text-foreground">
              SaaS Core
            </span>
            <span className="font-display text-xl text-muted-foreground font-light">
              &nbsp;Playground
            </span>
          </div>
          <div className="flex items-center gap-1">
            <NavLink to="/">{t('nav.home')}</NavLink>
            <NavLink to="/components">{t('nav.components')}</NavLink>
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
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <ThemeProvider
      presets={[warmStudioPreset]}
      defaultConfig={{ activePreset: 'warm-studio' }}
    >
      <CurrencyProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-background text-foreground">
            <Navigation />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/components" element={<ComponentsPage />} />
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
