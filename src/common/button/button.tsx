// default button styled according mockups
import { FC, ReactElement } from 'react';

import './button.scss';
import cn from 'classnames';
import { Typography } from '../typography/typography.tsx';

export interface ButtonProps {
  title?: string;
  icon?: ReactElement;
  onClick?: () => void;
  className?: string;
  color?: 'primary' | 'dark';
  disabled?: boolean;
}

export const Button: FC<ButtonProps> = (props) => {
  const {
    disabled = false,
    className,
    title = '',
    icon,
    onClick,
    color = 'primary',
    ...otherProps
  } = props;

  return (
    <button
      onClick={onClick}
      {...otherProps}
      className={cn(className, 'default-button', `btn-color-${color}`, { disabled: disabled })}>
      <Typography>{title}</Typography> {icon}
    </button>
  );
};
