import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAnecdote } from '../requests';
import { useNotificationDispatch } from './NotificationContext';

const AnecdoteForm = () => {
  const queryClient = useQueryClient();
  const notificationDispatch = useNotificationDispatch();
  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: newAnecdote => {
      const anecdotes = queryClient.getQueryData(['anecdotes']);
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote));

      const payload = `Created '${newAnecdote.content}'`;
      notificationDispatch({ type: '+', payload });
      setTimeout(() => notificationDispatch({ type: '-', payload }), 5000);
    },
    onError: () => {
      const payload = `Error: The anecdote is too short. It should be at least 5 characters long`;
      notificationDispatch({ type: '+', payload });
      setTimeout(() => notificationDispatch({ type: '-', payload }), 5000);
    },
  });

  const onCreate = async event => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = '';
    newAnecdoteMutation.mutate({ content, votes: 0 });
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type='submit'>create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
