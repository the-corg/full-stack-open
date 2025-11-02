import { useState, useEffect, useRef, useContext } from 'react';
import LoginForm from './components/LoginForm';
import Blog from './components/Blog';
import Togglable from './components/Togglable';
import CreateForm from './components/CreateForm';
import Notification from './components/Notification';
import blogService from './services/blogs';
import NotificationContext from './components/NotificationContext';
/*import { useQuery } from '@tanstack/react-query';
import { getBlogs } from './requests';*/

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);

  const { notificationDispatch } = useContext(NotificationContext);

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('loggedInBloglistUser');
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

      const payload = `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`;
      notificationDispatch({ type: 'NOTIFICATION', payload });
      setTimeout(() => notificationDispatch({ type: 'REMOVE', payload }), 5000);

      createFormRef.current.toggleVisibility();
      return true;
    } catch (exception) {
      const payload = exception.response.data.error;
      notificationDispatch({ type: 'ERROR', payload });
      setTimeout(() => notificationDispatch({ type: 'REMOVE', payload }), 5000);
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
      const payload = exception.response.data.error;
      notificationDispatch({ type: 'ERROR', payload });
      setTimeout(() => notificationDispatch({ type: 'REMOVE', payload }), 5000);
    }
  };

  const deleteBlog = async blog => {
    if (blog.author === '') blog.author = 'Unknown author';
    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) return;

    try {
      await blogService.remove(blog);

      setBlogs(blogs.filter(b => b.id !== blog.id));
    } catch (exception) {
      const payload = exception.response.data.error;
      notificationDispatch({ type: 'ERROR', payload });
      setTimeout(() => notificationDispatch({ type: 'REMOVE', payload }), 5000);
    }
  };

  /*
  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: getBlogs,
  });

  console.log('Query result:', JSON.parse(JSON.stringify(result)));
  if (result.isLoading) {
    return <div>loading data...</div>;
  }
  //const blogs = result.data;
  console.log('Result data:', result.data);*/

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
              blog.user?.username === user.username ? async () => await deleteBlog(blog) : undefined
            }
          />
        ))}
    </div>
  );
};

export default App;
