import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      author
      published
      id
    }
  }
`;

const Books = () => {
  const booksQueryResult = useQuery(ALL_BOOKS);
  if (booksQueryResult.loading) return <div>loading...</div>;

  const books = booksQueryResult.data.allBooks;

  return (
    <div>
      <h2>books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map(a => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
