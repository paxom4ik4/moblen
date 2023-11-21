import { FC, useState } from 'react';

import ProfileIcon from 'assets/icons/profile-icon.svg';
import NotificationIcon from 'assets/icons/notifications-icon.svg';

import './upperbar.scss';
import { batch, useDispatch, useSelector } from 'react-redux';
import { setUser } from 'store/user-data/user-data.slice.ts';
import StudentIcon from 'assets/icons/student-icon.svg';
import { RootState } from 'store/store.ts';
import { Typography } from 'common/typography/typography.tsx';
import { setAppMode } from 'store/app-mode/app-mode.slice.ts';
import { useNavigate } from 'react-router-dom';
import { LoginRoutes } from 'constants/routes.ts';
import { logoutUser } from 'services/login/login.ts';
import { clearLocalStorage } from 'utils/app.utils.ts';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Notification } from '../../common/notification/notification.tsx';
import { ClickAwayListener } from '@mui/material';
import { editTutorInfo, getTutorInfo } from '../../services/tutor';
import { AppModes } from '../../constants/appTypes.ts';

const DEFAULT_CLASSNAME = 'app-upper-bar';

export const UpperBar: FC = () => {
  const queryClient = useQueryClient();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userData } = useSelector((state: RootState) => state.userData);
  const { uuid, name, surname, email, photo } = userData!;

  const [menuOpened, setMenuOpened] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { appMode } = useSelector((state: RootState) => state.appMode);

  const { data: tutorData } = useQuery(['tutorData', appMode], () => getTutorInfo(uuid));

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

  const logoutHandler = async () => {
    setIsLoggingOut(true);
    await logoutMutation.mutate(localStorage.getItem('refreshToken')!);
    await logoutMutation.mutate(localStorage.getItem('accessToken')!);
  };

  const uploadTutorPhoto = useMutation((data: FormData) => editTutorInfo(uuid, data), {
    onSuccess: () => {
      queryClient.invalidateQueries('tutorData');
    },
  });

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
          <ProfileIcon />
        </div>
        {menuOpened && (
          <div className={`${DEFAULT_CLASSNAME}_menu`}>
            <div className={`${DEFAULT_CLASSNAME}_menu_photo`}>
              <input
                type={'file'}
                className={`${DEFAULT_CLASSNAME}_menu_photo_upload`}
                onChange={(event) => {
                  const photoData = new FormData();

                  if (event.target.files?.length) {
                    photoData.append('files', event.target.files[0]);
                  }

                  uploadTutorPhoto.mutate(photoData);
                }}
              />
              {photo ? (
                <img
                  src={appMode === AppModes.tutor ? tutorData?.data?.tutor_photo : photo}
                  alt={'profile'}
                />
              ) : (
                <StudentIcon />
              )}
            </div>
            <div className={`${DEFAULT_CLASSNAME}_menu_name`}>
              <Typography size={'large'}>
                {name} {surname}
              </Typography>
              <Typography color={'gray'}>{email}</Typography>
            </div>
            <div className={`${DEFAULT_CLASSNAME}_menu_buttons`}>
              <button onClick={logoutHandler}>
                <Typography color={'gray'} weight={'bold'}>
                  {'Выход'}
                </Typography>
              </button>
            </div>
          </div>
        )}
      </div>
    </ClickAwayListener>
  );
};
