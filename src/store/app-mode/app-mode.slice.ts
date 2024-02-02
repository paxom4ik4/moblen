import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppModes } from 'constants/appTypes.ts';

export interface AppModeState {
  appMode: AppModes.TT | AppModes.ST | AppModes.ORG | null;
}

const initialState: AppModeState = {
  appMode: AppModes.TT,
};

export const appModeSlice = createSlice({
  name: 'appMode',
  initialState,
  reducers: {
    setAppMode: (state, action: PayloadAction<AppModes.TT | AppModes.ST | AppModes.ORG | null>) => {
      state.appMode = action.payload;
    },
  },
});

export const { setAppMode } = appModeSlice.actions;

export default appModeSlice.reducer;
