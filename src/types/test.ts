import { TaskWithAnswer } from './task.ts';
import { CompareOption } from '../components/task-card/task-card.tsx';

export interface Test {
  id: string;
  name: string;
  subject: string;
  topic: string;
  status: 'pending' | 'done';
  tasks: TaskWithAnswer[];
}

export interface CompareState {
  leftOptions: CompareOption[];
  rightOptions: CompareOption[];
}
