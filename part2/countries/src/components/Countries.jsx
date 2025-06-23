import Country from "./Country";

const Countries = ({ countries, showCountry }) =>
  countries.map((country) => (
    <Country
      key={country.name.common}
      countryName={country.name.common}
      onClick={() => showCountry(country)}
    />
  ));

export default Countries;
