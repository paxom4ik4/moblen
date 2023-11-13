import { AppModes } from '../constants/appTypes.ts';

export const routeConfig = [
  {
    title: 'Группы',
    path: '/groups',
  },
  {
    title: '',
    path: '/assignments/create-test',
  },
  {
    title: 'Курсы',
    path: '/assignments',
  },
  {
    title: 'Результаты учеников',
    path: '/results',
  },
];

export const studentRouteConfig = [
  {
    title: 'Задания',
    path: '/assignments',
  },
];

export const clearLocalStorage = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('expiresIn');
  localStorage.removeItem('userData');
  localStorage.removeItem('appMode');
};

export const getStoredAppMode = (): AppModes | null => {
  const storedAppMode = localStorage.getItem('appMode');

  if (!storedAppMode) {
    return null;
  }

  if (storedAppMode === AppModes[AppModes.tutor]) {
    return AppModes.tutor;
  }

  return AppModes.student;
};
