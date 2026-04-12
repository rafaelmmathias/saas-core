import { cn } from '@saas-core/core/helpers';

import { fmtDay, fmtMonthYear, isToday, monthMatrix, startOfMonth } from './dateUtils';
import type { UseTasks } from './useTasks';

type Props = {
  anchor: Date;
  store: UseTasks;
  onPickDay: (d: Date) => void;
};

const WEEKDAYS = ['seg', 'ter', 'qua', 'qui', 'sex', 'sáb', 'dom'];

export function MonthlyView({ anchor, store, onPickDay }: Props) {
  const { days } = monthMatrix(anchor);
  const currentMonth = startOfMonth(anchor).getMonth();

  return (
    <section className="mx-auto max-w-6xl">
      <header className="pb-8 pt-6">
        <div className="text-muted-foreground flex items-baseline gap-3 font-mono text-[10px] uppercase tracking-[0.2em]">
          <span>Mês</span>
          <div className="rule flex-1" />
          <span className="font-display text-foreground text-lg normal-case italic tracking-normal">
            {fmtMonthYear(anchor)}
          </span>
        </div>
      </header>

      <div className="border-border/60 grid grid-cols-7 gap-px border-b pb-1">
        {WEEKDAYS.map((w) => (
          <div
            key={w}
            className="text-muted-foreground px-2 pb-2 font-mono text-[10px] uppercase tracking-[0.15em]"
          >
            {w}
          </div>
        ))}
      </div>

      <div className="bg-border/60 grid grid-cols-7 gap-px">
        {days.map((d) => {
          const tasks = store.byDay(d);
          const done = tasks.filter((t) => t.done).length;
          const pending = tasks.length - done;
          const outside = d.getMonth() !== currentMonth;
          const today = isToday(d);

          return (
            <button
              key={d.toISOString()}
              onClick={() => onPickDay(d)}
              className={cn(
                'bg-background hover:bg-accent/30 relative flex min-h-[96px] flex-col items-start p-2 text-left transition-colors',
                outside && 'bg-background/50 text-muted-foreground/50',
                today && 'bg-accent/40',
              )}
            >
              <span
                className={cn('font-display text-2xl italic leading-none', today && 'text-primary')}
              >
                {fmtDay(d)}
              </span>

              {tasks.length > 0 && (
                <div className="mt-auto flex w-full items-center gap-1.5 pt-2">
                  {pending > 0 && <span className="bg-primary size-1.5 rounded-full" />}
                  {done > 0 && <span className="bg-muted-foreground/40 size-1.5 rounded-full" />}
                  <span className="text-muted-foreground ml-auto font-mono text-[10px] tracking-wider">
                    {tasks.length}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
