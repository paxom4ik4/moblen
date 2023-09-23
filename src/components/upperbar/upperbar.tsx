import { FC } from 'react';

import ProfileIcon from 'assets/icons/profile-icon.svg';
import NotificationIcon from 'assets/icons/notifications-icon.svg';

import './upperbar.scss';

const DEFAULT_CLASSNAME = 'app-upper-bar';

export const UpperBar: FC = () => {
  return (
    <div className={DEFAULT_CLASSNAME}>
      <div className={`${DEFAULT_CLASSNAME}_notifications`}><NotificationIcon /></div>
      <div className={`${DEFAULT_CLASSNAME}_profile`}><ProfileIcon /></div>
    </div>
  )
}
