import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserData } from 'constants/appTypes.ts';

export interface UserDataState {
  userData: UserData | null;
}

const initialState: UserDataState = {
  userData: null,
};

const userDataSlice = createSlice({
  name: 'userData',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserData | null>) => {
      state.userData = action.payload;
    },
  },
});

export const { setUser } = userDataSlice.actions;

export default userDataSlice.reducer;
