import { FC, PropsWithChildren } from 'react';

import './typography.scss';

import cl from 'classnames';

export interface TypographyProps extends PropsWithChildren {
  size?: 'default' | 'small'  | 'large';
  color?: 'default' | 'gray' | 'purple';
  weight?: 'default' | 'bold' | 'italic';
  className?: string;
  onClick?: () => void;
}

export const Typography: FC<TypographyProps> = (props) => {
  const { onClick, size = 'default', weight = 'default', color = 'default', className, children } = props;

  return (
    <p onClick={onClick} className={cl(className, `typography-size-${size}`, `typography-weight-${weight}`, `typography-color-${color}`)}>{children}</p>
  )
}
