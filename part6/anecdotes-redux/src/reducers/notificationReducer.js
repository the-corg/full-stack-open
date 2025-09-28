import { createSlice } from '@reduxjs/toolkit';

const initialState = '';

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    notificationSet(state, action) {
      return action.payload;
    },
    notificationRemove(state, action) {
      if (state !== action.payload) return state;
      return initialState;
    },
  },
});

export const { notificationSet, notificationRemove } =
  notificationSlice.actions;

export const setNotification =
  (text, seconds = 3) =>
  dispatch => {
    dispatch(notificationSet(text));
    setTimeout(() => dispatch(notificationRemove(text)), seconds * 1000);
  };

export default notificationSlice.reducer;
