import { combineReducers, configureStore } from '@reduxjs/toolkit';

import appModeReducer from './app-mode/app-mode.slice.ts';
import userDataReduced from './user-data/user-data.slice.ts';
import tutorGroupsReducer from './tutor-groups/tutor-groups.slice.ts';
import resultsSliceReducer from './results/results.slice.ts';
import createTaskSliceReducer from './create-task/create-task.slice.ts';
import generateTaskSliceReducer from './generate-task/generate-task.slice.ts';
import coursesSliceReducer from './courses/courses.slice.ts';
import studentSliceReducer from './student/student.slice.ts';

const reducer = combineReducers({
  appMode: appModeReducer,
  userData: userDataReduced,
  tutorGroups: tutorGroupsReducer,
  results: resultsSliceReducer,
  createTask: createTaskSliceReducer,
  generateTask: generateTaskSliceReducer,
  courses: coursesSliceReducer,
  student: studentSliceReducer,
});

export const store = configureStore({
  reducer,
});

export type RootState = ReturnType<typeof store.getState>;
