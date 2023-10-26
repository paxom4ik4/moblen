import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InitialState {
  activeTutor: null | string;
  activeCourse: null | string;
  activeTopic: null | string;
}

const initialState: InitialState = {
  activeTutor: null,
  activeCourse: null,
  activeTopic: null,
};

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    setActiveTutor: (state, action: PayloadAction<string | null>) => {
      state.activeTutor = action.payload;
    },
    setActiveCourse: (state, action: PayloadAction<string | null>) => {
      state.activeCourse = action.payload;
    },
    setActiveTopic: (state, action: PayloadAction<string | null>) => {
      state.activeTopic = action.payload;
    },
  },
});

export const { setActiveTutor, setActiveCourse, setActiveTopic } = studentSlice.actions;

export default studentSlice.reducer;
