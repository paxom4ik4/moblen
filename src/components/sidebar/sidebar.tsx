import { Dispatch, FC, SetStateAction } from 'react';
import { Link } from 'react-router-dom';

import MoblenIcon from 'assets/icons/moblen-icon.svg';

import { SidebarMenu } from './sidebar-menu/sidebar-menu.tsx';

import './sidebar.scss';

const DEFAULT_CLASSNAME = 'app-sidebar';

interface SidebarProps {
  isSidebarOpened: boolean;
  setIsSidebarOpened: Dispatch<SetStateAction<boolean>>;
}

export const Sidebar: FC<SidebarProps> = (props) => {
  const { isSidebarOpened, setIsSidebarOpened } = props;

  return (
    <div className={`${DEFAULT_CLASSNAME} ${isSidebarOpened && 'sidebar-opened'}`}>
      <Link to={'/'}>
        <MoblenIcon />
      </Link>

      <SidebarMenu setIsSidebarOpened={setIsSidebarOpened} />
    </div>
  );
};

export default Sidebar;
