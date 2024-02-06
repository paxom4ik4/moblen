import { FC, PropsWithChildren } from 'react';

import './typography.scss';

import cl from 'classnames';

export interface TypographyProps extends PropsWithChildren {
  size?: 'default' | 'small' | 'large';
  color?: 'default' | 'gray' | 'purple' | 'red';
  weight?: 'default' | 'bold' | 'italic';
  isPre?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Typography: FC<TypographyProps> = (props) => {
  const {
    onClick,
    size = 'default',
    weight = 'default',
    color = 'default',
    isPre,
    className,
    children,
  } = props;

  return (
    <p
      style={{ whiteSpace: isPre ? 'pre' : 'pre-wrap' }}
      onClick={onClick}
      className={cl(
        className,
        `typography-size-${size}`,
        `typography-weight-${weight}`,
        `typography-color-${color}`,
      )}>
      {children}
    </p>
  );
};
