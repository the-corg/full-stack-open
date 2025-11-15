import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Blog from './Blog';
import Togglable from './Togglable';
import CreateForm from './CreateForm';
import { setNotification } from '../reducers/notificationReducer';
import { initializeBlogs, createBlog, like, remove } from '../reducers/blogReducer';

const authorStr = author => (author === '' ? 'unknown author' : author);

const Blogs = () => {
  const dispatch = useDispatch();
  const blogs = useSelector(({ blogs }) => blogs);

  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);
  
  const createFormRef = useRef();

  const user = useSelector(({ user }) => user);

  const addBlog = async newBlog => {
    try {
      await dispatch(createBlog(newBlog, user));
      dispatch(setNotification(`added blog '${newBlog.title}' by ${authorStr(newBlog.author)}`));
      createFormRef.current.toggleVisibility();
      return true;
    } catch (exception) {
      dispatch(setNotification(exception.response.data.error, true));
    }
    return false;
  };

  const likeBlog = async blog => {
    try {
      await dispatch(like(blog));
      dispatch(setNotification(`liked '${blog.title}' by ${authorStr(blog.author)}`));
    } catch (exception) {
      dispatch(setNotification(exception.response.data.error, true));
    }
  };

  const deleteBlog = async blog => {
    if (!window.confirm(`Remove blog ${blog.title} by ${authorStr(blog.author)}?`)) return;

    try {
      await dispatch(remove(blog));
      dispatch(setNotification(`deleted '${blog.title}' by ${authorStr(blog.author)}`));
    } catch (exception) {
      dispatch(setNotification(exception.response.data.error, true));
    }
  };

  return (
    <div>
      <Togglable buttonLabel='create new' ref={createFormRef}>
        <CreateForm addBlog={addBlog} />
      </Togglable>
      {blogs
        .toSorted((a, b) => b.likes - a.likes)
        .map(blog => (
          <Blog
            key={blog.id}
            blog={blog}
            likeBlog={async () => await likeBlog(blog)}
            deleteBlog={
              blog.user?.username === user.username ? async () => await deleteBlog(blog) : undefined
            }
          />
        ))}
    </div>
  );
};

export default Blogs;
