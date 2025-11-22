import { useState } from 'react';
import { TextField, Button } from '@mui/material';

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
          <TextField
            label='title'
            placeholder='title of the blog'
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          <TextField
            label='author'
            placeholder='author of the blog (optional)'
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          <TextField
            label='url'
            placeholder='URL of the blog'
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <div>
          <Button variant='outlined' color='success' type='submit'>
            create
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateForm;
