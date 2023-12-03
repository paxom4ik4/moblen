import { TestIndexOption, TestOption } from 'types/task.ts';

export const convertTestOptionsToCriteria = (options: TestOption[]): string => {
  const correctOptions = options
    .map((item, index) => (item.isCorrect ? index + 1 : null))
    .filter(Boolean);

  return correctOptions.join(' ');
};

export const convertTestOptionsToOrderedCriteria = (options: TestIndexOption[]): string => {
  const correctOptions = options.map((item) => item.correctIndex);

  return correctOptions.join(' ');
};
