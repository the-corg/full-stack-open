const CountryFull = ({ country }) => (
  <div>
    <h1>{country.name.common}</h1>
    <div>Capital {country.capital}</div>
    <div>Area {country.area}</div>
    <div>
      <h2>Languages</h2>
      <ul>
        {Object.values(country.languages).map((lang) => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>
    </div>
    <img src={country.flags.png} alt={country.flags.alt} />
  </div>
);

export default CountryFull;
