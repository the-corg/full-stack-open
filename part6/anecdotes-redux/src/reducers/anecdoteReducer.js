import { createSlice } from '@reduxjs/toolkit';
import anecdoteService from '../services/anecdotes';

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    voteFor(state, action) {
      const id = action.payload;

      const anecdoteToChange = state.find(a => a.id === id);
      anecdoteToChange.votes++;
      return state;
    },
    appendAnecdote(state, action) {
      state.push(action.payload);
    },
    setAnecdotes(state, action) {
      return action.payload;
    },
  },
});

export const { voteFor, appendAnecdote, setAnecdotes } = anecdoteSlice.actions;

export const initializeAnecdotes = () => async dispatch =>
  dispatch(setAnecdotes(await anecdoteService.getAll()));

export const createAnecdote = content => async dispatch =>
  dispatch(appendAnecdote(await anecdoteService.createNew(content)));

export default anecdoteSlice.reducer;
