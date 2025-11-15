import { useRef, useContext } from 'react';
import Blog from './Blog';
import Togglable from './Togglable';
import CreateForm from './CreateForm';
import NotificationContext from './NotificationContext';
import UserContext from './UserContext';
import { useQuery } from '@tanstack/react-query';
import { getBlogs, like, remove } from '../requests';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const Blogs = () => {
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

      const payload = `blog ${deletedBlog.title} by ${deletedBlog.author} deleted successfully`;
      notificationDispatch({ type: 'NOTIFICATION', payload });
      setTimeout(() => notificationDispatch({ type: 'REMOVE', payload }), 5000);
    },
    onError: err => {
      const payload = err.message;
      notificationDispatch({ type: 'ERROR', payload });
      setTimeout(() => notificationDispatch({ type: 'REMOVE', payload }), 5000);
    },
  });

  const createFormRef = useRef();

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: getBlogs,
  });

  if (result.isLoading) {
    return <div>loading data...</div>;
  }
  const blogs = result.data;

  return (
    <div>
      <Togglable buttonLabel='create new' ref={createFormRef}>
        <CreateForm ref={createFormRef} />
      </Togglable>
      {blogs
        .toSorted((a, b) => b.likes - a.likes)
        .map(blog => (
          <Blog
            key={blog.id}
            blog={blog}
            likeBlog={async () => await likeBlogMutation.mutate(blog)}
            deleteBlog={
              blog.user?.username === user.username
                ? async () => {
                    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) return;
                    deleteBlogMutation.mutate(blog);
                  }
                : undefined
            }
          />
        ))}
    </div>
  );
};

export default Blogs;
