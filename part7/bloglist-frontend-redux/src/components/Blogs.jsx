import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Togglable from './Togglable';
import CreateForm from './CreateForm';
import { setNotification } from '../reducers/notificationReducer';
import { initializeBlogs, createBlog } from '../reducers/blogReducer';
import { Link } from 'react-router-dom';

const authorStr = author => (author === '' ? 'unknown author' : author);

const Blogs = () => {
  const dispatch = useDispatch();
  const blogs = useSelector(({ blogs }) => blogs);
  const user = useSelector(({ user }) => user);

  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);

  const createFormRef = useRef();

  const addBlog = async newBlog => {
    try {
      await dispatch(createBlog(newBlog, user));
      dispatch(setNotification(`added blog '${newBlog.title}' by ${authorStr(newBlog.author)}`));
      createFormRef.current.toggleVisibility();
      return true;
    } catch (exception) {
      dispatch(setNotification(exception.response.data.error, true));
    }
    return false;
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div>
      <Togglable buttonLabel='create new' ref={createFormRef}>
        <CreateForm addBlog={addBlog} />
      </Togglable>
      {blogs
        .toSorted((a, b) => b.likes - a.likes)
        .map(blog => (
          <div className='blog' style={blogStyle} key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>
              {blog.title} by {authorStr(blog.author)}
            </Link>
          </div>
        ))}
    </div>
  );
};

export default Blogs;
