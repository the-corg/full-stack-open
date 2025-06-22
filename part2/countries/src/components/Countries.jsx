import Country from "./Country";

const Countries = ({ countries }) =>
  countries.map((country) => (
    <Country key={country.ccn3} countryName={country.name.common} />
  ));

export default Countries;
