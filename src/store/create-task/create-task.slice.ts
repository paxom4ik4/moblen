import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CreateTask {
  topicName: null | string;
  courseName: null | string;
  taskListName: null | string;
  taskListId: null | string;
}

const initialState: CreateTask = {
  topicName: null,
  courseName: null,
  taskListName: null,
  taskListId: null,
};

const createTaskSlice = createSlice({
  name: 'createTask',
  initialState,
  reducers: {
    setTaskToCreate: (
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
    clearCreateTask: (state) => {
      state.topicName = null;
      state.courseName = null;
      state.taskListName = null;
      state.taskListId = null;
    },
  },
});

export const { setTaskToCreate, clearCreateTask } = createTaskSlice.actions;

export default createTaskSlice.reducer;
