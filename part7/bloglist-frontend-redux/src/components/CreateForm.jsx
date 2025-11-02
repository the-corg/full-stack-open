import { useState } from 'react';

const CreateForm = ({ addBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const createNewBlog = async event => {
    event.preventDefault();
    const success = await addBlog({ title, author, url });
    if (!success) return;
    setTitle('');
    setAuthor('');
    setUrl('');
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={createNewBlog}>
        <div>
          <label>
            title:{' '}
            <input
              value={title}
              type='text'
              name='Title'
              onChange={({ target }) => setTitle(target.value)}
              placeholder='title of the blog'
            />
          </label>
        </div>
        <div>
          <label>
            author:{' '}
            <input
              value={author}
              type='text'
              name='Author'
              onChange={({ target }) => setAuthor(target.value)}
              placeholder='author of the blog (optional)'
            />
          </label>
        </div>
        <div>
          <label>
            url:{' '}
            <input
              value={url}
              type='text'
              name='Url'
              onChange={({ target }) => setUrl(target.value)}
              placeholder='URL of the blog'
            />
          </label>
        </div>
        <div>
          <button type='submit'>create</button>
        </div>
      </form>
    </div>
  );
};

export default CreateForm;
