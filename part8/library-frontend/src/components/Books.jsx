import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { ALL_BOOKS } from '../queries';

const Books = () => {
  const [genre, setGenre] = useState(null);
  const booksQueryResult = useQuery(ALL_BOOKS);
  if (booksQueryResult.loading) return <div>loading...</div>;

  const books = booksQueryResult.data.allBooks;

  const genres = Array.from(
    new Set(books.reduce((list, current) => list.concat(current.genres), []))
  );

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
          {books
            .filter(b => (genre ? b.genres.includes(genre) : true))
            .map(a => (
              <tr key={a.id}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
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
        <button onClick={() => setGenre(null)}>All genres</button>
      </div>
    </div>
  );
};

export default Books;
