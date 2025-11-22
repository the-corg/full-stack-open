import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Togglable from './Togglable';
import CreateForm from './CreateForm';
import { setNotification } from '../reducers/notificationReducer';
import { initializeBlogs, createBlog } from '../reducers/blogReducer';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@mui/material';

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

  return (
    <div>
      <Togglable buttonLabel='create new' ref={createFormRef}>
        <CreateForm addBlog={addBlog} />
      </Togglable>

      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {blogs
              .toSorted((a, b) => b.likes - a.likes)
              .map(blog => (
                <TableRow key={blog.id}>
                  <TableCell>
                    <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                  </TableCell>
                  <TableCell>{authorStr(blog.author)}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Blogs;
