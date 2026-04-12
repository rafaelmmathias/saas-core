import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Button } from '@saas-core/core-ui/components/button';
import { ArrowDownToLine } from 'lucide-react';
import { useMemo, useState } from 'react';

import { ISO, fmtFullDate, fmtWeekday, isToday } from './dateUtils';
import { TaskForm } from './TaskForm';
import { TaskItem } from './TaskItem';
import type { Task } from './types';
import type { UseTasks } from './useTasks';

type Props = {
  date: Date;
  store: UseTasks;
};

export function DailyView({ date, store }: Props) {
  const [editing, setEditing] = useState<Task | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const dayTasks = store.byDay(date);
  const withTime = dayTasks.filter((t) => t.time);
  const withoutTime = dayTasks.filter((t) => !t.time);
  const undated = store.undatedTasks;
  const pending = useMemo(() => (isToday(date) ? store.pendingBefore(date) : []), [date, store]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const ids = dayTasks.map((t) => t.id);
    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;
    const reordered = [...ids];
    reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, String(active.id));
    store.reorder(reordered);
  };

  const openEdit = (t: Task) => {
    setEditing(t);
    setFormOpen(true);
  };

  const handleSubmit = (data: { title: string; date?: string; time?: string; note?: string }) => {
    if (editing) {
      store.updateTask(editing.id, data);
      setEditing(null);
    } else {
      store.addTask({ ...data });
    }
  };

  const completedCount = dayTasks.filter((t) => t.done).length;

  return (
    <section className="mx-auto max-w-3xl">
      {/* Masthead */}
      <header className="relative pb-10 pt-6">
        <div className="text-muted-foreground flex items-baseline gap-3 font-mono text-[10px] uppercase tracking-[0.2em]">
          <span>№ {fmtWeekday(date)}</span>
          <div className="rule flex-1" />
          <span>
            {completedCount.toString().padStart(2, '0')} /{' '}
            {dayTasks.length.toString().padStart(2, '0')}
          </span>
        </div>
        <h1 className="font-display mt-3 text-[clamp(3.5rem,10vw,6.5rem)] italic leading-[0.92] tracking-tight">
          {fmtFullDate(date)
            .split(' de ')
            .map((part, i) =>
              i === 0 ? (
                <span key={i}>{part}</span>
              ) : (
                <span
                  key={i}
                  className="text-muted-foreground/70 ml-3 font-sans text-[0.3em] font-light uppercase not-italic tracking-[0.2em]"
                >
                  {part}
                </span>
              ),
            )}
        </h1>
      </header>

      {pending.length > 0 && (
        <div className="border-primary/30 bg-primary/[0.04] mb-6 flex items-center justify-between gap-4 border-l-2 px-4 py-3">
          <div className="flex items-start gap-3">
            <ArrowDownToLine className="text-primary mt-0.5 size-4" />
            <div>
              <p className="text-[13px]">
                <span className="text-primary font-mono font-medium">{pending.length}</span>{' '}
                {pending.length === 1 ? 'tarefa pendente' : 'tarefas pendentes'} de dias anteriores.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground rounded-sm"
            onClick={() => store.rolloverPendingTo(ISO(date))}
          >
            Mover para hoje
          </Button>
        </div>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={dayTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {withTime.length > 0 && (
            <Section label="Agendadas">
              {withTime.map((t) => (
                <TaskItem
                  key={t.id}
                  task={t}
                  onToggle={store.toggleDone}
                  onRemove={store.removeTask}
                  onEdit={openEdit}
                  onNoteChange={(id, note) => store.updateTask(id, { note })}
                />
              ))}
            </Section>
          )}
          {withoutTime.length > 0 && (
            <Section label="Sem horário">
              {withoutTime.map((t) => (
                <TaskItem
                  key={t.id}
                  task={t}
                  onToggle={store.toggleDone}
                  onRemove={store.removeTask}
                  onEdit={openEdit}
                  onNoteChange={(id, note) => store.updateTask(id, { note })}
                />
              ))}
            </Section>
          )}
        </SortableContext>
      </DndContext>

      {undated.length > 0 && (
        <Section label="Sem data" muted>
          {undated.map((t) => (
            <TaskItem
              key={t.id}
              task={t}
              onToggle={store.toggleDone}
              onRemove={store.removeTask}
              onEdit={openEdit}
              onNoteChange={(id, note) => store.updateTask(id, { note })}
            />
          ))}
        </Section>
      )}

      {dayTasks.length === 0 && undated.length === 0 && (
        <div className="py-16 text-center">
          <p className="font-display text-muted-foreground/70 text-2xl italic">Um dia em branco.</p>
          <p className="text-muted-foreground mt-2 text-sm">
            Pressione <kbd className="bg-muted rounded px-1.5 py-0.5 font-mono text-[11px]">N</kbd>{' '}
            ou clique em <em className="not-italic">Nova tarefa</em> para começar.
          </p>
        </div>
      )}

      <TaskForm
        open={formOpen}
        onOpenChange={(o) => {
          setFormOpen(o);
          if (!o) setEditing(null);
        }}
        initial={editing ?? undefined}
        defaultDate={date}
        onSubmit={handleSubmit}
      />
    </section>
  );
}

function Section({
  label,
  muted,
  children,
}: {
  label: string;
  muted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <div className="mb-2 flex items-baseline gap-3">
        <span
          className={
            muted
              ? 'text-muted-foreground/60 font-mono text-[10px] uppercase tracking-[0.2em]'
              : 'text-muted-foreground font-mono text-[10px] uppercase tracking-[0.2em]'
          }
        >
          {label}
        </span>
        <div className="rule flex-1" />
      </div>
      <div>{children}</div>
    </div>
  );
}
