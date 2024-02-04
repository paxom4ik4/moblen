import { Button } from '@mui/material';
import { getBalance } from '../../services/org/org';
import { useState } from 'react';
// import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { createPortal } from 'react-dom';
import { useQuery } from 'react-query';
const DEFAULT_CLASSNAME = 'balance';

const VladModal = () => {
  return (
    // <ClickAwayListener onClickAway={() => setIsFeedbackOpened(false)}>
    <div className={`${DEFAULT_CLASSNAME}_modal`}>
      <div></div>
    </div>
    //   {/* </ClickAwayListener> */}
  );
};
const Balance = () => {
  const [openModal, setOpenModal] = useState(false);

  const { data: actualBalance } = useQuery(['getBalance'], () => getBalance());

  return (
    <div>
      <div>Баланс: {actualBalance?.balance}</div>
      <Button
        onClick={() => {
          setOpenModal(!openModal);
        }}>
        Пополнить баланс
      </Button>
      {openModal &&
        createPortal(
          <div className={`${DEFAULT_CLASSNAME}_container`}>
            <VladModal />
          </div>,
          document.body,
        )}
    </div>
  );
};

export default Balance;
