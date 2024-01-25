// default button styled according mockups
import { FC, ReactElement } from 'react';

import './button.scss';
import cn from 'classnames';
import { Typography } from '../typography/typography.tsx';
import { ButtonBaseProps } from '@mui/material';

export interface ButtonProps extends ButtonBaseProps {
  title?: string;
  icon?: ReactElement;
  onClick?: () => void;
  className?: string;
  color?: 'primary' | 'dark';
  disabled?: boolean;
  textColor?: string;
}

export const Button: FC<ButtonProps> = (props) => {
  const {
    disabled = false,
    className,
    title = '',
    icon,
    onClick,
    color = 'primary',
    textColor,
    ...otherProps
  } = props;

  return (
    <button
      onClick={onClick}
      {...otherProps}
      className={cn(className, 'default-button', `btn-color-${color}`, { disabled: disabled })}>
      <Typography className={textColor}>{title}</Typography> {icon}
    </button>
  );
};
