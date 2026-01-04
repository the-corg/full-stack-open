import { useQuery } from '@apollo/client/react';
import { ALL_BOOKS, ME } from '../queries';

const Recommend = () => {
  const booksQueryResult = useQuery(ALL_BOOKS);
  const meQueryResult = useQuery(ME);
  if (booksQueryResult.loading || meQueryResult.loading) return <div>loading...</div>;

  const books = booksQueryResult.data.allBooks;
  const favoriteGenre = meQueryResult.data.me.favoriteGenre;

  if (!favoriteGenre) return <div>Error: You forgot to specify your favorite genre.</div>;

  return (
    <div>
      <h2>recommendations</h2>
      books in your favorite genre <b>{favoriteGenre}</b>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books
            .filter(b => b.genres.includes(favoriteGenre))
            .map(a => (
              <tr key={a.id}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommend;
