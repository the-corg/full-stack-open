import { useState } from 'react';
import Notification from './Notification';
import loginService from '../services/login';
import blogService from '../services/blogs';
import messageService from '../services/messages';
import PropTypes from 'prop-types';

const LoginForm = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const handleLogin = async event => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('loggedInBloglistUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      console.log(exception.response.data.error);
      messageService.showError(setErrorMessage, exception.response.data.error);
    }
  };

  return (
    <div>
      <h2>Log in to application</h2>
      <Notification message={errorMessage} isError='true' />
      <form onSubmit={handleLogin}>
        <div>
          username{' '}
          <input
            type='text'
            value={username}
            name='Username'
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password{' '}
          <input
            type='password'
            value={password}
            name='Password'
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  );
};

LoginForm.PropTypes = {
  setUser: PropTypes.func.isRequired,
};

export default LoginForm;
