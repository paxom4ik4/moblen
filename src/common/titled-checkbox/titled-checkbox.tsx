import { FC, PropsWithChildren } from 'react';
import { Typography } from "../typography/typography.tsx";

import './titled-checkbox.scss';

const DEFAULT_CLASSNAME = 'titled-checkbox';

export interface TitledCheckboxProps extends PropsWithChildren {
  checked?: boolean;
  onChange?: () => void;
  name?: string;
}

export const TitledCheckbox: FC<TitledCheckboxProps> = props => {
  const { children, name, ...otherProps } = props;

  return (
    <div className={DEFAULT_CLASSNAME}>
      <label htmlFor={name}><Typography>{children}</Typography></label> <input id={name} type={"checkbox"} {...otherProps} />
    </div>
  )
}
