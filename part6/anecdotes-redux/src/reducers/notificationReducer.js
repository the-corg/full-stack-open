import { createSlice } from '@reduxjs/toolkit';

const initialState = '';

export const notify = (dispatch, text) => {
  dispatch(notificationSet(text));
  setTimeout(() => dispatch(notificationRemove(text)), 5000);
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    notificationSet(state, action) {
      return action.payload;
    },
    notificationRemove(state, action) {
      if (state !== action.payload) return state;
      return '';
    },
  },
});

export const { notificationSet, notificationRemove } =
  notificationSlice.actions;

export default notificationSlice.reducer;
