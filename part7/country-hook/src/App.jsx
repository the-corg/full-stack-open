import { useState, useEffect } from 'react';
import axios from 'axios';

const useField = type => {
  const [value, setValue] = useState('');

  const onChange = event => {
    setValue(event.target.value);
  };

  return {
    type,
    value,
    onChange,
  };
};

const useCountry = name => {
  const [country, setCountry] = useState(null);
  const url = `https://studies.cs.helsinki.fi/restcountries/api/name/${name}`;

  useEffect(() => {
    if (name)
      axios
        .get(url)
        .then(response => setCountry(response))
        .catch(() => setCountry({}));
  }, [name]);

  return country;
};

const Country = ({ country }) => {
  if (!country) return null;

  const data = country.data;
  if (!data) return <div>not found...</div>;

  return (
    <div>
      <h3>{data.name.common} </h3>
      <div>capital {data.capital} </div>
      <div>population {data.population}</div>
      <img src={data.flags.png} height='100' alt={data.flags.alt} />
    </div>
  );
};

const App = () => {
  const nameInput = useField('text');
  const [name, setName] = useState('');
  const country = useCountry(name);

  const fetch = e => {
    e.preventDefault();
    setName(nameInput.value);
  };

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  );
};

export default App;
