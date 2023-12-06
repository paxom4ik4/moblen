import { Box, Checkbox, FormControlLabel, FormGroup, TextareaAutosize } from '@mui/material';
import { Typography } from 'common/typography/typography.tsx';
import { FC } from 'react';
import { ConvertedCompareOption, TestIndexOption, TestOption } from 'types/task.ts';

const DEFAULT_CLASSNAME = 'task-pass-card';

type UnorderedTestProps = {
  options?: TestOption[] | TestIndexOption[] | ConvertedCompareOption[];
  text?: string;
  isViewMode?: boolean;

  handleOptionChange?: (index: number, field: string, value: boolean) => void;
};

export const UnorderedTest: FC<UnorderedTestProps> = (props) => {
  const { text = '', options = [], isViewMode = false, handleOptionChange = () => {} } = props;

  return (
    <FormGroup className={`${DEFAULT_CLASSNAME}_test_content`}>
      <Typography className={`${DEFAULT_CLASSNAME}_test_content_task`}>{text}</Typography>

      {options?.map((option, index) => (
        <Box
          width={'100%'}
          key={index}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={1}>
          <FormControlLabel
            label={''}
            disabled={isViewMode}
            control={
              <Checkbox
                style={{ color: '#6750a4' }}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                checked={option.isCorrect}
                onChange={(e) => handleOptionChange(index, 'isCorrect', e.target.checked)}
              />
            }
          />
          <TextareaAutosize disabled placeholder={'Введите вариант ответа'} value={option.text} />
        </Box>
      ))}
    </FormGroup>
  );
};
