import { Button } from '@saas-core/core-ui/components/button';
import { Tabs, TabsList, TabsTrigger } from '@saas-core/core-ui/components/tabs';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

import { DailyView } from '@/features/tasks/DailyView';
import { addDays, addMonths, subDays, subMonths } from '@/features/tasks/dateUtils';
import { MonthlyView } from '@/features/tasks/MonthlyView';
import { TaskForm } from '@/features/tasks/TaskForm';
import type { ViewMode } from '@/features/tasks/types';
import { useTasks } from '@/features/tasks/useTasks';
import { WeeklyView } from '@/features/tasks/WeeklyView';

export function PlannerPage() {
  const store = useTasks();
  const [view, setView] = useState<ViewMode>('daily');
  const [anchor, setAnchor] = useState(() => new Date());
  const [quickOpen, setQuickOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'n' && !e.metaKey && !e.ctrlKey) {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
        e.preventDefault();
        setQuickOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const step = (dir: -1 | 1) => {
    if (view === 'daily') setAnchor((d) => (dir === 1 ? addDays(d, 1) : subDays(d, 1)));
    else if (view === 'weekly') setAnchor((d) => (dir === 1 ? addDays(d, 7) : subDays(d, 7)));
    else setAnchor((d) => (dir === 1 ? addMonths(d, 1) : subMonths(d, 1)));
  };

  return (
    <main className="relative mx-auto min-h-screen max-w-[1400px] px-6 pb-24 pt-8 sm:px-10 lg:px-16">
      {/* Top bar */}
      <div className="relative z-10 mb-6 flex items-center justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <span className="font-display text-3xl italic leading-none">planner</span>
          <span className="text-muted-foreground/70 font-mono text-[10px] uppercase tracking-[0.2em]">
            est. 2026
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Tabs value={view} onValueChange={(v) => setView(v as ViewMode)}>
            <TabsList variant="line" className="bg-transparent p-0">
              <TabsTrigger
                value="daily"
                className="font-mono text-[10px] uppercase tracking-[0.2em]"
              >
                Dia
              </TabsTrigger>
              <TabsTrigger
                value="weekly"
                className="font-mono text-[10px] uppercase tracking-[0.2em]"
              >
                Semana
              </TabsTrigger>
              <TabsTrigger
                value="monthly"
                className="font-mono text-[10px] uppercase tracking-[0.2em]"
              >
                Mês
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="bg-border/60 mx-2 h-5 w-px" />

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => step(-1)}
              className="size-8 rounded-sm"
              aria-label="Anterior"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAnchor(new Date())}
              className="h-8 rounded-sm px-2 font-mono text-[10px] uppercase tracking-[0.2em]"
            >
              Hoje
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => step(1)}
              className="size-8 rounded-sm"
              aria-label="Próximo"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>

          <Button
            onClick={() => setQuickOpen(true)}
            className="ml-1 h-8 rounded-sm text-[12px]"
            size="sm"
          >
            <Plus className="size-3.5" /> Nova tarefa
          </Button>
        </div>
      </div>

      <div className="rule mb-2" />

      {view === 'daily' && <DailyView date={anchor} store={store} />}
      {view === 'weekly' && (
        <WeeklyView
          anchor={anchor}
          store={store}
          onPickDay={(d) => {
            setAnchor(d);
            setView('daily');
          }}
        />
      )}
      {view === 'monthly' && (
        <MonthlyView
          anchor={anchor}
          store={store}
          onPickDay={(d) => {
            setAnchor(d);
            setView('daily');
          }}
        />
      )}

      <TaskForm
        open={quickOpen}
        onOpenChange={setQuickOpen}
        defaultDate={anchor}
        onSubmit={(data) => store.addTask(data)}
      />
    </main>
  );
}
