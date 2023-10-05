import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppModes } from "constants/appTypes.ts";

export interface AppModeState {
  appMode: AppModes.tutor | AppModes.student | null;
}

const initialState: AppModeState = {
  appMode: null,
};

export const appModeSlice = createSlice({
  name: 'appMode',
  initialState,
  reducers: {
    setAppMode: (state, action: PayloadAction<AppModes.tutor | AppModes.student | null>) => {
      state.appMode = action.payload;
    },
  }
});

export const { setAppMode } = appModeSlice.actions;

export default appModeSlice.reducer;
