import { CompareOption, ConvertedCompareOption, TestIndexOption, TestOption } from 'types/task.ts';

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
 
  const convertedLeftOption = leftOptions.map((item: CompareOption) => {
    return({
      text: item.text,
      index: `${item.index}`,
      isLeft: true
    })
  });

  const convertedRightOptions = rightOptions.map((item) => {
    
    return({
      text: item.text,
      index: `${item.index}`,
      connected: item.connected!.map((item) => `${item}`).join(' ') ?? '',
      isLeft: false
    })
  });

  return [...convertedLeftOption, ...convertedRightOptions];
};

export const convertTestOptionsToCompareCriteria = (options: CompareOption[]): string => {
  const convertedOption = options?.map((item) => ({
    text: item.text,
    index: `${item.index}`,
    connected: item?.connected?.map((item) => `${item}`).join(' ') ?? '',
  }));

  const criteria: string[] = [];

  convertedOption.forEach((option) => {
    const connections = option.connected.split(' ');

    criteria.push(connections.map((item) => `${item}${option.index}`).join(' '));
  });

  return criteria.join(' ');
};
