import { FC } from 'react';

import './sidebar-menu.scss';
import { sidebarMenuConfig } from "./sidebar-menu-config.tsx";
import { Link, useLocation } from "react-router-dom";

const DEFAULT_CLASSNAME = 'app-sidebar-menu';

export const SidebarMenu: FC = () => {
  const location = useLocation();

  return (
    <div className={DEFAULT_CLASSNAME}>
      {sidebarMenuConfig.map(item => (
        <Link
          key={item.path}
          to={item.path}
          className={`${DEFAULT_CLASSNAME}_item ${location.pathname === item.path && 'active-sidebar-item'}`}>
          {item.icon}
        </Link>
      ))}
    </div>
  )
}
