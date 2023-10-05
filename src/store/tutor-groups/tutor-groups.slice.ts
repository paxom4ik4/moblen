import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Group } from 'types/group.ts';

const initialState: { groups: Group[] } = {
  groups: [],
};

const tutorGroupsSlice = createSlice({
  name: 'tutorGroups',
  initialState,
  reducers: {
    addGroup: (state, action: PayloadAction<Group>) => {
      state.groups = [action.payload, ...state.groups];
    },
    deleteGroupById: (state, action: PayloadAction<string>) => {
      state.groups = state.groups.filter((group) => group.group_uuid !== action.payload);
    },
    setTutorGroups: (state, action: PayloadAction<Group[]>) => {
      state.groups = action.payload;
    },
  },
});

export const { addGroup, deleteGroupById, setTutorGroups } = tutorGroupsSlice.actions;

export default tutorGroupsSlice.reducer;
