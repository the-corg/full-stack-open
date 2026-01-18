import { useState, useEffect } from 'react';
import type { Entry, NewEntry, Visibility, Weather } from './types';
import { getAllEntries, createEntry } from './diaryEntryService';

const App = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [date, setDate] = useState('');
  const [visibility, setVisibility] = useState<Visibility>('good');
  const [weather, setWeather] = useState<Weather>('sunny');
  const [comment, setComment] = useState('');

  useEffect(() => {
    getAllEntries().then(data => {
      setEntries(data);
    });
  }, []);

  const entryCreation = (event: React.SyntheticEvent) => {
    event.preventDefault();

    const newEntry: NewEntry = { date, visibility, weather, comment };
    createEntry(newEntry).then(data => {
      setEntries(entries.concat(data));
    });

    setDate('');
    setVisibility('good');
    setWeather('sunny');
    setComment('');
  };

  return (
    <div>
      <h2>Add new entry</h2>
      <form onSubmit={entryCreation}>
        <input value={date} onChange={event => setDate(event.target.value)} />
        <input
          value={visibility}
          onChange={event => setVisibility(event.target.value as Visibility)}
        />
        <input value={weather} onChange={event => setWeather(event.target.value as Weather)} />
        <input value={comment} onChange={event => setComment(event.target.value)} />
        <button type='submit'>add</button>
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
