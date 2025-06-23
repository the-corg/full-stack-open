import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import Countries from "./components/Countries";
import CountryFull from "./components/CountryFull";
import countryService from "./services/countries";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    countryService.getAll().then((data) => setCountries(data));
  }, []);

  const showCountry = (country) => {
    setFilter(country.name.common);
  };

  const countriesFound = countries.filter((country) =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  );

  const count = countriesFound.length;

  return (
    <>
      <Filter
        text={filter}
        onChange={(event) => setFilter(event.target.value)}
      />
      {filter &&
        (count > 10 ? (
          "Too many matches, specify another filter"
        ) : count > 1 ? (
          <Countries countries={countriesFound} showCountry={showCountry} />
        ) : (
          count === 1 && <CountryFull country={countriesFound[0]} />
        ))}
    </>
  );
};

export default App;
