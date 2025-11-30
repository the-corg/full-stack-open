import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { CREATE_BOOK, ALL_BOOKS, ALL_AUTHORS } from '../queries';

const NewBook = ({ setError }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');
  const [genres, setGenres] = useState([]);

  const [createBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
    onError: error => setError(error.message),
  });

  const submit = async event => {
    event.preventDefault();

    if (!title | !author | !year) {
      setError("Title, Author, and Published can't be empty");
      return;
    }
    const published = parseInt(year);
    if (Number.isNaN(published)) {
      setError('Please enter a valid publication year');
      return;
    }

    createBook({ variables: { title, author, published, genres } });

    setTitle('');
    setYear('');
    setAuthor('');
    setGenres([]);
    setGenre('');
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre('');
  };

  return (
    <div>
      <h2>add new book</h2>
      <form onSubmit={submit}>
        <div>
          title
          <input value={title} onChange={({ target }) => setTitle(target.value)} />
        </div>
        <div>
          author
          <input value={author} onChange={({ target }) => setAuthor(target.value)} />
        </div>
        <div>
          published
          <input type='number' value={year} onChange={({ target }) => setYear(target.value)} />
        </div>
        <div>
          <input value={genre} onChange={({ target }) => setGenre(target.value)} />
          <button onClick={addGenre} type='button'>
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type='submit'>create book</button>
      </form>
    </div>
  );
};

export default NewBook;
