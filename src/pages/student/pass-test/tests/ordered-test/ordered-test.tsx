import { Box, FormControlLabel, FormGroup, TextareaAutosize, TextField } from '@mui/material';
import { Typography } from 'common/typography/typography.tsx';
import { FC } from 'react';
import { ConvertedCompareOption, TestIndexOption, TestOption } from 'types/task.ts';

const DEFAULT_CLASSNAME = 'task-pass-card';

type OrderedTestProps = {
  options?: TestOption[] | TestIndexOption[] | ConvertedCompareOption[];
  text?: string;
  isViewMode?: boolean;

  handleIndexOptionChange?: (index: number, field: string, value: string) => void;
};

export const OrderedTest: FC<OrderedTestProps> = (props) => {
  const { text = '', options = [], isViewMode = false, handleIndexOptionChange = () => {} } = props;

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
              <TextField
                placeholder={'Введите значение'}
                style={{ color: '#6750a4' }}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                value={option.correctIndex}
                onChange={(e) => handleIndexOptionChange(index, 'correctIndex', e.target.value)}
              />
            }
          />
          <TextareaAutosize disabled placeholder={'Введите вариант ответа'} value={option.text} />
        </Box>
      ))}
    </FormGroup>
  );
};
