import { combineReducers, configureStore } from '@reduxjs/toolkit';

import appModeReducer from './app-mode/app-mode.slice.ts';
import userDataReduced from './user-data/user-data.slice.ts';
import tutorGroupsReducer from './tutor-groups/tutor-groups.slice.ts';
import resultsSliceReducer from './results/results.slice.ts';

const reducer = combineReducers({
  appMode: appModeReducer,
  userData: userDataReduced,
  tutorGroups: tutorGroupsReducer,
  results: resultsSliceReducer,
});

export const store = configureStore({
  reducer,
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
