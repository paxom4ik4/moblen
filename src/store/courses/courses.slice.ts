import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: {
  activeCourse: string | null;
  activeTopic: string | null;
} = {
  activeCourse: null,
  activeTopic: null,
};

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setActiveCourse: (state, action: PayloadAction<string | null>) => {
      state.activeCourse = action.payload;
    },
    setActiveTopic: (state, action: PayloadAction<string | null>) => {
      state.activeTopic = action.payload;
    },
  },
});

export const { setActiveCourse, setActiveTopic } = coursesSlice.actions;

export default coursesSlice.reducer;
