import { useState, useEffect } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client/react';
import { ALL_BOOKS, ALL_GENRES } from '../queries';

const Books = () => {
  const [genre, setGenre] = useState(null);
  const genresQueryResult = useQuery(ALL_GENRES);
  const [loadBooks, { called: booksCalled, loading: booksLoading, data: booksData }] =
    useLazyQuery(ALL_BOOKS);

  useEffect(() => {
    loadBooks({ variables: { genre } });
  }, [genre, loadBooks]);

  if (genresQueryResult.loading || booksLoading || !booksCalled) return <p>loading ...</p>;
  const genres = genresQueryResult.data.allGenres;
  const books = booksData.allBooks;

  return (
    <div>
      <h2>books</h2>
      {genre && 'in genre '}
      <b>{genre}</b>
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
      <div>
        {genres.map(g => (
          <button key={g} onClick={() => setGenre(g)}>
            {g}
          </button>
        ))}
        <button onClick={() => setGenre(null)}>all genres</button>
      </div>
    </div>
  );
};

export default Books;
