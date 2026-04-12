import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@saas-core/core/helpers';
import { Button } from '@saas-core/core-ui/components/button';
import { Checkbox } from '@saas-core/core-ui/components/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@saas-core/core-ui/components/popover';
import { GripVertical, MessageSquare, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

import type { Task } from './types';

type Props = {
  task: Task;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onEdit: (task: Task) => void;
  onNoteChange: (id: string, note: string) => void;
};

export function TaskItem({ task, onToggle, onRemove, onEdit, onNoteChange }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });
  const [draftNote, setDraftNote] = useState(task.note ?? '');

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group/item relative flex items-start gap-3 border-b py-3 pr-2 transition-colors',
        'border-border/60 hover:bg-accent/30',
        isDragging && 'opacity-40',
      )}
    >
      <button
        type="button"
        aria-label="Arrastar"
        className="text-muted-foreground/30 hover:text-muted-foreground mt-1 cursor-grab touch-none opacity-0 transition-opacity active:cursor-grabbing group-hover/item:opacity-100"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" />
      </button>

      <Checkbox
        checked={task.done}
        onCheckedChange={() => onToggle(task.id)}
        className="mt-1.5 size-[18px] rounded-full border-[1.5px]"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-3">
          <p
            className={cn(
              'truncate text-[15px] leading-tight tracking-tight',
              task.done && 'text-muted-foreground line-through decoration-[1.5px]',
            )}
          >
            {task.title}
          </p>
          {task.time && (
            <span className="text-muted-foreground shrink-0 font-mono text-[11px] tracking-wider">
              {task.time}
            </span>
          )}
        </div>
        {task.note && !task.done && (
          <p className="text-muted-foreground mt-1 line-clamp-2 text-[13px] italic leading-snug">
            {task.note}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover/item:opacity-100">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'text-muted-foreground size-7',
                task.note && 'text-primary opacity-100',
              )}
              aria-label="Observação"
            >
              <MessageSquare className="size-3.5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-72 p-3">
            <label className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.15em]">
              Observação
            </label>
            <textarea
              value={draftNote}
              onChange={(e) => setDraftNote(e.target.value)}
              onBlur={() => onNoteChange(task.id, draftNote.trim())}
              rows={4}
              placeholder="Um pensamento, contexto, lembrete…"
              className="border-border focus:border-primary mt-2 w-full resize-none rounded-sm border bg-transparent p-2 text-[13px] italic leading-snug outline-none"
            />
          </PopoverContent>
        </Popover>

        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground size-7"
          onClick={() => onEdit(task)}
          aria-label="Editar"
        >
          <Pencil className="size-3.5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive size-7"
          onClick={() => onRemove(task.id)}
          aria-label="Excluir"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
