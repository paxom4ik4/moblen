import {FC, useContext} from 'react';

import './sidebar-menu.scss';
import { sidebarMenuConfig, studentSidebarMenuConfig } from "./sidebar-menu-config.tsx";
import { Link, useLocation } from "react-router-dom";
import { AppContext } from "app.tsx";
import { AppModes}  from "constants/appTypes.ts";

const DEFAULT_CLASSNAME = 'app-sidebar-menu';

export const SidebarMenu: FC = () => {
  const location = useLocation();

  const { appMode } = useContext(AppContext);

  const config = appMode === AppModes.tutor ? sidebarMenuConfig : studentSidebarMenuConfig;

  return (
    <div className={DEFAULT_CLASSNAME}>
      {config.map(item => (
        <Link
          key={item.path}
          to={item.path}
          className={`${DEFAULT_CLASSNAME}_item ${location.pathname === item.path && 'active-sidebar-item'} ${item.disabled && "disabled-link"}`}>
          {item.icon}
        </Link>
      ))}
    </div>
  )
}
