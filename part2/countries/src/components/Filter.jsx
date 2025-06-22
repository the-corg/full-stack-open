const Filter = ({ text, onChange }) => (
  <div>
    find countries <input value={text} onChange={onChange} />
  </div>
);

export default Filter;
