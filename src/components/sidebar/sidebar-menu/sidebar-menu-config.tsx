import { ReactElement } from "react";

import SettingsIcon from 'assets/icons/settings-icon.svg';
import StatisticsIcon from 'assets/icons/statistics-icon.svg';
import AssignmentsIcon from 'assets/icons/assignments-icon.svg';
import GroupsIcon from 'assets/icons/groups-icon.svg';
import ChatIcon from 'assets/icons/chat-icon.svg';

export interface SidebarMenuItem {
  path: string;
  icon: ReactElement;
  disabled?: boolean;
}

export const sidebarMenuConfig: SidebarMenuItem[] = [
  {
    path: '/settings',
    icon: <SettingsIcon />,
    disabled: true,
  },
  {
    path: '/statistics',
    icon: <StatisticsIcon />,
    disabled: true,
  },
  {
    path: '/assignments',
    icon: <AssignmentsIcon />,
  },
  {
    path: '/groups',
    icon: <GroupsIcon />,
  },
];

export const studentSidebarMenuConfig: SidebarMenuItem[] = [
  {
    path: '/settings',
    icon: <SettingsIcon />,
    disabled: true,
  },
  {
    path: '/statistics',
    icon: <StatisticsIcon />,
    disabled: true,
  },
  {
    path: '/assignments',
    icon: <AssignmentsIcon />,
  },
  {
    path: '/chatGPT',
    icon: <ChatIcon />,
    disabled: true,
  },
]
