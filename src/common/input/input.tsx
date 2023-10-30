import { FC } from 'react';

import { TextField, TextFieldProps } from '@mui/material';

import './input.scss';

export const Input: FC<TextFieldProps> = (props) => {
  return <TextField size={'small'} {...props} />;
};
