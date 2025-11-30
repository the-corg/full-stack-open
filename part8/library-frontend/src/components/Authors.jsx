import { useQuery } from '@apollo/client/react';
import { ALL_AUTHORS } from '../queries';

const Authors = () => {
  const authorsQueryResult = useQuery(ALL_AUTHORS);
  if (authorsQueryResult.loading) return <div>loading...</div>;

  const authors = authorsQueryResult.data.allAuthors;

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map(a => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Authors;
