import { Box, Button, FormGroup, MenuItem, Select, TextField } from '@mui/material';
import RemoveIcon from 'components/task-card/close_icon.svg';
import { Dispatch, FC, SetStateAction } from 'react';
import { CompareState } from 'types/test.ts';

const DEFAULT_CLASSNAME = 'task-card';

type CompareTaskProps = {
  isCreateMode?: boolean;
  isEditMode?: boolean;
  setIsEditMode?: Dispatch<SetStateAction<boolean>>;

  compareTestState?: CompareState;
  setCompareTestState?: Dispatch<SetStateAction<CompareState>>;

  handleRemoveCompareOption?: (index: number, side: 'left' | 'right') => void;
  handleAddCompareOption?: (side: 'left' | 'right') => void;
  handleLinkChange?: (index: number, linkedTo: number[], side: 'left' | 'right') => void;
};

export const CompareTask: FC<CompareTaskProps> = (props) => {
  const {
    isCreateMode = false,
    isEditMode = false,
    setIsEditMode = () => {},
    compareTestState = { leftOptions: [], rightOptions: [] },
    setCompareTestState = () => {},
    handleRemoveCompareOption = () => {},
    handleAddCompareOption = () => {},
    handleLinkChange = () => {},
  } = props;

  const formItemDisabled = !isCreateMode || !isEditMode;

  return (
    <div
      onClick={() => setIsEditMode(true)}
      className={`${DEFAULT_CLASSNAME}_test_content`}
      style={{ padding: '0 8px' }}>
      <FormGroup onClick={() => !isCreateMode && setIsEditMode(true)}>
        <Box display="flex" justifyContent="space-between" gap={2}>
          <div style={{ width: '50%' }}>
            {isCreateMode &&
              compareTestState.leftOptions.map((option, index) => (
                <Box
                  className={`${DEFAULT_CLASSNAME}_compareItem`}
                  key={index}
                  display="flex"
                  alignItems="center"
                  mt={1}>
                  <span
                    style={{
                      marginRight: '12px',
                      backgroundColor: '#6750a4',
                      color: '#fff',
                      borderRadius: '50%',
                      width: '28px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {index + 1}
                  </span>
                  <TextField
                    variant="outlined"
                    fullWidth
                    value={option.text}
                    onChange={(e) => {
                      const newLeftOptions = [...compareTestState.leftOptions];
                      newLeftOptions[index].text = e.target.value;
                      setCompareTestState({
                        ...compareTestState,
                        leftOptions: newLeftOptions,
                      });
                    }}
                  />
                  <Button onClick={() => handleRemoveCompareOption(index, 'left')}>
                    <RemoveIcon />
                  </Button>
                </Box>
              ))}
            {!formItemDisabled && (
              <Button style={{ color: '#6750a4' }} onClick={() => handleAddCompareOption('left')}>
                + Добавить опцию
              </Button>
            )}
          </div>
          <div style={{ width: '50%' }}>
            {isCreateMode &&
              compareTestState.rightOptions.map((option, index) => (
                <Box
                  className={`${DEFAULT_CLASSNAME}_compareItem`}
                  key={index}
                  display="flex"
                  alignItems="center"
                  mt={1}>
                  <span
                    style={{
                      marginRight: '12px',
                      backgroundColor: '#6750a4',
                      color: '#fff',
                      borderRadius: '50%',
                      width: '32px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {`${String.fromCharCode(65 + index)}`}
                  </span>
                  <Select
                    variant="outlined"
                    style={{ width: '120px', marginRight: '12px' }}
                    multiple
                    value={option.connected}
                    onChange={(e) =>
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      handleLinkChange(index, e.target.value, 'right')
                    }>
                    {compareTestState.leftOptions.map((leftOption, leftIndex) => (
                      <MenuItem key={leftOption.index} value={leftOption.index}>
                        {leftIndex + 1}
                      </MenuItem>
                    ))}
                  </Select>
                  <TextField
                    variant="outlined"
                    fullWidth
                    value={option.text}
                    onChange={(e) => {
                      const newRightOptions = [...compareTestState.rightOptions];
                      newRightOptions[index].text = e.target.value;
                      setCompareTestState({
                        ...compareTestState,
                        rightOptions: newRightOptions,
                      });
                    }}
                  />
                  <Button onClick={() => handleRemoveCompareOption(index, 'right')}>
                    <RemoveIcon />
                  </Button>
                </Box>
              ))}
            {!formItemDisabled && (
              <Button style={{ color: '#6750a4' }} onClick={() => handleAddCompareOption('right')}>
                + Добавить опцию
              </Button>
            )}
          </div>
        </Box>
      </FormGroup>
    </div>
  );
};
