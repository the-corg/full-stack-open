import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../requests';

const Users = () => {
  const result = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  if (result.isLoading) {
    return <div>loading data...</div>;
  }
  const users = result.data;

  return (
    <div>
      <h2>Users</h2>

      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created </th>
          </tr>
        </thead>
        <tbody>
          {users.toSorted().map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
