import { createSlice } from '@reduxjs/toolkit';

const initialState = { message: null, isError: false };

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    notificationSet(state, action) {
      return action.payload;
    },
    notificationRemove(state, action) {
      if (state.message !== action.payload.message) return state;
      return initialState;
    },
  },
});

export const { notificationSet, notificationRemove } =
  notificationSlice.actions;

export const setNotification =
  (message, isError = false, seconds = 3) =>
  dispatch => {
    dispatch(notificationSet({ message, isError }));
    setTimeout(
      () => dispatch(notificationRemove({ message, isError })),
      seconds * 1000,
    );
  };

export default notificationSlice.reducer;
