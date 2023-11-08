export interface Asset {
  image: File;
  text: string;
}

export interface Task {
  task_uuid: string;
  task_condition: string;
  task_image?: string;
  criteria: string;
  max_ball: number;
  format: string;
}

export interface TaskList {
  list_uuid: string;
  list_name: string;
  task_count: number;
  deadline: string;
  appreciable: boolean;
  time_limit: number;
  replay: boolean;
  see_answers: boolean;
  see_criteria: boolean;
}

export interface TaskWithAnswer extends Task {
  answer: string;
}

export const mockedTask = {
  task_condition: 'Решите пример: 2 + 2',
  format: 'Текстовый формат',
  criteria: 'Нельзя ползьзоваться калькулятором',
  max_ball: 10,
  assets: null,
  task_answer: '',
  answer: 'task',
  task_image: null,
  task_uuid: '123',
};
