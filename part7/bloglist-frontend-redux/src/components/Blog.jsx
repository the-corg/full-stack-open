import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { initializeBlogs, like, remove, comment } from '../reducers/blogReducer';
import { setNotification } from '../reducers/notificationReducer';

const authorStr = author => (author === '' ? 'unknown author' : author);

const Blog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const id = useParams().id;
  const blog = useSelector(({ blogs }) => blogs.find(b => b.id === id));
  const user = useSelector(({ user }) => user);
  const [text, setText] = useState('');

  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);

  if (!blog) return <div>Blog not found.</div>;

  const likeBlog = async blog => {
    try {
      await dispatch(like(blog));
      dispatch(setNotification(`liked '${blog.title}' by ${authorStr(blog.author)}`));
    } catch (exception) {
      dispatch(setNotification(exception.response.data.error, true));
    }
  };

  const commentBlog = async event => {
    event.preventDefault();
    if (text === '') {
      dispatch(setNotification("Comment text can't be empty", true));
      return;
    }
    try {
      await dispatch(comment(blog, text));
      dispatch(setNotification(`added comment to '${blog.title}' by ${authorStr(blog.author)}`));
      setText('');
    } catch (exception) {
      dispatch(setNotification(exception.response.data.error, true));
    }
  };

  const deleteBlog = async blog => {
    if (!window.confirm(`Remove blog ${blog.title} by ${authorStr(blog.author)}?`)) return;

    try {
      dispatch(setNotification(`deleted '${blog.title}' by ${authorStr(blog.author)}`));
      navigate('/');
      await dispatch(remove(blog));
    } catch (exception) {
      dispatch(setNotification(exception.response.data.error, true));
    }
  };

  return (
    <div>
      <h2>
        {blog.title} by {authorStr(blog.author)}
      </h2>

      <div>
        <a href={blog.url}>{blog.url}</a>
        <div>
          {blog.likes} likes <button onClick={async () => await likeBlog(blog)}>like</button>
        </div>
        <div>added by {blog.user?.name ?? 'Unknown user'}</div>
        <button
          style={{ display: blog.user?.username === user.username ? '' : 'none' }}
          onClick={async () => deleteBlog(blog)}
        >
          remove
        </button>
        <div>
          <h3>comments</h3>
          <form onSubmit={commentBlog}>
            <input
              value={text}
              type='text'
              name='text'
              onChange={({ target }) => setText(target.value)}
              placeholder='new comment'
            />
            <button type='submit'>add comment</button>
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
