import { createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blogs';

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    updateBlog(state, action) {
      return state.map(b => (b.id !== action.payload.id ? b : action.payload));
    },
    appendBlog(state, action) {
      state.push(action.payload);
    },
    setBlogs(state, action) {
      return action.payload;
    },
    deleteBlog(state, action) {
      return state.filter(b => b.id !== action.payload.id);
    },
  },
});

export const { updateBlog, appendBlog, setBlogs, deleteBlog } =
  blogSlice.actions;

export const initializeBlogs = () => async dispatch =>
  dispatch(setBlogs(await blogService.getAll()));

export const createBlog = (newBlog, user) => async dispatch => {
  const returnedBlog = await blogService.create(newBlog);
  returnedBlog.user = user;
  dispatch(appendBlog(returnedBlog));
};

export const like = blogToLike => async dispatch => {
  const updatedBlog = await blogService.like(blogToLike);
  updatedBlog.user = { ...blogToLike.user };
  dispatch(updateBlog(updatedBlog));
};

export const remove = blogToRemove => async dispatch => {
  await blogService.remove(blogToRemove);
  dispatch(deleteBlog(blogToRemove));
};

export default blogSlice.reducer;
