import { Box, FormGroup, MenuItem, Select } from '@mui/material';
import { FC } from 'react';
import { Typography } from 'common/typography/typography.tsx';
import { CompareState } from 'types/test.ts';

const DEFAULT_CLASSNAME = 'task-pass-card';

type CompareTaskProps = {
  options?: CompareState;
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
                <Typography>{option.text}</Typography>
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
                  value={Array.isArray(option.connected) ? option.connected : []}
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
                <Typography>{option.text}</Typography>
              </Box>
            ))}
          </div>
        </Box>
      </FormGroup>
    </FormGroup>
  );
};
