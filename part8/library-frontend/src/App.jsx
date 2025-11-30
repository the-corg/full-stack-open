import { useState } from 'react';
import Authors from './components/Authors';
import BirthyearForm from './components/BirthyearForm';
import Books from './components/Books';
import NewBook from './components/NewBook';
import Notify from './components/Notify';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const notify = message => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };
  const padding = { padding: 5 };
  return (
    <Router>
      <div>
        <Link style={padding} to='/'>
          authors
        </Link>
        <Link style={padding} to='/books'>
          books
        </Link>
        <Link style={padding} to='/newbook'>
          add book
        </Link>
        <Link style={padding} to='/birthyear'>
          set birthyear
        </Link>
      </div>
      <Notify errorMessage={errorMessage} />
      <Routes>
        <Route path='/books' element={<Books />} />
        <Route path='/newbook' element={<NewBook setError={notify} />} />
        <Route path='/birthyear' element={<BirthyearForm setError={notify} />} />
        <Route path='/' element={<Authors />} />
      </Routes>
    </Router>
  );
};

export default App;
