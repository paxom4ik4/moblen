import { Button } from '@mui/material';
import { getBalance } from '../../services/org/org';
import { useState } from 'react';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { createPortal } from 'react-dom';
import { useQuery } from 'react-query';

import './balance.scss';
const DEFAULT_CLASSNAME = 'balance';

const Balance = () => {
  const [openModal, setOpenModal] = useState(false);

  const { data: actualBalance } = useQuery(['getBalance'], () => getBalance());

  return (
    <div style={{display: 'flex', alignItems: 'center'}}>
      <Button
        onClick={() => {
          setOpenModal(!openModal);
        }}>
        Пополнить баланс
      </Button>
      <div style={{marginLeft: '15px'}}>
        <div style={{marginTop: '10px', fontSize: '14px', color: '#6750a4'}}>Генерация: -{actualBalance?.gen_cost} ₽</div>
        <div style={{fontSize: '14px', color: '#6750a4'}}>Проверка: -{actualBalance?.check_cost} ₽</div>
        <div style={{fontSize: '18px'}}>Баланс: {actualBalance?.balance} ₽</div>
      </div>


      {openModal &&
        createPortal(
          <div className={`${DEFAULT_CLASSNAME}_container`}>
            <ClickAwayListener onClickAway={() => setOpenModal(false)}>
              <div className={`${DEFAULT_CLASSNAME}_modal`}>
                <div>
                  <div className={`${DEFAULT_CLASSNAME}_modal_item`} >По вопросам оплаты обратитесь к</div>
                  <div className={`${DEFAULT_CLASSNAME}_modal_item`}>главному администратору сайта</div>
                  <div style={{fontWeight: 'bold', fontSize: '20px', display: 'flex', justifyContent: 'center'}}>Владислав Викторович Кудинов</div>
                  <div className={`${DEFAULT_CLASSNAME}_modal_item`}>+79087856734</div>
                  <div className={`${DEFAULT_CLASSNAME}_modal_item`}>t.me/fatherjones</div>
                </div>
              </div>
            </ClickAwayListener>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default Balance;
