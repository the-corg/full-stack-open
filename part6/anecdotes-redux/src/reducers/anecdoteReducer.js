import { createSlice } from '@reduxjs/toolkit';
import anecdoteService from '../services/anecdotes';

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    updateAnecdote(state, action) {
      return state.map(a => (a.id !== action.payload.id ? a : action.payload));
    },
    appendAnecdote(state, action) {
      state.push(action.payload);
    },
    setAnecdotes(state, action) {
      return action.payload;
    },
  },
});

export const { updateAnecdote, appendAnecdote, setAnecdotes } =
  anecdoteSlice.actions;

export const initializeAnecdotes = () => async dispatch =>
  dispatch(setAnecdotes(await anecdoteService.getAll()));

export const createAnecdote = content => async dispatch =>
  dispatch(appendAnecdote(await anecdoteService.createNew(content)));

export const voteFor = id => async (dispatch, getState) => {
  const anecdoteToChange = getState().anecdotes.find(a => a.id === id);
  const newAnecdote = {
    ...anecdoteToChange,
    votes: anecdoteToChange.votes + 1,
  };
  const updatedAnecdote = await anecdoteService.update(id, newAnecdote);
  dispatch(updateAnecdote(updatedAnecdote));
};

export default anecdoteSlice.reducer;
