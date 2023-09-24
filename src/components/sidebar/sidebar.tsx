import { FC } from 'react';
import { Link } from "react-router-dom";

import MoblenIcon from "assets/icons/moblen-icon.svg";

import { SidebarMenu } from "./sidebar-menu/sidebar-menu.tsx";

import './sidebar.scss';

const DEFAULT_CLASSNAME = 'app-sidebar';

export const Sidebar: FC = () => {
  return (
    <div className={DEFAULT_CLASSNAME}>
      <Link to={'/'}><MoblenIcon /></Link>

      <SidebarMenu />
    </div>
  )
};

export default Sidebar;
