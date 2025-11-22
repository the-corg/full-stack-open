import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './reducers/userReducer';
import LoginForm from './components/LoginForm';
import Notification from './components/Notification';
import blogService from './services/blogs';
import Users from './components/Users';
import Blogs from './components/Blogs';
import { Routes, Route } from 'react-router-dom';
import User from './components/User';
import Blog from './components/Blog';

const App = () => {
  const dispatch = useDispatch();

  const user = useSelector(({ user }) => user);

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('loggedInBloglistUser');
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON);
      blogService.setToken(user.token);
      dispatch(setUser(user));
    }
  }, [dispatch]);

  const handleLogout = () => {
    window.localStorage.clear();
    dispatch(setUser(null));
  };

  if (!user) return <LoginForm />;

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>
      <Routes>
        <Route path='/blogs/:id' element={<Blog />} />
        <Route path='/users/:id' element={<User />} />
        <Route path='/users' element={<Users />} />
        <Route path='/blogs' element={<Blogs />} />
        <Route path='/' element={<Blogs />} />
      </Routes>
    </div>
  );
};

export default App;
