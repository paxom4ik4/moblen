import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: { selectedStudent: null | string } = {
  selectedStudent: null,
};

const resultsSlice = createSlice({
  name: 'resutls',
  initialState,
  reducers: {
    setSelectedStudent: (state, action: PayloadAction<string>) => {
      if (state.selectedStudent === action.payload) {
        state.selectedStudent = null;
      } else {
        state.selectedStudent = action.payload;
      }
    },
    clearSelectedStudent: (state) => {
      state.selectedStudent = null;
    },
  },
});

export const { setSelectedStudent, clearSelectedStudent } = resultsSlice.actions;

export default resultsSlice.reducer;
