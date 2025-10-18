import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAnecdotes, updateAnecdote } from './requests';
import AnecdoteForm from './components/AnecdoteForm';
import Notification from './components/Notification';
import { useNotificationDispatch } from './components/NotificationContext';

const App = () => {
  const queryClient = useQueryClient();
  const notificationDispatch = useNotificationDispatch();

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: updatedAnecdote => {
      const anecdotes = queryClient.getQueryData(['anecdotes']);
      queryClient.setQueryData(
        ['anecdotes'],
        anecdotes.map(a => (a.id !== updatedAnecdote.id ? a : updatedAnecdote))
      );

      const payload = `Voted for '${updatedAnecdote.content}'`;
      notificationDispatch({ type: '+', payload });
      setTimeout(() => notificationDispatch({ type: '-', payload }), 5000);
    },
  });

  const handleVote = anecdote =>
    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 });

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
