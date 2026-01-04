import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { BOOK_DETAILS, CREATE_BOOK } from '../queries';

const NewBook = ({ setError }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');
  const [genres, setGenres] = useState([]);

  const [createBook] = useMutation(CREATE_BOOK, {
    onError: error => setError(error.message),
    update(cache, { data: { addBook } }) {
      cache.modify({
        fields: {
          allGenres(existingGenres = []) {
            const newGenres = addBook.genres.filter(g => !existingGenres.includes(g));
            return [...existingGenres, ...newGenres].sort();
          },

          allBooks(existingBookRefs = [], { args }) {
            if (args?.genre && !addBook.genres.includes(args.genre)) return existingBookRefs;

            const newBookRef = cache.writeFragment({
              data: addBook,
              fragment: BOOK_DETAILS,
            });

            if (existingBookRefs.some(ref => cache.identify(ref) === cache.identify(addBook)))
              return existingBookRefs;

            return [...existingBookRefs, newBookRef];
          },
        },
      });
    },
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
