export type Task = {
  id: string;
  title: string;
  date?: string;
  time?: string;
  done: boolean;
  note?: string;
  order: number;
  createdAt: string;
};

export type ViewMode = 'daily' | 'weekly' | 'monthly';
