import {FC, ReactElement} from 'react';

import './button.scss';
import cn from 'classnames';

export interface ButtonProps {
  title?: string;
  icon?: ReactElement;
  onClick?: () => void;
  className?: string;
  color?: 'primary' | 'dark';
}

export const Button: FC<ButtonProps> = props => {
  const { className, title = "", icon, onClick, color = 'primary' } = props;

  return (
    <button
      onClick={onClick}
      className={cn(className, `btn-color-${color}`)}>
      {title} {icon}
    </button>
  )
}
