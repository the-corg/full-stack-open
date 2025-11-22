import { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import NotificationContext from './NotificationContext';
import UserContext from './UserContext';
import { getBlogs, like, remove, comment } from '../requests';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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

const LikeButton = styled(Button)`
  border-color: magenta;
  background: deeppink;
`;

const RemoveButton = styled(Button)`
  border-color: darkred;
  background: red;
`;

const Input = styled.input`
  margin: 0.25em;
  padding: 0.5em;
  font-size: 1em;
  width: 16em;
`;

const Blog = () => {
  const id = useParams().id;
  const navigate = useNavigate();

  const [text, setText] = useState('');

  const { notificationDispatch } = useContext(NotificationContext);
  const { user } = useContext(UserContext);

  const queryClient = useQueryClient();
  const likeBlogMutation = useMutation({
    mutationFn: like,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
    onError: err => {
      const payload = err.message;
      notificationDispatch({ type: 'ERROR', payload });
      setTimeout(() => notificationDispatch({ type: 'REMOVE', payload }), 5000);
    },
  });

  const commentBlogMutation = useMutation({
    mutationFn: comment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      setText('');
    },
    onError: err => {
      const payload = err.message;
      notificationDispatch({ type: 'ERROR', payload });
      setTimeout(() => notificationDispatch({ type: 'REMOVE', payload }), 5000);
    },
  });

  const deleteBlogMutation = useMutation({
    mutationFn: remove,
    onSuccess: (data, deletedBlog) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });

      navigate('/');

      const payload = `blog ${deletedBlog.title} by ${deletedBlog.author === '' ? 'unknown author' : deletedBlog.author} deleted successfully`;
      notificationDispatch({ type: 'NOTIFICATION', payload });
      setTimeout(() => notificationDispatch({ type: 'REMOVE', payload }), 5000);
    },
    onError: err => {
      const payload = err.message;
      notificationDispatch({ type: 'ERROR', payload });
      setTimeout(() => notificationDispatch({ type: 'REMOVE', payload }), 5000);
    },
  });

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: getBlogs,
  });

  if (result.isLoading) {
    return <div>loading data...</div>;
  }
  const blog = result.data.find(b => b.id === id);

  if (!blog) return <div>Blog not found.</div>;

  const commentBlog = async event => {
    event.preventDefault();
    if (text === '') {
      const payload = "Comment text can't be empty";
      notificationDispatch({ type: 'ERROR', payload });
      setTimeout(() => notificationDispatch({ type: 'REMOVE', payload }), 5000);
      return;
    }
    commentBlogMutation.mutate({ id: blog.id, text });
  };

  const deleteBlog = blog.user?.username === user.username;

  return (
    <div>
      <h2>
        {blog.title} by {blog.author === '' ? 'unknown author' : blog.author}
      </h2>
      <div>
        <a href={blog.url}>{blog.url}</a>
        <div>
          {blog.likes} likes{' '}
          <LikeButton onClick={async () => await likeBlogMutation.mutate(blog)}>like</LikeButton>
        </div>
        <div>added by {blog.user?.name ?? 'Unknown user'}</div>
        <RemoveButton
          style={{ display: deleteBlog ? '' : 'none' }}
          onClick={async () => {
            if (
              !window.confirm(
                `Remove blog ${blog.title} by ${blog.author === '' ? 'unknown author' : blog.author}?`,
              )
            )
              return;
            deleteBlogMutation.mutate(blog);
          }}
        >
          remove
        </RemoveButton>
        <div>
          <h3>comments</h3>
          <form onSubmit={commentBlog}>
            <Input
              value={text}
              type='text'
              name='text'
              onChange={({ target }) => setText(target.value)}
              placeholder='new comment'
            />
            <Button type='submit'>add comment</Button>
          </form>
          <ul>
            {blog.comments.map((comment, index) => (
              <li key={index}>{comment}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Blog;
