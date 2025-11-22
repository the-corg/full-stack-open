import { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import NotificationContext from './NotificationContext';
import UserContext from './UserContext';
import { getBlogs, like, remove } from '../requests';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const Blog = () => {
  const id = useParams().id;
  const navigate = useNavigate();

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
          <button onClick={async () => await likeBlogMutation.mutate(blog)}>like</button>
        </div>
        <div>added by {blog.user?.name ?? 'Unknown user'}</div>
        <button
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
        </button>
        <div style={{ display: blog.comments.length > 0 ? '' : 'none' }}>
          <h3>comments</h3>
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
