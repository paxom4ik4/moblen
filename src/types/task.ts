export interface Asset {
  image: File;
  text: string;
}

export interface Task {
  taskText: string;
  format: 'standard';
  criteria: string;
  maxScore: string;
  assets?: Asset[];
}

