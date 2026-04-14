import { Button } from '@saas-core/core-ui/components/button';
import { TooltipProvider } from '@saas-core/core-ui/components/tooltip';
import { ThemeProvider, useTheme } from '@saas-core/core-ui/theme';
import { Moon, Sun } from 'lucide-react';
import { Route, Routes } from 'react-router';

import { PlannerPage } from '@/app/pages/PlannerPage';
import { editorialPreset } from '@/config/theme-presets';

function ThemeToggle() {
  const { mode, setMode } = useTheme();
  const isDark = mode === 'dark';
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setMode(isDark ? 'light' : 'dark')}
      className="fixed right-5 top-5 z-50 size-9 rounded-sm"
      aria-label="Alternar tema"
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}

export function App() {
  return (
    <ThemeProvider presets={[editorialPreset]} defaultConfig={{ activePreset: 'editorial' }}>
      <TooltipProvider>
        <div className="bg-background text-foreground min-h-screen">
          <ThemeToggle />
          <Routes>
            <Route path="/" element={<PlannerPage />} />
            <Route path="*" element={<PlannerPage />} />
          </Routes>
        </div>
      </TooltipProvider>
    </ThemeProvider>
  );
}
