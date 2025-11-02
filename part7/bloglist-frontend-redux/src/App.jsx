import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setNotification } from './reducers/notificationReducer';
import { initializeBlogs, createBlog, like, remove } from './reducers/blogReducer';
import { setUser } from './reducers/userReducer';
import LoginForm from './components/LoginForm';
import Blog from './components/Blog';
import Togglable from './components/Togglable';
import CreateForm from './components/CreateForm';
import Notification from './components/Notification';
import blogService from './services/blogs';

const authorStr = author => (author === '' ? 'unknown author' : author);

const App = () => {
  const dispatch = useDispatch();

  const blogs = useSelector(({ blogs }) => blogs);
  const user = useSelector(({ user }) => user);

  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('loggedInBloglistUser');
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON);
      blogService.setToken(user.token);
      dispatch(setUser(user));
    }
  }, []);

  const handleLogout = () => {
    window.localStorage.clear();
    dispatch(setUser(null));
  };

  const createFormRef = useRef();

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

  if (!user) return <LoginForm />;

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>
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

export default App;
