const Notify = ({ errorMessage }) => {
  if (!errorMessage) {
    return null;
  }
  return <div style={{ color: 'red', backgroundColor: 'lightred' }}>{errorMessage}</div>;
};

export default Notify;
