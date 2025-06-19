const Total = ({ parts }) => {
  const sum = parts.reduce((sumSoFar, part) => sumSoFar + part.exercises, 0);
  return (
    <p>
      <b>total of {sum} exercises</b>
    </p>
  );
};

export default Total;
