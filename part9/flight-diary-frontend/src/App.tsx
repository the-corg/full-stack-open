import { useState, useEffect } from 'react';
import type { Entry, NewEntry, Visibility, Weather } from './types';
import { getAllEntries, createEntry } from './diaryEntryService';
import axios from 'axios';
import Notification from './Notification';

const App = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [date, setDate] = useState('');
  const [visibility, setVisibility] = useState<Visibility>('good');
  const [weather, setWeather] = useState<Weather>('sunny');
  const [comment, setComment] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    getAllEntries().then(data => {
      setEntries(data);
    });
  }, []);

  const entryCreation = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    try {
      const newEntry: NewEntry = { date, visibility, weather, comment };
      const data = await createEntry(newEntry);
      setEntries(entries.concat(data));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data ?? 'Unknown axios error');
        setTimeout(() => setErrorMessage(''), 3000);
        return;
      } else {
        setErrorMessage('Unknown error');
        setTimeout(() => setErrorMessage(''), 3000);
        return;
      }
    }

    setDate('');
    setVisibility('good');
    setWeather('sunny');
    setComment('');
  };

  return (
    <div>
      <h2>Add new entry</h2>
      <Notification errorMessage={errorMessage} />
      <form onSubmit={entryCreation}>
        <div>
          date:
          <input value={date} onChange={event => setDate(event.target.value)} />
        </div>
        <div>
          visibility:
          <input
            value={visibility}
            onChange={event => setVisibility(event.target.value as Visibility)}
          />
        </div>
        <div>
          weather:
          <input value={weather} onChange={event => setWeather(event.target.value as Weather)} />
        </div>
        <div>
          comment:
          <input value={comment} onChange={event => setComment(event.target.value)} />
        </div>
        <div>
          <button type='submit'>add</button>
        </div>
      </form>
      <h2>Diary entries</h2>
      <div>
        {entries.map(entry => (
          <div key={entry.id}>
            <h3>{entry.date}</h3>
            <div>visibility: {entry.visibility}</div>
            <div>weather: {entry.weather}</div>
            <div>comment: {entry.comment}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
