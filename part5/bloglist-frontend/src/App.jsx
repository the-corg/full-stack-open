import { useState, useEffect, useRef } from 'react';
import LoginForm from './components/LoginForm';
import Blog from './components/Blog';
import Togglable from './components/Togglable';
import CreateForm from './components/CreateForm';
import Notification from './components/Notification';
import blogService from './services/blogs';
import messageService from './services/messages';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);

  const [message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem(
      'loggedInBloglistUser'
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

      messageService.showNotification(
        setMessage,
        `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`
      );
      createFormRef.current.toggleVisibility();
      return true;
    } catch (exception) {
      console.log(exception);
      messageService.showError(setErrorMessage, exception.response.data.error);
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
      messageService.showError(setErrorMessage, exception.response.data.error);
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
      messageService.showError(setErrorMessage, exception.response.data.error);
    }
  };

  if (!user) return <LoginForm setUser={setUser} />;

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} />
      <Notification message={errorMessage} isError='true' />
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
