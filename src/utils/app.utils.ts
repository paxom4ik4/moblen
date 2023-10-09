import { Test } from '../types/test.ts';
import { mockedTask } from '../types/task.ts';
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

// MOCKED WHILE BE READY

export const mockedTests: Test[] = [
  {
    id: 'student-test-1',
    name: 'ДЗ #1',
    subject: 'Англ',
    topic: 'Первая тема',
    status: 'done',
    tasks: [mockedTask, mockedTask, mockedTask],
  },
  {
    id: 'student-test-1',
    name: 'ДЗ #2',
    subject: 'Англ',
    topic: 'Первая тема',
    status: 'done',
    tasks: [mockedTask, mockedTask],
  },
  {
    id: 'student-test-1',
    name: 'ДЗ #3',
    subject: 'Англ',
    topic: 'Первая тема',
    status: 'done',
    tasks: [mockedTask, mockedTask, mockedTask],
  },
  {
    id: 'student-test-2',
    name: 'ДЗ #4',
    subject: 'Англ',
    topic: 'Первая тема',
    status: 'done',
    tasks: [mockedTask, mockedTask, mockedTask, mockedTask, mockedTask],
  },
];

export const getStoredAppMode = (): AppModes | null => {
  const storedAppMode = sessionStorage.getItem('appMode');

  if (!storedAppMode) {
    return null;
  }

  if (storedAppMode === AppModes.tutor) {
    return AppModes.tutor;
  }

  return AppModes.student;
};
