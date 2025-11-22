import { useEffect, useContext } from 'react';
import LoginForm from './components/LoginForm';
import { setToken } from './requests';
import Notification from './components/Notification';
import UserContext from './components/UserContext';
import Users from './components/Users';
import Blogs from './components/Blogs';
import { Routes, Route, Link } from 'react-router-dom';
import User from './components/User';
import Blog from './components/Blog';

const App = () => {
  const { user, userDispatch } = useContext(UserContext);

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('loggedInBloglistUser');
    if (loggedInUserJSON) {
      const loggedInUser = JSON.parse(loggedInUserJSON);
      setToken(loggedInUser.token);
      userDispatch({ type: 'LOGIN', payload: loggedInUser });
    }
  }, [userDispatch]);

  const handleLogout = () => {
    window.localStorage.clear();
    userDispatch({ type: 'LOGOUT' });
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
