const Filter = ({ text, onChange }) => (
  <div>
    filter shown with:
    <input value={text} onChange={onChange} />
  </div>
);

export default Filter;
