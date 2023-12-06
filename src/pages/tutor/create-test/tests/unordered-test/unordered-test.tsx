import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextareaAutosize,
} from '@mui/material';
import RemoveIcon from 'components/task-card/close_icon.svg';
import { Dispatch, FC, SetStateAction } from 'react';
import { TestOption } from 'types/task.ts';

const DEFAULT_CLASSNAME = 'task-card';

type UnorderedTestProps = {
  options?: TestOption[];

  isCreateMode?: boolean;
  isEditMode?: boolean;

  setIsEditMode?: Dispatch<SetStateAction<boolean>>;

  handleOptionChange?: (index: number, field: string, value: boolean | string) => void;
  handleRemoveOption?: (index: number) => void;
  handleAddOption?: () => void;
};

export const UnorderedTest: FC<UnorderedTestProps> = (props) => {
  const {
    options = [],
    isCreateMode = false,
    isEditMode = false,
    setIsEditMode = () => {},
    handleOptionChange = () => {},
    handleRemoveOption = () => {},
    handleAddOption = () => {},
  } = props;

  const formItemDisabled = !isCreateMode && !isEditMode;

  return (
    <div className={`${DEFAULT_CLASSNAME}_test_content`}>
      <FormGroup onClick={() => !isCreateMode && setIsEditMode(true)}>
        {options?.map((option, index) => (
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
                <Checkbox
                  disabled={formItemDisabled}
                  style={{ color: '#6750a4' }}
                  checked={option.isCorrect}
                  onChange={(e) => handleOptionChange(index, 'isCorrect', e.target.checked)}
                />
              }
            />
            <TextareaAutosize
              disabled={formItemDisabled}
              placeholder={'Введите вариант ответа'}
              value={option.text}
              onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
            />

            <Button disabled={formItemDisabled} onClick={() => handleRemoveOption(index)}>
              <RemoveIcon />
            </Button>
          </Box>
        ))}
      </FormGroup>
      {(isCreateMode || isEditMode) && (
        <Button className={`${DEFAULT_CLASSNAME}_test_content_add`} onClick={handleAddOption}>
          + Добавить вариант
        </Button>
      )}
    </div>
  );
};
