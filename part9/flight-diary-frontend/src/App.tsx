import { useState, useEffect } from 'react';
import type { Entry } from './types';
import { getAllEntries } from './diaryEntryService';

const App = () => {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    getAllEntries().then(data => {
      setEntries(data);
    });
  }, []);

  return (
    <div>
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
