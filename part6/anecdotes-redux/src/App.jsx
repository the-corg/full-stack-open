import { useSelector, useDispatch } from 'react-redux';
import { createAnecdote, voteFor } from './reducers/anecdoteReducer';

const App = () => {
  const anecdotes = useSelector(state =>
    state.toSorted((a, b) => b.votes - a.votes)
  );
  const dispatch = useDispatch();

  const vote = id => {
    console.log('vote', id);
    dispatch(voteFor(id));
  };

  const addAnecdote = event => {
    event.preventDefault();
    const text = event.target.anecdote.value;
    console.log('create', text);
    event.target.anecdote.value = '';

    dispatch(createAnecdote(text));
  };

  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}{' '}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name='anecdote' />
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  );
};

export default App;
