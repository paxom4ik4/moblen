import { Button } from '@mui/material';
import { getBalance } from '../../services/org/org';
import { useState } from 'react';
import { useQuery } from 'react-query';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

import './balance.scss';
const DEFAULT_CLASSNAME = 'balance';

const Balance = () => {
  const [openModal, setOpenModal] = useState(false);
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: '25px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  };
  
  const { data: actualBalance } = useQuery(['getBalance'], () => getBalance());
  const handleClose = () => setOpenModal(false);
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
      <Modal
        open={openModal}
        onClose={handleClose}
      >
        <Box sx={style}>
          <div className={`${DEFAULT_CLASSNAME}_modal_item`} >По вопросам оплаты обратитесь к</div>
          <div className={`${DEFAULT_CLASSNAME}_modal_item`}>главному администратору сайта</div>
          <div style={{fontWeight: 'bold', fontSize: '20px', display: 'flex', justifyContent: 'center'}}>Владислав Викторович Кудинов</div>
          <div className={`${DEFAULT_CLASSNAME}_modal_item`}>+79087856734</div>
          <div className={`${DEFAULT_CLASSNAME}_modal_item`}>t.me/fatherjones</div>
        </Box>
      </Modal>
    </div>
  );
};

export default Balance;
