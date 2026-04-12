import { Button } from '@saas-core/core-ui/components/button';
import { DatePicker } from '@saas-core/core-ui/components/date-picker';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@saas-core/core-ui/components/dialog';
import { Input } from '@saas-core/core-ui/components/input';
import { TimePicker } from '@saas-core/core-ui/components/time-picker';
import { useEffect, useState } from 'react';

import { ISO, fromISO } from './dateUtils';
import type { Task } from './types';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Partial<Task>;
  defaultDate?: Date;
  onSubmit: (data: { title: string; date?: string; time?: string; note?: string }) => void;
};

export function TaskForm({ open, onOpenChange, initial, defaultDate, onSubmit }: Props) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (!open) return;
    setTitle(initial?.title ?? '');
    setDate(initial?.date ?? (defaultDate ? ISO(defaultDate) : ''));
    setTime(initial?.time ?? '');
    setNote(initial?.note ?? '');
  }, [open, initial, defaultDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      date: date || undefined,
      time: time || undefined,
      note: note.trim() || undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border/70 bg-card max-w-md rounded-sm border shadow-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-3xl italic">
            {initial?.id ? 'Editar tarefa' : 'Nova tarefa'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          <div>
            <label className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.15em]">
              O quê
            </label>
            <Input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Descreva a tarefa…"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.15em]">
                Data
              </label>
              <DatePicker
                date={date ? fromISO(date) : undefined}
                onDateChange={(d) => setDate(d ? ISO(d) : '')}
                placeholder="Escolher data"
              />
            </div>
            <div>
              <label className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.15em]">
                Hora
              </label>
              <TimePicker
                value={time || undefined}
                onValueChange={(t) => setTime(t ?? '')}
                placeholder="Escolher hora"
                className="border-border/60 mt-1 h-9 rounded-sm font-mono text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.15em]">
              Observação
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Opcional"
              className="border-border/60 focus:border-primary mt-1 w-full resize-none rounded-sm border bg-transparent p-2 text-sm italic outline-none"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="rounded-sm">
              {initial?.id ? 'Salvar' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
