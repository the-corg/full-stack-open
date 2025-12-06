import { useState } from 'react';
import Authors from './components/Authors';
import BirthyearForm from './components/BirthyearForm';
import Books from './components/Books';
import NewBook from './components/NewBook';
import Notify from './components/Notify';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import { useApolloClient } from '@apollo/client/react';

const App = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('library-user-token'));
  const [errorMessage, setErrorMessage] = useState(null);
  const client = useApolloClient();
  const notify = message => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };

  const logout = async () => {
    localStorage.clear();
    setToken(null);
    await client.resetStore();
    navigate('/');
  };

  const linkStyle = { padding: 5 };
  const buttonStyle = {
    margin: 5,
    fontVariant: 'small-caps',
  };
  const separator = <span style={buttonStyle}>|</span>;
  return (
    <>
      <div>
        <Link style={linkStyle} to='/'>
          authors
        </Link>
        {separator}
        <Link style={linkStyle} to='/books'>
          books
        </Link>
        {separator}
        {token ? (
          <>
            <Link style={linkStyle} to='/newbook'>
              add book
            </Link>
            {separator}
            <Link style={linkStyle} to='/birthyear'>
              set birthyear
            </Link>
            {separator}
            <button style={buttonStyle} onClick={logout}>
              logout
            </button>
          </>
        ) : (
          <Link to='/login'>
            <button style={buttonStyle}>login</button>
          </Link>
        )}
      </div>
      <Notify errorMessage={errorMessage} />
      <Routes>
        <Route path='/books' element={<Books />} />
        <Route path='/login' element={<LoginForm setError={notify} setToken={setToken} />} />
        <Route path='/newbook' element={<NewBook setError={notify} />} />
        <Route path='/birthyear' element={<BirthyearForm setError={notify} />} />
        <Route path='/' element={<Authors />} />
      </Routes>
    </>
  );
};

export default App;
