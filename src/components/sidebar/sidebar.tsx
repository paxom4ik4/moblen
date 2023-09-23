import { FC } from 'react';
import MoblenIcon from "assets/icons/moblen-icon.svg";

import './sidebar.scss';
import {SidebarMenu} from "./sidebar-menu/sidebar-menu.tsx";
import {Link} from "react-router-dom";

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
