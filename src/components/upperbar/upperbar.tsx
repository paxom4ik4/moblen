import { ChangeEvent, FC, useEffect, useState } from 'react';

import ProfileIcon from 'assets/icons/profile-icon.svg';
import NotificationIcon from 'assets/icons/notifications-icon.svg';

import './upperbar.scss';
import { batch, useDispatch } from 'react-redux';
import { setUser } from 'store/user-data/user-data.slice.ts';
import StudentIcon from 'assets/icons/student-icon.svg';
import { Typography } from 'common/typography/typography.tsx';
import { setAppMode } from 'store/app-mode/app-mode.slice.ts';
import { useNavigate } from 'react-router-dom';
import { LoginRoutes } from 'constants/routes.ts';
import { logoutUser } from 'services/login/login.ts';
import { clearLocalStorage } from 'utils/app.utils.ts';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Notification } from 'common/notification/notification.tsx';
import { ClickAwayListener } from '@mui/material';
import { editUserPhoto, getUserData } from 'services/user';

const DEFAULT_CLASSNAME = 'app-upper-bar';

export const UpperBar: FC = () => {
  const queryClient = useQueryClient();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [menuOpened, setMenuOpened] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { data: userData } = useQuery('userData', () => getUserData());

  const logoutMutation = useMutation((token: string) => logoutUser(token), {
    onSuccess: () => {
      clearAppStateHandler();
      setIsLoggingOut(false);
      navigate(LoginRoutes.LOGIN);
    },
  });

  const clearAppStateHandler = () => {
    clearLocalStorage();

    batch(() => {
      dispatch(setUser(null));
      dispatch(setAppMode(null));
    });
  };

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');

    if (!storedUserData) {
      clearAppStateHandler();
      navigate(LoginRoutes.LOGIN);
    }
  }, []);

  const logoutHandler = async () => {
    setIsLoggingOut(true);
    await logoutMutation.mutate(localStorage.getItem('refreshToken')!);
    await logoutMutation.mutate(localStorage.getItem('accessToken')!);
  };

  const uploadUserPhoto = useMutation((data: FormData) => editUserPhoto(data), {
    onSuccess: async () => {
      await queryClient.invalidateQueries('tutorData');
    },
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();

      formData.append('photo', file);
      uploadUserPhoto.mutate(formData);
    }
  };

  if (!userData) {
    return <div>Loading</div>;
  }

  return (
    <ClickAwayListener onClickAway={() => setMenuOpened(false)}>
      <div className={DEFAULT_CLASSNAME}>
        {logoutMutation.isLoading && (
          <Notification
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            autoHideDuration={3000}
            message={'Выход из системы'}
            open={isLoggingOut}
            onClose={() => setIsLoggingOut(!isLoggingOut)}
          />
        )}

        <div className={`${DEFAULT_CLASSNAME}_notifications`}>
          <NotificationIcon />
        </div>
        <div
          className={`${DEFAULT_CLASSNAME}_profile`}
          onClick={() => {
            setMenuOpened(!menuOpened);
          }}>
          {userData?.photo ? <img src={userData.photo} alt={'profile'} /> : <ProfileIcon />}
        </div>
        <div
          className={`${DEFAULT_CLASSNAME}_menu ${
            menuOpened && `${DEFAULT_CLASSNAME}_menu_opened`
          }`}>
          <div className={`${DEFAULT_CLASSNAME}_menu_photo`}>
            <input
              type={'file'}
              className={`${DEFAULT_CLASSNAME}_menu_photo_upload`}
              onChange={handleFileChange}
            />
            {userData.photo ? <img src={userData.photo} alt={'profile'} /> : <StudentIcon />}
          </div>
          <div className={`${DEFAULT_CLASSNAME}_menu_name`}>
            <Typography size={'large'}>
              {userData?.first_name} {userData?.last_name}
            </Typography>
            <Typography color={'gray'}>{userData?.email}</Typography>
          </div>
          <div className={`${DEFAULT_CLASSNAME}_menu_buttons`}>
            <button onClick={logoutHandler}>
              <Typography color={'gray'} weight={'bold'}>
                {'Выход'}
              </Typography>
            </button>
          </div>
        </div>
      </div>
    </ClickAwayListener>
  );
};
