import { configureStore } from '@reduxjs/toolkit';
import notificationReducer from './reducers/notificationReducer';
import blogReducer from './reducers/blogReducer';
import userReducer from './reducers/userReducer';
import usersReducer from './reducers/usersReducer';

const store = configureStore({
  reducer: {
    users: usersReducer,
    blogs: blogReducer,
    user: userReducer,
    notification: notificationReducer,
  },
});

export default store;
