import { CompareOption, TaskWithAnswer } from './task.ts';

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
