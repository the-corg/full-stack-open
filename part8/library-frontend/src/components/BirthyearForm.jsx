import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { EDIT_AUTHOR, ALL_AUTHORS } from '../queries';

const BirthyearForm = ({ setError }) => {
  const [name, setName] = useState('');
  const [year, setYear] = useState('');

  const [changeAuthor] = useMutation(EDIT_AUTHOR, { onError: error => setError(error.message) });
  const authorsQueryResult = useQuery(ALL_AUTHORS);
  if (authorsQueryResult.loading) return <div>loading...</div>;

  const authors = authorsQueryResult.data.allAuthors;

  const submit = event => {
    event.preventDefault();
    if (!name) {
      setError('Please select one of the authors');
      return;
    }
    if (!year) {
      setError("Birthyear can't be empty");
      return;
    }
    const born = parseInt(year);
    if (Number.isNaN(born)) {
      setError('Please enter a valid birthyear');
      return;
    }

    changeAuthor({ variables: { name, born } });
    setYear('');
    setName('');
  };

  return (
    <div>
      <h2>set birthyear</h2>
      <form onSubmit={submit}>
        <label>
          name
          <select value={name} onChange={({ target }) => setName(target.value)}>
            <option value={''}>Select author...</option>
            {authors.map(a => (
              <option key={a.id} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        </label>

        <div>
          born <input type='number' value={year} onChange={({ target }) => setYear(target.value)} />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  );
};

export default BirthyearForm;
