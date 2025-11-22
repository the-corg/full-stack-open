import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setNotification } from '../reducers/notificationReducer';
import { setUser } from '../reducers/userReducer';
import Notification from './Notification';
import loginService from '../services/login';
import blogService from '../services/blogs';
import { TextField, Button, Typography } from '@mui/material';

const LoginForm = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async event => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('loggedInBloglistUser', JSON.stringify(user));
      blogService.setToken(user.token);
      dispatch(setUser(user));
      setUsername('');
      setPassword('');
    } catch (exception) {
      dispatch(setNotification(exception.response.data.error, true));
    }
  };

  return (
    <div>
      <Typography variant='h3'>Log in to application</Typography>
      <Notification />
      <form onSubmit={handleLogin}>
        <div>
          <TextField label='username' onChange={({ target }) => setUsername(target.value)} />
        </div>
        <div>
          <TextField
            label='password'
            type='password'
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <Button variant='contained' color='success' type='submit'>
          login
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
