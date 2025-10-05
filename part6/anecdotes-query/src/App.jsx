import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAnecdotes, updateAnecdote } from './requests';
import AnecdoteForm from './components/AnecdoteForm';
import Notification from './components/Notification';

const App = () => {
  const queryClient = useQueryClient();
  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] });
    },
  });

  const handleVote = anecdote => {
    console.log('vote');
    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 });
  };

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    refetchOnWindowFocus: false,
  });

  console.log(JSON.parse(JSON.stringify(result)));

  if (result.isLoading) {
    return <div>loading data...</div>;
  }

  if (result.isError) {
    return (
      <>
        <div>Anecdote service not available due to a server issue.</div>
        <div>Error message: {result.error.message}</div>
      </>
    );
  }

  const anecdotes = result.data;

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
