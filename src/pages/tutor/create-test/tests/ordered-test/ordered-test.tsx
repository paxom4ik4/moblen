import {
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  TextareaAutosize,
  TextField,
} from '@mui/material';
import RemoveIcon from 'components/task-card/close_icon.svg';
import { Dispatch, FC, SetStateAction } from 'react';
import { TestIndexOption } from 'types/task.ts';

type OrderedTestProps = {
  indexOptions?: TestIndexOption[];

  setIsEditMode?: Dispatch<SetStateAction<boolean>>;

  isEditMode?: boolean;
  isCreateMode?: boolean;

  handleIndexOptionChange?: (index: number, field: string, value: string) => void;
  handleIndexRemoveOption?: (index: number) => void;
  handleIndexAddOption?: () => void;
};

const DEFAULT_CLASSNAME = 'task-card';

export const OrderedTest: FC<OrderedTestProps> = (props) => {
  const {
    indexOptions = [],
    isCreateMode = false,
    isEditMode = false,
    setIsEditMode = () => {},
    handleIndexOptionChange = () => {},
    handleIndexRemoveOption = () => {},
    handleIndexAddOption = () => {},
  } = props;

  const formItemDisabled = !isEditMode && !isCreateMode;

  return (
    <div className={`${DEFAULT_CLASSNAME}_test_content`} onClick={() => setIsEditMode(true)}>
      <FormGroup>
        {indexOptions.map((option, index) => (
          <Box
            width={'100%'}
            key={index}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={1}>
            <FormControlLabel
              disabled={formItemDisabled}
              label={''}
              control={
                <TextField
                  disabled={formItemDisabled}
                  placeholder={'Введите значение'}
                  style={{ color: '#6750a4' }}
                  value={option.correctIndex}
                  onChange={(e) => handleIndexOptionChange(index, 'correctIndex', e.target.value)}
                />
              }
            />
            <TextareaAutosize
              disabled={formItemDisabled}
              placeholder={'Введите вариант ответа'}
              value={option.text}
              onChange={(e) => handleIndexOptionChange(index, 'text', e.target.value)}
            />

            <Button disabled={formItemDisabled} onClick={() => handleIndexRemoveOption(index)}>
              <RemoveIcon />
            </Button>
          </Box>
        ))}
      </FormGroup>
      {!formItemDisabled && (
        <Button className={`${DEFAULT_CLASSNAME}_test_content_add`} onClick={handleIndexAddOption}>
          + Добавить вариант
        </Button>
      )}
    </div>
  );
};
