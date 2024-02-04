import { Button } from '@mui/material';
import {getBalance} from '../../services/org/org'
import { useState } from 'react';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { createPortal } from 'react-dom';
const DEFAULT_CLASSNAME = 'balance';

const VladModal = () => {
    return (
        // <ClickAwayListener onClickAway={() => setIsFeedbackOpened(false)}>
        <div className={`${DEFAULT_CLASSNAME}_modal`}>
            <div></div>
        </div>
    //   {/* </ClickAwayListener> */}
    )
}
const Balance = () => {
  const actualBalance = getBalance();
  const [openModal, setOpenModal] = useState(false)

//   return (
//     <>{actualBalance}</>
//   )
return(
    <div>
      <div>Баланс</div>
      <Button onClick={() => {setOpenModal(!openModal)}}>Пополнить баланс</Button>
      {openModal &&
        createPortal(
          <div className={`${DEFAULT_CLASSNAME}_container`}>
            <VladModal />
          </div>,
          document.body,
        )}
    </div>
)
};

export default Balance;

