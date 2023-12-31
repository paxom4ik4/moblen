import './feedback.scss';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button, ButtonProps, styled, TextareaAutosize } from '@mui/material';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { useMutation } from 'react-query';
import { sendFeedback } from '../../services/user';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store.ts';
import { Notification } from '../../common/notification/notification.tsx';

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
  const { userData } = useSelector((state: RootState) => state.userData);

  const [feedbackText, setFeedbackText] = useState('');

  const sendFeedbackMutation = useMutation(
    (data: { user_uuid: string; message: string }) => sendFeedback(data.user_uuid, data.message),
    {
      onSuccess: () => {
        setIsFeedbackOpened(false);
        setIsFeedbackSent(true);
      },
    },
  );

  const sendFeedbackHandler = () => {
    if (feedbackText.length && userData?.uuid) {
      sendFeedbackMutation.mutate({ user_uuid: userData.uuid, message: feedbackText });
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
      <div className={DEFAULT_CLASSNAME}>
        <button onClick={() => setIsFeedbackOpened(!isFeedbackOpened)}>Сообщить о проблеме</button>
      </div>
    </>
  );
};
