import { ConvertedCompareOption, TestIndexOption, TestOption } from 'types/task.ts';
import { CompareOption } from 'components/task-card/task-card.tsx';

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

export const convertCompareOptions = (
  leftOptions: CompareOption[],
  rightOptions: CompareOption[],
): ConvertedCompareOption[] => {
  const convertedLeftOption = leftOptions.map((item) => ({
    text: item.text,
    index: `${item.index}`,
  }));

  const convertedRightOptions = rightOptions.map((item) => ({
    text: item.text,
    index: `${String.fromCharCode(64 + item.index)}`,
    connected: item?.connected?.map((item) => `${item}`).join(' ') ?? '',
  }));

  return [...convertedLeftOption, ...convertedRightOptions];
};

export const convertTestOptionsToCompareCriteria = (options: CompareOption[]): string => {
  const convertedOption = options.map((item) => ({
    text: item.text,
    index: `${String.fromCharCode(64 + item.index)}`,
    connected: item?.connected?.map((item) => `${item}`).join(' ') ?? '',
  }));

  const criteria: string[] = [];

  convertedOption.forEach((option) => {
    const connections = option.connected.split(' ');

    criteria.push(connections.map((item) => `${item}${option.index}`).join(' '));
  });

  return criteria.join(' ');
};
