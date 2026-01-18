import axios from 'axios';
import type { Entry, NewEntry } from './types';

const baseUrl = 'http://localhost:3000/api/diaries';

export const getAllEntries = () => {
  return axios.get<Entry[]>(baseUrl).then(response => response.data);
};

export const createEntry = (object: NewEntry) => {
  return axios.post<Entry>(baseUrl, object).then(response => response.data);
};
