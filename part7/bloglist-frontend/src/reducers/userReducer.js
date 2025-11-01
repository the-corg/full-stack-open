import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;

/*export const initializeUsers = () => async dispatch =>
  dispatch(setUsers(await userService.getAll()));

export const createUser = (newUser, user) => async dispatch => {
  const returnedUser = await userService.create(newUser);
  returnedUser.user = user;
  dispatch(appendUser(returnedUser));
};

export const like = userToLike => async dispatch => {
  const updatedUser = await userService.like(userToLike);
  updatedUser.user = { ...userToLike.user };
  dispatch(updateUser(updatedUser));
};

export const remove = userToRemove => async dispatch => {
  await userService.remove(userToRemove);
  dispatch(deleteUser(userToRemove));
};*/

export default userSlice.reducer;
