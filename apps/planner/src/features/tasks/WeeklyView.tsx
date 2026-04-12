import { cn } from '@saas-core/core/helpers';

import { fmtDay, fmtMonthYear, fmtWeekdayShort, isToday, weekRange } from './dateUtils';
import type { UseTasks } from './useTasks';

type Props = {
  anchor: Date;
  store: UseTasks;
  onPickDay: (d: Date) => void;
};

export function WeeklyView({ anchor, store, onPickDay }: Props) {
  const { days } = weekRange(anchor);

  return (
    <section className="mx-auto max-w-6xl">
      <header className="pb-8 pt-6">
        <div className="text-muted-foreground flex items-baseline gap-3 font-mono text-[10px] uppercase tracking-[0.2em]">
          <span>Semana</span>
          <div className="rule flex-1" />
          <span>{fmtMonthYear(anchor)}</span>
        </div>
      </header>

      <div className="border-border/60 bg-border/60 grid grid-cols-1 gap-px border sm:grid-cols-7">
        {days.map((d) => {
          const tasks = store.byDay(d);
          const done = tasks.filter((t) => t.done).length;
          const today = isToday(d);
          return (
            <button
              key={d.toISOString()}
              onClick={() => onPickDay(d)}
              className={cn(
                'group/day bg-background hover:bg-accent/30 flex min-h-[180px] flex-col p-3 text-left transition-colors',
                today && 'bg-accent/40',
              )}
            >
              <div className="flex items-baseline justify-between">
                <span className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.15em]">
                  {fmtWeekdayShort(d)}
                </span>
                <span
                  className={cn(
                    'font-display text-3xl italic leading-none',
                    today ? 'text-primary' : 'text-foreground',
                  )}
                >
                  {fmtDay(d)}
                </span>
              </div>

              <div className="mt-3 flex-1 space-y-1.5">
                {tasks.slice(0, 5).map((t) => (
                  <div
                    key={t.id}
                    className={cn(
                      'flex items-center gap-1.5 text-[11px] leading-tight',
                      t.done && 'text-muted-foreground line-through',
                    )}
                  >
                    <span
                      className={cn(
                        'size-1 shrink-0 rounded-full',
                        t.done ? 'bg-muted-foreground' : 'bg-primary',
                      )}
                    />
                    <span className="truncate">{t.title}</span>
                  </div>
                ))}
                {tasks.length > 5 && (
                  <div className="text-muted-foreground/70 font-mono text-[10px]">
                    +{tasks.length - 5}
                  </div>
                )}
              </div>

              {tasks.length > 0 && (
                <div className="border-border/50 mt-2 border-t pt-2">
                  <span className="text-muted-foreground font-mono text-[10px] tracking-wider">
                    {done.toString().padStart(2, '0')} / {tasks.length.toString().padStart(2, '0')}
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
