import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GenerateTask {
  topicName: null | string;
  courseName: null | string;
  taskListName: null | string;
  taskListId: null | string;
}

const initialState: GenerateTask = {
  topicName: null,
  courseName: null,
  taskListName: null,
  taskListId: null,
};

const generateTaskSlice = createSlice({
  name: 'generateTask',
  initialState,
  reducers: {
    setTaskToGenerate: (
      state,
      action: PayloadAction<{
        topicName: string;
        courseName: string;
        taskListName: string;
        taskListId: string;
      }>,
    ) => {
      state.topicName = action.payload.topicName;
      state.courseName = action.payload.courseName;
      state.taskListName = action.payload.taskListName;
      state.taskListId = action.payload.taskListId;
    },
    clearGenerateTask: (state) => {
      state.topicName = null;
      state.courseName = null;
      state.taskListName = null;
      state.taskListId = null;
    },
  },
});

export const { setTaskToGenerate, clearGenerateTask } = generateTaskSlice.actions;

export default generateTaskSlice.reducer;
