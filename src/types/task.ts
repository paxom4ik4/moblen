export interface Asset {
  image: File;
  text: string;
}
export interface Task {
  criteria: string;
  format: string;
  max_ball: number;
  task_answer?: string;
  task_condition: string;
  task_image: null;
  task_uuid: string;
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
