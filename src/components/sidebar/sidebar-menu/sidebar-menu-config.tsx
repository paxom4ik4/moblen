import { ReactElement } from "react";

import SettingsIcon from 'assets/icons/settings-icon.svg';
import StatisticsIcon from 'assets/icons/statistics-icon.svg';
import AssignmentsIcon from 'assets/icons/assignments-icon.svg';
import GroupsIcon from 'assets/icons/groups-icon.svg';

export interface SidebarMenuItem {
  path: string;
  icon: ReactElement;
}

export const sidebarMenuConfig: SidebarMenuItem[] = [
  {
    path: '/settings',
    icon: <SettingsIcon />,
  },
  {
    path: '/statistics',
    icon: <StatisticsIcon />,
  },
  {
    path: '/assignments',
    icon: <AssignmentsIcon />,
  },
  {
    path: '/groups',
    icon: <GroupsIcon />,
  },
]
