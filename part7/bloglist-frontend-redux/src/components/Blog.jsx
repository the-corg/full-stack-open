import { useState } from 'react';

const Blog = ({ blog, likeBlog, deleteBlog }) => {
  const [detailed, setDetailed] = useState(false);

  const toggleDetailed = () => setDetailed(!detailed);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const showWhenDetailed = { display: detailed ? '' : 'none' };

  return (
    <div className='blog' style={blogStyle}>
      <div>
        {blog.title} {blog.author}{' '}
        <button onClick={toggleDetailed}>{detailed ? 'hide' : 'show'}</button>
      </div>

      <div style={showWhenDetailed}>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes} <button onClick={likeBlog}>like</button>
        </div>
        <div>{blog.user?.name ?? 'Unknown user'}</div>
        <button
          style={{ display: deleteBlog ? '' : 'none' }}
          onClick={deleteBlog}
        >
          remove
        </button>
      </div>
    </div>
  );
};

export default Blog;
