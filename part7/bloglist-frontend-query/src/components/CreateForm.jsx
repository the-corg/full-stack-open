import { useState, useContext } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBlog } from '../requests';
import NotificationContext from './NotificationContext';
import styled from 'styled-components';

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
  width: 16em;
`;

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
            <Input
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
            <Input
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
            <Input
              value={url}
              type='text'
              name='Url'
              onChange={({ target }) => setUrl(target.value)}
              placeholder='URL of the blog'
            />
          </label>
        </div>
        <div>
          <Button type='submit'>create</Button>
        </div>
      </form>
    </div>
  );
};

export default CreateForm;
