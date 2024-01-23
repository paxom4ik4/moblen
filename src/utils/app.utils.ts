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

  if (storedAppMode.toUpperCase() === AppModes[AppModes.TT]) {
    return AppModes.TT;
  }

  return AppModes.ST;
};

export const dateTimeConfig = {
  hour12: false,
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
};
