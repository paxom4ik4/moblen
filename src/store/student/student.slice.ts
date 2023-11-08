import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InitialState {
  activeTutor: null | string;
  activeCourse: null | {
    id: string;
    name: string;
  };
  activeTopic: null | {
    id: string;
    name: string;
  };
  currentTaskList: null | { name: string; id: string };
}

const initialState: InitialState = {
  activeTutor: null,
  activeCourse: null,
  activeTopic: null,
  currentTaskList: null,
};

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    setActiveTutor: (state, action: PayloadAction<string | null>) => {
      state.activeTutor = action.payload;
    },
    setActiveCourse: (state, action: PayloadAction<{ id: string; name: string } | null>) => {
      state.activeCourse = action.payload;
    },
    setActiveTopic: (state, action: PayloadAction<{ id: string; name: string } | null>) => {
      state.activeTopic = action.payload;
    },
    setCurrentTaskList: (state, action: PayloadAction<{ id: string; name: string } | null>) => {
      state.currentTaskList = action.payload;
    },
  },
});

export const { setActiveTutor, setActiveCourse, setActiveTopic, setCurrentTaskList } =
  studentSlice.actions;

export default studentSlice.reducer;
