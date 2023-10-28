import { Dispatch, FC, SetStateAction } from 'react';
import { useSelector } from 'react-redux';

import './sidebar-menu.scss';
import { sidebarMenuConfig, studentSidebarMenuConfig } from './sidebar-menu-config.tsx';
import { Link, useLocation } from 'react-router-dom';
import { AppModes } from 'constants/appTypes.ts';
import { RootState } from 'store/store.ts';

const DEFAULT_CLASSNAME = 'app-sidebar-menu';

export const SidebarMenu: FC<{ setIsSidebarOpened: Dispatch<SetStateAction<boolean>> }> = (
  props,
) => {
  const { setIsSidebarOpened } = props;

  const location = useLocation();

  const { appMode } = useSelector((state: RootState) => state.appMode);

  const config = appMode === AppModes.tutor ? sidebarMenuConfig : studentSidebarMenuConfig;

  return (
    <div className={DEFAULT_CLASSNAME}>
      {config.map((item) => (
        <Link
          onClick={() => window.innerWidth <= 768 && setIsSidebarOpened(false)}
          key={item.path}
          to={item.path}
          className={`${DEFAULT_CLASSNAME}_item ${
            location.pathname === item.path && 'active-sidebar-item'
          } ${item.disabled && 'disabled-link'}`}>
          {item.icon}
        </Link>
      ))}
    </div>
  );
};
