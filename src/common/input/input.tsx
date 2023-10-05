import { FC } from 'react';

import { TextField, TextFieldProps } from '@mui/material';

export const Input: FC<TextFieldProps> = (props) => {
  return <TextField {...props} />;
};
