import { FC } from 'react';
import { Snackbar, SnackbarProps } from '@mui/material';

export const Notification: FC<SnackbarProps> = (props) => {
  return <Snackbar {...props} />;
};
