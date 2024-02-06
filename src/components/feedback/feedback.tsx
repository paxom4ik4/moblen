import './feedback.scss';
import { Dispatch, FC, SetStateAction, useState} from 'react';
import { useSelector } from 'react-redux';
import { createPortal } from 'react-dom';
import { Button, ButtonProps, styled, TextareaAutosize } from '@mui/material';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { useMutation } from 'react-query';
import { sendFeedback } from 'services/user';
import { Notification } from 'common/notification/notification.tsx';
import Balance from 'components/balance/balance';
import RefOrg from 'components/refOrg/refOrg'
import { AppModes } from 'constants/appTypes';
import { RootState } from 'store/store.ts';

const DEFAULT_CLASSNAME = 'feedback';

const ColorButton = styled(Button)<ButtonProps>(() => ({
  color: '#000',
  backgroundColor: '#E1E2EC',
  borderColor: '#6750a4',
  '&:hover': {
    backgroundColor: '#6750a4',
    color: '#fff',
    borderColor: '#6750a4',
  },
}));

type FeedbackModalProps = {
  setIsFeedbackOpened: Dispatch<SetStateAction<boolean>>;
  setIsFeedbackSent: Dispatch<SetStateAction<boolean>>;
};

const FeedbackModal: FC<FeedbackModalProps> = ({ setIsFeedbackOpened, setIsFeedbackSent }) => {
  const [feedbackText, setFeedbackText] = useState('');

  const sendFeedbackMutation = useMutation(
    (data: { message: string }) => sendFeedback(data.message),
    {
      onSuccess: () => {
        setIsFeedbackOpened(false);
        setIsFeedbackSent(true);
      },
    },
  );

  const sendFeedbackHandler = () => {
    if (feedbackText.length) {
      sendFeedbackMutation.mutate({ message: feedbackText });
    }
  };

  return (
    <ClickAwayListener onClickAway={() => setIsFeedbackOpened(false)}>
      <div className={`${DEFAULT_CLASSNAME}_modal`}>
        <TextareaAutosize
          value={feedbackText}
          onChange={(event) => setFeedbackText(event.target.value)}
          placeholder={'Опишите проблему...'}
          className={`${DEFAULT_CLASSNAME}_modal_textField`}
          autoFocus={true}
        />
        <ColorButton onClick={sendFeedbackHandler} variant={'outlined'}>
          Отправить
        </ColorButton>
      </div>
    </ClickAwayListener>
  );
};

export const Feedback = () => {

  const { appMode } = useSelector((state: RootState) => state.appMode);

  const [isFeedbackOpened, setIsFeedbackOpened] = useState(false);
  const [isFeedbackSent, setIsFeedbackSent] = useState(false);

  return (
    <>
      <Notification
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={3000}
        message={'Спасибо! Сообщение об ошибке отправлено'}
        open={isFeedbackSent}
        onClose={() => setIsFeedbackSent(false)}
      />
      {isFeedbackOpened &&
        createPortal(
          <div className={`${DEFAULT_CLASSNAME}_container`}>
            <FeedbackModal
              setIsFeedbackOpened={setIsFeedbackOpened}
              setIsFeedbackSent={setIsFeedbackSent}
            />
          </div>,
          document.body,
        )}
        
      <div className={DEFAULT_CLASSNAME} style={appMode === AppModes.ORG ? {display: 'flex', justifyContent: 'space-between', width: '80%'} : {}}>
        {appMode === AppModes.ORG ? <div style={{display: 'flex', justifyContent: 'space-between', width: '85%'}}><Balance /><RefOrg /></div>: <></>}
        <button onClick={() => setIsFeedbackOpened(!isFeedbackOpened)}>Сообщить о проблеме</button>
      </div>
    </>
  );
};
