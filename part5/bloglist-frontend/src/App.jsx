import { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import Blog from './components/Blog';
import Notification from './components/Notification';
import blogService from './services/blogs';
import messageService from './services/messages';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const [message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const [createVisible, setCreateVisible] = useState(false);

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem(
      'loggedInBloglistUser'
    );
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON);
      blogService.setToken(user.token);
      setUser(user);
    }
  }, []);

  const handleLogout = () => {
    window.localStorage.clear();
    setUser(null);
  };

  const newBlog = async event => {
    event.preventDefault();

    const newBlog = {
      title,
      author,
      url,
    };

    try {
      const returnedBlog = await blogService.create(newBlog);
      setBlogs(blogs.concat(returnedBlog));
      setTitle('');
      setAuthor('');
      setUrl('');
      messageService.showNotification(
        setMessage,
        `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`
      );
    } catch (exception) {
      console.log(exception.response.data.error);
      messageService.showError(setErrorMessage, exception.response.data.error);
    }
  };

  if (!user) return <LoginForm setUser={setUser} />;

  const hideWhenVisible = { display: createVisible ? 'none' : '' };
  const showWhenVisible = { display: createVisible ? '' : 'none' };

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} />
      <Notification message={errorMessage} isError='true' />
      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setCreateVisible(true)}>new note</button>
        </div>
        <div style={showWhenVisible}>
          <h2>create new</h2>
          <form onSubmit={newBlog}>
            <div>
              title:{' '}
              <input
                value={title}
                type='text'
                name='Title'
                onChange={({ target }) => setTitle(target.value)}
              />
            </div>
            <div>
              author:{' '}
              <input
                value={author}
                type='text'
                name='Author'
                onChange={({ target }) => setAuthor(target.value)}
              />
            </div>
            <div>
              url:{' '}
              <input
                value={url}
                type='text'
                name='Url'
                onChange={({ target }) => setUrl(target.value)}
              />
            </div>
            <div>
              <button type='submit'>create</button>
            </div>
          </form>
          <button onClick={() => setCreateVisible(false)}>cancel</button>
        </div>
      </div>
      {blogs.map(blog => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
