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
import { Button, AppBar, Toolbar, Typography } from '@mui/material';

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
      <AppBar position='static'>
        <Toolbar>
          <Button color='inherit' component={Link} to='/'>
            blogs
          </Button>
          <Button color='inherit' component={Link} to='/users'>
            users
          </Button>
          <Typography sx={{ mx: 1 }} variant='body2'>
            {user.name} logged in
          </Typography>
          <Button variant='contained' color='error' size='small' onClick={handleLogout}>
            logout
          </Button>
        </Toolbar>
      </AppBar>

      <Typography variant='h3'>blog app</Typography>
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
