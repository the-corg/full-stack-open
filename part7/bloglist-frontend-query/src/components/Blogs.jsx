import { useRef } from 'react';
import Togglable from './Togglable';
import CreateForm from './CreateForm';
import { useQuery } from '@tanstack/react-query';
import { getBlogs } from '../requests';
import { Link } from 'react-router-dom';

const Blogs = () => {
  const createFormRef = useRef();

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: getBlogs,
  });

  if (result.isLoading) {
    return <div>loading data...</div>;
  }
  const blogs = result.data;

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
        <CreateForm ref={createFormRef} />
      </Togglable>
      {blogs
        .toSorted((a, b) => b.likes - a.likes)
        .map(blog => (
          <div className='blog' style={blogStyle} key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>
              {blog.title} by {blog.author === '' ? 'unknown author' : blog.author}
            </Link>
          </div>
        ))}
    </div>
  );
};

export default Blogs;
