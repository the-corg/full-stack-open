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
import styled from 'styled-components';

const Button = styled.button`
  background: DodgerBlue;
  font-size: 1em;
  margin: 5;
  padding: 0.25em 1em;
  border-radius: 3px;
  border-color: #222288;
  color: white;
`;

const Page = styled.div`
  padding: 1em;
  background: #eef5ff;
`;

const Navigation = styled.div`
  background: DeepSkyBlue;
  padding: 0.4em;
`;

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

  const margin = {
    margin: 5,
    fontVariant: 'small-caps',
  };

  const separator = <span style={margin}>|</span>;

  return (
    <Page>
      <Navigation>
        <Link style={margin} to='/'>
          blogs
        </Link>
        {separator}
        <Link style={margin} to='/users'>
          users
        </Link>
        {separator}
        <span style={margin}>{user.name} logged in</span>
        <Button style={margin} onClick={handleLogout}>
          logout
        </Button>
      </Navigation>
      <h2>blog app</h2>
      <Notification />
      <Routes>
        <Route path='/blogs/:id' element={<Blog />} />
        <Route path='/users/:id' element={<User />} />
        <Route path='/users' element={<Users />} />
        <Route path='/blogs' element={<Blogs />} />
        <Route path='/' element={<Blogs />} />
      </Routes>
    </Page>
  );
};

export default App;
