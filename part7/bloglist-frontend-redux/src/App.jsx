import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './reducers/userReducer';
import LoginForm from './components/LoginForm';
import Notification from './components/Notification';
import blogService from './services/blogs';
import Users from './components/Users';
import Blogs from './components/Blogs';
import { Routes, Route, Link } from 'react-router-dom';
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

  const menu = {
    backgroundColor: 'lightblue',
    paddingLeft: 7,
  };
  const margin = {
    margin: 5,
  };

  const separator = <span style={margin}>|</span>;

  return (
    <div>
      <div style={menu}>
        <Link style={margin} to='/'>
          blogs
        </Link>
        {separator}
        <Link style={margin} to='/users'>
          users
        </Link>
        {separator}
        <span style={margin}>{user.name} logged in</span>
        <button style={margin} onClick={handleLogout}>
          logout
        </button>
      </div>
      <h2>blog app</h2>
      <Notification />
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
