import { FC, useState } from 'react';

import ProfileIcon from 'assets/icons/profile-icon.svg';
import NotificationIcon from 'assets/icons/notifications-icon.svg';

import './upperbar.scss';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from 'store/user-data/user-data.slice.ts';
import StudentIcon from 'assets/icons/student-icon.svg';
import { RootState } from 'store/store.ts';
import { Typography } from 'common/typography/typography.tsx';
import { setAppMode } from 'store/app-mode/app-mode.slice.ts';
import { logoutUser } from 'services/login/login.ts';
import { useNavigate } from 'react-router-dom';
import { LoginRoutes } from '../../constants/routes.ts';

const DEFAULT_CLASSNAME = 'app-upper-bar';

export const UpperBar: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userData } = useSelector((state: RootState) => state.userData);
  const { name, surname, email, photo } = userData!;

  const [menuOpened, setMenuOpened] = useState<boolean>(false);

  const logoutHandler = async () => {
    dispatch(setUser(null));
    dispatch(setAppMode(null));
    localStorage.removeItem('userData');
    localStorage.removeItem('appMode');
    navigate(LoginRoutes.LOGIN);
    await logoutUser();
  };

  return (
    <div className={DEFAULT_CLASSNAME}>
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
            {photo ? <img src={photo} alt={'profile'} /> : <StudentIcon />}
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
  );
};
