import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setNotification } from './reducers/notificationReducer';
import LoginForm from './components/LoginForm';
import Blog from './components/Blog';
import Togglable from './components/Togglable';
import CreateForm from './components/CreateForm';
import Notification from './components/Notification';
import blogService from './services/blogs';

const App = () => {
  const dispatch = useDispatch();

  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem(
      'loggedInBloglistUser',
    );
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON);
      blogService.setToken(user.token);
      setUser(user);
    }
  }, []);

  const handleLogout = () => {
    window.localStorage.clear();
    setUser(null);
  };

  const createFormRef = useRef();

  const addBlog = async newBlog => {
    try {
      const returnedBlog = await blogService.create(newBlog);
      returnedBlog.user = user;
      setBlogs(blogs.concat(returnedBlog));

      dispatch(
        setNotification(
          `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
        ),
      );
      createFormRef.current.toggleVisibility();
      return true;
    } catch (exception) {
      console.log(exception);
      dispatch(setNotification(exception.response.data.error, true));
    }
    return false;
  };

  const likeBlog = async blog => {
    try {
      const returnedBlog = await blogService.like(blog);

      returnedBlog.user = { ...blog.user };

      const newBlogs = [
        ...blogs.slice(0, blogs.indexOf(blog)),
        returnedBlog,
        ...blogs.slice(blogs.indexOf(blog) + 1),
      ];

      setBlogs(newBlogs);
    } catch (exception) {
      console.log(exception);
      dispatch(setNotification(exception.response.data.error, true));
    }
  };

  const deleteBlog = async blog => {
    if (blog.author === '') blog.author = 'Unknown author';
    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) return;

    try {
      await blogService.remove(blog);

      setBlogs(blogs.filter(b => b.id !== blog.id));
    } catch (exception) {
      console.log(exception);
      dispatch(setNotification(exception.response.data.error, true));
    }
  };

  if (!user) return <LoginForm setUser={setUser} />;

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
              blog.user?.username === user.username
                ? async () => await deleteBlog(blog)
                : undefined
            }
          />
        ))}
    </div>
  );
};

export default App;
