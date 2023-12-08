import { Dispatch, SetStateAction } from 'react';
import { SelectChangeEvent } from '@mui/material';
import { CompareOption, ConvertedCompareOption, TestIndexOption, TestOption } from 'types/task.ts';
import { CompareState } from 'types/test.ts';

export type CreateModeTaskCardProps = {
  disabled?: boolean;

  taskId?: string;
  taskListId: string;
  index?: number;

  isCreateMode: true;

  newTaskText: string;
  newTaskCriteria: string;
  newTaskFormat: string;
  newTaskMaxScore: number;
  newTaskAssets?: File[];

  setNewTaskText: Dispatch<SetStateAction<string>>;
  setNewTaskCriteria: Dispatch<SetStateAction<string>>;
  setNewTaskMaxScore: Dispatch<SetStateAction<number>>;
  setNewTaskAssets?: Dispatch<SetStateAction<File[]>>;
  handleFormatChange: (event: SelectChangeEvent) => void;

  newTaskAssetsTotalSize: number;
  setNewTaskAssetsTotalSize: Dispatch<SetStateAction<number>>;
  newTaskAssetsError: null | string;
  setNewTaskAssetsError: Dispatch<SetStateAction<null | string>>;

  saveNewTaskHandler: () => void;

  taskFormats?: {
    subject: string;
    formats: string[];
  }[];

  editModeDisabled?: boolean;

  hideAssets?: boolean;

  isNewTaskSaving?: boolean;

  setIsNewTask: Dispatch<SetStateAction<boolean>>;

  options?: TestOption[];
  indexOptions?: TestIndexOption[];
  compareOptions?: CompareOption[];

  setOptions: Dispatch<SetStateAction<TestOption[]>>;
  setIndexOptions: Dispatch<SetStateAction<TestIndexOption[]>>;

  compareTestState: CompareState;
  setCompareTestState: Dispatch<SetStateAction<CompareState>>;
};

export type TaskCardProps = {
  disabled?: boolean;

  isCreateMode: false;

  text: string;
  criteria: string;
  maxScore: number | null;
  format: string;
  editModeDisabled?: boolean;

  taskId?: string;
  taskListId: string;
  index?: number;

  files: { file_name: string; url: string }[];

  taskFormats?: {
    subject: string;
    formats: string[];
  }[];

  hideAssets?: boolean;

  options?: TestOption[];
  indexOptions?: TestIndexOption[];
  compareOptions?: ConvertedCompareOption[];
};
