import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { initializeUsers } from '../reducers/usersReducer';

const User = () => {
  const dispatch = useDispatch();
  const id = useParams().id;
  const user = useSelector(({ users }) => users.find(u => u.id === id));

  useEffect(() => {
    dispatch(initializeUsers());
  }, [dispatch]);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map(blog => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default User;
