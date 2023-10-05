export interface Asset {
  image: File;
  text: string;
}

export interface Task {
  taskText: string;
  format: string;
  criteria: string;
  maxScore: string;
  assets?: Asset[];
}

export interface TaskWithAnswer extends Task {
  answer: string;
}

export const mockedTask = {
  taskText: 'Решите пример: 2 + 2',
  format: 'standard',
  criteria: 'Нельзя ползьзоваться калькулятором',
  maxScore: '10',
  answer: 'Ответ Студента',
  assets: [],
};
