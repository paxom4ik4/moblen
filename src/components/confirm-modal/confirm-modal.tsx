import { FC } from 'react';
import { Typography } from 'common/typography/typography.tsx';

import CheckIcon from 'assets/icons/check-icon.svg';
import CancelIcon from 'assets/icons/cancel-icon.svg';

import './confirm-modal.scss';

type TProps = {
  label: string;
  confirm: () => void;
  reject: () => void;
};

const DEFAULT_CLASSNAME = 'confirm-modal';

export const ConfirmModal: FC<TProps> = (props) => {
  const { label, confirm, reject } = props;

  return (
    <div className={DEFAULT_CLASSNAME}>
      <Typography size={'large'}>Вы дейстивительно хотите удалить {label} ?</Typography>

      <div className={`${DEFAULT_CLASSNAME}_buttons`}>
        <button onClick={reject}>
          <CancelIcon />
        </button>
        <button onClick={confirm}>
          <CheckIcon />
        </button>
      </div>
    </div>
  );
};
