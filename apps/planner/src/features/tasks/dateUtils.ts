import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isToday,
  parseISO,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const ISO = (d: Date) => format(d, 'yyyy-MM-dd');
export const fromISO = (s: string) => parseISO(s);

export const fmtWeekday = (d: Date) => format(d, 'EEEE', { locale: ptBR });
export const fmtWeekdayShort = (d: Date) => format(d, 'EEE', { locale: ptBR });
export const fmtDay = (d: Date) => format(d, 'd');
export const fmtMonth = (d: Date) => format(d, 'MMMM', { locale: ptBR });
export const fmtMonthYear = (d: Date) => format(d, "MMMM 'de' yyyy", { locale: ptBR });
export const fmtFullDate = (d: Date) => format(d, "d 'de' MMMM 'de' yyyy", { locale: ptBR });

export const weekRange = (anchor: Date) => {
  const start = startOfWeek(anchor, { weekStartsOn: 1 });
  const end = endOfWeek(anchor, { weekStartsOn: 1 });
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) days.push(addDays(start, i));
  return { start, end, days };
};

export const monthMatrix = (anchor: Date) => {
  const first = startOfMonth(anchor);
  const last = endOfMonth(anchor);
  const gridStart = startOfWeek(first, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(last, { weekStartsOn: 1 });
  const days: Date[] = [];
  let cursor = gridStart;
  while (cursor <= gridEnd) {
    days.push(cursor);
    cursor = addDays(cursor, 1);
  }
  return { first, last, days };
};

export {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isToday,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
};
