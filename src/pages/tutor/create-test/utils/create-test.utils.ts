import { TaskCreatePayload } from 'services/tasks';
import {
  COMPARE_TEST_FORMAT,
  TEST_FORMAT,
  TEST_FORMAT_WITH_INDEX,
} from 'constants/testTaskFormats.ts';
import {
  convertCompareOptions,
  convertTestOptionsToCompareCriteria,
  convertTestOptionsToCriteria,
  convertTestOptionsToOrderedCriteria,
} from '../utils.ts';
import { TestIndexOption, TestOption } from 'types/task.ts';
import { CompareState } from 'types/test.ts';

export const createTaskPayload = (
  newTaskFormat: string = '',
  taskFormats: { subject: string; formats: string[] }[],
  newTaskText: string = '',
  newTaskMaxScore: number = 0,
  newTaskCriteria: string = '',

  options: TestOption[] = [],
  indexOptions: TestIndexOption[] = [],
  compareTestState: CompareState = { leftOptions: [], rightOptions: [] },
) => {
  const data: TaskCreatePayload = {
    format: newTaskFormat.length
      ? newTaskFormat
      : `${taskFormats[0].subject},${taskFormats[0].formats[0]}`,
    max_ball: newTaskMaxScore?.toString() ?? '0',
    task_condition: newTaskText.length ? newTaskText : '-',
  };

  if (
    !newTaskFormat.includes(TEST_FORMAT) &&
    !newTaskFormat.includes(TEST_FORMAT_WITH_INDEX) &&
    !newTaskFormat.includes(COMPARE_TEST_FORMAT)
  ) {
    data['criteria'] = newTaskCriteria.length ? newTaskCriteria : '-';
  }

  if (newTaskFormat.includes(TEST_FORMAT)) {
    data['variants'] = options;
    data['criteria'] = convertTestOptionsToCriteria(options);
  }

  if (newTaskFormat.includes(TEST_FORMAT_WITH_INDEX)) {
    data['variants'] = indexOptions;
    data['criteria'] = convertTestOptionsToOrderedCriteria(indexOptions);
  }

  if (newTaskFormat.includes(COMPARE_TEST_FORMAT)) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    data['variants'] = convertCompareOptions(
      compareTestState.leftOptions,
      compareTestState.rightOptions,
    );
    data['criteria'] = convertTestOptionsToCompareCriteria(compareTestState.rightOptions);
  }

  return data;
};

export const createFormDataTaskPayload = (
  newTaskFormat: string = '',
  taskFormats: { subject: string; formats: string[] }[],
  newTaskText: string = '',
  newTaskMaxScore: number = 0,
  newTaskCriteria: string = '',

  options: TestOption[] = [],
  indexOptions: TestIndexOption[] = [],
  compareTestState: CompareState = { leftOptions: [], rightOptions: [] },
  newTaskAssets: File[] = [],
) => {
  const data = new FormData();

  data.append(
    'format',
    newTaskFormat.length ? newTaskFormat : `${taskFormats[0].subject},${taskFormats[0].formats[0]}`,
  );

  data.append('max_ball', newTaskMaxScore?.toString() ?? '0');
  data.append('task_condition', newTaskText.length ? newTaskText : '-');

  if (
    !newTaskFormat.includes(TEST_FORMAT) &&
    !newTaskFormat.includes(TEST_FORMAT_WITH_INDEX) &&
    !newTaskFormat.includes(COMPARE_TEST_FORMAT)
  ) {
    data.append('criteria', newTaskCriteria.length ? newTaskCriteria : '-');
  }

  if (newTaskFormat.includes(TEST_FORMAT)) {
    data.append('variants', JSON.stringify(options));
    data.append('criteria', convertTestOptionsToCriteria(options));
  }

  if (newTaskFormat.includes(TEST_FORMAT_WITH_INDEX)) {
    data.append('variants', JSON.stringify(indexOptions));
    data.append('criteria', convertTestOptionsToOrderedCriteria(indexOptions));
  }

  if (newTaskFormat.includes(COMPARE_TEST_FORMAT)) {
    data.append(
      'variants',
      JSON.stringify(
        convertCompareOptions(compareTestState.leftOptions, compareTestState.rightOptions),
      ),
    );
    data.append('criteria', convertTestOptionsToCompareCriteria(compareTestState.rightOptions));
  }

  Array.from(newTaskAssets).forEach((item) => {
    data.append('files', item);
  });

  return data;
};
