import { useState, useContext } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBlog } from '../requests';
import NotificationContext from './NotificationContext';

const CreateForm = ({ ref }) => {
  const queryClient = useQueryClient();
  const newBlogMutation = useMutation({
    mutationFn: createBlog,
    onSuccess: newBlog => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });

      const payload = `a new blog ${newBlog.title} by ${newBlog.author} added`;
      notificationDispatch({ type: 'NOTIFICATION', payload });
      setTimeout(() => notificationDispatch({ type: 'REMOVE', payload }), 5000);

      ref.current.toggleVisibility();
      setTitle('');
      setAuthor('');
      setUrl('');
    },
    onError: err => {
      const payload = err.message;
      notificationDispatch({ type: 'ERROR', payload });
      setTimeout(() => notificationDispatch({ type: 'REMOVE', payload }), 5000);
    },
  });
  const { notificationDispatch } = useContext(NotificationContext);

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const createNewBlog = async event => {
    event.preventDefault();
    newBlogMutation.mutate({ title, author, url });
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
