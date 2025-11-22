import { useState, useContext } from 'react';
import Notification from './Notification';
import loginService from '../services/login';
import PropTypes from 'prop-types';
import NotificationContext from './NotificationContext';
import UserContext from './UserContext';
import { setToken } from '../requests';
import styled from 'styled-components';

const Page = styled.div`
  padding: 1em;
  background: HoneyDew;
`;

const Button = styled.button`
  background: ForestGreen;
  font-size: 1em;
  margin: 5;
  padding: 0.25em 1em;
  border-radius: 3px;
  border-color: darkgreen;
  color: white;
`;

const Input = styled.input`
  margin: 0.25em;
  padding: 0.5em;
  font-size: 1em;
`;

const LoginForm = () => {
  const { notificationDispatch } = useContext(NotificationContext);
  const { userDispatch } = useContext(UserContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async event => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('loggedInBloglistUser', JSON.stringify(user));
      setToken(user.token);
      userDispatch({ type: 'LOGIN', payload: user });
      setUsername('');
      setPassword('');
    } catch (exception) {
      const payload = exception.response.data.error;
      notificationDispatch({ type: 'ERROR', payload });
      setTimeout(() => notificationDispatch({ type: 'REMOVE', payload }), 5000);
    }
  };

  return (
    <Page>
      <h2>Log in to application</h2>
      <Notification />
      <form onSubmit={handleLogin}>
        <div>
          username{' '}
          <Input
            type='text'
            value={username}
            name='Username'
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password{' '}
          <Input
            type='password'
            value={password}
            name='Password'
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <Button type='submit'>login</Button>
      </form>
    </Page>
  );
};

LoginForm.PropTypes = {
  setUser: PropTypes.func.isRequired,
};

export default LoginForm;
