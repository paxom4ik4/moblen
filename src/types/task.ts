export interface Task {
  task_uuid: string;
  task_condition: string;
  task_image?: string;
  criteria: string;
  max_ball: number;
  format: string;
  files?: { file_name: string; url: string }[];
  variants?: null | TestOption[] | TestIndexOption[] | ConvertedCompareOption[];
}

export interface CompletedTask {
  answer: string;
  response: string;
  score: string;
  task: Task;
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
  status: [string, number?, number?];
  sent_data?: string;
}

export interface TaskWithAnswer extends Task {
  answer: string;
}

export interface GenerateTaskPayload {
  text: string;
  subject: string;
  task_format: string;
  max_score: number;
  task_count: number;
}

export interface TestOption {
  text: string;
  isCorrect: boolean;
}

export interface TestIndexOption {
  text: string;
  correctIndex: string;
}

export interface CompareOption {
  index: number;
  text: string;
  connected?: number[];
}

export interface ConvertedCompareOption {
  text: string;
  index: string;
  connected?: string;
}
