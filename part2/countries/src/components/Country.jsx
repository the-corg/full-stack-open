const Country = ({ countryName, onClick }) => (
  <div>
    {countryName} <button onClick={onClick}>Show</button>
  </div>
);

export default Country;
