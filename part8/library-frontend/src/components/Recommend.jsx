import { useEffect } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client/react';
import { ALL_BOOKS, ME } from '../queries';

const Recommend = () => {
  const { data: meData, loading: meLoading } = useQuery(ME);
  const [loadBooks, { called: booksCalled, loading: booksLoading, data: booksData }] =
    useLazyQuery(ALL_BOOKS);

  useEffect(() => {
    if (meData?.me?.favoriteGenre) {
      loadBooks({
        variables: { genre: meData.me.favoriteGenre },
      });
    }
  }, [meData, loadBooks]);

  if (meLoading || booksLoading) return <p>loading ...</p>;

  if (!booksCalled) return null;

  const favoriteGenre = meData.me.favoriteGenre;
  const books = booksData.allBooks;

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
          {books.map(b => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommend;
