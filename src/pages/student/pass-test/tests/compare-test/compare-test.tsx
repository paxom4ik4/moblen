import { Box, FormGroup, MenuItem, Select, TextField } from '@mui/material';
import { FC } from 'react';
import { ConvertedCompareOption, TestIndexOption, TestOption } from 'types/task.ts';
import { Typography } from 'common/typography/typography.tsx';

const DEFAULT_CLASSNAME = 'task-card';

type CompareTaskProps = {
  options?: TestOption[] | TestIndexOption[] | ConvertedCompareOption[];
  text?: string;
  isViewMode?: boolean;

  handleLinkChange?: (index: number, linkedTo: number[], side: 'left' | 'right') => void;
};

export const CompareTest: FC<CompareTaskProps> = (props) => {
  const {
    text = '',
    isViewMode = false,
    options = { leftOptions: [], rightOptions: [] },
    handleLinkChange = () => {},
  } = props;

  return (
    <FormGroup className={`${DEFAULT_CLASSNAME}_test_content`}>
      <Typography className={`${DEFAULT_CLASSNAME}_test_content_task`}>{text}</Typography>

      <FormGroup>
        <Box display="flex" justifyContent="space-between" gap={2}>
          <div style={{ width: '50%' }}>
            {options?.leftOptions?.map((option, index) => (
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
                    minWidth: '20px',
                    minHeight: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {index + 1}
                </span>
                <TextField disabled fullWidth value={option.text} />
              </Box>
            ))}
          </div>
          <div style={{ width: '50%' }}>
            {options?.rightOptions?.map((option, index) => (
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
                    minWidth: '20px',
                    minHeight: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {`${String.fromCharCode(65 + index)}`}
                </span>
                <Select
                  MenuProps={{ disablePortal: true }}
                  disabled={isViewMode}
                  variant="outlined"
                  style={{ width: '120px', marginRight: '12px' }}
                  multiple
                  value={option.connected}
                  onChange={(e) =>
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    handleLinkChange(index, e.target.value, 'right')
                  }>
                  {options?.leftOptions.map((leftOption, leftIndex) => (
                    <MenuItem key={leftOption.index} value={leftOption.index}>
                      {leftIndex + 1}
                    </MenuItem>
                  ))}
                </Select>
                <TextField disabled fullWidth value={option.text} />
              </Box>
            ))}
          </div>
        </Box>
      </FormGroup>
    </FormGroup>
  );
};
