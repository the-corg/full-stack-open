import { useRef } from 'react';
import Togglable from './Togglable';
import CreateForm from './CreateForm';
import { useQuery } from '@tanstack/react-query';
import { getBlogs } from '../requests';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const BlogBox = styled.div`
  padding: 10px;
  border: 2px solid dodgerblue;
  font-size: 1em;
  margin: 7px 0px;
`;

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

  return (
    <div>
      <Togglable buttonLabel='create new' ref={createFormRef}>
        <CreateForm ref={createFormRef} />
      </Togglable>
      {blogs
        .toSorted((a, b) => b.likes - a.likes)
        .map(blog => (
          <BlogBox key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>
              {blog.title} by {blog.author === '' ? 'unknown author' : blog.author}
            </Link>
          </BlogBox>
        ))}
    </div>
  );
};

export default Blogs;
