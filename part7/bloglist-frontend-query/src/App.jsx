import { useEffect, useContext } from 'react';
import LoginForm from './components/LoginForm';
import { setToken } from './requests';
import Notification from './components/Notification';
import UserContext from './components/UserContext';
import Users from './components/Users';
import Blogs from './components/Blogs';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

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

  return (
    <Router>
      <div>
        <h2>blogs</h2>
        <Notification />
        <p>
          {user.name} logged in <button onClick={handleLogout}>logout</button>
        </p>

        <Routes>
          <Route path='/users' element={<Users />} />
          <Route path='/blogs' element={<Blogs />} />
          <Route path='/' element={<Blogs />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
