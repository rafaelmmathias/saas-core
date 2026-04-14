import { CurrencyProvider } from '@saas-core/core/currency';
import { NavBar } from '@saas-core/core-ui/components/composite/navbar';
import type { NavItem, RenderLink } from '@saas-core/core-ui/components/composite/navbar';
import { TooltipProvider } from '@saas-core/core-ui/components/tooltip';
import { useResponsive } from '@saas-core/core-ui/hooks/useResponsive';
import { ThemeProvider } from '@saas-core/core-ui/theme';
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

function Navigation() {
  const { t } = useTranslation();
  const location = useLocation();

  const items: NavItem[] = [
    { id: 'home', href: '/', label: t('nav.home'), isActive: location.pathname === '/' },
    {
      id: 'components',
      href: '/components',
      label: t('nav.components'),
      isActive: location.pathname === '/components',
    },
    {
      id: 'design',
      href: '/design-system',
      label: 'Design System',
      isActive: location.pathname === '/design-system',
    },
    {
      id: 'forms',
      href: '/forms',
      label: t('nav.forms'),
      isActive: location.pathname === '/forms',
    },
    {
      id: 'theming',
      href: '/theming',
      label: t('nav.theming'),
      isActive: location.pathname === '/theming',
    },
    { id: 'i18n', href: '/i18n', label: t('nav.i18n'), isActive: location.pathname === '/i18n' },
  ];

  const renderLink: RenderLink = (item, { className, onClick }) => (
    <Link key={item.id} to={item.href!} className={className} onClick={onClick}>
      {item.label}
    </Link>
  );

  const brand = (
    <>
      <span className="font-display text-foreground text-xl font-bold italic">SaaS Core</span>
      <span className="font-display text-muted-foreground text-xl font-light">
        &nbsp;Playground
      </span>
    </>
  );
  const { down, isTablet } = useResponsive();
  const maxItems = down('md') || isTablet ? 3 : undefined;
  return <NavBar brand={brand} items={items} renderLink={renderLink} maxItems={maxItems} />;
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
