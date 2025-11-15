import { useEffect, useRef, useContext } from 'react';
import LoginForm from './components/LoginForm';
import Blog from './components/Blog';
import Togglable from './components/Togglable';
import CreateForm from './components/CreateForm';
import Notification from './components/Notification';
import NotificationContext from './components/NotificationContext';
import UserContext from './components/UserContext';
import { useQuery } from '@tanstack/react-query';
import { getBlogs, like, remove, setToken } from './requests';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const App = () => {
  const { notificationDispatch } = useContext(NotificationContext);
  const { user, userDispatch } = useContext(UserContext);

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('loggedInBloglistUser');
    if (loggedInUserJSON) {
      const loggedInUser = JSON.parse(loggedInUserJSON);
      setToken(loggedInUser.token);
      userDispatch({ type: 'LOGIN', payload: loggedInUser });
    }
  }, [userDispatch]);

  const queryClient = useQueryClient();
  const likeBlogMutation = useMutation({
    mutationFn: like,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
    onError: err => {
      const payload = err.message;
      notificationDispatch({ type: 'ERROR', payload });
      setTimeout(() => notificationDispatch({ type: 'REMOVE', payload }), 5000);
    },
  });

  const deleteBlogMutation = useMutation({
    mutationFn: remove,
    onSuccess: (data, deletedBlog) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });

      const payload = `blog ${deletedBlog.title} by ${deletedBlog.author} deleted successfully`;
      notificationDispatch({ type: 'NOTIFICATION', payload });
      setTimeout(() => notificationDispatch({ type: 'REMOVE', payload }), 5000);
    },
    onError: err => {
      const payload = err.message;
      notificationDispatch({ type: 'ERROR', payload });
      setTimeout(() => notificationDispatch({ type: 'REMOVE', payload }), 5000);
    },
  });

  const createFormRef = useRef();

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: getBlogs,
  });

  if (result.isLoading) {
    return <div>loading data...</div>;
  }
  const blogs = result.data;

  const handleLogout = () => {
    window.localStorage.clear();
    userDispatch({ type: 'LOGOUT' });
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
        <CreateForm ref={createFormRef} />
      </Togglable>
      {blogs
        .toSorted((a, b) => b.likes - a.likes)
        .map(blog => (
          <Blog
            key={blog.id}
            blog={blog}
            likeBlog={async () => await likeBlogMutation.mutate(blog)}
            deleteBlog={
              blog.user?.username === user.username
                ? async () => {
                    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) return;
                    deleteBlogMutation.mutate(blog);
                  }
                : undefined
            }
          />
        ))}
    </div>
  );
};

export default App;
